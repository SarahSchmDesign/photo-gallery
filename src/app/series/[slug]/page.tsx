import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
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
    <div className="space-y-12 animate-fade-in">
      {/* Retour navigation */}
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-500 hover:text-stone-950 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded-sm py-1"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-1" />
        <span>Retour au portfolio</span>
      </Link>

      {/* En-tête de la Série */}
      <header className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium tracking-wide border border-stone-200/60">
          <Sparkles className="w-3.5 h-3.5 text-stone-500" />
          <span>Série &amp; Collection Documentée</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-stone-950 leading-[1.12]">
          {seriesItem.title}
        </h1>
        {seriesItem.subtitle && (
          <p className="text-lg sm:text-xl text-stone-600 font-light italic">
            {seriesItem.subtitle}
          </p>
        )}
        {seriesItem.statement && (
          <div className="pt-2 border-l-2 border-stone-300 pl-4 text-sm sm:text-base text-stone-600 leading-relaxed italic">
            « {seriesItem.statement} »
          </div>
        )}
      </header>

      {/* Clichés de la série */}
      <GalleryView initialPhotos={seriesItem.photos} series={allSeries} />
    </div>
  );
}
