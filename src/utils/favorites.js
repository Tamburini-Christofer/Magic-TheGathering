const STORAGE_KEY = 'favorites_cards_v1';

export function getFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.log("Errore lettura preferiti:", e);
    return [];
  }
}

export function saveFavorites(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.log("Errore salvataggio preferiti:", e);
  }
}

export function isFavorite(id) {
  if (!id) return false;
  const list = getFavorites();
  return list.some((c) => c.id === id);
}

export function addFavorite(card) {
  if (!card || !card.id) return;
  const list = getFavorites();
  if (!list.some((c) => c.id === card.id)) {
    list.push(card);
    saveFavorites(list);
  }
}

export function removeFavorite(id) {
  if (!id) return;
  const list = getFavorites().filter((c) => c.id !== id);
  saveFavorites(list);
}

export function toggleFavorite(card) {
  if (!card || !card.id) return false;
  if (isFavorite(card.id)) {
    removeFavorite(card.id);
    return false;
  } else {
    addFavorite(card);
    return true;
  }
}

export function clearFavorites() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.log("Errore cancellazione preferiti:", e);
  }
}

export default { getFavorites, saveFavorites, isFavorite, addFavorite, removeFavorite, toggleFavorite, clearFavorites };
