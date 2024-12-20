// Add to the top of your script
const favoritesKey = 'favoriteComics';

// Toggle favorite status
function toggleFavorite(title) {
  let favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];

  if (favorites.includes(title)) {
    favorites = favorites.filter(fav => fav !== title);
  } else {
    favorites.push(title);
  }

  localStorage.setItem(favoritesKey, JSON.stringify(favorites));
  displayResults(); // Refresh the displayed results
}

// Check if a comic is a favorite
function isFavorite(title) {
  const favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];
  return favorites.includes(title);
}
