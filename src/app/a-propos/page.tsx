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
    } catch {
      alert('Une erreur est survenue lors de l\'envoi de votre demande.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-24 md:space-y-32 animate-fade-in">
      {/* Bio / Démarche artistique en Instrument Serif */}
      <section className="space-y-8 border-b border-[rgba(20,19,18,0.1)] pb-16">
        <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#736E69]">
          À Propos • Sarah Schm.
        </div>

        <h1 className="font-instrument text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal leading-[0.92] tracking-tight text-[#141312]">
          Capturer l’émotion pure <br />
          <span className="font-editorial-italic font-normal text-[#4A4643]">
            de l'instant suspendu.
          </span>
        </h1>

        <div className="prose text-[#4A4643] space-y-6 font-light text-base sm:text-lg md:text-xl leading-relaxed pt-4 max-w-3xl">
          <p>
            Photographe fascinée par la pureté des lignes géométriques et le murmure des paysages froids, je conçois la photographie comme un dialogue silencieux entre l'observateur et le monde.
          </p>
          <p>
            Mes séries photographiques oscillent entre la solitude contemplative des côtes nordiques et la cadence nocturne des mégalopoles asiatiques. Chaque prise de vue obéit à une exigence d'harmonie tonale absolue, prolongée lors du développement numérique à travers des profils sur mesure.
          </p>
        </div>
      </section>

      {/* Matériel & Laboratoire */}
      <section className="space-y-8">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#736E69] block mb-1">
            Équipement &amp; Process
          </span>
          <h2 className="font-instrument text-3xl sm:text-4xl text-[#141312]">
            Dans le Sac Photographique
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-mono">
          <div className="space-y-2 p-6 bg-[#F4F1EB]/50 border border-[rgba(20,19,18,0.08)]">
            <span className="text-[10px] uppercase tracking-widest text-[#736E69] block">01 / Boîtiers</span>
            <p className="font-instrument text-2xl text-[#141312]">Sony A7R V &amp; Fujifilm X-T5</p>
            <p className="text-[#736E69] font-sans text-xs pt-1">Capteur plein format 61 MP sans filtre passe-bas et matrice X-Trans V.</p>
          </div>

          <div className="space-y-2 p-6 bg-[#F4F1EB]/50 border border-[rgba(20,19,18,0.08)]">
            <span className="text-[10px] uppercase tracking-widest text-[#736E69] block">02 / Optiques Fixes</span>
            <p className="font-instrument text-2xl text-[#141312]">35mm f/1.4 GM &amp; 50mm f/1.2 GM</p>
            <p className="text-[#736E69] font-sans text-xs pt-1">Verres apochromatiques et bokeh velouté à grande ouverture.</p>
          </div>

          <div className="space-y-2 p-6 bg-[#F4F1EB]/50 border border-[rgba(20,19,18,0.08)]">
            <span className="text-[10px] uppercase tracking-widest text-[#736E69] block">03 / Étalonnage</span>
            <p className="font-instrument text-2xl text-[#141312]">EIZO ColorEdge DCI-P3</p>
            <p className="text-[#736E69] font-sans text-xs pt-1">Calibration matérielle mensuelle par sonde spectrophotométrique.</p>
          </div>

          <div className="space-y-2 p-6 bg-[#F4F1EB]/50 border border-[rgba(20,19,18,0.08)]">
            <span className="text-[10px] uppercase tracking-widest text-[#736E69] block">04 / Tirages d'Art</span>
            <p className="font-instrument text-2xl text-[#141312]">Hahnemühle Baryta 315g</p>
            <p className="text-[#736E69] font-sans text-xs pt-1">Encres pigmentaires UltraChrome K3 avec longévité garantie plus de 100 ans.</p>
          </div>
        </div>
      </section>

      {/* Formulaire de Tirage Signé */}
      <section className="border-t border-[rgba(20,19,18,0.1)] pt-16 space-y-8">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#736E69] block mb-1">
            Commande Spéciale
          </span>
          <h2 className="font-instrument text-4xl sm:text-5xl text-[#141312]">
            Acquérir une Épreuve Numérotée
          </h2>
          <p className="text-[#736E69] text-sm pt-2 max-w-xl leading-relaxed">
            Chaque tirage est inspecté sous lumière normalisée 5000K, signé de la main de Sarah et délivré avec son certificat d'authenticité infalsifiable.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[#F4F1EB] border border-[rgba(20,19,18,0.1)] p-12 text-center space-y-3 animate-scale-in">
            <CheckCircle className="w-10 h-10 text-[#141312] mx-auto" />
            <h3 className="font-instrument text-3xl text-[#141312]">
              Demande Réceptionnée
            </h3>
            <p className="text-xs font-mono text-[#736E69] max-w-md mx-auto">
              Sarah vous contactera personnellement sous 24h avec la proposition d'épreuve et les délais d'acheminement sécurisé.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="clientName" className="block text-[#4A4643] mb-1 uppercase tracking-wider text-[10px]">Nom complet *</label>
                <input
                  id="clientName"
                  required
                  name="clientName"
                  className="w-full p-3.5 border border-[rgba(20,19,18,0.2)] bg-white text-sm text-[#141312] outline-none focus:border-[#141312] transition-colors font-sans"
                  placeholder="Ex: Claire Martin"
                />
              </div>
              <div>
                <label htmlFor="clientEmail" className="block text-[#4A4643] mb-1 uppercase tracking-wider text-[10px]">E-mail de contact *</label>
                <input
                  id="clientEmail"
                  required
                  type="email"
                  name="clientEmail"
                  className="w-full p-3.5 border border-[rgba(20,19,18,0.2)] bg-white text-sm text-[#141312] outline-none focus:border-[#141312] transition-colors font-sans"
                  placeholder="claire@exemple.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="photoTitle" className="block text-[#4A4643] mb-1 uppercase tracking-wider text-[10px]">Titre du cliché</label>
                <input
                  id="photoTitle"
                  name="photoTitle"
                  className="w-full p-3.5 border border-[rgba(20,19,18,0.2)] bg-white text-sm text-[#141312] outline-none focus:border-[#141312] transition-colors font-sans"
                  placeholder="Ex: Brume matinale sur les cimes"
                />
              </div>
              <div>
                <label htmlFor="desiredSize" className="block text-[#4A4643] mb-1 uppercase tracking-wider text-[10px]">Format souhaité</label>
                <select
                  id="desiredSize"
                  name="desiredSize"
                  className="w-full p-3.5 border border-[rgba(20,19,18,0.2)] bg-white text-sm text-[#141312] outline-none focus:border-[#141312] transition-colors font-sans"
                >
                  <option value="30x45 cm">30 x 45 cm — Tirage Fine Art Papier Baryté</option>
                  <option value="40x60 cm">40 x 60 cm — Épreuve numérotée sur Dibond</option>
                  <option value="60x90 cm">60 x 90 cm — Grand format caisse américaine</option>
                  <option value="Sur mesure">Format ou cadre sur mesure</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-[#4A4643] mb-1 uppercase tracking-wider text-[10px]">Message ou souhaits d'encadrement</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-full p-3.5 border border-[rgba(20,19,18,0.2)] bg-white text-sm text-[#141312] outline-none focus:border-[#141312] transition-colors font-sans"
                placeholder="Indiquez un lieu de livraison ou des spécifications particulières..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#141312] hover:bg-black text-[#FAF8F5] text-xs font-mono uppercase tracking-[0.2em] transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Envoi...' : 'Transmettre la demande'}</span>
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
