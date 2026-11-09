import { prisma } from '@/lib/prisma';
import GalleryView from '@/components/GalleryView';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [photos, series] = await Promise.all([
    prisma.photo.findMany({
      orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.series.findMany({
      orderBy: { order: 'asc' },
    }),
  ]);

  return <GalleryView initialPhotos={photos} series={series} />;
}
