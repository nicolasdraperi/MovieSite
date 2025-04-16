'use client';

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { filmService } from "@/services/api";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface Film {
  _id: string;
  title: string;
  release_date: string;
  poster_path: string;
}

export default function NavBar() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [genres, setGenres] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<Film[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await filmService.getGenresStats();
        setGenres(genresData);
      } catch (error) {
        console.error('Erreur lors du chargement des genres:', error);
      }
    };
    fetchGenres();
  }, []);

  React.useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearch.trim() === "") {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        setLoading(true);
        const results = await filmService.searchFilms({ title: debouncedSearch });
        setSuggestions(results.slice(0, 5));
        setShowSuggestions(true);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedSearch]);

  const handleGenreClick = (genreId: number) => {
    window.location.href = `/genre/${genreId}`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-background">
      <div className="relative">
        {/* Overlay pour les suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            className="fixed inset-0 bg-black/50"
            style={{ zIndex: -1 }}
            onClick={() => setShowSuggestions(false)}
          />
        )}

        {/* Barre de navigation */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="relative border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
          <div className="container mx-auto">
            <div className="flex h-16 items-center px-4">
              <NavigationMenu>
                <NavigationMenuList className="space-x-4">
                  <NavigationMenuItem>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="font-bold text-xl"
                    >
                      <Link href="/" className="hover:text-primary">MovieDB</Link>
                    </motion.div>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Genres</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {genres.map((genre) => (
                          <li key={genre._id}>
                            <Button 
                              variant="ghost" 
                              className="w-full justify-between hover:bg-muted"
                              onClick={() => handleGenreClick(genre._id)}
                            >
                              <span>{genre.name}</span>
                              <span className="text-muted-foreground">
                                ({genre.count})
                              </span>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <Link 
                      href="/top" 
                      className="hover:text-primary transition-colors"
                    >
                      Top Films
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <div className="flex-1 flex items-center justify-end space-x-4">
                <div ref={searchRef} className="relative flex-1 max-w-sm lg:max-w-lg">
                  <Input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Rechercher un film..."
                    className="pr-8"
                  />
                  <Search 
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 
                      ${loading ? 'animate-spin text-primary' : 'text-muted-foreground'}`}
                  />
                  
                  {/* Suggestions */}
                  <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-md shadow-lg"
                      >
                        {suggestions.map((film) => (
                          <Link 
                            key={film._id} 
                            href={`/film/${film._id}`}
                            className="flex items-center gap-3 p-3 hover:bg-muted transition-colors"
                            onClick={() => setShowSuggestions(false)}
                          >
                            {film.poster_path && (
                              <img 
                                src={`https://image.tmdb.org/t/p/w92${film.poster_path}`}
                                alt={film.title}
                                className="w-10 h-14 object-cover rounded"
                              />
                            )}
                            <div>
                              <div className="font-medium">{film.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(film.release_date).getFullYear()}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}