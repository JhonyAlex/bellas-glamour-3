import { NextRequest, NextResponse } from 'next/server';
import { verifyAge } from '@/app/actions/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birthDate } = body;

    if (!birthDate) {
      return NextResponse.json(
        { success: false, error: 'Birth date is required' },
        { status: 400 }
      );
    }

    const result = await verifyAge(birthDate);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Age verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
