'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { filmService } from '@/services/api';
import NavBar from '@/components/NavBar';
import MovieCard from '@/components/MovieCard';
import { Trophy, Star, Calendar, Users, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  runtime?: number;
}

export default function TopFilmsPage() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalFilms, setTotalFilms] = useState(0);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [genres, setGenres] = useState<Record<number, string>>({});
  const [isFullSynopsis, setIsFullSynopsis] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [data, total, genresData] = await Promise.all([
          filmService.getTopFilms(),
          filmService.getTotalFilms(),
          filmService.getGenresStats()
        ]);
        
        setFilms(data);
        setTotalFilms(total);
        const genresMap = genresData.reduce((acc, genre) => ({
          ...acc,
          [genre._id]: genre.name
        }), {});
        setGenres(genresMap);
      } catch (error) {
        console.error('Erreur:', error);
        setError("Une erreur est survenue lors du chargement des films.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Reset le synopsis quand on ferme le modal
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setSelectedFilm(null);
      setIsFullSynopsis(false);
    }
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
          <div className="flex flex-col items-center text-center mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-700">
                Top Films
              </h1>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-lg text-muted-foreground">
                Les 10 films les mieux notés avec au moins 25 votes
              </p>
              {totalFilms > 0 && (
                <p className="text-sm text-muted-foreground/80">
                  Sur un total de {totalFilms} films
                </p>
              )}
            </div>
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
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8"
              >
                {films.map((film, index) => (
                  <motion.div
                    key={`${film._id}-${index}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="aspect-[2/3] overflow-hidden rounded-lg relative group cursor-pointer"
                    onClick={() => setSelectedFilm(film)}
                  >
                    <div className="absolute top-2 left-2 z-20">
                      <div className="relative">
                        <div className="absolute inset-0 bg-black/50 blur-lg rounded-full"></div>
                        <div className="relative bg-gradient-to-r from-yellow-500 to-yellow-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <MovieCard movie={film} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <Dialog open={selectedFilm !== null} onOpenChange={handleDialogChange}>
            <DialogContent className="max-w-3xl">
              {selectedFilm && (
                <ScrollArea className="max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      {selectedFilm.title}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedFilm.genre_ids.map((genreId) => (
                      <Badge key={genreId} variant="secondary">
                        {genres[genreId]}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Card className="overflow-hidden h-full">
                      <div className="relative aspect-[2/3] w-full">
                        <img 
                          src={`https://image.tmdb.org/t/p/w500${selectedFilm.poster_path}`}
                          alt={selectedFilm.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </Card>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <span>{selectedFilm.vote_average.toFixed(1)}/10</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-500" />
                          <span>{selectedFilm.vote_count} votes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-green-500" />
                          <span>{formatDate(selectedFilm.release_date)}</span>
                        </div>
                        {selectedFilm.runtime && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-purple-500" />
                            <span>{selectedFilm.runtime} min</span>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-2">Synopsis</h4>
                        <div className="relative">
                          <p className={`text-muted-foreground leading-relaxed ${!isFullSynopsis && 'line-clamp-3'}`}>
                            {selectedFilm.overview || "Aucun synopsis disponible."}
                          </p>
                          {selectedFilm.overview && selectedFilm.overview.length > 150 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 h-8 px-2"
                              onClick={() => setIsFullSynopsis(!isFullSynopsis)}
                            >
                              {isFullSynopsis ? (
                                <ChevronUp className="h-4 w-4 mr-1" />
                              ) : (
                                <ChevronDown className="h-4 w-4 mr-1" />
                              )}
                              Voir {isFullSynopsis ? 'moins' : 'plus'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              )}
            </DialogContent>
          </Dialog>

          {films.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 text-muted-foreground bg-muted/50 rounded-lg"
            >
              Aucun film trouvé
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}