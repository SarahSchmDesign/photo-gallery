'use client';

import React, { useState, useRef, useCallback } from 'react';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  title: string;
  software?: string;
}

export default function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  title,
  software = 'Adobe Lightroom',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(Math.round(percentage * 10) / 10);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was already released
    }
  };

  // Accessibilité clavier (conformité WCAG Slider Pattern)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, Math.round(prev - step)));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, Math.round(prev + step)));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSliderPosition(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSliderPosition(100);
    }
  };

  return (
    <div className="group/slider relative w-full overflow-hidden rounded-xl bg-stone-900 border border-stone-200/60 dark:border-stone-800 shadow-sm select-none">
      {/* Conteneur interactif avec PointerEvents modernes */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative aspect-[16/10] w-full cursor-ew-resize overflow-hidden touch-none"
      >
        {/* Image APRÈS (pleine largeur en arrière-plan) */}
        <img
          src={afterUrl}
          alt={`${title} - Après retouche`}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          loading="lazy"
        />

        {/* Image AVANT (révélée selon la position du curseur via clip-path haute performance) */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={beforeUrl}
            alt={`${title} - Avant retouche (RAW brut)`}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Ligne séparatrice verticale */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_8px_rgba(0,0,0,0.6)] pointer-events-none will-change-transform"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Poignée centrale tactile & clavier */}
          <div
            ref={handleRef}
            role="slider"
            tabIndex={0}
            aria-label={`Curseur avant/après pour ${title}`}
            aria-valuenow={Math.round(sliderPosition)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`${Math.round(sliderPosition)}% retouche`}
            onKeyDown={handleKeyDown}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-stone-900 shadow-lg flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing border border-stone-200/80 outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 transition-transform duration-150 ${
              isDragging ? 'scale-95 shadow-xl' : 'hover:scale-110'
            }`}
            style={{ transitionTimingFunction: 'var(--ease-spring)' }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-700" />
          </div>
        </div>

        {/* Badges d'état discrets et élégants (Unslop & Hallmark) */}
        <div className="absolute top-3.5 left-3.5 bg-stone-950/70 backdrop-blur-md text-stone-200 text-[10px] tracking-wider uppercase font-mono px-2.5 py-1 rounded border border-white/10 pointer-events-none">
          Avant <span className="text-stone-400">• RAW</span>
        </div>
        <div className="absolute top-3.5 right-3.5 bg-stone-950/70 backdrop-blur-md text-stone-200 text-[10px] tracking-wider uppercase font-mono px-2.5 py-1 rounded border border-white/10 pointer-events-none">
          Après <span className="text-stone-400">• Recette</span>
        </div>
      </div>

      {/* Barre de contrôle et raccourcis rapides */}
      <div className="py-2.5 px-4 bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-400 text-xs flex flex-wrap justify-between items-center gap-2 border-t border-stone-200/60 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-stone-500">
            {Math.round(sliderPosition)}%
          </span>
          <span className="text-stone-300 dark:text-stone-700">|</span>
          {/* Boutons de réglage rapide pour mobile / accessibilité */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSliderPosition(0)}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                sliderPosition === 0
                  ? 'bg-stone-900 text-white font-medium'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              100% Avant
            </button>
            <button
              type="button"
              onClick={() => setSliderPosition(50)}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                sliderPosition === 50
                  ? 'bg-stone-900 text-white font-medium'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              50 / 50
            </button>
            <button
              type="button"
              onClick={() => setSliderPosition(100)}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                sliderPosition === 100
                  ? 'bg-stone-900 text-white font-medium'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              100% Après
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
          <Sparkles className="w-3 h-3 text-stone-400" />
          <span className="italic">{software}</span>
        </div>
      </div>
    </div>
  );
}
