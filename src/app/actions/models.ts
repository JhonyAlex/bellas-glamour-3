'use server';

import { prisma } from '@/lib/db';
import { cacheOrFetch, clearCache } from '@/lib/cache';
import { Profile, ProfileWithStats, ModelFilters } from '@/types';
import { PAGINATION } from '@/lib/constants';

// Get all models with filters and pagination
export async function getModels(options?: {
  filters?: ModelFilters;
  page?: number;
  pageSize?: number;
}) {
  const {
    filters = {},
    page = 1,
    pageSize = PAGINATION.DEFAULT_PAGE_SIZE,
  } = options || {};

  // Check if we have any filters
  const hasFilters = filters.search || filters.eyeColor || filters.hairColor ||
    filters.ethnicity || filters.minPrice || filters.maxPrice ||
    filters.sortBy || filters.isFeatured;

  // For first page without filters, use cache
  const cacheKey = hasFilters ? null : `models_page_${page}_pageSize_${pageSize}`;

  if (cacheKey) {
    try {
      const cached = await cacheOrFetch(cacheKey, queryModels, 300);
      return cached;
    } catch {
      // Fall through to direct query if cache fails
    }
  }

  return queryModels();

  async function queryModels() {
    const where: any = {
      status: 'approved',
    };

    // Apply search filter
    if (filters.search) {
      where.OR = [
        { stage_name: { contains: filters.search, mode: 'insensitive' } },
        { location: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Apply attribute filters
    if (filters.eyeColor) {
      where.eye_color = filters.eyeColor;
    }
    if (filters.hairColor) {
      where.hair_color = filters.hairColor;
    }
    if (filters.ethnicity) {
      where.ethnicity = filters.ethnicity;
    }

    // Apply price filters
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.subscription_price = {};
      if (filters.minPrice !== undefined) {
        where.subscription_price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.subscription_price.lte = filters.maxPrice;
      }
    }

    // Apply featured filter
    if (filters.isFeatured) {
      where.is_featured = true;
    }

    // Determine sort order
    let orderBy: any = { created_at: 'desc' };
    switch (filters.sortBy) {
      case 'popular':
        orderBy = { subscribers_count: 'desc' };
        break;
      case 'price_low':
        orderBy = { subscription_price: 'asc' };
        break;
      case 'price_high':
        orderBy = { subscription_price: 'desc' };
        break;
      case 'name':
        orderBy = { stage_name: 'asc' };
        break;
    }

    // Get total count
    const total = await prisma.profile.count({ where });

    // Get profiles
    const profiles = await prisma.profile.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    return {
      data: profiles,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasMore: page * pageSize < total,
    };
  }
}

// Get featured models
export async function getFeaturedModels(limit: number = 6) {
  return cacheOrFetch(
    `featured_models_${limit}`,
    async () => {
      return await prisma.profile.findMany({
        where: {
          status: 'approved',
          is_featured: true,
        },
        orderBy: [
          { featured_order: 'asc' },
          { subscribers_count: 'desc' },
        ],
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    },
    600 // Cache for 10 minutes
  );
}

// Get model by slug
export async function getModelBySlug(slug: string) {
  const profile = await prisma.profile.findUnique({
    where: { slug },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          created_at: true,
        },
      },
      media: {
        where: {
          moderation_status: 'approved',
          is_archived: false,
        },
        orderBy: { created_at: 'desc' },
        take: 20,
      },
    },
  });

  if (!profile || profile.status !== 'approved') {
    return null;
  }

  // Increment view count
  await prisma.profile.update({
    where: { id: profile.id },
    data: { views_count: { increment: 1 } },
  });

  return profile;
}

// Get model by ID
export async function getModelById(id: string) {
  const profile = await prisma.profile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  return profile;
}

// Create or update model profile
export async function upsertProfile(data: {
  userId: string;
  stageName: string;
  bio?: string;
  height?: string;
  weight?: string;
  eyeColor?: string;
  hairColor?: string;
  measurements?: string;
  ethnicity?: string;
  location?: string;
  subscriptionPrice?: number;
  socialLinks?: any;
}) {
  // Generate slug
  const baseSlug = data.stageName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  let slug = baseSlug;
  let counter = 1;
  
  // Ensure unique slug
  while (await prisma.profile.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const profile = await prisma.profile.upsert({
    where: { user_id: data.userId },
    create: {
      user_id: data.userId,
      stage_name: data.stageName,
      slug,
      bio: data.bio,
      height: data.height,
      weight: data.weight,
      eye_color: data.eyeColor,
      hair_color: data.hairColor,
      measurements: data.measurements,
      ethnicity: data.ethnicity,
      location: data.location,
      subscription_price: data.subscriptionPrice || 9.99,
      social_links: data.socialLinks ? JSON.stringify(data.socialLinks) : null,
    },
    update: {
      stage_name: data.stageName,
      bio: data.bio,
      height: data.height,
      weight: data.weight,
      eye_color: data.eyeColor,
      hair_color: data.hairColor,
      measurements: data.measurements,
      ethnicity: data.ethnicity,
      location: data.location,
      subscription_price: data.subscriptionPrice,
      social_links: data.socialLinks ? JSON.stringify(data.socialLinks) : null,
    },
  });

  return profile;
}

// Get model stats for dashboard
export async function getModelStats(profileId: string) {
  const [
    subscriberCount,
    mediaCount,
    totalViews,
    totalLikes,
    recentEarnings,
  ] = await Promise.all([
    prisma.subscription.count({
      where: { profile_id: profileId, status: 'active' },
    }),
    prisma.media.count({
      where: { profile_id: profileId, is_archived: false },
    }),
    prisma.media.aggregate({
      where: { profile_id: profileId },
      _sum: { views_count: true },
    }),
    prisma.media.aggregate({
      where: { profile_id: profileId },
      _sum: { likes_count: true },
    }),
    prisma.transaction.aggregate({
      where: {
        profile_id: profileId,
        status: 'completed',
        created_at: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      _sum: { creator_amount: true },
    }),
  ]);

  return {
    subscriberCount,
    mediaCount,
    totalViews: totalViews._sum.views_count || 0,
    totalLikes: totalLikes._sum.likes_count || 0,
    recentEarnings: recentEarnings._sum.creator_amount || 0,
  };
}
