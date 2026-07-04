import { NextRequest, NextResponse } from 'next/server';
import { uploadMedia } from '@/lib/media';

export const config = {
  maxDuration: 900,
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'hero';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > 1024 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 1GB)' }, { status: 413 });
    }

    const url = await uploadMedia(file, folder);
    const mediaType = file.type.startsWith('video/') ? 'video' : 'image';

    return NextResponse.json({ url, mediaType, success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    console.error('Upload error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
