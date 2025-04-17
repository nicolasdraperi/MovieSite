'use client';

import { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { filmService } from '@/services/api';
import NavBar from '@/components/NavBar';
import MovieCard from '@/components/MovieCard';
import { Button } from "@/components/ui/button";

// Types
interface Film {
  _id: number;
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
}

interface GenreStats {
  _id: number;
  count: number;
  name: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GenrePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genreName, setGenreName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const filmsPerPage = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer tous les films du genre
        const data = await filmService.getFilmsByGenre(parseInt(resolvedParams.id));
        setFilms(data);

        // Récupérer les stats des genres pour le nom
        const genresStats = await filmService.getGenresStats();
        const genre = genresStats.find(g => g._id === parseInt(resolvedParams.id));
        if (genre) {
          setGenreName(genre.name);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError("Une erreur est survenue lors du chargement des films.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  // Pagination côté client
  const paginatedFilms = films.slice(0, currentPage * filmsPerPage);
  const hasMore = paginatedFilms.length < films.length;

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="relative min-h-screen bg-background">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8" style={{ paddingTop: "6rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
              {genreName ? `Films - ${genreName}` : 'Chargement...'}
            </h1>
            {films.length > 0 && (
              <span className="text-muted-foreground">
                {films.length} films trouvés
              </span>
            )}
          </div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 text-destructive rounded-lg p-4 text-center mb-8"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-[60vh]"
              >
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary absolute top-0 left-0" style={{ animationDelay: "-0.2s" }}></div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
              >
                {paginatedFilms.map((film, index) => (
                  <motion.div
                    key={`${film._id}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index % 20 * 0.05 }}
                    className="aspect-[2/3] overflow-hidden rounded-lg"
                  >
                    <MovieCard movie={film} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {hasMore && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center mt-8"
            >
              <Button
                onClick={loadMore}
                variant="outline"
                size="lg"
                className="w-full max-w-xs hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Charger plus de films
              </Button>
            </motion.div>
          )}

          {films.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 text-muted-foreground bg-muted/50 rounded-lg"
            >
              Aucun film trouvé pour ce genre
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}