'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { filmService } from '@/services/api';
import NavBar from '@/components/NavBar';
import MovieCard from '@/components/MovieCard';
import { Button } from "@/components/ui/button";

interface Film {
  _id: string;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export default function Home() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const filmsPerPage = 20;

  useEffect(() => {
    const fetchFilms = async () => {
      try {
        setLoading(true);
        setError(null);
        const skip = (currentPage - 1) * filmsPerPage;
        const data = await filmService.getAllFilms(skip, filmsPerPage);
        
        if (currentPage === 1) {
          setFilms(data);
        } else {
          setFilms(prev => [...prev, ...data]);
        }
        
        setHasMore(data.length === filmsPerPage);
      } catch (error) {
        console.error('Erreur:', error);
        setError("Une erreur est survenue lors du chargement des films.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilms();
  }, [currentPage]);

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="relative min-h-screen bg-background">
      <NavBar />
      
      <main className="container mx-auto px-4" style={{ paddingTop: "5rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
              Films Populaires
            </h1>
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
            {loading && films.length === 0 ? (
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {films.map((film, index) => (
                    <motion.div
                      key={`${film._id}-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, delay: index % 20 * 0.05 }}
                      className="h-full"
                    >
                      <MovieCard movie={film} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {films.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 text-muted-foreground bg-muted/50 rounded-lg"
            >
              Aucun film trouvé
            </motion.div>
          )}

          {hasMore && !loading && films.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center mt-8 pb-8"
            >
              <Button
                onClick={loadMore}
                variant="outline"
                size="lg"
                className="w-full max-w-xs hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    Chargement...
                  </div>
                ) : (
                  'Charger plus de films'
                )}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}