'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { Media, ModerationStatus } from '@/types';
import { UPLOAD_LIMITS } from '@/lib/constants';

// Get media by ID
export async function getMediaById(id: string) {
  const media = await prisma.media.findUnique({
    where: { id },
    include: {
      profile: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return media;
}

// Get media for a profile
export async function getProfileMedia(profileId: string, options?: {
  type?: string;
  isPremium?: boolean;
  limit?: number;
  offset?: number;
}) {
  const { type, isPremium, limit = 20, offset = 0 } = options || {};

  const where: any = {
    profile_id: profileId,
    moderation_status: 'approved',
    is_archived: false,
  };

  if (type) {
    where.type = type;
  }

  if (isPremium !== undefined) {
    where.is_premium = isPremium;
  }

  const media = await prisma.media.findMany({
    where,
    orderBy: [
      { is_pinned: 'desc' },
      { created_at: 'desc' },
    ],
    take: limit,
    skip: offset,
  });

  return media;
}

// Upload media (metadata only - actual file upload handled separately)
export async function createMedia(data: {
  profileId: string;
  type: 'photo' | 'video' | 'gif';
  url: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  tags?: string[];
  isPremium?: boolean;
  isPpv?: boolean;
  price?: number;
  contentWarnings?: string[];
}) {
  const media = await prisma.media.create({
    data: {
      profile_id: data.profileId,
      type: data.type,
      url: data.url,
      thumbnail_url: data.thumbnailUrl,
      original_url: data.url,
      title: data.title,
      description: data.description,
      tags: data.tags ? JSON.stringify(data.tags) : null,
      is_premium: data.isPremium || false,
      is_ppv: data.isPpv || false,
      price: data.price,
      content_warnings: data.contentWarnings ? JSON.stringify(data.contentWarnings) : null,
      moderation_status: 'pending',
      exif_removed: true, // Assume EXIF is removed during upload
    },
  });

  revalidatePath('/');
  return media;
}

// Update media
export async function updateMedia(id: string, data: Partial<{
  title: string;
  description: string;
  tags: string[];
  isPremium: boolean;
  isPpv: boolean;
  price: number;
  isPinned: boolean;
  isArchived: boolean;
}>) {
  const updateData: any = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.tags !== undefined) updateData.tags = JSON.stringify(data.tags);
  if (data.isPremium !== undefined) updateData.is_premium = data.isPremium;
  if (data.isPpv !== undefined) updateData.is_ppv = data.isPpv;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.isPinned !== undefined) updateData.is_pinned = data.isPinned;
  if (data.isArchived !== undefined) updateData.is_archived = data.isArchived;

  const media = await prisma.media.update({
    where: { id },
    data: updateData,
  });

  revalidatePath('/');
  return media;
}

// Delete media
export async function deleteMedia(id: string, profileId: string) {
  // Verify ownership
  const media = await prisma.media.findFirst({
    where: { id, profile_id: profileId },
  });

  if (!media) {
    return { success: false, error: 'Media not found or not authorized' };
  }

  await prisma.media.delete({
    where: { id },
  });

  revalidatePath('/');
  return { success: true };
}

// Increment view count
export async function incrementMediaView(id: string) {
  await prisma.media.update({
    where: { id },
    data: { views_count: { increment: 1 } },
  });
}

// Like media
export async function likeMedia(mediaId: string, userId: string) {
  // Check if already liked
  const existingLike = await prisma.mediaLike.findUnique({
    where: {
      user_id_media_id: {
        user_id: userId,
        media_id: mediaId,
      },
    },
  });

  if (existingLike) {
    // Unlike
    await prisma.$transaction([
      prisma.mediaLike.delete({
        where: { id: existingLike.id },
      }),
      prisma.media.update({
        where: { id: mediaId },
        data: { likes_count: { decrement: 1 } },
      }),
    ]);
    return { liked: false };
  } else {
    // Like
    await prisma.$transaction([
      prisma.mediaLike.create({
        data: {
          user_id: userId,
          media_id: mediaId,
        },
      }),
      prisma.media.update({
        where: { id: mediaId },
        data: { likes_count: { increment: 1 } },
      }),
    ]);
    return { liked: true };
  }
}

// Get pending media for moderation
export async function getPendingMedia(options?: {
  limit?: number;
  offset?: number;
}) {
  const { limit = 20, offset = 0 } = options || {};

  const media = await prisma.media.findMany({
    where: {
      moderation_status: 'pending',
    },
    orderBy: { created_at: 'asc' },
    take: limit,
    skip: offset,
    include: {
      profile: {
        select: {
          id: true,
          stage_name: true,
          slug: true,
        },
      },
    },
  });

  const total = await prisma.media.count({
    where: { moderation_status: 'pending' },
  });

  return { data: media, total };
}

// Moderate media (admin action)
export async function moderateMedia(
  mediaId: string,
  adminId: string,
  status: 'approved' | 'rejected' | 'flagged',
  notes?: string
) {
  const media = await prisma.media.update({
    where: { id: mediaId },
    data: {
      moderation_status: status,
      moderation_notes: notes,
      moderated_by: adminId,
      moderated_at: new Date(),
    },
  });

  // Log audit
  await prisma.auditLog.create({
    data: {
      user_id: adminId,
      action: `media_${status}`,
      resource_type: 'media',
      resource_id: mediaId,
      details: JSON.stringify({ notes }),
    },
  });

  revalidatePath('/');
  return media;
}

// Get flagged media
export async function getFlaggedMedia(options?: {
  limit?: number;
  offset?: number;
}) {
  const { limit = 20, offset = 0 } = options || {};

  const media = await prisma.media.findMany({
    where: {
      moderation_status: 'flagged',
    },
    orderBy: { moderated_at: 'desc' },
    take: limit,
    skip: offset,
    include: {
      profile: {
        select: {
          id: true,
          stage_name: true,
        },
      },
    },
  });

  return media;
}
