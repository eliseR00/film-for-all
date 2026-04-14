'use client';

import { Film } from '@/types/film';
import Link from 'next/link';
import Image from 'next/image';

interface FilmCardProps {
  film: Film;
}

export default function FilmCard({ film }: FilmCardProps) {
  return (
    <Link href={`/films/${film.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
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
      </div>
    </Link>
  );
}
