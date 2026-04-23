'use client';

import { useState, useEffect } from 'react';
import { Film } from '@/types/film';
import FilmCard from '@/components/FilmCard';
import { useFavorites } from '@/hooks/useFavorites';

export default function Discovery() {
  const [films, setFilms] = useState<Film[]>([]);
  const [currentFilm, setCurrentFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorited } = useFavorites();

  useEffect(() => {
    const loadFilms = async () => {
      setLoading(true);
      const response = await fetch('/api/films');
      const filmsData = await response.json();
      setFilms(filmsData);
      // Pick initial random film
      if (filmsData.length > 0) {
        const randomIndex = Math.floor(Math.random() * filmsData.length);
        setCurrentFilm(filmsData[randomIndex]);
      }
      setLoading(false);
    };
    loadFilms();
  }, []);

  const regenerateFilm = () => {
    if (films.length > 0) {
      const randomIndex = Math.floor(Math.random() * films.length);
      setCurrentFilm(films[randomIndex]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentFilm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No films available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Discover a Random Film
        </h1>

        <div className="flex justify-center mb-8">
          <FilmCard
            film={currentFilm}
            onFavorite={toggleFavorite}
            isFavorited={isFavorited(currentFilm.id)}
          />
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Film Details</h2>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-medium bg-gray-50">Brand Name</td>
                <td className="px-4 py-2">{currentFilm.brand}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-medium bg-gray-50">Film Model</td>
                <td className="px-4 py-2">{currentFilm.name}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-medium bg-gray-50">ISO</td>
                <td className="px-4 py-2">{currentFilm.iso}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-medium bg-gray-50">Type</td>
                <td className="px-4 py-2">{currentFilm.isColor ? 'Color' : 'Black & White'}</td>
              </tr>
              <tr className="border-b border-gray-300">
                <td className="px-4 py-2 font-medium bg-gray-50">Key Features</td>
                <td className="px-4 py-2">{currentFilm.genre?.join(', ') || 'N/A'}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium bg-gray-50">Description</td>
                <td className="px-4 py-2">{currentFilm.description || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-center">
          <button
            onClick={regenerateFilm}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Discover Another Film
          </button>
        </div>
      </div>
    </div>
  );
}