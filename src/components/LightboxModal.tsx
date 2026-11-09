'use client';

import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Camera, Sliders, Mail, MapPin, Calendar } from 'lucide-react';

export interface PhotoData {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  thumbUrl?: string | null;
  camera?: string | null;
  lens?: string | null;
  aperture?: string | null;
  shutter?: string | null;
  iso?: number | null;
  location?: string | null;
  capturedAt?: string | null;
}

interface LightboxModalProps {
  photos: PhotoData[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onOpenPrintInquiry?: (photo: PhotoData) => void;
}

export default function LightboxModal({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  onOpenPrintInquiry,
}: LightboxModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % photos.length);
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + photos.length) % photos.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, currentIndex, photos.length, onClose, onNavigate]);

  if (!isOpen || !photos[currentIndex]) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Vue plein écran : ${currentPhoto.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 backdrop-blur-xl animate-fade-in select-none p-4 md:p-8"
      onClick={(e) => {
        // Ferme si on clique sur l'arrière-plan
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Bouton Fermer */}
      <button
        ref={closeBtnRef}
        onClick={onClose}
        className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white transition-[transform,colors] duration-150 hover:scale-105 active:scale-95 border border-stone-800 focus-visible:ring-2 focus-visible:ring-white outline-none"
        aria-label="Fermer la vue plein écran (Échap)"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Flèches Navigation */}
      {photos.length > 1 && (
        <>
          <button
            onClick={() => onNavigate((currentIndex - 1 + photos.length) % photos.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white transition-[transform,colors] duration-150 hover:scale-105 active:scale-95 border border-stone-800 focus-visible:ring-2 focus-visible:ring-white outline-none"
            aria-label="Cliché précédent (Flèche gauche)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => onNavigate((currentIndex + 1) % photos.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white transition-[transform,colors] duration-150 hover:scale-105 active:scale-95 border border-stone-800 focus-visible:ring-2 focus-visible:ring-white outline-none"
            aria-label="Cliché suivant (Flèche droite)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Structure principale */}
      <div className="relative flex flex-col items-center justify-between w-full h-full max-w-7xl mx-auto gap-4">
        {/* Zone Image avec animation de mise à l'échelle douce */}
        <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden py-2">
          <img
            key={currentPhoto.id}
            src={currentPhoto.imageUrl}
            alt={currentPhoto.title}
            className="max-h-[72vh] max-w-full object-contain rounded-sm shadow-2xl animate-scale-in"
          />
        </div>

        {/* Barre d'informations et métadonnées EXIF (Unslop & Hallmark) */}
        <div className="w-full max-w-4xl bg-stone-900/85 backdrop-blur-md rounded-xl p-4 md:p-5 border border-stone-800 text-stone-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
          <div className="space-y-1">
            <h2 className="font-editorial text-xl font-semibold text-white tracking-wide">
              {currentPhoto.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400">
              {currentPhoto.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  {currentPhoto.location}
                </span>
              )}
              {currentPhoto.capturedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-stone-400" />
                  {currentPhoto.capturedAt}
                </span>
              )}
              <span>• {currentIndex + 1} / {photos.length}</span>
            </div>
            {currentPhoto.description && (
              <p className="text-xs text-stone-300 italic pt-0.5 max-w-xl">{currentPhoto.description}</p>
            )}
          </div>

          {/* EXIF badges */}
          <div className="flex flex-wrap items-center gap-2">
            {(currentPhoto.camera || currentPhoto.lens) && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-950/70 border border-stone-800 text-[11px] text-stone-300">
                <Camera className="w-3.5 h-3.5 text-stone-400" />
                <span>{currentPhoto.camera || ''} {currentPhoto.lens ? `• ${currentPhoto.lens}` : ''}</span>
              </div>
            )}

            {(currentPhoto.aperture || currentPhoto.shutter || currentPhoto.iso) && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-950/70 border border-stone-800 text-[11px] font-mono text-stone-300">
                <Sliders className="w-3 h-3 text-stone-400" />
                <span>
                  {currentPhoto.aperture || ''} {currentPhoto.shutter || ''} {currentPhoto.iso ? `ISO ${currentPhoto.iso}` : ''}
                </span>
              </div>
            )}

            {/* Action Demande Tirage */}
            {onOpenPrintInquiry && (
              <button
                type="button"
                onClick={() => onOpenPrintInquiry(currentPhoto)}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-stone-100 hover:bg-white text-stone-900 text-xs font-medium transition-[transform,background-color] duration-150 hover:scale-[1.02] active:scale-95 shadow-sm"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Tirage d'art</span>
              </button>
            )}

            {/* Télécharger l'original */}
            <a
              href={currentPhoto.imageUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded bg-stone-950/70 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors border border-stone-800"
              title="Télécharger l'original"
              aria-label="Télécharger le fichier original"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
