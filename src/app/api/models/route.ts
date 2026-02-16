import { NextRequest, NextResponse } from 'next/server';
import { getModels, getModelBySlug, getFeaturedModels } from '@/app/actions/models';

// GET /api/models - Get all models
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '12', 10);
  const search = searchParams.get('search') || undefined;
  const eyeColor = searchParams.get('eyeColor') || undefined;
  const hairColor = searchParams.get('hairColor') || undefined;
  const ethnicity = searchParams.get('ethnicity') || undefined;
  const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
  const sortBy = searchParams.get('sortBy') as any || undefined;
  const featured = searchParams.get('featured') === 'true';
  const slug = searchParams.get('slug');

  try {
    // Get single model by slug
    if (slug) {
      const model = await getModelBySlug(slug);
      if (!model) {
        return NextResponse.json(
          { success: false, error: 'Model not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: model });
    }

    // Get featured models
    if (featured) {
      const models = await getFeaturedModels(pageSize);
      return NextResponse.json({ success: true, data: models });
    }

    // Get all models with filters
    const result = await getModels({
      filters: {
        search,
        eyeColor,
        hairColor,
        ethnicity,
        minPrice,
        maxPrice,
        sortBy,
      },
      page,
      pageSize,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}
