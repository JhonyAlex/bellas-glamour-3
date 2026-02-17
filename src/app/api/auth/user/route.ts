import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { verifyToken } from '@/app/actions/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        email_verified: true,
        age_verified: true,
        is_banned: true,
        created_at: true,
        profile: {
          select: {
            id: true,
            stage_name: true,
            slug: true,
            avatar_url: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({ user: user || null }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { user: null, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
