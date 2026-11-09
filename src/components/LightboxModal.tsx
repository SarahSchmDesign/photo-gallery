'use client';

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Camera, Sliders, Mail } from 'lucide-react';

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
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % photos.length);
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + photos.length) % photos.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex, photos.length, onClose, onNavigate]);

  if (!isOpen || !photos[currentIndex]) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in select-none">
      {/* Bouton Fermer */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-50 p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-800 text-stone-300 hover:text-white transition-all border border-stone-800"
        aria-label="Fermer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Flèches Navigation */}
      {photos.length > 1 && (
        <>
          <button
            onClick={() => onNavigate((currentIndex - 1 + photos.length) % photos.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-stone-900/60 hover:bg-stone-800 text-white transition-all border border-stone-800"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => onNavigate((currentIndex + 1) % photos.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-stone-900/60 hover:bg-stone-800 text-white transition-all border border-stone-800"
            aria-label="Suivant"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Conteneur principal */}
      <div className="relative flex flex-col items-center justify-between w-full h-full p-4 md:p-8 max-w-7xl mx-auto">
        {/* Zone Image */}
        <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden py-4">
          <img
            src={currentPhoto.imageUrl}
            alt={currentPhoto.title}
            className="max-h-[75vh] max-w-full object-contain rounded-sm shadow-2xl transition-all"
          />
        </div>

        {/* Barre d'informations et métadonnées EXIF */}
        <div className="w-full max-w-4xl bg-stone-950/80 backdrop-blur-md rounded-xl p-4 md:p-5 border border-stone-800/80 text-stone-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h2 className="font-editorial text-xl font-semibold text-white tracking-wide">
              {currentPhoto.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400">
              {currentPhoto.location && <span>📍 {currentPhoto.location}</span>}
              {currentPhoto.capturedAt && <span>📅 {currentPhoto.capturedAt}</span>}
              <span>• Cliché {currentIndex + 1} sur {photos.length}</span>
            </div>
            {currentPhoto.description && (
              <p className="text-xs text-stone-300 italic pt-0.5">{currentPhoto.description}</p>
            )}
          </div>

          {/* EXIF badges */}
          <div className="flex flex-wrap items-center gap-2">
            {(currentPhoto.camera || currentPhoto.lens) && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-[11px] text-stone-300">
                <Camera className="w-3.5 h-3.5 text-blue-400" />
                <span>{currentPhoto.camera || ''} {currentPhoto.lens ? `• ${currentPhoto.lens}` : ''}</span>
              </div>
            )}

            {(currentPhoto.aperture || currentPhoto.shutter || currentPhoto.iso) && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-[11px] font-mono text-stone-300">
                <Sliders className="w-3 h-3 text-emerald-400" />
                <span>
                  {currentPhoto.aperture || ''} {currentPhoto.shutter || ''} {currentPhoto.iso ? `ISO ${currentPhoto.iso}` : ''}
                </span>
              </div>
            )}

            {/* Action Demande Tirage */}
            {onOpenPrintInquiry && (
              <button
                onClick={() => onOpenPrintInquiry(currentPhoto)}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-xs text-white transition-all border border-stone-700"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Tirage d'art</span>
              </button>
            )}

            {/* Télécharger */}
            <a
              href={currentPhoto.imageUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition-all border border-stone-800"
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
