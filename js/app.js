/**
 * LUMINA - GALERIE PHOTO
 * Logique applicative JavaScript moderne (Vanilla JS)
 */

(function () {
  'use strict';

  // --- Clés de stockage LocalStorage ---
  const STORAGE_KEY_PHOTOS = 'lumina_gallery_photos_v1';
  const STORAGE_KEY_FAVORITES = 'lumina_gallery_favs_v1';
  const STORAGE_KEY_THEME = 'lumina_gallery_theme_v1';

  // --- État de l'application ---
  let photos = [];
  let favorites = new Set();
  let currentCategory = 'all';
  let searchQuery = '';
  let activeLightboxIndex = -1;
  let currentlyFilteredPhotos = [];

  // --- Sélecteurs DOM ---
  const galleryGrid = document.getElementById('galleryGrid');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearch');
  const categoryFilters = document.getElementById('categoryFilters');
  const galleryStatus = document.getElementById('galleryStatus');
  const resetFilterBtn = document.getElementById('resetFilterBtn');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const resetAllDataBtn = document.getElementById('resetAllDataBtn');

  // Vues
  const viewGridBtn = document.getElementById('viewGrid');
  const viewSquareBtn = document.getElementById('viewSquare');

  // Lightbox
  const lightboxModal = document.getElementById('lightboxModal');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const lbImage = document.getElementById('lbImage');
  const lbSpinner = document.getElementById('lbSpinner');
  const lbTitle = document.getElementById('lbTitle');
  const lbMeta = document.getElementById('lbMeta');
  const lbDesc = document.getElementById('lbDesc');
  const lbTags = document.getElementById('lbTags');
  const lbLikeBtn = document.getElementById('lbLikeBtn');
  const lbDownloadBtn = document.getElementById('lbDownloadBtn');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  // Modal Ajout
  const uploadModal = document.getElementById('uploadModal');
  const openUploadBtn = document.getElementById('openUploadBtn');
  const closeUploadModal = document.getElementById('closeUploadModal');
  const cancelUploadBtn = document.getElementById('cancelUploadBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const uploadForm = document.getElementById('uploadForm');
  const photoFileInput = document.getElementById('photoFile');

  // ==========================================================================
  // INITIALISATION
  // ==========================================================================
  function init() {
    loadTheme();
    loadFavorites();
    loadPhotos();
    setupEventListeners();
    renderGallery();
  }

  // --- Gestion du Thème (Dark / Light) ---
  function loadTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY_THEME, next);
  }

  // --- Gestion des Favoris ---
  function loadFavorites() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (stored) {
        favorites = new Set(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Erreur lors du chargement des favoris', e);
      favorites = new Set();
    }
  }

  function saveFavorites() {
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(Array.from(favorites)));
  }

  function toggleFavorite(id, e) {
    if (e) e.stopPropagation();
    if (favorites.has(id)) {
      favorites.delete(id);
    } else {
      favorites.add(id);
    }
    saveFavorites();
    updateFavoriteButtons();
    updateCategoryCounters();

    // Si on est dans l'onglet favoris, rafraîchir
    if (currentCategory === 'favorites') {
      renderGallery();
    }
  }

  // --- Chargement des photos ---
  function loadPhotos() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PHOTOS);
      if (stored) {
        photos = JSON.parse(stored);
      } else {
        photos = [...INITIAL_PHOTOS];
        savePhotos();
      }
    } catch (e) {
      console.warn('Erreur chargement photos', e);
      photos = [...INITIAL_PHOTOS];
    }
  }

  function savePhotos() {
    localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(photos));
  }

  // ==========================================================================
  // FILTRES & RECHERCHE
  // ==========================================================================
  function getFilteredPhotos() {
    return photos.filter(photo => {
      // Filtre catégorie
      if (currentCategory === 'favorites') {
        if (!favorites.has(photo.id)) return false;
      } else if (currentCategory !== 'all' && photo.category !== currentCategory) {
        return false;
      }

      // Filtre recherche
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = (photo.title || '').toLowerCase().includes(q);
        const matchAuthor = (photo.author || '').toLowerCase().includes(q);
        const matchLocation = (photo.location || '').toLowerCase().includes(q);
        const matchDesc = (photo.description || '').toLowerCase().includes(q);
        const matchTags = (photo.tags || []).some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchAuthor && !matchLocation && !matchDesc && !matchTags) {
          return false;
        }
      }

      return true;
    });
  }

  function updateCategoryCounters() {
    const counts = {
      all: photos.length,
      nature: 0,
      architecture: 0,
      voyage: 0,
      portrait: 0,
      street: 0,
      favorites: 0
    };

    photos.forEach(p => {
      if (counts[p.category] !== undefined) counts[p.category]++;
      if (favorites.has(p.id)) counts.favorites++;
    });

    for (const [cat, count] of Object.entries(counts)) {
      const el = document.getElementById(`count-${cat}`);
      if (el) el.textContent = count;
    }
  }

  // ==========================================================================
  // RENDU DU DOM
  // ==========================================================================
  function renderGallery() {
    updateCategoryCounters();
    currentlyFilteredPhotos = getFilteredPhotos();

    galleryGrid.innerHTML = '';

    if (currentlyFilteredPhotos.length === 0) {
      galleryGrid.style.display = 'none';
      emptyState.style.display = 'block';
      galleryStatus.textContent = 'Aucun élément correspondant';
      return;
    }

    galleryGrid.style.display = '';
    emptyState.style.display = 'none';
    galleryStatus.textContent = `${currentlyFilteredPhotos.length} photo${currentlyFilteredPhotos.length > 1 ? 's' : ''} affichée${currentlyFilteredPhotos.length > 1 ? 's' : ''}`;

    const fragment = document.createDocumentFragment();

    currentlyFilteredPhotos.forEach((photo, index) => {
      const card = createPhotoCard(photo, index);
      fragment.appendChild(card);
    });

    galleryGrid.appendChild(fragment);
  }

  function createPhotoCard(photo, index) {
    const card = document.createElement('article');
    card.className = 'photo-card';
    card.setAttribute('data-id', photo.id);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Voir ${photo.title}`);

    const isFav = favorites.has(photo.id);

    const categoryNames = {
      nature: 'Nature',
      architecture: 'Architecture',
      voyage: 'Voyage',
      portrait: 'Portrait',
      street: 'Street'
    };

    card.innerHTML = `
      <img class="photo-img" src="${photo.thumbUrl || photo.url}" alt="${escapeHtml(photo.title)}" loading="lazy">
      <div class="photo-overlay">
        <div class="overlay-top">
          <span class="photo-category-badge">${categoryNames[photo.category] || photo.category}</span>
          <button class="card-like-btn ${isFav ? 'liked' : ''}" data-action="like" aria-label="Aimer cette photo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
        <div class="overlay-bottom">
          <h3 class="photo-title-text">${escapeHtml(photo.title)}</h3>
          <p class="photo-author-text">${escapeHtml(photo.author || 'Inconnu')}${photo.location ? ` &bull; ${escapeHtml(photo.location)}` : ''}</p>
        </div>
      </div>
    `;

    // Événement clic sur la carte -> ouvrir lightbox
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="like"]')) {
        toggleFavorite(photo.id, e);
        return;
      }
      openLightbox(index);
    });

    // Accessibilité clavier (Entrée / Espace)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });

    return card;
  }

  function updateFavoriteButtons() {
    document.querySelectorAll('.card-like-btn').forEach(btn => {
      const card = btn.closest('.photo-card');
      if (card) {
        const id = card.getAttribute('data-id');
        if (favorites.has(id)) {
          btn.classList.add('liked');
        } else {
          btn.classList.remove('liked');
        }
      }
    });

    if (activeLightboxIndex >= 0 && currentlyFilteredPhotos[activeLightboxIndex]) {
      const cur = currentlyFilteredPhotos[activeLightboxIndex];
      if (favorites.has(cur.id)) {
        lbLikeBtn.classList.add('liked');
      } else {
        lbLikeBtn.classList.remove('liked');
      }
    }
  }

  // ==========================================================================
  // LIGHTBOX
  // ==========================================================================
  function openLightbox(index) {
    if (index < 0 || index >= currentlyFilteredPhotos.length) return;
    activeLightboxIndex = index;
    const photo = currentlyFilteredPhotos[index];

    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    lbSpinner.style.display = 'block';
    lbImage.style.opacity = '0';

    const tempImg = new Image();
    tempImg.onload = () => {
      lbImage.src = photo.url;
      lbImage.alt = photo.title;
      lbSpinner.style.display = 'none';
      lbImage.style.opacity = '1';
    };
    tempImg.onerror = () => {
      lbImage.src = photo.thumbUrl || photo.url;
      lbSpinner.style.display = 'none';
      lbImage.style.opacity = '1';
    };
    tempImg.src = photo.url;

    lbTitle.textContent = photo.title;
    lbMeta.textContent = `${photo.author || 'Inconnu'}${photo.location ? ' • ' + photo.location : ''}${photo.date ? ' • ' + photo.date : ''}`;
    lbDesc.textContent = photo.description || 'Aucune description disponible.';

    // Tags
    lbTags.innerHTML = '';
    (photo.tags || []).forEach(t => {
      const span = document.createElement('span');
      span.className = 'tag-badge';
      span.textContent = `#${t}`;
      lbTags.appendChild(span);
    });

    // Bouton de téléchargement
    lbDownloadBtn.href = photo.url;

    // État favori
    if (favorites.has(photo.id)) {
      lbLikeBtn.classList.add('liked');
    } else {
      lbLikeBtn.classList.remove('liked');
    }

    // Gestion boutons précédent/suivant
    lbPrev.style.display = currentlyFilteredPhotos.length > 1 ? 'flex' : 'none';
    lbNext.style.display = currentlyFilteredPhotos.length > 1 ? 'flex' : 'none';
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeLightboxIndex = -1;
  }

  function showNextPhoto() {
    if (currentlyFilteredPhotos.length <= 1) return;
    const nextIndex = (activeLightboxIndex + 1) % currentlyFilteredPhotos.length;
    openLightbox(nextIndex);
  }

  function showPrevPhoto() {
    if (currentlyFilteredPhotos.length <= 1) return;
    const prevIndex = (activeLightboxIndex - 1 + currentlyFilteredPhotos.length) % currentlyFilteredPhotos.length;
    openLightbox(prevIndex);
  }

  // ==========================================================================
  // AJOUT DE NOUVELLE PHOTO
  // ==========================================================================
  function openUpload() {
    uploadModal.classList.add('active');
    uploadModal.setAttribute('aria-hidden', 'false');
    document.getElementById('photoTitle').focus();
  }

  function closeUpload() {
    uploadModal.classList.remove('active');
    uploadModal.setAttribute('aria-hidden', 'true');
    uploadForm.reset();
  }

  function handleUploadSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('photoTitle').value.trim();
    const category = document.getElementById('photoCategory').value;
    const urlInput = document.getElementById('photoUrl').value.trim();
    const author = document.getElementById('photoAuthor').value.trim() || 'Anonyme';
    const location = document.getElementById('photoLocation').value.trim();
    const tagsInput = document.getElementById('photoTags').value;
    const description = document.getElementById('photoDescription').value.trim();

    const file = photoFileInput.files && photoFileInput.files[0];

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const dataUrl = event.target.result;
        createNewPhotoEntry({
          title,
          category,
          url: dataUrl,
          thumbUrl: dataUrl,
          author,
          location,
          date: dateFormatted,
          description,
          tags
        });
      };
      reader.readAsDataURL(file);
    } else if (urlInput) {
      createNewPhotoEntry({
        title,
        category,
        url: urlInput,
        thumbUrl: urlInput,
        author,
        location,
        date: dateFormatted,
        description,
        tags
      });
    } else {
      alert('Veuillez fournir une URL d’image ou choisir un fichier local.');
    }
  }

  function createNewPhotoEntry(photoData) {
    const newPhoto = {
      id: 'custom-' + Date.now(),
      ...photoData,
      likes: 0
    };

    photos.unshift(newPhoto);
    savePhotos();
    closeUpload();

    // Activer l'onglet de la catégorie ou "all"
    currentCategory = 'all';
    document.querySelectorAll('.filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-category') === 'all');
    });

    renderGallery();
  }

  // ==========================================================================
  // ÉVÉNEMENTS
  // ==========================================================================
  function setupEventListeners() {
    // Changement de thème
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Filtres catégories
    categoryFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderGallery();
    });

    // Recherche
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      clearSearchBtn.style.display = searchQuery ? 'block' : 'none';
      renderGallery();
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.style.display = 'none';
      searchInput.focus();
      renderGallery();
    });

    resetFilterBtn.addEventListener('click', () => {
      searchQuery = '';
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      currentCategory = 'all';
      document.querySelectorAll('.filter-pill').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-category') === 'all');
      });
      renderGallery();
    });

    // Basculer la vue de la grille
    viewGridBtn.addEventListener('click', () => {
      viewGridBtn.classList.add('active');
      viewSquareBtn.classList.remove('active');
      galleryGrid.classList.remove('square-view');
      galleryGrid.classList.add('masonry-view');
    });

    viewSquareBtn.addEventListener('click', () => {
      viewSquareBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
      galleryGrid.classList.remove('masonry-view');
      galleryGrid.classList.add('square-view');
    });

    // Lightbox navigation
    lbClose.addEventListener('click', closeLightbox);
    lightboxBackdrop.addEventListener('click', closeLightbox);
    lbNext.addEventListener('click', showNextPhoto);
    lbPrev.addEventListener('click', showPrevPhoto);

    lbLikeBtn.addEventListener('click', () => {
      if (activeLightboxIndex >= 0 && currentlyFilteredPhotos[activeLightboxIndex]) {
        toggleFavorite(currentlyFilteredPhotos[activeLightboxIndex].id);
      }
    });

    // Touches du clavier pour lightbox et navigation
    window.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNextPhoto();
      if (e.key === 'ArrowLeft') showPrevPhoto();
    });

    // Modal Ajout
    openUploadBtn.addEventListener('click', openUpload);
    closeUploadModal.addEventListener('click', closeUpload);
    cancelUploadBtn.addEventListener('click', closeUpload);
    modalBackdrop.addEventListener('click', closeUpload);
    uploadForm.addEventListener('submit', handleUploadSubmit);

    // Réinitialisation de toutes les données d'exemple
    resetAllDataBtn.addEventListener('click', () => {
      if (confirm('Voulez-vous restaurer la galerie avec les photos d’exemple d’origine ?')) {
        localStorage.removeItem(STORAGE_KEY_PHOTOS);
        localStorage.removeItem(STORAGE_KEY_FAVORITES);
        favorites = new Set();
        loadPhotos();
        renderGallery();
      }
    });
  }

  // Utilitaire d'échappement XSS
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Lancement
  document.addEventListener('DOMContentLoaded', init);
})();
