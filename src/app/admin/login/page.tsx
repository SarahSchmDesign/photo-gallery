'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Mot de passe invalide');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-md bg-white border border-stone-200/80 rounded-2xl p-8 sm:p-10 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-900 border border-stone-200">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-editorial text-2xl font-semibold text-stone-950">
            Espace d'Administration
          </h1>
          <p className="text-xs text-stone-500">
            Accès sécurisé réservé à la photographe (Sarah).
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg text-center animate-scale-in">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label htmlFor="admin-password" className="block text-stone-700 font-medium mb-1.5">
              Mot de passe administrateur
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-3 rounded-lg border border-stone-300 bg-stone-50 text-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-medium flex items-center justify-center gap-2 transition-[transform,background-color] duration-150 hover:scale-[1.01] active:scale-95 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:opacity-50"
          >
            <span>{loading ? 'Vérification...' : 'Accéder au Back-office'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
          <span>Session chiffrée &amp; protection anti-bruteforce</span>
        </div>
      </div>
    </div>
  );
}
