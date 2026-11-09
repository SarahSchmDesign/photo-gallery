import { prisma } from '@/lib/prisma';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { ShoppingBag, Sparkles, Download, FileText, CheckCircle2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RecipesShopPage() {
  const recipes = await prisma.recipe.findMany({
    where: { isPublished: true },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-16">
      {/* Hero Éditorial Boutique */}
      <section className="max-w-3xl space-y-5 pt-2 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-medium tracking-wide border border-stone-200/60">
          <Sparkles className="w-3.5 h-3.5 text-stone-500" />
          <span>Boutique Numérique &amp; Outils de Développement</span>
        </div>
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-stone-950 leading-[1.12]">
          Les Recettes &amp; Presets Lightroom.
        </h1>
        <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-2xl">
          Accédez aux réglages chromatiques et courbes de tonalité calibrés au fil de mes voyages. Chaque pack comprend les fichiers prêts à l'emploi (.xmp et .dng pour mobile) accompagnés d'un guide pas-à-pas en PDF.
        </p>
      </section>

      {/* Liste des Recettes */}
      <div className="space-y-24">
        {recipes.map((recipe, index) => (
          <article
            key={recipe.id}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border-b border-stone-200/80 pb-20 last:border-b-0 animate-fade-up stagger-${(index % 6) + 1}`}
          >
            {/* Colonne Gauche : Curseur Avant / Après interactif */}
            <div className="lg:col-span-7">
              <BeforeAfterSlider
                beforeUrl={recipe.beforeUrl}
                afterUrl={recipe.afterUrl}
                title={recipe.title}
                software={recipe.software}
              />
            </div>

            {/* Colonne Droite : Fiche Produit & Achat */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-widest text-stone-400 font-mono font-medium">
                  Recette #{String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-stone-950 tracking-tight">
                  {recipe.title}
                </h2>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {recipe.description}
                </p>
              </div>

              {/* Inclus dans le pack (Unslop: chrome calme et soigné) */}
              <div className="bg-stone-50 rounded-xl p-5 space-y-3 border border-stone-200/70 text-xs text-stone-700">
                <p className="font-semibold text-stone-900 flex items-center gap-2">
                  <Download className="w-4 h-4 text-stone-700" />
                  Contenu du téléchargement instantané :
                </p>
                <ul className="space-y-2 text-stone-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-stone-500 mt-0.5 shrink-0" />
                    <span>Presets pour Lightroom Classic &amp; CC (fichiers <code className="font-mono text-stone-800 bg-stone-200/60 px-1 py-0.5 rounded">.xmp</code>)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-stone-500 mt-0.5 shrink-0" />
                    <span>Presets pour Lightroom Mobile gratuit (fichiers <code className="font-mono text-stone-800 bg-stone-200/60 px-1 py-0.5 rounded">.dng</code>)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-stone-500 mt-0.5 shrink-0" />
                    <span>Fiche technique détaillée &amp; décomposition des courbes (PDF)</span>
                  </li>
                </ul>
              </div>

              {/* Prix et Bouton d'Achat Sécurisé */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-medium">
                    Tarif unique
                  </span>
                  <span className="font-editorial text-3xl sm:text-4xl font-semibold text-stone-950">
                    {recipe.price.toFixed(2)} €
                  </span>
                </div>

                <a
                  href={recipe.lemonSqueezyUrl || 'https://lemonsqueezy.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-sm font-medium shadow-sm transition-[transform,background-color] duration-150 hover:scale-[1.02] active:scale-95 focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 outline-none"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Obtenir la Recette</span>
                </a>
              </div>

              <p className="text-[11px] text-stone-400 italic">
                Paiement sécurisé via Lemon Squeezy • Téléchargement immédiat • Mises à jour incluses.
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
