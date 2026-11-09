import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.clientName || !data.clientEmail) {
      return NextResponse.json({ error: 'Nom et e-mail requis' }, { status: 400 });
    }

    const inquiry = await prisma.printInquiry.create({
      data: {
        photoSlug: data.photoSlug || 'demande-generale',
        photoTitle: data.photoTitle || 'Tirage personnalisé',
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        desiredSize: data.desiredSize || '40x60 cm',
        message: data.message || '',
      },
    });

    return NextResponse.json(inquiry, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
