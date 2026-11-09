import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'LUMINA — Photographies d’Art & Recettes Lightroom',
  description: 'Portfolio photographique d\'art, tirages limités et carnet de recettes chromatiques par Sarah.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-theme="light">
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#141312] selection:bg-[#EAE4DC] selection:text-[#141312] antialiased overflow-x-clip">
        {/* Lien d'évitement accessibilité */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#141312] focus:text-white focus:rounded-sm focus:shadow-xl focus:outline-none text-xs font-mono"
        >
          Aller au contenu principal
        </a>

        {/* En-tête Éditoriale Haute-Couture */}
        <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[rgba(20,19,18,0.08)] transition-[background-color,border-color]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
            {/* Logo en Instrument Serif monumental */}
            <Link
              href="/"
              className="group flex flex-col outline-none focus-visible:ring-1 focus-visible:ring-[#141312]"
            >
              <span className="font-instrument text-3xl md:text-4xl tracking-tight text-[#141312] leading-none group-hover:opacity-70 transition-opacity">
                Lumina
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#736E69] font-medium pt-1">
                Archives Photographiques
              </span>
            </Link>

            {/* Navigation architecturale */}
            <nav className="flex items-center gap-6 sm:gap-10 text-xs uppercase tracking-[0.18em] font-medium text-[#4A4643]">
              <Link
                href="/"
                className="hover:text-[#141312] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-[#141312] py-1"
              >
                Portfolio
              </Link>
              <Link
                href="/recettes"
                className="hover:text-[#141312] transition-colors flex items-center gap-2 outline-none focus-visible:ring-1 focus-visible:ring-[#141312] py-1"
              >
                <span>Recettes</span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full bg-[#141312] text-[#FAF8F5] tracking-normal">
                  Presets
                </span>
              </Link>
              <Link
                href="/a-propos"
                className="hover:text-[#141312] transition-colors outline-none focus-visible:ring-1 focus-visible:ring-[#141312] py-1"
              >
                Tirages d'Art
              </Link>
              <Link
                href="/admin"
                className="text-[10px] tracking-[0.2em] text-[#A6A099] hover:text-[#141312] transition-colors pl-4 border-l border-[rgba(20,19,18,0.12)] py-1"
              >
                Studio
              </Link>
            </nav>
          </div>
        </header>

        {/* Contenu principal */}
        <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-12 md:py-20">
          {children}
        </main>

        {/* Colophon & Footer Éditorial */}
        <footer className="border-t border-[rgba(20,19,18,0.08)] bg-[#FAF8F5] py-16 px-6 lg:px-12 mt-24">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
            <div className="space-y-3">
              <span className="font-instrument text-4xl text-[#141312] block">
                Lumina.
              </span>
              <p className="text-xs text-[#736E69] max-w-md leading-relaxed">
                Collection photographique indépendante par Sarah. Œuvres imprimées sur papiers d'art barytés et formules de développement pour Adobe Lightroom.
              </p>
              <p className="text-[11px] font-mono text-[#A6A099] pt-2">
                © 2026 Lumina • Tous droits réservés.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 text-xs uppercase tracking-[0.16em] text-[#736E69]">
              <Link href="/recettes" className="hover:text-[#141312] transition-colors">
                Recettes Lightroom
              </Link>
              <Link href="/a-propos" className="hover:text-[#141312] transition-colors">
                Épreuves Signées
              </Link>
              <Link href="/admin" className="hover:text-[#141312] transition-colors text-[#A6A099]">
                Accès Photographe
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
