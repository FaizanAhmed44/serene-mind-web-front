
import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Course } from '@/data/types/course';

interface FavoritesContextType {
  favorites: Course[];
  addToFavorites: (course: Course) => void;
  removeFromFavorites: (courseId: number) => void;
  isFavorite: (courseId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Course[]>([]);

  const addToFavorites = (course: Course) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === course.id)) {
        return prev;
      }
      return [...prev, course];
    });
  };

  const removeFromFavorites = (courseId: number) => {
    setFavorites(prev => prev.filter(course => course.id !== courseId));
  };

  const isFavorite = (courseId: number) => {
    return favorites.some(course => course.id === courseId);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
