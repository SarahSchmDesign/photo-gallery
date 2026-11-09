'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, Sliders, ArrowUpRight } from 'lucide-react';
import LightboxModal, { PhotoData } from './LightboxModal';

interface SeriesData {
  id: string;
  slug: string;
  title: string;
  coverUrl?: string | null;
}

interface GalleryViewProps {
  initialPhotos: PhotoData[];
  series: SeriesData[];
}

export default function GalleryView({ initialPhotos, series }: GalleryViewProps) {
  const [photos] = useState<PhotoData[]>(initialPhotos);
  const [selectedSeriesSlug, setSelectedSeriesSlug] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);
  const [printModalPhoto, setPrintModalPhoto] = useState<PhotoData | null>(null);

  // Filtrage selon série
  const filteredPhotos = selectedSeriesSlug === 'all'
    ? photos
    : photos; // On peut filtrer par seriesId si besoin

  return (
    <div className="space-y-12">
      {/* Hero Éditorial Squarespace */}
      <section className="max-w-3xl space-y-4 pt-4 pb-8">
        <p className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
          Portfolio Photographique
        </p>
        <h1 className="font-editorial text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-stone-950 leading-[1.12]">
          Lumière, matière et silences géométriques.
        </h1>
        <p className="text-base md:text-lg text-stone-600 font-light leading-relaxed">
          Une collection de photographies d'art captant l'intimité des paysages nordiques, l'épure architecturale et le frémissement des nuits de voyage.
        </p>
      </section>

      {/* Séries Thématiques */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
            Séries &amp; Collections
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {series.map((item) => (
            <Link
              key={item.id}
              href={`/series/${item.slug}`}
              className="group relative aspect-[16/10] overflow-hidden rounded-lg bg-stone-100 shadow-sm transition-all"
            >
              {item.coverUrl && (
                <img
                  src={item.coverUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] tracking-widest uppercase text-stone-300 font-medium">Série</span>
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-xl font-medium">{item.title}</h3>
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Grille Principale des Clichés */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <h2 className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
            Tous les clichés ({filteredPhotos.length})
          </h2>
          <span className="text-xs text-stone-400 italic">Cliquez sur un cliché pour agrandir</span>
        </div>

        {/* Grille Asymétrique Éditoriale */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setLightboxIndex(index)}
              className="group break-inside-avoid overflow-hidden rounded-lg bg-stone-100 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 relative"
            >
              <img
                src={photo.thumbUrl || photo.imageUrl}
                alt={photo.title}
                loading="lazy"
                className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />

              {/* Overlay minimaliste au survol */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <h3 className="font-editorial text-lg font-medium tracking-wide">{photo.title}</h3>
                <div className="flex items-center justify-between text-xs text-stone-300 pt-1">
                  <span>{photo.location || 'Cliché'}</span>
                  {photo.camera && (
                    <span className="flex items-center gap-1 font-mono text-[10px] bg-black/40 px-2 py-0.5 rounded">
                      <Camera className="w-3 h-3 text-blue-400" />
                      {photo.camera}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      <LightboxModal
        photos={filteredPhotos}
        currentIndex={lightboxIndex}
        isOpen={lightboxIndex >= 0}
        onClose={() => setLightboxIndex(-1)}
        onNavigate={(newIndex) => setLightboxIndex(newIndex)}
        onOpenPrintInquiry={(photo) => setPrintModalPhoto(photo)}
      />

      {/* Modal Demande Tirage d'Art */}
      {printModalPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="font-editorial text-xl font-semibold text-stone-900">
              Demande de Tirage d'Art
            </h3>
            <p className="text-xs text-stone-600">
              Cliché sélectionné : <strong>« {printModalPhoto.title} »</strong>
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const clientName = (form.elements.namedItem('clientName') as HTMLInputElement).value;
                const clientEmail = (form.elements.namedItem('clientEmail') as HTMLInputElement).value;
                const desiredSize = (form.elements.namedItem('desiredSize') as HTMLInputElement).value;
                const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

                await fetch('/api/inquiries', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    photoSlug: printModalPhoto.slug,
                    photoTitle: printModalPhoto.title,
                    clientName,
                    clientEmail,
                    desiredSize,
                    message,
                  }),
                });

                alert('Votre demande de tirage a bien été envoyée à Sarah !');
                setPrintModalPhoto(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-stone-500 mb-1">Votre Nom</label>
                <input required name="clientName" className="w-full p-2.5 rounded border border-stone-300 text-sm" placeholder="Ex: Jean Dupont" />
              </div>
              <div>
                <label className="block text-stone-500 mb-1">Votre E-mail</label>
                <input required type="email" name="clientEmail" className="w-full p-2.5 rounded border border-stone-300 text-sm" placeholder="jean@exemple.com" />
              </div>
              <div>
                <label className="block text-stone-500 mb-1">Format souhaité</label>
                <select name="desiredSize" className="w-full p-2.5 rounded border border-stone-300 text-sm">
                  <option value="30x45 cm">30 x 45 cm (Papier Baryté)</option>
                  <option value="40x60 cm">40 x 60 cm (Tirage Fine Art signifié)</option>
                  <option value="60x90 cm">60 x 90 cm (Grand format encadré)</option>
                  <option value="Sur mesure">Autre format sur mesure</option>
                </select>
              </div>
              <div>
                <label className="block text-stone-500 mb-1">Message ou précisions</label>
                <textarea name="message" rows={3} className="w-full p-2.5 rounded border border-stone-300 text-sm" placeholder="Précisez votre demande ou adresse de livraison..." />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPrintModalPhoto(null)}
                  className="px-4 py-2 rounded border border-stone-300 hover:bg-stone-100 text-stone-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-stone-900 hover:bg-stone-800 text-white font-medium"
                >
                  Envoyer la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
