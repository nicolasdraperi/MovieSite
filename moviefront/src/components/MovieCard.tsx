'use client';

import { useState } from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface MovieCardProps {
  movie: {
    _id: string;
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
  }
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="relative z-10" // Ajout d'un z-index pour être au-dessus de l'overlay
    >
      <Card 
        className="overflow-hidden cursor-pointer bg-card transition-colors relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[2/3]">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="object-cover w-full h-full"
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
          >
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{movie.title}</h3>
            <p className="text-sm text-gray-200 line-clamp-3">{movie.overview}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-yellow-400 flex items-center gap-1 font-medium">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
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