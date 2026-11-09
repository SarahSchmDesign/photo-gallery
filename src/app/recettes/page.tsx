import { prisma } from '@/lib/prisma';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { ShoppingBag, Download, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RecipesShopPage() {
  const recipes = await prisma.recipe.findMany({
    where: { isPublished: true },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-24 md:space-y-36">
      {/* Hero Éditorial en Instrument Serif */}
      <section className="space-y-8 pt-4 pb-12 border-b border-[rgba(20,19,18,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono uppercase tracking-[0.2em] text-[#736E69]">
          <span>Laboratoire Numérique • Presets &amp; Étalonnage</span>
          <span>Lightroom Classic / CC / Mobile</span>
        </div>

        <div className="space-y-4 max-w-5xl">
          <h1 className="font-instrument text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal leading-[0.92] tracking-tight text-[#141312]">
            Recettes chromatiques <br />
            <span className="font-editorial-italic font-normal text-[#4A4643]">
              &amp; développement RAW.
            </span>
          </h1>
          <p className="font-sans text-base sm:text-lg md:text-xl text-[#736E69] font-light max-w-2xl leading-relaxed pt-4">
            Les réglages colorimétriques, courbes de tonalité et balances de blancs forgés au fil de mes voyages. Chaque formule est pensée pour révéler la texture argentique et la pureté des ombres.
          </p>
        </div>
      </section>

      {/* Liste des Recettes */}
      <div className="space-y-28 md:space-y-36">
        {recipes.map((recipe, index) => (
          <article
            key={recipe.id}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center border-b border-[rgba(20,19,18,0.08)] pb-24 last:border-b-0"
          >
            {/* Colonne Curseur Avant / Après interactif */}
            <div className="lg:col-span-7">
              <BeforeAfterSlider
                beforeUrl={recipe.beforeUrl}
                afterUrl={recipe.afterUrl}
                title={recipe.title}
                software={recipe.software}
              />
            </div>

            {/* Colonne Fiche Technique & Commande */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#736E69] block">
                  FORMULE N° 0{index + 1}
                </span>
                <h2 className="font-instrument text-4xl sm:text-5xl font-normal text-[#141312] leading-tight">
                  {recipe.title}
                </h2>
                <p className="text-[#4A4643] text-sm leading-relaxed pt-1">
                  {recipe.description}
                </p>
              </div>

              {/* Détails du lot */}
              <div className="bg-[#F4F1EB]/60 rounded-sm p-5 space-y-3 border border-[rgba(20,19,18,0.08)] text-xs text-[#4A4643]">
                <p className="font-mono uppercase tracking-wider text-[11px] text-[#141312] font-semibold flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-[#8C6D46]" />
                  Contenu du lot téléchargeable :
                </p>
                <ul className="space-y-2 font-mono text-[11px] text-[#736E69]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#141312] mt-0.5 shrink-0" />
                    <span>Fichiers presets <code className="text-[#141312] bg-white px-1 py-0.5 border border-[rgba(20,19,18,0.1)]">.XMP</code> pour Lightroom Desktop &amp; Photoshop</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#141312] mt-0.5 shrink-0" />
                    <span>Fichiers profils <code className="text-[#141312] bg-white px-1 py-0.5 border border-[rgba(20,19,18,0.1)]">.DNG</code> compatibles Lightroom Mobile gratuit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#141312] mt-0.5 shrink-0" />
                    <span>Guide PDF d'étalonnage pas-à-pas avec décomposition des courbes RVB</span>
                  </li>
                </ul>
              </div>

              {/* Tarif & Achat */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#736E69] block">
                    Tarif d'acquisition
                  </span>
                  <span className="font-instrument text-4xl sm:text-5xl font-normal text-[#141312]">
                    {recipe.price.toFixed(2)} €
                  </span>
                </div>

                <a
                  href={recipe.lemonSqueezyUrl || 'https://lemonsqueezy.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#141312] hover:bg-black text-[#FAF8F5] text-xs font-mono uppercase tracking-[0.18em] transition-colors shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-[#141312]"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Obtenir la Formule</span>
                </a>
              </div>

              <p className="text-[11px] font-mono text-[#A6A099]">
                Paiement chiffré SSL • Téléchargement immédiat par e-mail • Mises à jour incluses.
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
