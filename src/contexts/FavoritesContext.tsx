
import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Course } from '@/data/types/course';
import type { IndexCourse } from '@/data/types/index-course';

interface FavoritesContextType {
  favorites: Course[];
  favoriteIds: string[];
  addToFavorites: (course: Course | IndexCourse) => void;
  removeFromFavorites: (courseId: string) => void;
  isFavorite: (courseId: string) => boolean;
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

  const favoriteIds = favorites.map(course => course.id);

  const addToFavorites = (course: Course | IndexCourse) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === course.id)) {
        return prev;
      }
      
      // Convert IndexCourse to Course if needed
      const fullCourse: Course = 'longDescription' in course ? course as Course : {
        ...course,
        id: String(course.id), // Ensure id is string
        longDescription: course.description,
        price: "Free",
        originalPrice: undefined,
        language: "English",
        level: "Beginner",
        certificate: true,
        outcomes: [],
        modules_detail: [],
        reviews: [],
        instructor: {
          name: course.instructor,
          title: "",
          bio: "",
          photo: ""
        }
      };
      
      return [...prev, fullCourse];
    });
  };

  const removeFromFavorites = (courseId: string) => {
    setFavorites(prev => prev.filter(course => course.id !== courseId));
  };

  const isFavorite = (courseId: string) => {
    return favorites.some(course => course.id === courseId);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      favoriteIds,
      addToFavorites,
      removeFromFavorites,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
