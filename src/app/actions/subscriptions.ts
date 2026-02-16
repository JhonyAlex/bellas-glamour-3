'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { PLATFORM_FEE_PERCENTAGE } from '@/lib/constants';
import { getCurrentUser } from './auth';

// Create subscription
export async function createSubscription(data: {
  profileId: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  amount: number;
  isTrial?: boolean;
}) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Check if already subscribed
  const existing = await prisma.subscription.findUnique({
    where: {
      subscriber_id_profile_id: {
        subscriber_id: user.id,
        profile_id: data.profileId,
      },
    },
  });

  if (existing && existing.status === 'active') {
    return { success: false, error: 'Already subscribed' };
  }

  // Calculate billing period
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  // Create or update subscription
  const subscription = await prisma.subscription.upsert({
    where: {
      subscriber_id_profile_id: {
        subscriber_id: user.id,
        profile_id: data.profileId,
      },
    },
    create: {
      subscriber_id: user.id,
      profile_id: data.profileId,
      stripe_subscription_id: data.stripeSubscriptionId,
      stripe_customer_id: data.stripeCustomerId,
      amount: data.amount,
      status: 'active',
      current_period_start: now,
      current_period_end: periodEnd,
      is_trial: data.isTrial || false,
    },
    update: {
      status: 'active',
      amount: data.amount,
      current_period_start: now,
      current_period_end: periodEnd,
    },
  });

  // Update profile subscriber count
  await prisma.profile.update({
    where: { id: data.profileId },
    data: { subscribers_count: { increment: 1 } },
  });

  // Create transaction
  const platformFee = data.amount * (PLATFORM_FEE_PERCENTAGE / 100);
  const creatorAmount = data.amount - platformFee;

  await prisma.transaction.create({
    data: {
      user_id: user.id,
      profile_id: data.profileId,
      amount: data.amount,
      type: 'subscription',
      status: 'completed',
      platform_fee: platformFee,
      creator_amount: creatorAmount,
      reference_type: 'subscription',
      reference_id: subscription.id,
    },
  });

  // Update creator earnings
  await prisma.profile.update({
    where: { id: data.profileId },
    data: {
      earnings_total: { increment: creatorAmount },
      earnings_pending: { increment: creatorAmount },
    },
  });

  revalidatePath('/');
  return { success: true, subscription };
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      id: subscriptionId,
      subscriber_id: user.id,
    },
  });

  if (!subscription) {
    return { success: false, error: 'Subscription not found' };
  }

  // Update subscription to cancel at period end
  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      cancel_at_period_end: true,
      canceled_at: new Date(),
    },
  });

  revalidatePath('/');
  return { success: true };
}

// Get user subscriptions
export async function getUserSubscriptions() {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  const subscriptions = await prisma.subscription.findMany({
    where: {
      subscriber_id: user.id,
      status: 'active',
    },
    include: {
      profile: {
        select: {
          id: true,
          stage_name: true,
          slug: true,
          avatar_url: true,
        },
      },
    },
    orderBy: { created_at: 'desc' },
  });

  return subscriptions;
}

// Check if user is subscribed to profile
export async function isSubscribedTo(profileId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }

  const subscription = await prisma.subscription.findUnique({
    where: {
      subscriber_id_profile_id: {
        subscriber_id: user.id,
        profile_id: profileId,
      },
    },
  });

  return subscription?.status === 'active';
}

// Create tip
export async function createTip(data: {
  profileId: string;
  amount: number;
  message?: string;
  stripePaymentIntentId?: string;
}) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Calculate fees
  const platformFee = data.amount * (PLATFORM_FEE_PERCENTAGE / 100);
  const creatorAmount = data.amount - platformFee;

  // Create tip
  const tip = await prisma.tip.create({
    data: {
      sender_id: user.id,
      profile_id: data.profileId,
      amount: data.amount,
      message: data.message,
      stripe_payment_intent_id: data.stripePaymentIntentId,
      status: 'completed',
    },
  });

  // Create transaction
  await prisma.transaction.create({
    data: {
      user_id: user.id,
      profile_id: data.profileId,
      amount: data.amount,
      type: 'tip',
      status: 'completed',
      platform_fee: platformFee,
      creator_amount: creatorAmount,
      reference_type: 'tip',
      reference_id: tip.id,
    },
  });

  // Update creator earnings
  await prisma.profile.update({
    where: { id: data.profileId },
    data: {
      earnings_total: { increment: creatorAmount },
      earnings_pending: { increment: creatorAmount },
    },
  });

  revalidatePath('/');
  return { success: true, tip };
}

// Unlock PPV content
export async function unlockMedia(mediaId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  // Get media
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    include: { profile: true },
  });

  if (!media || !media.is_ppv || !media.price) {
    return { success: false, error: 'Media not found or not PPV' };
  }

  // Check if already unlocked
  const existing = await prisma.mediaUnlock.findUnique({
    where: {
      user_id_media_id: {
        user_id: user.id,
        media_id: mediaId,
      },
    },
  });

  if (existing) {
    return { success: true, alreadyUnlocked: true };
  }

  // Calculate fees
  const platformFee = media.price * (PLATFORM_FEE_PERCENTAGE / 100);
  const creatorAmount = media.price - platformFee;

  // Create unlock
  const unlock = await prisma.mediaUnlock.create({
    data: {
      user_id: user.id,
      media_id: mediaId,
      amount: media.price,
    },
  });

  // Create transaction
  await prisma.transaction.create({
    data: {
      user_id: user.id,
      profile_id: media.profile_id,
      amount: media.price,
      type: 'ppv_unlock',
      status: 'completed',
      platform_fee: platformFee,
      creator_amount: creatorAmount,
      reference_type: 'media',
      reference_id: mediaId,
    },
  });

  // Update media unlock count
  await prisma.media.update({
    where: { id: mediaId },
    data: { unlock_count: { increment: 1 } },
  });

  // Update creator earnings
  await prisma.profile.update({
    where: { id: media.profile_id },
    data: {
      earnings_total: { increment: creatorAmount },
      earnings_pending: { increment: creatorAmount },
    },
  });

  revalidatePath('/');
  return { success: true, unlock };
}

// Check if media is unlocked for user
export async function isMediaUnlocked(mediaId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return false;
  }

  const unlock = await prisma.mediaUnlock.findUnique({
    where: {
      user_id_media_id: {
        user_id: user.id,
        media_id: mediaId,
      },
    },
  });

  return !!unlock;
}
