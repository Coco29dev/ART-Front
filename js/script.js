document.addEventListener('DOMContentLoaded', function () {
  // Éléments du DOM
  const randomArtButton = document.getElementById('randomArtButton');
  const artworkDisplay = document.getElementById('artwork-display');
  const artworkImage = document.getElementById('artwork-image');
  const artworkTitle = document.getElementById('artwork-title');
  const artworkContent = document.getElementById('artwork-content');

  // URL de l'API
  const API_URL = 'http://localhost:3000/api/v1/tableau';

  // Variable pour stocker le dernier UUID affiché
  let lastDisplayedUuid = '';

  // Fonction pour afficher un tableau aléatoire
  async function fetchRandomArtwork() {
    // Afficher l'animation de chargement
    showLoading();

    try {
      // Appel à l'API
      const response = await fetch(`${API_URL}/random`);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const artwork = await response.json();

      // Vérifier si c'est le même tableau que précédemment
      if (artwork.uuid === lastDisplayedUuid) {
        console.log("Même tableau obtenu, nouvelle tentative...");
        return fetchRandomArtwork(); // Réessayer
      }

      // Mise à jour de l'UUID du dernier tableau affiché
      lastDisplayedUuid = artwork.uuid;

      // Mise à jour de l'interface avec les données du tableau
      artworkImage.src = artwork.url;
      artworkImage.alt = artwork.title;
      artworkTitle.textContent = artwork.title;
      artworkContent.innerHTML = artwork.content;

      // Afficher la section
      artworkDisplay.classList.remove('hidden');

      // NE PAS faire défiler automatiquement
      // La ligne qui causait le problème a été supprimée:
      // artworkDisplay.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
      console.error('Erreur:', error);
      alert('Impossible de récupérer un tableau. Veuillez réessayer.');
    } finally {
      // Cacher l'animation de chargement
      hideLoading();
    }
  }

  // Afficher l'animation de chargement
  function showLoading() {
    // Supprimer l'ancienne animation si elle existe
    hideLoading();

    // Créer l'élément de chargement
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading';
    loadingElement.id = 'loading';

    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';

    const text = document.createElement('p');
    text.textContent = 'Chargement en cours...';

    loadingElement.appendChild(spinner);
    loadingElement.appendChild(text);

    // Insérer avant la section d'affichage
    artworkDisplay.parentNode.insertBefore(loadingElement, artworkDisplay);
  }

  // Cacher l'animation de chargement
  function hideLoading() {
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.remove();
    }
  }

  // Gestionnaire d'événements pour le bouton
  randomArtButton.addEventListener('click', fetchRandomArtwork);

  // Gérer les erreurs d'image
  artworkImage.addEventListener('error', function () {
    this.src = 'https://via.placeholder.com/800x600?text=Image+non+disponible';
  });
});