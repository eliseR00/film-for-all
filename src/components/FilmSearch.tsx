'use client';

import { useState, useEffect } from 'react';
import { Film } from '@/types/film';
import FilmCard from './FilmCard';
import { filmApi } from '@/lib/filmApi';

interface FilmWithFilters extends Film {
  iso?: number;
  format35mm?: boolean;
  format120?: boolean;
  isColor?: boolean;
  brand?: string;
}

export default function FilmSearch() {
  const [allFilms, setAllFilms] = useState<FilmWithFilters[]>([]);
  const [filteredFilms, setFilteredFilms] = useState<FilmWithFilters[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedISO, setSelectedISO] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Get unique values for filters
  const brands = Array.from(new Set(allFilms.map((f) => f.brand))).sort();
  const isos = Array.from(new Set(allFilms.map((f) => f.iso))).sort((a, b) => a! - b!);
  const colors = ['B&W', 'Color'];

  // Load all films on mount
  useEffect(() => {
    const loadFilms = async () => {
      setLoading(true);
      const films = await filmApi.getAllFilms();
      setAllFilms(films);
      setFilteredFilms(films);
      setLoading(false);
    };
    loadFilms();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = allFilms;

    // Search query filter
    if (searchQuery) {
      results = results.filter(
        (film) =>
          film.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (film.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      );
    }

    // Brand filter
    if (selectedBrand) {
      results = results.filter((film) => film.brand === selectedBrand);
    }

    // ISO filter
    if (selectedISO) {
      results = results.filter((film) => film.iso === parseInt(selectedISO));
    }

    // Format filter
    if (selectedFormat) {
      results = results.filter((film) => {
        if (selectedFormat === '35mm') return film.format35mm;
        if (selectedFormat === '120') return film.format120;
        return true;
      });
    }

    // Color filter
    if (selectedColor) {
      const isColor = selectedColor === 'Color';
      results = results.filter((film) => film.isColor === isColor);
    }

    setFilteredFilms(results);
  }, [searchQuery, selectedBrand, selectedISO, selectedFormat, selectedColor, allFilms]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('');
    setSelectedISO('');
    setSelectedFormat('');
    setSelectedColor('');
  };

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search films by name or description..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Brand Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* ISO Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ISO
          </label>
          <select
            value={selectedISO}
            onChange={(e) => setSelectedISO(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All ISO</option>
            {isos.map((iso) => (
              <option key={iso} value={iso}>
                ISO {iso}
              </option>
            ))}
          </select>
        </div>

        {/* Format Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Format
          </label>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Formats</option>
            <option value="35mm">35mm</option>
            <option value="120">120mm</option>
          </select>
        </div>

        {/* Color Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="B&W">Black & White</option>
            <option value="Color">Color</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            onClick={resetFilters}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results */}
      {loading && <p className="text-center text-gray-600 py-8">Loading films...</p>}

      {!loading && filteredFilms.length === 0 && (
        <p className="text-center text-gray-600 py-8">No films match your filters</p>
      )}

      {!loading && filteredFilms.length > 0 && (
        <>
          <p className="text-sm text-gray-600 mb-4">
            Showing {filteredFilms.length} of {allFilms.length} films
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFilms.map((film) => (
              <FilmCard key={film.id} film={film} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
