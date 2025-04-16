'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { filmService } from '@/services/api';
import { ArrowLeft, Star, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { use } from 'react';

interface FilmDetails {
  _id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path?: string; // Optionnel
  vote_average: number;
  release_date: string;
  runtime?: number; // Optionnel
  genres?: Array<{ id: number; name: string }>; // Optionnel
}

export default function FilmPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [film, setFilm] = useState<FilmDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilmDetails = async () => {
      try {
        setLoading(true);
        const filmId = parseInt(resolvedParams.id, 10);
        if (isNaN(filmId)) {
          throw new Error("ID de film invalide");
        }
        const data = await filmService.getFilmById(filmId);
        setFilm(data);
      } catch (err) {
        setError("Erreur lors du chargement des détails du film");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilmDetails();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !film) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-destructive mb-4">{error || "Film non trouvé"}</p>
        <Link href="/">
          <Button variant="outline">Retour à l'accueil</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section avec backdrop */}
      <div className="relative h-[70vh] w-full">
        <div className="absolute inset-0">
          {film.backdrop_path ? (
            <img
              src={`https://image.tmdb.org/t/p/original${film.backdrop_path}`}
              alt={film.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Link href="/" className="inline-flex items-center text-white mb-4 hover:text-primary transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Link>
            <div className="flex gap-8 items-end">
              <motion.img
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                src={`https://image.tmdb.org/t/p/w500${film.poster_path}`}
                alt={film.title}
                className="w-64 rounded-lg shadow-2xl"
              />
              <div className="flex-1">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold text-white mb-4"
                >
                  {film.title}
                </motion.h1>
                <div className="flex items-center gap-6 text-white/80 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-1" />
                    {film.vote_average.toFixed(1)}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-1" />
                    {new Date(film.release_date).getFullYear()}
                  </div>
                  {film.runtime && (
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-1" />
                      {`${film.runtime} min`}
                    </div>
                  )}
                </div>
                {film.genres && film.genres.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {film.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Synopsis */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
            <p className="text-muted-foreground">{film.overview}</p>
          </div>

          {/* Informations supplémentaires */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Informations</h2>
            <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
              <div>
                <p className="font-medium">Note</p>
                <p className="text-muted-foreground">{film.vote_average.toFixed(1)} / 10</p>
              </div>
              <div>
                <p className="font-medium">Date de sortie</p>
                <p className="text-muted-foreground">
                  {new Date(film.release_date).toLocaleDateString()}
                </p>
              </div>
              {film.runtime && (
                <div>
                  <p className="font-medium">Durée</p>
                  <p className="text-muted-foreground">{film.runtime} minutes</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}