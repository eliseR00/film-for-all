import { useState } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('film-favorites');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const addFavorite = (filmId: string) => {
    setFavorites(prev => {
      const newFavorites = [...prev, filmId];
      localStorage.setItem('film-favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const removeFavorite = (filmId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(id => id !== filmId);
      localStorage.setItem('film-favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const toggleFavorite = (filmId: string) => {
    if (favorites.includes(filmId)) {
      removeFavorite(filmId);
    } else {
      addFavorite(filmId);
    }
  };

  const isFavorited = (filmId: string) => favorites.includes(filmId);

  return { favorites, toggleFavorite, isFavorited };
}