'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Camera, Check, X, SlidersHorizontal, MapPin } from 'lucide-react';
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

  const filteredPhotos = selectedSeriesSlug === 'all' ? photos : photos;

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
      }, 2200);
    } catch {
      alert('Une erreur est survenue lors de l\'envoi de votre demande.');
      setInquiryStatus('idle');
    }
  };

  return (
    <div className="space-y-24 md:space-y-36">
      {/* Hero Éditorial Monumental en Instrument Serif */}
      <section className="space-y-8 pt-4 pb-12 border-b border-[rgba(20,19,18,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono uppercase tracking-[0.2em] text-[#736E69]">
          <span>Portfolio Éditorial • Volume I</span>
          <span>Sarah Schm. / 2024 — 2026</span>
        </div>

        <div className="space-y-4 max-w-5xl">
          <h1 className="font-instrument text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal leading-[0.92] tracking-tight text-[#141312]">
            Lumière, matière <br />
            <span className="font-editorial-italic font-normal text-[#4A4643]">
              &amp; silences géométriques.
            </span>
          </h1>
          <p className="font-sans text-base sm:text-lg md:text-xl text-[#736E69] font-light max-w-2xl leading-relaxed pt-4">
            Une traversée photographique sensible dédiée à l'épure architecturale, la solitude des territoires nordiques et les lumières fugaces du monde.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-[#A6A099]">
          <span>• TIRAGES FINE ART NUMÉROTÉS</span>
          <span>• ÉPREUVES SIGNEES</span>
          <span>• FORMULES RAW LIGHTROOM</span>
        </div>
      </section>

      {/* Séries & Collections Thématiques */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[rgba(20,19,18,0.08)]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#736E69] block mb-1">
              Anthologie
            </span>
            <h2 className="font-instrument text-3xl sm:text-4xl text-[#141312]">
              Séries Thématiques
            </h2>
          </div>
          <span className="text-xs font-mono text-[#736E69]">
            {series.length} chapitres curatés
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {series.map((item, index) => (
            <Link
              key={item.id}
              href={`/series/${item.slug}`}
              className="group flex flex-col space-y-4"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-[#F4F1EB] border border-[rgba(20,19,18,0.06)] shadow-sm">
                {item.coverUrl && (
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                <div className="absolute top-4 left-4 z-10 font-instrument text-2xl text-white/90 drop-shadow-md">
                  0{index + 1}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity flex items-end p-6">
                  <div className="w-full flex items-end justify-between text-white">
                    <span className="text-xs uppercase tracking-[0.2em] font-mono text-white/80">
                      Explorer la série
                    </span>
                    <ArrowUpRight className="w-5 h-5 text-white/90 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-instrument text-2xl sm:text-3xl text-[#141312] group-hover:text-[#8C6D46] transition-colors leading-tight">
                  {item.title}
                </h3>
                <span className="text-xs font-mono text-[#736E69] block">
                  Collection originale
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Galerie Principale en Planches Asymétriques */}
      <section className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[rgba(20,19,18,0.08)]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#736E69] block mb-1">
              Catalogue Principal
            </span>
            <h2 className="font-instrument text-3xl sm:text-4xl text-[#141312]">
              Tous les Clichés
            </h2>
          </div>
          <span className="text-xs font-mono text-[#736E69]">
            {filteredPhotos.length} œuvres présentées • Clic pour agrandir
          </span>
        </div>

        {/* Grille Asymétrique Éditoriale avec typographie soignée */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10">
          {filteredPhotos.map((photo, index) => (
            <article
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
              aria-label={`Agrandir la photographie : ${photo.title}`}
              className="group break-inside-avoid flex flex-col space-y-3 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-[#141312] rounded-sm p-1"
            >
              <div className="relative overflow-hidden rounded-sm bg-[#F4F1EB] border border-[rgba(20,19,18,0.08)] shadow-sm">
                <img
                  src={photo.thumbUrl || photo.imageUrl}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Légende Éditoriale façon photobook */}
              <div className="flex flex-col space-y-1 pt-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-instrument text-xl sm:text-2xl text-[#141312] group-hover:text-[#8C6D46] transition-colors leading-snug">
                    {photo.title}
                  </h3>
                  {photo.location && (
                    <span className="text-[11px] font-mono text-[#736E69] shrink-0">
                      {photo.location}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#A6A099]">
                  <span>
                    {photo.camera ? `${photo.camera}` : 'Épreuve originale'}
                  </span>
                  {photo.aperture && (
                    <span>
                      {photo.aperture} • {photo.shutter || ''}
                    </span>
                  )}
                </div>
              </div>
            </article>
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

      {/* Dialogue Demande de Tirage d'Art (Style Galerie / Colophon) */}
      {printModalPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="print-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget && inquiryStatus !== 'submitting') {
              setPrintModalPhoto(null);
            }
          }}
        >
          <div className="relative w-full max-w-lg rounded-sm bg-[#FAF8F5] p-8 sm:p-10 shadow-2xl space-y-6 animate-scale-in border border-[rgba(20,19,18,0.15)] text-[#141312]">
            <button
              onClick={() => setPrintModalPhoto(null)}
              className="absolute top-6 right-6 p-2 text-[#736E69] hover:text-[#141312] transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            {inquiryStatus === 'success' ? (
              <div className="py-12 text-center space-y-4">
                <Check className="w-10 h-10 text-[#141312] mx-auto" />
                <h3 className="font-instrument text-3xl text-[#141312]">
                  Demande d'Épreuve Transmise
                </h3>
                <p className="text-sm text-[#736E69] max-w-md mx-auto leading-relaxed">
                  Sarah prendra directement contact avec vous par e-mail afin de vous adresser la confirmation de tirage, les détails d'encadrement et le certificat d'authenticité.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2 border-b border-[rgba(20,19,18,0.1)] pb-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#736E69] block">
                    Bon d'Acquisition d'Art
                  </span>
                  <h3 id="print-dialog-title" className="font-instrument text-3xl sm:text-4xl text-[#141312]">
                    Commander un Tirage
                  </h3>
                  <p className="text-xs text-[#736E69]">
                    Œuvre sélectionnée : <strong className="text-[#141312]">« {printModalPhoto.title} »</strong>
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                  <div>
                    <label htmlFor="clientName" className="block text-[#4A4643] mb-1 font-mono uppercase tracking-wider text-[10px]">
                      Nom &amp; Prénom *
                    </label>
                    <input
                      id="clientName"
                      required
                      name="clientName"
                      className="w-full p-3 rounded-none border border-[rgba(20,19,18,0.2)] text-sm text-[#141312] bg-white outline-none focus:border-[#141312] transition-colors"
                      placeholder="Ex: Camille Bernard"
                    />
                  </div>
                  <div>
                    <label htmlFor="clientEmail" className="block text-[#4A4643] mb-1 font-mono uppercase tracking-wider text-[10px]">
                      Adresse E-mail *
                    </label>
                    <input
                      id="clientEmail"
                      required
                      type="email"
                      name="clientEmail"
                      className="w-full p-3 rounded-none border border-[rgba(20,19,18,0.2)] text-sm text-[#141312] bg-white outline-none focus:border-[#141312] transition-colors"
                      placeholder="camille@exemple.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="desiredSize" className="block text-[#4A4643] mb-1 font-mono uppercase tracking-wider text-[10px]">
                      Format &amp; Support d'Impression
                    </label>
                    <select
                      id="desiredSize"
                      name="desiredSize"
                      className="w-full p-3 rounded-none border border-[rgba(20,19,18,0.2)] text-sm text-[#141312] bg-white outline-none focus:border-[#141312] transition-colors"
                    >
                      <option value="30x45 cm">30 x 45 cm — Tirage Fine Art Papier Baryté Hahnemühle</option>
                      <option value="40x60 cm">40 x 60 cm — Épreuve numérotée &amp; contrecollée sur Dibond</option>
                      <option value="60x90 cm">60 x 90 cm — Tirage d'exception avec caisse américaine chêne</option>
                      <option value="Sur mesure">Format ou encadrement spécifique sur mesure</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-[#4A4643] mb-1 font-mono uppercase tracking-wider text-[10px]">
                      Précisions ou adresse de livraison (optionnel)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      className="w-full p-3 rounded-none border border-[rgba(20,19,18,0.2)] text-sm text-[#141312] bg-white outline-none focus:border-[#141312] transition-colors"
                      placeholder="Indiquez une ville ou des souhaits d'encadrement particuliers..."
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setPrintModalPhoto(null)}
                      disabled={inquiryStatus === 'submitting'}
                      className="px-5 py-3 border border-[rgba(20,19,18,0.2)] text-[#141312] text-xs uppercase tracking-widest font-mono hover:bg-[#F4F1EB] transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={inquiryStatus === 'submitting'}
                      className="px-6 py-3 bg-[#141312] text-[#FAF8F5] text-xs uppercase tracking-widest font-mono hover:bg-black transition-colors disabled:opacity-50"
                    >
                      {inquiryStatus === 'submitting' ? 'Envoi...' : 'Envoyer la demande'}
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
