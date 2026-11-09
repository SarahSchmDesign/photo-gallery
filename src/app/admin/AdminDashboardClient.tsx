'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, Image as ImageIcon, Sparkles, Inbox, 
  Trash2, Star, LogOut, Check, Sliders, Camera, Eye
} from 'lucide-react';
import exifr from 'exifr';

interface AdminDashboardClientProps {
  initialPhotos: any[];
  seriesList: any[];
  recipesList: any[];
  inquiriesList: any[];
}

export default function AdminDashboardClient({
  initialPhotos,
  seriesList,
  recipesList,
  inquiriesList,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'photos' | 'upload' | 'recipes' | 'inquiries'>('photos');
  const [photos, setPhotos] = useState(initialPhotos);
  const [recipes, setRecipes] = useState(recipesList);

  // États pour l'Upload de Photo avec EXIF
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoDesc, setPhotoDesc] = useState('');
  const [photoLocation, setPhotoLocation] = useState('');
  const [selectedSeriesId, setSelectedSeriesId] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Données EXIF extraites
  const [camera, setCamera] = useState('');
  const [lens, setLens] = useState('');
  const [aperture, setAperture] = useState('');
  const [shutter, setShutter] = useState('');
  const [iso, setIso] = useState<number | ''>('');
  const [exifLoading, setExifLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // États pour la création de Recette (Avant/Après)
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeDesc, setRecipeDesc] = useState('');
  const [recipePrice, setRecipePrice] = useState('19.00');
  const [recipeLemonUrl, setRecipeLemonUrl] = useState('');
  const [recipeBeforeUrl, setRecipeBeforeUrl] = useState('');
  const [recipeAfterUrl, setRecipeAfterUrl] = useState('');
  const [creatingRecipe, setCreatingRecipe] = useState(false);

  // Gestion du Drop et extraction EXIF
  const handleFileSelect = async (file: File) => {
    setUploadFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    if (!photoTitle) {
      setPhotoTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    setExifLoading(true);
    try {
      const parsed = await exifr.parse(file, [
        'Make', 'Model', 'LensModel', 'FNumber', 'ExposureTime', 'ISO', 'DateTimeOriginal'
      ]);

      if (parsed) {
        if (parsed.Model) {
          const make = parsed.Make ? `${parsed.Make} ` : '';
          setCamera(`${make}${parsed.Model}`.replace(/ILCE-7RM5/i, 'A7R V').replace(/ILCE-7M4/i, 'A7 IV'));
        }
        if (parsed.LensModel) setLens(parsed.LensModel);
        if (parsed.FNumber) setAperture(`f/${parsed.FNumber}`);
        if (parsed.ExposureTime) {
          setShutter(parsed.ExposureTime < 1 ? `1/${Math.round(1 / parsed.ExposureTime)}s` : `${parsed.ExposureTime}s`);
        }
        if (parsed.ISO) setIso(parsed.ISO);
      }
    } catch (err) {
      console.warn('Pas de données EXIF exploitables', err);
    } finally {
      setExifLoading(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile && !previewUrl) return alert('Sélectionnez une image');

    setUploading(true);
    try {
      let finalImageUrl = previewUrl;

      // Conversion en base64 pour persistance locale immédiate si pas de Cloudinary configuré
      if (uploadFile) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(uploadFile);
        });
        finalImageUrl = base64;
      }

      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: photoTitle,
          description: photoDesc,
          imageUrl: finalImageUrl,
          camera,
          lens,
          aperture,
          shutter,
          iso,
          location: photoLocation,
          seriesId: selectedSeriesId || null,
          isFeatured,
        }),
      });

      if (!res.ok) throw new Error('Erreur lors du téléversement');

      const newPhoto = await res.json();
      setPhotos([newPhoto, ...photos]);
      setActiveTab('photos');
      setUploadFile(null);
      setPreviewUrl('');
      setPhotoTitle('');
      alert('Cliché ajouté avec succès au catalogue !');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Supprimer définitivement ce cliché ?')) return;
    await fetch(`/api/photos/${id}`, { method: 'DELETE' });
    setPhotos(photos.filter(p => p.id !== id));
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    const res = await fetch(`/api/photos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFeatured: !current }),
    });
    if (res.ok) {
      setPhotos(photos.map(p => p.id === id ? { ...p, isFeatured: !current } : p));
    }
  };

  const handleCreateRecipeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingRecipe(true);
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: recipeTitle,
          description: recipeDesc,
          price: Number(recipePrice),
          lemonSqueezyUrl: recipeLemonUrl,
          beforeUrl: recipeBeforeUrl,
          afterUrl: recipeAfterUrl,
        }),
      });

      if (!res.ok) throw new Error('Erreur lors de la création');
      const newRecipe = await res.json();
      setRecipes([newRecipe, ...recipes]);
      setActiveTab('recipes');
      setRecipeTitle('');
      setRecipeDesc('');
      setRecipeBeforeUrl('');
      setRecipeAfterUrl('');
      alert('Recette créée avec succès !');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreatingRecipe(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Barre supérieure Admin */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-200">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-stone-500 font-semibold">
            Tableau de Bord
          </span>
          <h1 className="font-editorial text-3xl font-medium text-stone-950">
            Espace Photographe
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Déconnexion</span>
        </button>
      </div>

      {/* Onglets */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('photos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-[background-color,color] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${
            activeTab === 'photos'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Clichés ({photos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-[background-color,color] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${
            activeTab === 'upload'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Téléverser + EXIF</span>
        </button>

        <button
          onClick={() => setActiveTab('recipes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-[background-color,color] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${
            activeTab === 'recipes'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Recettes &amp; Presets ({recipes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-[background-color,color] duration-150 outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${
            activeTab === 'inquiries'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Demandes de Tirages ({inquiriesList.length})</span>
        </button>
      </div>

      {/* CONTENU ONGLET 1 : LISTE DES CLICHÉS */}
      {activeTab === 'photos' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-editorial text-xl font-medium text-stone-950">Catalogue de photographies</h2>
            <button
              onClick={() => setActiveTab('upload')}
              className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white text-xs font-medium flex items-center gap-1.5 transition-[transform,background-color] duration-150 hover:scale-[1.02] active:scale-95 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-stone-950"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Ajouter un cliché</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="relative aspect-[3/2] bg-stone-100 overflow-hidden">
                  <img src={photo.thumbUrl || photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                  {photo.isFeatured && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-stone-900 text-white font-semibold text-[10px] tracking-wider uppercase border border-white/20">
                      Coup de cœur
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-editorial text-base font-semibold text-stone-950">{photo.title}</h3>
                    <p className="text-xs text-stone-500 pt-0.5">{photo.location || 'Sans lieu'}</p>
                    {photo.camera && (
                      <p className="text-[11px] font-mono text-stone-400 pt-1">
                        📷 {photo.camera} {photo.aperture ? `• ${photo.aperture}` : ''}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <button
                      onClick={() => handleToggleFeatured(photo.id, photo.isFeatured)}
                      className={`flex items-center gap-1 outline-none focus-visible:ring-1 focus-visible:ring-stone-900 rounded ${
                        photo.isFeatured ? 'text-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${photo.isFeatured ? 'fill-stone-900 text-stone-900' : ''}`} />
                      <span>{photo.isFeatured ? 'Mis en avant' : 'Mettre en avant'}</span>
                    </button>

                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="text-stone-400 hover:text-red-600 p-1 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-red-600 rounded"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENU ONGLET 2 : UPLOAD + EXIF AUTO */}
      {activeTab === 'upload' && (
        <div className="max-w-2xl bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="font-editorial text-2xl font-medium text-stone-950">Téléverser un nouveau cliché</h2>
            <p className="text-xs text-stone-500 pt-1">
              Les réglages de prise de vue (boîtier, optique, f/, vitesse, ISO) sont extraits automatiquement dès que vous déposez votre photo.
            </p>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-5 text-xs">
            {/* Dropzone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileSelect(e.dataTransfer.files[0]);
                }
              }}
              className="border-2 border-dashed border-stone-300 hover:border-stone-900 rounded-xl p-8 text-center bg-stone-50/50 cursor-pointer transition-colors outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
              onClick={() => document.getElementById('photoInputFile')?.click()}
            >
              <input
                id="photoInputFile"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />
              {previewUrl ? (
                <div className="space-y-2">
                  <img src={previewUrl} alt="Aperçu" className="max-h-48 mx-auto rounded shadow-sm object-contain" />
                  <p className="text-stone-900 font-medium">Cliquer ou déposer pour changer de fichier</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-stone-400 mx-auto" />
                  <p className="font-medium text-stone-700">Glissez-déposez votre photo ici</p>
                  <p className="text-stone-400">ou cliquez pour parcourir vos dossiers</p>
                </div>
              )}
            </div>

            {exifLoading && (
              <p className="text-stone-600 text-xs italic text-center animate-pulse">
                Extraction des métadonnées EXIF en cours...
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Titre de l'œuvre *</label>
                <input
                  required
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                  placeholder="Ex: Coucher de soleil sur les cimes"
                />
              </div>
              <div>
                <label className="block text-stone-700 font-medium mb-1">Lieu</label>
                <input
                  value={photoLocation}
                  onChange={(e) => setPhotoLocation(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                  placeholder="Ex: Lofoten, Norvège"
                />
              </div>
            </div>

            {/* Série associée */}
            <div>
              <label className="block text-stone-700 font-medium mb-1">Rattacher à une Série</label>
              <select
                value={selectedSeriesId}
                onChange={(e) => setSelectedSeriesId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
              >
                <option value="">Aucune série particulière</option>
                {seriesList.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>

            {/* Bloc EXIF (auto-rempli mais modifiable) */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-3">
              <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-stone-700" />
                <span>Données EXIF Détectées (modifiables)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-500 block mb-0.5">Boîtier</label>
                  <input
                    value={camera}
                    onChange={(e) => setCamera(e.target.value)}
                    className="w-full p-2 rounded-lg border border-stone-300 text-xs text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                    placeholder="Ex: Sony A7R V"
                  />
                </div>
                <div>
                  <label className="text-stone-500 block mb-0.5">Objectif</label>
                  <input
                    value={lens}
                    onChange={(e) => setLens(e.target.value)}
                    className="w-full p-2 rounded-lg border border-stone-300 text-xs text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                    placeholder="Ex: FE 35mm f/1.4 GM"
                  />
                </div>
                <div>
                  <label className="text-stone-500 block mb-0.5">Ouverture</label>
                  <input
                    value={aperture}
                    onChange={(e) => setAperture(e.target.value)}
                    className="w-full p-2 rounded-lg border border-stone-300 text-xs font-mono text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                    placeholder="Ex: f/2.8"
                  />
                </div>
                <div>
                  <label className="text-stone-500 block mb-0.5">Vitesse &amp; ISO</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={shutter}
                      onChange={(e) => setShutter(e.target.value)}
                      className="w-full p-2 rounded-lg border border-stone-300 text-xs font-mono text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                      placeholder="1/500s"
                    />
                    <input
                      type="number"
                      value={iso}
                      onChange={(e) => setIso(Number(e.target.value) || '')}
                      className="w-full p-2 rounded-lg border border-stone-300 text-xs font-mono text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                      placeholder="ISO 100"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isFeaturedCb"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-stone-900 border-stone-300 focus:ring-stone-900"
              />
              <label htmlFor="isFeaturedCb" className="text-stone-700 font-medium">
                Mettre ce cliché en coup de cœur sur la page d'accueil
              </label>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-medium text-xs transition-[transform,background-color] duration-150 hover:scale-[1.01] active:scale-95 disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-stone-950"
            >
              {uploading ? 'Enregistrement en cours...' : 'Publier le Cliché dans la Galerie'}
            </button>
          </form>
        </div>
      )}

      {/* CONTENU ONGLET 3 : GESTION DES RECETTES AVEC AVANT / APRÈS */}
      {activeTab === 'recipes' && (
        <div className="space-y-8">
          <div className="max-w-2xl bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="font-editorial text-2xl font-medium text-stone-950">Créer une nouvelle recette</h2>
              <p className="text-xs text-stone-500 pt-1">
                Déposez simplement le cliché brut (Avant) et le cliché retouché (Après). Le comparateur fluide sera immédiatement disponible sur la boutique.
              </p>
            </div>

            <form onSubmit={handleCreateRecipeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Nom de la recette *</label>
                <input
                  required
                  value={recipeTitle}
                  onChange={(e) => setRecipeTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                  placeholder="Ex: Tonalités Dorées & Brume"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Description éditoriale</label>
                <textarea
                  rows={2}
                  value={recipeDesc}
                  onChange={(e) => setRecipeDesc(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                  placeholder="Expliquez à qui s'adresse ce preset et le rendu obtenu..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Prix (€) *</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={recipePrice}
                    onChange={(e) => setRecipePrice(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Lien Lemon Squeezy</label>
                  <input
                    value={recipeLemonUrl}
                    onChange={(e) => setRecipeLemonUrl(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                    placeholder="https://votre-boutique.lemonsqueezy.com/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">URL Image AVANT (RAW brut) *</label>
                  <input
                    required
                    value={recipeBeforeUrl}
                    onChange={(e) => setRecipeBeforeUrl(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">URL Image APRÈS (Retouchée) *</label>
                  <input
                    required
                    value={recipeAfterUrl}
                    onChange={(e) => setRecipeAfterUrl(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={creatingRecipe}
                className="w-full py-3.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-medium text-xs transition-[transform,background-color] duration-150 hover:scale-[1.01] active:scale-95 disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-stone-950"
              >
                {creatingRecipe ? 'Création...' : 'Ajouter la Recette à la Boutique'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONTENU ONGLET 4 : DEMANDES DE TIRAGES D'ART */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <h2 className="font-editorial text-xl font-medium text-stone-950">Demandes de tirages d'art reçues</h2>
          {inquiriesList.length === 0 ? (
            <p className="text-xs text-stone-500 italic">Aucune demande de tirage pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {inquiriesList.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-xl border border-stone-200 text-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-stone-900 text-sm">{item.clientName}</span>
                      <span className="text-stone-400 pl-2">({item.clientEmail})</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-stone-100 text-stone-800 font-mono text-[10px] border border-stone-200">
                      Format : {item.desiredSize}
                    </span>
                  </div>
                  <p className="text-stone-700">Cliché demandé : <strong>« {item.photoTitle} »</strong></p>
                  {item.message && (
                    <p className="text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100 italic">
                      « {item.message} »
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
