'use server';

import { prisma } from '@/lib/db';
import { getCurrentUser } from './auth';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function getAdminStats() {
  await requireAdmin();

  // Load sequentially to avoid EAGAIN process limit errors on Spaceship
  const totalUsers = await prisma.user.count();
  const totalModels = await prisma.profile.count({ where: { status: 'approved' } });
  const pendingModels = await prisma.profile.count({ where: { status: 'pending' } });
  const pendingMedia = await prisma.media.count({ where: { moderation_status: 'pending' } });
  const flaggedMedia = await prisma.media.count({ where: { moderation_status: 'flagged' } });

  return { totalUsers, totalModels, pendingModels, pendingMedia, flaggedMedia };
}

export async function getPendingModels() {
  await requireAdmin();
  return prisma.profile.findMany({
    where: { status: 'pending' },
    include: {
      user: { select: { id: true, email: true, name: true, created_at: true } },
    },
    orderBy: { created_at: 'asc' },
  });
}

export async function approveModel(profileId: string) {
  const admin = await requireAdmin();

  await prisma.profile.update({
    where: { id: profileId },
    data: {
      status: 'approved',
      approved_at: new Date(),
      approved_by: admin.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      user_id: admin.id,
      action: 'model_approved',
      resource_type: 'profile',
      resource_id: profileId,
    },
  });

  revalidatePath('/');
  return { success: true };
}

export async function rejectModel(profileId: string, reason?: string) {
  const admin = await requireAdmin();

  await prisma.profile.update({
    where: { id: profileId },
    data: {
      status: 'rejected',
      rejected_at: new Date(),
      rejected_by: admin.id,
      rejection_reason: reason || 'Rejected by admin',
    },
  });

  await prisma.auditLog.create({
    data: {
      user_id: admin.id,
      action: 'model_rejected',
      resource_type: 'profile',
      resource_id: profileId,
      details: JSON.stringify({ reason }),
    },
  });

  revalidatePath('/');
  return { success: true };
}

export async function getUsers(page: number = 1, pageSize: number = 20) {
  await requireAdmin();

  // Load sequentially to avoid EAGAIN process limit errors on Spaceship
  const users = await prisma.user.findMany({
    orderBy: { created_at: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      is_banned: true,
      created_at: true,
      last_login: true,
      profile: { select: { stage_name: true, status: true } },
    },
  });
  const total = await prisma.user.count();

  return { users, total, page, pageSize };
}

export async function getRecentAuditLogs(limit: number = 10) {
  await requireAdmin();
  return prisma.auditLog.findMany({
    orderBy: { created_at: 'desc' },
    take: limit,
    include: {
      user: { select: { email: true, name: true } },
    },
  });
}

export async function banUser(userId: string, reason: string) {
  const admin = await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: {
      is_banned: true,
      ban_reason: reason,
      banned_at: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      user_id: admin.id,
      action: 'user_banned',
      resource_type: 'user',
      resource_id: userId,
      details: JSON.stringify({ reason }),
    },
  });

  revalidatePath('/');
  return { success: true };
}

export async function unbanUser(userId: string) {
  const admin = await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: {
      is_banned: false,
      ban_reason: null,
      banned_at: null,
    },
  });

  await prisma.auditLog.create({
    data: {
      user_id: admin.id,
      action: 'user_unbanned',
      resource_type: 'user',
      resource_id: userId,
    },
  });

  revalidatePath('/');
  return { success: true };
}
