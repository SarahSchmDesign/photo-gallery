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
    <div className="space-y-16 animate-fade-in">
      {/* Retour navigation */}
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#736E69] hover:text-[#141312] transition-colors py-1"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-1" />
        <span>Retour aux archives</span>
      </Link>

      {/* En-tête de la Série en Instrument Serif */}
      <header className="space-y-6 max-w-5xl border-b border-[rgba(20,19,18,0.1)] pb-12">
        <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#736E69]">
          SÉRIE DOCUMENTÉE • SÉLECTION ORIGINALE
        </div>

        <h1 className="font-instrument text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal leading-[0.92] tracking-tight text-[#141312]">
          {seriesItem.title}
        </h1>

        {seriesItem.subtitle && (
          <p className="font-editorial-italic text-2xl sm:text-3xl md:text-4xl text-[#4A4643] font-normal">
            « {seriesItem.subtitle} »
          </p>
        )}

        {seriesItem.statement && (
          <div className="pt-2 pl-6 border-l border-[rgba(20,19,18,0.2)] text-base sm:text-lg text-[#736E69] font-light max-w-3xl leading-relaxed">
            {seriesItem.statement}
          </div>
        )}
      </header>

      {/* Clichés de la série */}
      <GalleryView initialPhotos={seriesItem.photos} series={allSeries} />
    </div>
  );
}
