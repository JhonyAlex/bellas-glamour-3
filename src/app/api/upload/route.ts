import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { verifyToken } from '@/app/actions/auth';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/mov'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || (payload.role !== 'model' && payload.role !== 'admin')) {
      return NextResponse.json({ error: 'Sin permisos para subir archivos' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 });
    }

    // Validate type
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 });
    }

    // Validate size
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json({ error: `Archivo demasiado grande. Máximo: ${maxSize / (1024 * 1024)}MB` }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${uuidv4()}.${ext}`;
    const subdir = isVideo ? 'videos' : 'photos';
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subdir);

    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({
      url: `/uploads/${subdir}/${filename}`,
      filename,
      size: file.size,
      type: isVideo ? 'video' : 'photo',
      mimeType: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 });
  }
}
