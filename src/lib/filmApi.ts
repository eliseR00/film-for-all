import axios from 'axios';
import { Film } from '@/types/film';

const FILM_API_BASE = 'https://filmapi.vercel.app/api';

interface RawFilm {
  _id: string;
  name: string;
  brand: string;
  iso: number;
  formatThirtyFive: boolean;
  formatOneTwenty: boolean;
  color: boolean;
  description: string;
  staticImageUrl: string;
  keyFeatures?: Array<{ feature: string }>;
  dateAdded: string;
}

export const filmApi = {
  async getAllFilms(): Promise<Film[]> {
    try {
      const response = await axios.get(`${FILM_API_BASE}/films`);
      const allFilms: RawFilm[] = response.data;

      return allFilms.map((film) => ({
        id: film._id,
        title: `${film.brand.toUpperCase()} ${film.name}`,
        name: film.name,
        year: new Date(film.dateAdded).getFullYear(),
        director: film.brand,
        description: film.description,
        poster: film.staticImageUrl,
        rating: film.iso / 100,
        genre: film.keyFeatures?.map((f) => f.feature) || [],
        // Additional properties for filtering
        iso: film.iso,
        format35mm: film.formatThirtyFive,
        format120: film.formatOneTwenty,
        isColor: film.color,
        brand: film.brand,
      }));
    } catch (error) {
      console.error('Error fetching all films:', error);
      return [];
    }
  },

  async searchFilms(query: string): Promise<Film[]> {
    try {
      const response = await axios.get(`${FILM_API_BASE}/films`);
      
      const allFilms: RawFilm[] = response.data;
      
      // Filter films based on query (search by name, brand, or description)
      const filtered = allFilms.filter((film) =>
        film.name.toLowerCase().includes(query.toLowerCase()) ||
        film.brand.toLowerCase().includes(query.toLowerCase()) ||
        film.description.toLowerCase().includes(query.toLowerCase())
      );

      return filtered.map((film) => ({
        id: film._id,
        title: `${film.brand.toUpperCase()} ${film.name}`,
        name: film.name,
        year: new Date(film.dateAdded).getFullYear(),
        director: film.brand,
        description: film.description,
        poster: film.staticImageUrl,
        rating: film.iso / 100,
        iso: film.iso,
        format35mm: film.formatThirtyFive,
        format120: film.formatOneTwenty,
        isColor: film.color,
        brand: film.brand,
      }));
    } catch (error) {
      console.error('Error searching films:', error);
      return [];
    }
  },

  async getFilmDetails(filmId: string): Promise<Film | null> {
    try {
      const response = await axios.get(`${FILM_API_BASE}/films`);
      
      const allFilms: RawFilm[] = response.data;
      const film = allFilms.find((f) => f._id === filmId);

      if (!film) {
        return null;
      }

      return {
        id: film._id,
        title: `${film.brand.toUpperCase()} ${film.name}`,
        name: film.name,
        year: new Date(film.dateAdded).getFullYear(),
        director: film.brand,
        description: film.description,
        poster: film.staticImageUrl,
        rating: film.iso / 100,
        genre: film.keyFeatures?.map((f) => f.feature) || [],
        iso: film.iso,
        format35mm: film.formatThirtyFive,
        format120: film.formatOneTwenty,
        isColor: film.color,
        brand: film.brand,
      };
    } catch (error) {
      console.error('Error fetching film details:', error);
      return null;
    }
  },
};
