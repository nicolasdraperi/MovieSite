'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { filmService } from '@/services/api';
import NavBar from '@/components/NavBar';
import MovieCard from '@/components/MovieCard';
import { Button } from "@/components/ui/button";
import {Input} from "@/components/ui/input";

interface Film {
  _id: number;  // Changé de string à number
  id: number;   // Ajouté
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;  // Ajouté
  release_date: string;
  genre_ids: number[];
}

export default function Home() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalFilms, setTotalFilms] = useState(0);
  const filmsPerPage = 20;
  const [title, setTitle] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const skip = (currentPage - 1) * filmsPerPage;

        // Récupérer les films
        const data = await filmService.getAllFilms(skip, filmsPerPage);
        if (currentPage === 1) {
          setFilms(data);
          // Récupérer le total seulement à la première page
          const total = await filmService.getTotalFilms();
          setTotalFilms(total);
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

    fetchData();
  }, [currentPage]);

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };
  const handleSearch = async (page = 1) => {
  setLoading(true);
  try {
    const params: any = {};
    if (title) params.title = title;
    if (minRating) params.min_rating = parseFloat(minRating);
    if (maxRating) params.max_rating = parseFloat(maxRating);

    const allResults = await filmService.searchFilms(params);

    const filtered = allResults.filter((film: any) => {
      const year = new Date(film.release_date).getFullYear();
      const minY = minYear ? parseInt(minYear) : 0;
      const maxY = maxYear ? parseInt(maxYear) : 9999;
      return year >= minY && year <= maxY;
    });

    setFilms(filtered);
    setTotalFilms(filtered.length);
    setHasMore(false);
    setCurrentPage(1);
  } catch (error) {
    console.error("Erreur lors de la recherche :", error);
    setError("Impossible d'effectuer la recherche.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="relative min-h-screen bg-background">
      <NavBar />

      <main className="container mx-auto px-4 py-8" style={{ paddingTop: "6rem" }}>
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3}}
            className="relative z-10"
        >
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Input placeholder="Titre du film" value={title} onChange={(e) => setTitle(e.target.value)}/>
              <Input
                type="number"
                placeholder="Note min (ex: 5)"
                min={0}
                max={10}
                step={0.1}
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              />

              <Input
                type="number"
                placeholder="Note max (ex: 9)"
                min={0}
                max={10}
                step={0.1}
                value={maxRating}
                onChange={(e) => setMaxRating(e.target.value)}
              />

              <Input
                type="number"
                placeholder="Année min (ex: 2000)"
                min={1800}
                max={2100}
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
              />

              <Input
                type="number"
                placeholder="Année max (ex: 2023)"
                min={1800}
                max={2100}
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
              />

          </div>

          <Button onClick={() => handleSearch(1)} disabled={loading}>
            {loading ? "Recherche..." : "Rechercher"}
          </Button>

          <div className="flex flex-col mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
              Films Populaires
            </h1>
            {totalFilms > 0 && (
                <p className="text-muted-foreground mt-2">
                  {films.length} films affichés sur {totalFilms} au total
                </p>
            )}
          </div>

          {error && (
              <motion.div
                  initial={{opacity: 0, y: -10}}
                  animate={{opacity: 1, y: 0}}
                  className="bg-destructive/10 text-destructive rounded-lg p-4 text-center mb-8"
              >
                {error}
              </motion.div>
          )}

          <AnimatePresence mode="wait">
            {loading && films.length === 0 ? (
                <motion.div
                    key="loader"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    className="flex justify-center items-center h-[60vh]"
                >
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary absolute top-0 left-0"
                         style={{animationDelay: "-0.2s"}}></div>
                  </div>
                </motion.div>
            ) : (
                <motion.div
                    key="grid"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {films.map((film, index) => (
                        <motion.div
                            key={`${film._id}-${index}`}
                            initial={{opacity: 0, scale: 0.9}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.9}}
                            transition={{duration: 0.2, delay: index % 20 * 0.05}}
                            className="aspect-[2/3] overflow-hidden rounded-lg"
                        >
                          <MovieCard movie={film}/>
                        </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
            )}
          </AnimatePresence>

          {films.length === 0 && !loading && (
              <motion.div
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  className="text-center py-10 text-muted-foreground bg-muted/50 rounded-lg"
              >
                Aucun film trouvé
              </motion.div>
          )}

          {hasMore && !loading && films.length > 0 && (
              <motion.div
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  className="flex justify-center mt-8"
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