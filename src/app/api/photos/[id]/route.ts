import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdminAuthenticated } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    await prisma.photo.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const photo = await prisma.photo.update({
      where: { id: params.id },
      data: {
        isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : undefined,
        title: data.title,
        description: data.description,
        order: data.order !== undefined ? Number(data.order) : undefined,
      },
    });
    return NextResponse.json(photo);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
