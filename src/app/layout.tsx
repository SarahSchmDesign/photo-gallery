import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Lumina | Galerie & Recettes Photographiques',
  description: 'Portfolio photographique d\'art et boutique de recettes de retouche Lightroom par Sarah.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-theme="light">
      <body className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-stone-200">
        {/* Navigation Squarespace Minimaliste */}
        <header className="sticky top-0 z-40 bg-stone-50/85 backdrop-blur-md border-b border-stone-200/60 transition-all">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Logo épuré */}
            <Link href="/" className="group flex items-center gap-2">
              <span className="font-editorial text-2xl font-semibold tracking-tight text-stone-950 group-hover:opacity-75 transition-opacity">
                Lumina<span className="text-blue-600">.</span>
              </span>
            </Link>

            {/* Liens de navigation */}
            <nav className="flex items-center gap-8 text-sm font-medium tracking-wide">
              <Link href="/" className="hover:text-stone-500 transition-colors">
                Portfolio
              </Link>
              <Link href="/recettes" className="hover:text-stone-500 transition-colors flex items-center gap-1.5">
                <span>Recettes &amp; Presets</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/50">
                  Shop
                </span>
              </Link>
              <Link href="/a-propos" className="hover:text-stone-500 transition-colors">
                À Propos &amp; Tirages
              </Link>
              <Link
                href="/admin"
                className="text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors pl-4 border-l border-stone-200"
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 md:py-14">
          {children}
        </main>

        {/* Footer Minimaliste */}
        <footer className="border-t border-stone-200/80 bg-white py-12 px-6 mt-16 text-xs text-stone-500">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <p className="font-semibold text-stone-800">Lumina Photography © 2026</p>
              <p>Toutes les photographies et recettes sont des créations originales de Sarah.</p>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/recettes" className="hover:underline">Boutique de Presets</Link>
              <Link href="/a-propos" className="hover:underline">Contact &amp; Tirages signés</Link>
              <Link href="/admin" className="hover:underline text-stone-400">Espace Privé</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
