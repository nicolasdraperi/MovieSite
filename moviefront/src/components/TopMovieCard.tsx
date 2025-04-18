'use client';

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface TopMovieCardProps {
  movie: {
    _id: number;
    id?: number;
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
    vote_count?: number;
    genre_ids?: number[];
  }
}

export default function TopMovieCard({ movie }: TopMovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="relative w-full h-full rounded-lg overflow-hidden group"
    >
      <Card className="w-full h-full overflow-hidden bg-card relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />

        {/* Description visible seulement au survol */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/90 via-black/60 to-black/30 z-10">
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
            {movie.title}
          </h3>
          <p className="text-sm text-gray-200 line-clamp-3">
            {movie.overview || "Aucun synopsis."}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 font-medium">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
              {movie.vote_count && (
                <span className="text-gray-400 text-sm">
                  ({movie.vote_count} votes)
                </span>
              )}
            </div>
            <span className="text-gray-300 font-medium">
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
