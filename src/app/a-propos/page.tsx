'use client';

import React, { useState } from 'react';
import { Camera, Send, Award, CheckCircle } from 'lucide-react';

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
    } catch (err) {
      alert('Une erreur est survenue lors de l\'envoi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16">
      {/* Bio / Démarche artistique */}
      <section className="space-y-6">
        <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
          À Propos
        </span>
        <h1 className="font-editorial text-4xl md:text-5xl font-medium text-stone-950">
          Sarah — Capturer l'émotion de l'instant.
        </h1>
        <div className="prose text-stone-600 space-y-4 font-light text-base md:text-lg leading-relaxed">
          <p>
            Photographe passionnée par la lumière naturelle et la pureté des lignes géométriques, je conçois la photographie comme un dialogue silencieux entre l'observateur et le monde.
          </p>
          <p>
            Mes séries oscillent entre la solitude contemplative des paysages nordiques et le rythme vibrant des cités contemporaines. Chaque prise de vue est pensée dans un souci d'harmonie tonale, que je prolonge lors du développement numérique à travers des recettes de retouche méticuleusement calibrées.
          </p>
        </div>
      </section>

      {/* Matériel & Boîtiers */}
      <section className="bg-stone-100/60 rounded-xl p-8 border border-stone-200/60 space-y-4">
        <h2 className="font-editorial text-2xl font-medium text-stone-900 flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          <span>Dans mon sac photo</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-600">
          <div className="space-y-1">
            <p className="font-semibold text-stone-800">Boîtiers principaux :</p>
            <p>Sony A7R V (Plein format 61 MP) &amp; Fujifilm X-T5 (Capteur X-Trans)</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-stone-800">Optiques de prédilection :</p>
            <p>Sony FE 35mm f/1.4 GM, 50mm f/1.2 GM &amp; Fujinon 16mm f/1.4 R</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-stone-800">Développement &amp; Écran :</p>
            <p>Adobe Lightroom Classic calibré sur écran EIZO ColorEdge (DCI-P3)</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-stone-800">Laboratoire de tirage :</p>
            <p>Papiers d'art Hahnemühle Photo Rag Baryta 315g, encres pigmentaires UltraChrome</p>
          </div>
        </div>
      </section>

      {/* Formulaire de Tirages d'Art */}
      <section className="border-t border-stone-200 pt-12 space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>Tirages d'Art Signés</span>
          </span>
          <h2 className="font-editorial text-3xl font-medium text-stone-950 pt-1">
            Commander une épreuve numérotée
          </h2>
          <p className="text-stone-600 text-sm pt-1">
            Toutes les photographies du portfolio sont disponibles en tirages d'art limités, signés et accompagnés de leur certificat d'authenticité.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center space-y-2">
            <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="font-editorial text-xl font-semibold text-emerald-950">
              Merci pour votre demande !
            </h3>
            <p className="text-xs text-emerald-700">
              Sarah vous répondra personnellement sous 24h avec un devis et les options d'encadrement.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Votre Nom *</label>
                <input required name="clientName" className="w-full p-3 rounded-lg border border-stone-300 bg-white text-sm" placeholder="Ex: Claire Martin" />
              </div>
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Votre E-mail *</label>
                <input required type="email" name="clientEmail" className="w-full p-3 rounded-lg border border-stone-300 bg-white text-sm" placeholder="claire@exemple.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Titre du cliché souhaité</label>
                <input name="photoTitle" className="w-full p-3 rounded-lg border border-stone-300 bg-white text-sm" placeholder="Ex: Brume matinale sur les cimes" />
              </div>
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Format souhaité</label>
                <select name="desiredSize" className="w-full p-3 rounded-lg border border-stone-300 bg-white text-sm">
                  <option value="30x45 cm">30 x 45 cm (Papier d'art Baryté)</option>
                  <option value="40x60 cm">40 x 60 cm (Tirage numéroté)</option>
                  <option value="60x90 cm">60 x 90 cm (Grand format caisse américaine)</option>
                  <option value="Sur mesure">Autre format sur mesure</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-stone-600 mb-1 font-medium">Message ou précisions</label>
              <textarea name="message" rows={4} className="w-full p-3 rounded-lg border border-stone-300 bg-white text-sm" placeholder="Indiquez vos souhaits particuliers, lieu de livraison..." />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider transition-all"
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
