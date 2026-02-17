import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { PAGINATION } from '@/lib/constants';

// GET /api/models - Get all models
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '12', 10);
    const search = searchParams.get('search') || undefined;
    const eyeColor = searchParams.get('eyeColor') || undefined;
    const hairColor = searchParams.get('hairColor') || undefined;
    const ethnicity = searchParams.get('ethnicity') || undefined;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const sortBy = searchParams.get('sortBy') || undefined;
    const featured = searchParams.get('featured') === 'true';
    const slug = searchParams.get('slug');

    // Get single model by slug
    if (slug) {
      const model = await prisma.profile.findUnique({
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
            orderBy: { created_at: 'desc' as const },
            take: 20,
          },
        },
      });

      if (!model || model.status !== 'approved') {
        return NextResponse.json(
          { success: false, error: 'Model not found' },
          { status: 404 }
        );
      }

      // Increment view count
      await prisma.profile.update({
        where: { id: model.id },
        data: { views_count: { increment: 1 } },
      });

      return NextResponse.json({ success: true, data: model });
    }

    // Get featured models
    if (featured) {
      const models = await prisma.profile.findMany({
        where: {
          status: 'approved',
          is_featured: true,
        },
        orderBy: [
          { featured_order: 'asc' as const },
          { subscribers_count: 'desc' as const },
        ],
        take: pageSize,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return NextResponse.json({ success: true, data: models });
    }

    // Build where clause for regular models query
    const where: any = {
      status: 'approved',
    };

    if (search) {
      where.OR = [
        { stage_name: { contains: search, mode: 'insensitive' as const } },
        { location: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    if (eyeColor) where.eye_color = eyeColor;
    if (hairColor) where.hair_color = hairColor;
    if (ethnicity) where.ethnicity = ethnicity;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.subscription_price = {};
      if (minPrice !== undefined) where.subscription_price.gte = minPrice;
      if (maxPrice !== undefined) where.subscription_price.lte = maxPrice;
    }

    // Determine sort order
    let orderBy: any = { created_at: 'desc' as const };
    switch (sortBy) {
      case 'popular':
        orderBy = { subscribers_count: 'desc' as const };
        break;
      case 'price_low':
        orderBy = { subscription_price: 'asc' as const };
        break;
      case 'price_high':
        orderBy = { subscription_price: 'desc' as const };
        break;
      case 'name':
        orderBy = { stage_name: 'asc' as const };
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

    return NextResponse.json({
      success: true,
      data: profiles,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasMore: page * pageSize < total,
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch models', details: (error as any)?.message },
      { status: 500 }
    );
  }
}
