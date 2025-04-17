'use client';

import { useState } from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

interface MovieCardProps {
  movie: {
    _id: number;  // Changé de string à number
    id?: number;  // Optionnel, au cas où il est présent
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
    vote_count?: number;  // Optionnel, au cas où il est présent
    genre_ids?: number[]; // Optionnel, au cas où il est présent
  }
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    router.push(`/film/${movie._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="relative w-full h-full rounded-lg overflow-hidden"
      onClick={handleClick}
    >
      <Card 
        className="w-full h-full overflow-hidden cursor-pointer bg-card transition-colors relative rounded-none"
      >
        <div className="relative w-full h-full">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
            style={{ 
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden'
            }}
          />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 p-4 flex flex-col justify-end"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{movie.title}</h3>
            <p className="text-sm text-gray-200 line-clamp-3">{movie.overview}</p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 flex items-center gap-1 font-medium">
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
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}