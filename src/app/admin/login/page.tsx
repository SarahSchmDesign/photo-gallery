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
      <div className="w-full max-w-md bg-[#FAF8F5] border border-[rgba(20,19,18,0.12)] p-8 sm:p-12 shadow-sm space-y-8">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto text-[#141312] border border-[rgba(20,19,18,0.1)]">
            <Lock className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#736E69] block">
            Accès Réservé
          </span>
          <h1 className="font-instrument text-4xl font-normal text-[#141312]">
            Studio Photographe
          </h1>
          <p className="text-xs text-[#736E69] font-sans">
            Administration du portfolio et des demandes d'acquisition.
          </p>
        </div>

        {error && (
          <div className="bg-[#F4F1EB] border border-red-300 text-red-800 text-xs font-mono p-3 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 text-xs font-mono">
          <div>
            <label htmlFor="admin-password" className="block text-[#4A4643] uppercase tracking-wider text-[10px] mb-2">
              Mot de passe administrateur
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-3.5 border border-[rgba(20,19,18,0.2)] bg-white text-sm text-[#141312] outline-none focus:border-[#141312] transition-colors font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 bg-[#141312] hover:bg-black text-[#FAF8F5] font-mono uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <span>{loading ? 'Vérification...' : 'Ouvrir le Studio'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[rgba(20,19,18,0.08)] flex items-center justify-center gap-2 text-[11px] font-mono text-[#A6A099]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#141312]" />
          <span>Session chiffrée HMAC SHA-256</span>
        </div>
      </div>
    </div>
  );
}
