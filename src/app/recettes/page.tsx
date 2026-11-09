import { prisma } from '@/lib/prisma';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import { ShoppingBag, Check, Sparkles, Download, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RecipesShopPage() {
  const recipes = await prisma.recipe.findMany({
    where: { isPublished: true },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-16">
      {/* Hero Boutique */}
      <section className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-widest text-blue-600 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Boutique de Produits Numériques</span>
        </span>
        <h1 className="font-editorial text-4xl md:text-5xl font-medium text-stone-950">
          Les Recettes &amp; Presets Lightroom
        </h1>
        <p className="text-base md:text-lg text-stone-600 font-light leading-relaxed">
          Accédez à mes réglages de développement photographique calibrés au fil de mes voyages. Chaque pack inclut les fichiers presets (.xmp et .dng pour mobile) ainsi qu'un guide pas-à-pas en PDF pour sublimer vos propres clichés.
        </p>
      </section>

      {/* Liste des Recettes */}
      <div className="space-y-20">
        {recipes.map((recipe, index) => (
          <article
            key={recipe.id}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-stone-200 pb-16 last:border-b-0"
          >
            {/* Colonne Gauche : Curseur Avant / Après */}
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
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
                  Recette #{index + 1}
                </span>
                <h2 className="font-editorial text-3xl font-medium text-stone-950">
                  {recipe.title}
                </h2>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {recipe.description}
                </p>
              </div>

              {/* Inclus dans le pack */}
              <div className="bg-stone-100/70 rounded-lg p-4 space-y-2 border border-stone-200/60 text-xs text-stone-700">
                <p className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  Contenu du téléchargement instantané :
                </p>
                <ul className="space-y-1.5 pl-5 list-disc text-stone-600">
                  <li>Presets pour Lightroom Classic &amp; CC (fichiers .xmp)</li>
                  <li>Presets pour Lightroom Mobile gratuit (fichiers .dng)</li>
                  <li>Fiche technique détaillée &amp; courbe des tonalités (PDF)</li>
                </ul>
              </div>

              {/* Prix et Bouton Achat Lemon Squeezy */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-stone-400 block uppercase">Prix du pack</span>
                  <span className="font-editorial text-3xl font-semibold text-stone-950">
                    {recipe.price.toFixed(2)} €
                  </span>
                </div>

                <a
                  href={recipe.lemonSqueezyUrl || 'https://lemonsqueezy.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-sm font-medium shadow-md transition-all hover:scale-[1.02]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Obtenir la Recette</span>
                </a>
              </div>

              <p className="text-[11px] text-stone-400 italic">
                Livraison immédiate par e-mail • Compatible Mac, PC, iOS &amp; Android.
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
