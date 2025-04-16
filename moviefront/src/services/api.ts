import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  }
});

export const filmService = {
  // Films
  getAllFilms: async (skip = 0, limit = 50) => {
    try {
      const response = await api.get(`/films?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erreur getAllFilms:', error);
      throw error;
    }
  },

  // Recherche de films
  searchFilms: async (params: {
    title?: string;
    genre_id?: number;
    min_rating?: number;
    max_rating?: number;
  }) => {
    try {
      const response = await api.get('/films/search', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur searchFilms:', error);
      throw error;
    }
  },

  // Genres
  getGenresStats: async () => {
    try {
      const response = await api.get('/films/genres/stats');
      return response.data;
    } catch (error) {
      console.error('Erreur getGenresStats:', error);
      throw error;
    }
  },

  getTop5Genres: async () => {
    try {
      const response = await api.get('/films/genres/top5');
      return response.data;
    } catch (error) {
      console.error('Erreur getTop5Genres:', error);
      throw error;
    }
  },

  // Films spéciaux
  getTopFilms: async () => {
    try {
      const response = await api.get('/films/top');
      return response.data;
    } catch (error) {
      console.error('Erreur getTopFilms:', error);
      throw error;
    }
  },

  getOldestFilm: async () => {
    try {
      const response = await api.get('/films/oldest');
      return response.data;
    } catch (error) {
      console.error('Erreur getOldestFilm:', error);
      throw error;
    }
  },

  getNewestFilm: async () => {
    try {
      const response = await api.get('/films/newest');
      return response.data;
    } catch (error) {
      console.error('Erreur getNewestFilm:', error);
      throw error;
    }
  },

  // Statistiques
  getTotalFilms: async () => {
    try {
      const response = await api.get('/films/count');
      return response.data;
    } catch (error) {
      console.error('Erreur getTotalFilms:', error);
      throw error;
    }
  },

  getAverageRating: async () => {
    try {
      const response = await api.get('/films/average-rating');
      return response.data;
    } catch (error) {
      console.error('Erreur getAverageRating:', error);
      throw error;
    }
  },

  // Films par genre
  getTopFilmsByGenre: async (genre_id: number) => {
    try {
      const response = await api.post('/films/top-by-genre', { genre_id });
      return response.data;
    } catch (error) {
      console.error('Erreur getTopFilmsByGenre:', error);
      throw error;
    }
  },

  // Film individuel
  getFilmById: async (film_id: number) => {
    try {
      const response = await api.get(`/films/${film_id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur getFilmById:', error);
      throw error;
    }
  },

  // CRUD operations
  addFilm: async (film: any) => {
    try {
      const response = await api.post('/films', film);
      return response.data;
    } catch (error) {
      console.error('Erreur addFilm:', error);
      throw error;
    }
  },

  updateFilm: async (film_id: number, film: any) => {
    try {
      const response = await api.put(`/films/${film_id}`, film);
      return response.data;
    } catch (error) {
      console.error('Erreur updateFilm:', error);
      throw error;
    }
  },

  deleteFilm: async (film_id: number) => {
    try {
      const response = await api.delete(`/films/${film_id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur deleteFilm:', error);
      throw error;
    }
  }
};