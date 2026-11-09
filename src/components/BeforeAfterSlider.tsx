'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Sliders } from 'lucide-react';

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

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-stone-900 shadow-md select-none">
      {/* Conteneur principal avec drag */}
      <div
        ref={containerRef}
        className="relative aspect-[16/10] w-full cursor-ew-resize overflow-hidden"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
      >
        {/* Image APRES (pleine largeur en fond) */}
        <img
          src={afterUrl}
          alt={`${title} - Après retouche`}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        />

        {/* Image AVANT (masquée par clip-path selon sliderPosition) */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={beforeUrl}
            alt={`${title} - Avant retouche (RAW brut)`}
            className="absolute inset-0 h-full w-full object-cover max-w-none"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
            }}
          />
        </div>

        {/* Ligne verticale de séparation */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Poignée centrale */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-stone-900 shadow-lg flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing border border-stone-200">
            <Sliders className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Badges Avant / Après */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1 rounded pointer-events-none">
          Avant (RAW brut)
        </div>
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] tracking-widest uppercase font-semibold px-2.5 py-1 rounded pointer-events-none">
          Après (Recette)
        </div>
      </div>

      {/* Indication sous le slider */}
      <div className="py-2.5 px-4 bg-stone-100 dark:bg-stone-900 text-stone-500 dark:text-stone-400 text-xs flex justify-between items-center border-t border-stone-200 dark:border-stone-800">
        <span>Glissez pour comparer l'effet</span>
        <span className="italic">{software}</span>
      </div>
    </div>
  );
}
