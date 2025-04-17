import axios, { AxiosError } from 'axios';

// Interfaces
interface Film {
  _id: number;
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
  runtime?: number;
}

interface Genre {
  id: number;
  name: string;
}

interface GenreStats {
  _id: number;
  count: number;
  name: string;
}

interface SearchParams {
  title?: string;
  genre_id?: number;
  min_rating?: number;
  max_rating?: number;
}

interface TotalFilmsResponse {
  total_films: number;
}

interface AverageRatingResponse {
  average_rating: number;
}

// Configuration API
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Gestionnaire d'erreur global
const handleError = (error: AxiosError, context: string) => {
  console.error(`Erreur ${context}:`, error);
  throw error;
};

export const filmService = {
  // Films
  getAllFilms: async (skip = 0, limit = 50): Promise<Film[]> => {
    try {
      const response = await api.get<Film[]>(`/films?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, 'getAllFilms');
      return [];
    }
  },

  // Recherche
  searchFilms: async (params: SearchParams): Promise<Film[]> => {
    try {
      const response = await api.get<Film[]>('/films/search', { params });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, 'searchFilms');
      return [];
    }
  },

  // Genres
  getGenresStats: async (): Promise<GenreStats[]> => {
    try {
      const response = await api.get<GenreStats[]>('/films/genres/stats');
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, 'getGenresStats');
      return [];
    }
  },

  getTop5Genres: async (): Promise<GenreStats[]> => {
    try {
      const response = await api.get<GenreStats[]>('/films/genres/top5');
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, 'getTop5Genres');
      return [];
    }
  },

  getFilmsByGenre: async (genre_id: number): Promise<Film[]> => {
    try {
      const response = await api.post<Film[]>('/films/by-genre', { genre_id });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, 'getFilmsByGenre');
      return [];
    }
  },

  // Films spéciaux
  getTopFilms: async (): Promise<Film[]> => {
    try {
      const response = await api.get<Film[]>('/films/top');
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, 'getTopFilms');
      return [];
    }
  },

  getOldestFilm: async (): Promise<Film | null> => {
    try {
      const response = await api.get<Film>('/films/oldest');
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, 'getOldestFilm');
      return null;
    }
  },

  getNewestFilm: async (): Promise<Film | null> => {
    try {
      const response = await api.get<Film>('/films/newest');
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, 'getNewestFilm');
      return null;
    }
  },

  // Statistiques
  getTotalFilms: async (): Promise<number> => {
    try {
      const response = await api.get<TotalFilmsResponse>('/films/count');
      return response.data.total_films;
    } catch (error) {
      handleError(error as AxiosError, 'getTotalFilms');
      return 0;
    }
  },

  getAverageRating: async (): Promise<number> => {
    try {
      const response = await api.get<AverageRatingResponse>('/films/average-rating');
      return response.data.average_rating;
    } catch (error) {
      handleError(error as AxiosError, 'getAverageRating');
      return 0;
    }
  },

  // Films par genre
  getTopFilmsByGenre: async (genre_id: number): Promise<Film[]> => {
    try {
      const response = await api.post<Film[]>('/films/top-by-genre', { genre_id });
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, 'getTopFilmsByGenre');
      return [];
    }
  },

  // Film individuel
  getFilmById: async (film_id: number): Promise<Film | null> => {
    try {
      const response = await api.get<Film>(`/films/${film_id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, 'getFilmById');
      return null;
    }
  },

  // CRUD operations
  addFilm: async (film: Omit<Film, '_id'>): Promise<Film | null> => {
    try {
      const response = await api.post<Film>('/films', film);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, 'addFilm');
      return null;
    }
  },

  updateFilm: async (film_id: number, film: Partial<Film>): Promise<{ message: string } | null> => {
    try {
      const response = await api.put<{ message: string }>(`/films/${film_id}`, film);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, 'updateFilm');
      return null;
    }
  },

  deleteFilm: async (film_id: number): Promise<{ message: string } | null> => {
    try {
      const response = await api.delete<{ message: string }>(`/films/${film_id}`);
      return response.data;
    } catch (error) {
      handleError(error as AxiosError, 'deleteFilm');
      return null;
    }
  }
};