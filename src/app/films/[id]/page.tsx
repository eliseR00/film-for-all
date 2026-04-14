'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface FilmOverviewResponse {
  filmId: string;
  title: string;
  overview: string;
  generatedAt: string;
}

export default function FilmDetail() {
  const params = useParams();
  const router = useRouter();
  const filmId = params.id as string;

  const [overview, setOverview] = useState<FilmOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await fetch('/api/films/overview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filmId }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch overview');
        }

        const data = await response.json();
        setOverview(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [filmId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Generating AI overview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-red-600 font-semibold">Error: {error}</p>
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="text-center">
        <p className="text-gray-600">No overview available</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
      >
        ← Back to Search
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {overview.title}
        </h1>

        <div className="space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              AI-Generated Overview
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {overview.overview}
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Generated: {new Date(overview.generatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
