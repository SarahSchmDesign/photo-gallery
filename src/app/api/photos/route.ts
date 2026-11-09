import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET() {
  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: 'desc' },
    include: { series: true },
  });
  return NextResponse.json(photos);
}

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const slug = data.slug || `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    const photo = await prisma.photo.create({
      data: {
        slug,
        title: data.title,
        description: data.description || null,
        imageUrl: data.imageUrl,
        thumbUrl: data.thumbUrl || data.imageUrl,
        width: data.width || 1600,
        height: data.height || 1067,
        aspectRatio: data.aspectRatio || 1.5,
        camera: data.camera || null,
        lens: data.lens || null,
        focalLength: data.focalLength || null,
        aperture: data.aperture || null,
        shutter: data.shutter || null,
        iso: data.iso ? Number(data.iso) : null,
        location: data.location || null,
        capturedAt: data.capturedAt || null,
        isFeatured: Boolean(data.isFeatured),
        tags: data.tags || '',
        seriesId: data.seriesId || null,
      },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (err: any) {
    console.error('Erreur création photo', err);
    return NextResponse.json({ error: err.message || 'Erreur lors de la création' }, { status: 400 });
  }
}
