import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Lumina | Photographie d’Art & Recettes Lightroom',
  description: 'Portfolio photographique d\'art et carnet de recettes chromatiques Lightroom par Sarah.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-theme="light">
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-stone-200 antialiased overflow-x-clip">
        {/* Lien d'évitement accessibilité (WCAG) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-stone-950 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
        >
          Aller au contenu principal
        </a>

        {/* Navigation Éditoriale Minimaliste */}
        <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-200/70 transition-[background-color,border-color]">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo épuré */}
            <Link
              href="/"
              className="group flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-4 rounded-sm"
            >
              <span className="font-editorial text-2xl font-semibold tracking-tight text-stone-950 group-hover:opacity-80 transition-opacity">
                Lumina<span className="text-stone-400">.</span>
              </span>
            </Link>

            {/* Liens de navigation */}
            <nav className="flex items-center gap-6 sm:gap-8 text-sm font-medium tracking-wide">
              <Link
                href="/"
                className="text-stone-700 hover:text-stone-950 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded-sm py-1 px-1"
              >
                Portfolio
              </Link>
              <Link
                href="/recettes"
                className="text-stone-700 hover:text-stone-950 transition-colors flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded-sm py-1 px-1"
              >
                <span>Recettes &amp; Presets</span>
                <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-stone-200/70 text-stone-700 border border-stone-300/50">
                  Shop
                </span>
              </Link>
              <Link
                href="/a-propos"
                className="text-stone-700 hover:text-stone-950 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded-sm py-1 px-1"
              >
                À Propos &amp; Tirages
              </Link>
              <Link
                href="/admin"
                className="text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors pl-4 border-l border-stone-200/80 outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded-sm py-1"
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>

        {/* Contenu principal */}
        <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 md:py-16">
          {children}
        </main>

        {/* Footer Minimaliste */}
        <footer className="border-t border-stone-200/80 bg-white py-14 px-6 mt-20 text-xs text-stone-500">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <p className="font-semibold text-stone-900">Lumina Photography © 2026</p>
              <p className="text-stone-500">Toutes les photographies et recettes sont des créations originales de Sarah.</p>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/recettes" className="hover:text-stone-900 transition-colors">
                Boutique de Presets
              </Link>
              <Link href="/a-propos" className="hover:text-stone-900 transition-colors">
                Contact &amp; Tirages signés
              </Link>
              <Link href="/admin" className="hover:text-stone-900 transition-colors text-stone-400">
                Espace Privé
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
