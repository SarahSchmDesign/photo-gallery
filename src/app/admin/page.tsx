import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin/login');
  }

  const [photos, series, recipes, inquiries] = await Promise.all([
    prisma.photo.findMany({
      orderBy: { createdAt: 'desc' },
      include: { series: true },
    }),
    prisma.series.findMany({
      orderBy: { order: 'asc' },
    }),
    prisma.recipe.findMany({
      orderBy: { order: 'asc' },
    }),
    prisma.printInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <AdminDashboardClient
      initialPhotos={photos}
      seriesList={series}
      recipesList={recipes}
      inquiriesList={inquiries}
    />
  );
}
