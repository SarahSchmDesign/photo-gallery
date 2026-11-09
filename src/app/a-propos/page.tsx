'use client';

import React, { useState } from 'react';
import { Camera, Send, Award, CheckCircle, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const clientName = (form.elements.namedItem('clientName') as HTMLInputElement).value;
    const clientEmail = (form.elements.namedItem('clientEmail') as HTMLInputElement).value;
    const photoTitle = (form.elements.namedItem('photoTitle') as HTMLInputElement).value;
    const desiredSize = (form.elements.namedItem('desiredSize') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoSlug: 'demande-generale',
          photoTitle: photoTitle || 'Tirage personnalisé',
          clientName,
          clientEmail,
          desiredSize,
          message,
        }),
      });
      setSubmitted(true);
    } catch {
      alert('Une erreur est survenue lors de l\'envoi de votre demande.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-fade-in">
      {/* Bio / Démarche artistique */}
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium tracking-wide border border-stone-200/60">
          <Sparkles className="w-3.5 h-3.5 text-stone-500" />
          <span>Démarche Artistique &amp; Biographie</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-stone-950 leading-[1.12]">
          Sarah — Capturer l’émotion pure de l’instant.
        </h1>
        <div className="prose text-stone-600 space-y-4 font-light text-base sm:text-lg leading-relaxed">
          <p>
            Photographe passionnée par la lumière naturelle et la pureté des lignes géométriques, je conçois la photographie comme un dialogue silencieux entre l'observateur et le monde.
          </p>
          <p>
            Mes séries oscillent entre la solitude contemplative des paysages nordiques et le rythme vibrant des cités contemporaines. Chaque prise de vue est pensée dans un souci d'harmonie tonale, que je prolonge lors du développement numérique à travers des recettes de retouche méticuleusement calibrées.
          </p>
        </div>
      </section>

      {/* Matériel & Boîtiers (Unslop & Hallmark) */}
      <section className="bg-stone-50 rounded-2xl p-8 border border-stone-200/70 space-y-5">
        <h2 className="font-editorial text-2xl font-medium text-stone-900 flex items-center gap-2.5">
          <Camera className="w-5 h-5 text-stone-700" />
          <span>Dans mon sac photographique</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-600">
          <div className="space-y-1.5 p-4 rounded-xl bg-white border border-stone-200/50">
            <p className="font-semibold text-stone-900 text-sm">Boîtiers principaux</p>
            <p className="leading-relaxed">Sony A7R V (Plein format 61 MP) &amp; Fujifilm X-T5 (Capteur X-Trans V)</p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-white border border-stone-200/50">
            <p className="font-semibold text-stone-900 text-sm">Optiques de prédilection</p>
            <p className="leading-relaxed">Sony FE 35mm f/1.4 GM, 50mm f/1.2 GM &amp; Fujinon 16mm f/1.4 R</p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-white border border-stone-200/50">
            <p className="font-semibold text-stone-900 text-sm">Développement &amp; Étalonnage</p>
            <p className="leading-relaxed">Adobe Lightroom Classic calibré sur écran EIZO ColorEdge (espace DCI-P3 / Adobe RGB)</p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-white border border-stone-200/50">
            <p className="font-semibold text-stone-900 text-sm">Laboratoire de tirage d'art</p>
            <p className="leading-relaxed">Papiers d'art Hahnemühle Photo Rag Baryta 315g, encres pigmentaires UltraChrome</p>
          </div>
        </div>
      </section>

      {/* Formulaire de Tirages d'Art */}
      <section className="border-t border-stone-200/80 pt-12 space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-stone-500" />
            <span>Tirages d'Art Signés &amp; Numérotés</span>
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-stone-950 pt-1.5">
            Commander une épreuve d’exception
          </h2>
          <p className="text-stone-600 text-sm pt-1 leading-relaxed max-w-2xl">
            Toutes les photographies du portfolio sont disponibles en tirages d'art numérotés, signés à la main et accompagnés de leur certificat d'authenticité infalsifiable.
          </p>
        </div>

        {submitted ? (
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8 text-center space-y-3 animate-scale-in">
            <CheckCircle className="w-8 h-8 text-stone-900 mx-auto" />
            <h3 className="font-editorial text-2xl font-medium text-stone-950">
              Merci pour votre demande
            </h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              Sarah vous répondra personnellement sous 24h avec les options de tirage, les formats d'encadrement sur mesure et les délais d'expédition.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 max-w-xl text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="clientName" className="block text-stone-700 mb-1 font-medium">Votre Nom *</label>
                <input
                  id="clientName"
                  required
                  name="clientName"
                  className="w-full p-3 rounded-lg border border-stone-300 bg-white text-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900 transition-colors"
                  placeholder="Ex: Claire Martin"
                />
              </div>
              <div>
                <label htmlFor="clientEmail" className="block text-stone-700 mb-1 font-medium">Votre E-mail *</label>
                <input
                  id="clientEmail"
                  required
                  type="email"
                  name="clientEmail"
                  className="w-full p-3 rounded-lg border border-stone-300 bg-white text-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900 transition-colors"
                  placeholder="claire@exemple.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="photoTitle" className="block text-stone-700 mb-1 font-medium">Titre du cliché souhaité</label>
                <input
                  id="photoTitle"
                  name="photoTitle"
                  className="w-full p-3 rounded-lg border border-stone-300 bg-white text-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900 transition-colors"
                  placeholder="Ex: Brume matinale sur les cimes"
                />
              </div>
              <div>
                <label htmlFor="desiredSize" className="block text-stone-700 mb-1 font-medium">Format souhaité</label>
                <select
                  id="desiredSize"
                  name="desiredSize"
                  className="w-full p-3 rounded-lg border border-stone-300 bg-white text-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900 transition-colors"
                >
                  <option value="30x45 cm">30 x 45 cm (Papier d'art Baryté)</option>
                  <option value="40x60 cm">40 x 60 cm (Tirage numéroté)</option>
                  <option value="60x90 cm">60 x 90 cm (Grand format caisse américaine)</option>
                  <option value="Sur mesure">Autre format sur mesure</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-stone-700 mb-1 font-medium">Message ou précisions</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full p-3 rounded-lg border border-stone-300 bg-white text-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900 transition-colors"
                placeholder="Indiquez vos souhaits particuliers, lieu de livraison, encadrement..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider transition-[transform,background-color] duration-150 hover:scale-[1.02] active:scale-95 disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Envoi en cours...' : 'Envoyer ma demande'}</span>
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
