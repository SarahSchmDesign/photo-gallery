import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET() {
  const recipes = await prisma.recipe.findMany({
    orderBy: { order: 'asc' },
  });
  return NextResponse.json(recipes);
}

export async function POST(request: Request) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const slug = data.slug || `${data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    const recipe = await prisma.recipe.create({
      data: {
        slug,
        title: data.title,
        description: data.description,
        price: Number(data.price) || 19.0,
        currency: 'EUR',
        lemonSqueezyUrl: data.lemonSqueezyUrl || 'https://lemonsqueezy.com',
        beforeUrl: data.beforeUrl,
        afterUrl: data.afterUrl,
        software: data.software || 'Adobe Lightroom',
        includedFiles: data.includedFiles || 'Presets .xmp, .dng + Guide PDF',
      },
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
