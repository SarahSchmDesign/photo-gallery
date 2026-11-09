'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, ArrowUpRight, Check, X, Sparkles, Filter } from 'lucide-react';
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
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Filtrage selon série
  const filteredPhotos = selectedSeriesSlug === 'all'
    ? photos
    : photos; // On conserve la flexibilité de filtrage

  const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!printModalPhoto) return;

    setInquiryStatus('submitting');
    const form = e.currentTarget;
    const clientName = (form.elements.namedItem('clientName') as HTMLInputElement).value;
    const clientEmail = (form.elements.namedItem('clientEmail') as HTMLInputElement).value;
    const desiredSize = (form.elements.namedItem('desiredSize') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    try {
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
      setInquiryStatus('success');
      setTimeout(() => {
        setPrintModalPhoto(null);
        setInquiryStatus('idle');
      }, 2000);
    } catch {
      alert('Une erreur est survenue lors de l\'envoi de votre demande.');
      setInquiryStatus('idle');
    }
  };

  return (
    <div className="space-y-16">
      {/* Hero Éditorial Squarespace / Hallmark */}
      <section className="max-w-3xl space-y-5 pt-2 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium tracking-wide border border-stone-200/60">
          <Sparkles className="w-3.5 h-3.5 text-stone-500" />
          <span>Portfolio &amp; Carnet Photographique</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-stone-950 leading-[1.12]">
          Lumière, matière &amp; silences géométriques.
        </h1>
        <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-2xl">
          Une collection de photographies d’art captant l’intimité des paysages nordiques, l’épure architecturale et le frémissement des nuits de voyage.
        </p>
      </section>

      {/* Séries Thématiques */}
      <section className="space-y-5">
        <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
          <h2 className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
            Séries &amp; Collections
          </h2>
          <span className="text-xs text-stone-400">
            {series.length} séries documentées
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {series.map((item, index) => (
            <Link
              key={item.id}
              href={`/series/${item.slug}`}
              className={`group relative aspect-[16/10] overflow-hidden rounded-xl bg-stone-100 border border-stone-200/60 shadow-sm transition-[box-shadow,transform] duration-300 hover:shadow-md hover:-translate-y-0.5 animate-fade-up stagger-${(index % 6) + 1}`}
            >
              {item.coverUrl && (
                <img
                  src={item.coverUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-105"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] tracking-widest uppercase text-stone-300 font-medium">
                  Série
                </span>
                <div className="flex items-center justify-between mt-1">
                  <h3 className="font-editorial text-xl font-medium">{item.title}</h3>
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-[transform,opacity] duration-200 ease-[var(--ease-spring)]">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Grille Principale des Clichés */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
              Tous les clichés ({filteredPhotos.length})
            </h2>
          </div>
          <span className="text-xs text-stone-400 italic">
            Cliquez sur un cliché pour explorer en haute définition et voir les métadonnées EXIF
          </span>
        </div>

        {/* Grille Asymétrique Éditoriale avec animations échelonnées */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setLightboxIndex(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setLightboxIndex(index);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Agrandir la photo : ${photo.title}`}
              className={`group break-inside-avoid overflow-hidden rounded-xl bg-stone-100 cursor-pointer border border-stone-200/50 shadow-sm hover:shadow-md transition-[box-shadow,transform] duration-300 hover:-translate-y-1 relative outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 animate-fade-up stagger-${(index % 6) + 1}`}
            >
              <img
                src={photo.thumbUrl || photo.imageUrl}
                alt={photo.title}
                loading="lazy"
                className="w-full object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.025]"
              />

              {/* Overlay minimaliste au survol (Unslop: chrome calme et lisible) */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-5 text-white">
                <h3 className="font-editorial text-lg font-medium tracking-wide leading-snug">
                  {photo.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-stone-300 pt-1.5">
                  <span>{photo.location || 'Cliché original'}</span>
                  {photo.camera && (
                    <span className="flex items-center gap-1 font-mono text-[10px] bg-stone-900/70 border border-white/10 px-2 py-0.5 rounded">
                      <Camera className="w-3 h-3 text-stone-300" />
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

      {/* Modal Demande Tirage d'Art (Hallmark & Motion) */}
      {printModalPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="print-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget && inquiryStatus !== 'submitting') {
              setPrintModalPhoto(null);
            }
          }}
        >
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl space-y-5 animate-scale-in border border-stone-200">
            <button
              onClick={() => setPrintModalPhoto(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Fermer la boîte de dialogue"
            >
              <X className="w-4 h-4" />
            </button>

            {inquiryStatus === 'success' ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-900 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-2xl font-medium text-stone-900">
                  Demande envoyée
                </h3>
                <p className="text-sm text-stone-600">
                  Merci ! Sarah vous recontactera très prochainement avec les options de tirage et délais d'expédition.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">
                    Tirage d'Art &amp; Épreuve Signée
                  </span>
                  <h3 id="print-dialog-title" className="font-editorial text-2xl font-medium text-stone-900">
                    Demande de Tirage
                  </h3>
                  <p className="text-xs text-stone-600">
                    Œuvre : <strong>« {printModalPhoto.title} »</strong>
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                  <div>
                    <label htmlFor="clientName" className="block text-stone-600 mb-1 font-medium">
                      Votre Nom complet
                    </label>
                    <input
                      id="clientName"
                      required
                      name="clientName"
                      className="w-full p-3 rounded-lg border border-stone-300 text-sm text-stone-900 bg-stone-50 focus:bg-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                      placeholder="Ex: Camille Bernard"
                    />
                  </div>
                  <div>
                    <label htmlFor="clientEmail" className="block text-stone-600 mb-1 font-medium">
                      Votre Adresse E-mail
                    </label>
                    <input
                      id="clientEmail"
                      required
                      type="email"
                      name="clientEmail"
                      className="w-full p-3 rounded-lg border border-stone-300 text-sm text-stone-900 bg-stone-50 focus:bg-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                      placeholder="camille@exemple.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="desiredSize" className="block text-stone-600 mb-1 font-medium">
                      Format &amp; Finition souhaités
                    </label>
                    <select
                      id="desiredSize"
                      name="desiredSize"
                      className="w-full p-3 rounded-lg border border-stone-300 text-sm text-stone-900 bg-stone-50 focus:bg-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                    >
                      <option value="30x45 cm">30 x 45 cm — Papier Baryté Hahnemühle</option>
                      <option value="40x60 cm">40 x 60 cm — Tirage Fine Art contrecollé &amp; signé</option>
                      <option value="60x90 cm">60 x 90 cm — Grand format avec caisse américaine</option>
                      <option value="Sur mesure">Format sur mesure / Demande spécifique</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-stone-600 mb-1 font-medium">
                      Message ou précisions (optionnel)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      className="w-full p-3 rounded-lg border border-stone-300 text-sm text-stone-900 bg-stone-50 focus:bg-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                      placeholder="Précisez un lieu de livraison, une date souhaitée ou un encadrement..."
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setPrintModalPhoto(null)}
                      disabled={inquiryStatus === 'submitting'}
                      className="px-4 py-2.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 text-sm font-medium transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={inquiryStatus === 'submitting'}
                      className="px-5 py-2.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-white text-sm font-medium transition-[transform,background-color] duration-150 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                      {inquiryStatus === 'submitting' ? 'Envoi en cours...' : 'Envoyer la demande'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
