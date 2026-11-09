import { NextResponse } from 'next/server';
import { verifyPassword, createAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!verifyPassword(password)) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
    }

    await createAdminSession();
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
