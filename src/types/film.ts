export interface Film {
  id: string;
  title: string;
  name?: string;
  year: number;
  director: string;
  description?: string;
  poster?: string;
  rating?: number;
  genre?: string[];
  iso?: number;
  format35mm?: boolean;
  format120?: boolean;
  isColor?: boolean;
  brand?: string;
}

export interface FilmOverview {
  filmId: string;
  title: string;
  overview: string;
  generatedAt: string;
}
