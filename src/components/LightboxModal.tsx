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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0C0B0A]/95 backdrop-blur-xl animate-fade-in select-none p-4 md:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Bouton Fermer */}
      <button
        ref={closeBtnRef}
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors border border-white/10 outline-none focus-visible:ring-1 focus-visible:ring-white"
        aria-label="Fermer (Échap)"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Flèches Navigation */}
      {photos.length > 1 && (
        <>
          <button
            onClick={() => onNavigate((currentIndex - 1 + photos.length) % photos.length)}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 outline-none focus-visible:ring-1 focus-visible:ring-white"
            aria-label="Cliché précédent"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => onNavigate((currentIndex + 1) % photos.length)}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10 outline-none focus-visible:ring-1 focus-visible:ring-white"
            aria-label="Cliché suivant"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Conteneur principal */}
      <div className="relative flex flex-col items-center justify-between w-full h-full max-w-7xl mx-auto gap-4">
        {/* Zone Image */}
        <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden py-2">
          <img
            key={currentPhoto.id}
            src={currentPhoto.imageUrl}
            alt={currentPhoto.title}
            className="max-h-[72vh] max-w-full object-contain rounded-none shadow-2xl animate-scale-in"
          />
        </div>

        {/* Fiche Technique en Instrument Serif & Monospace */}
        <div className="w-full max-w-4xl bg-[#141312]/90 backdrop-blur-md rounded-none p-5 sm:p-6 border border-white/10 text-stone-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl">
          <div className="space-y-1">
            <h2 className="font-instrument text-2xl sm:text-3xl font-normal text-white tracking-wide">
              {currentPhoto.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#A6A099]">
              {currentPhoto.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#8C6D46]" />
                  {currentPhoto.location}
                </span>
              )}
              {currentPhoto.capturedAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#8C6D46]" />
                  {currentPhoto.capturedAt}
                </span>
              )}
              <span>• ÉPREUVE {currentIndex + 1} / {photos.length}</span>
            </div>
            {currentPhoto.description && (
              <p className="text-xs text-stone-400 italic pt-1 max-w-xl font-light">{currentPhoto.description}</p>
            )}
          </div>

          {/* EXIF badges */}
          <div className="flex flex-wrap items-center gap-2">
            {(currentPhoto.camera || currentPhoto.lens) && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 border border-white/10 text-[11px] font-mono text-stone-300">
                <Camera className="w-3.5 h-3.5 text-[#8C6D46]" />
                <span>{currentPhoto.camera || ''} {currentPhoto.lens ? `• ${currentPhoto.lens}` : ''}</span>
              </div>
            )}

            {(currentPhoto.aperture || currentPhoto.shutter || currentPhoto.iso) && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 border border-white/10 text-[11px] font-mono text-stone-300">
                <Sliders className="w-3 h-3 text-[#8C6D46]" />
                <span>
                  {currentPhoto.aperture || ''} {currentPhoto.shutter || ''} {currentPhoto.iso ? `ISO ${currentPhoto.iso}` : ''}
                </span>
              </div>
            )}

            {/* Demande de tirage */}
            {onOpenPrintInquiry && (
              <button
                type="button"
                onClick={() => onOpenPrintInquiry(currentPhoto)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#FAF8F5] hover:bg-white text-[#141312] text-xs font-mono uppercase tracking-wider transition-colors shadow-sm"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Tirage</span>
              </button>
            )}

            {/* Télécharger */}
            <a
              href={currentPhoto.imageUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-black/60 hover:bg-white/10 text-stone-400 hover:text-white transition-colors border border-white/10"
              title="Télécharger l'original"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
