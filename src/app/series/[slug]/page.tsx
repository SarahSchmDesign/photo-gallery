import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import GalleryView from '@/components/GalleryView';

export const dynamic = 'force-dynamic';

interface SeriesPageProps {
  params: {
    slug: string;
  };
}

export default async function SeriesDetailPage({ params }: SeriesPageProps) {
  const seriesItem = await prisma.series.findUnique({
    where: { slug: params.slug },
    include: {
      photos: {
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!seriesItem) {
    notFound();
  }

  const allSeries = await prisma.series.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-12">
      {/* Retour */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Retour au portfolio</span>
      </Link>

      {/* En-tête de la Série */}
      <header className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-widest text-blue-600 font-semibold">
          Série Photographique
        </span>
        <h1 className="font-editorial text-4xl md:text-5xl font-medium text-stone-950">
          {seriesItem.title}
        </h1>
        {seriesItem.subtitle && (
          <p className="text-lg text-stone-600 font-light italic">
            {seriesItem.subtitle}
          </p>
        )}
        {seriesItem.statement && (
          <div className="pt-2 border-l-2 border-stone-300 pl-4 text-sm text-stone-600 leading-relaxed">
            « {seriesItem.statement} »
          </div>
        )}
      </header>

      {/* Clichés de la série */}
      <GalleryView initialPhotos={seriesItem.photos} series={allSeries} />
    </div>
  );
}
