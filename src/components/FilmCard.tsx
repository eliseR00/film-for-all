'use client';

import { Film } from '@/types/film';
import Link from 'next/link';
import Image from 'next/image';

interface FilmCardProps {
  film: Film;
  onFavorite?: (filmId: string) => void;
  isFavorited?: boolean;
}

export default function FilmCard({ film, onFavorite, isFavorited }: FilmCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavorite?.(film.id);
  };

  return (
    <Link href={`/films/${film.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full relative">
        {film.poster && (
          <div className="relative h-64 w-full">
            <Image
              src={film.poster}
              alt={film.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {film.title}
          </h3>
          <p className="text-sm text-gray-600">{film.year}</p>
          {film.rating && (
            <p className="text-sm font-medium text-yellow-600 mt-2">
              ⭐ {film.rating.toFixed(1)}/10
            </p>
          )}
        </div>
        {onFavorite && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className={`w-6 h-6 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}
      </div>
    </Link>
  );
}
