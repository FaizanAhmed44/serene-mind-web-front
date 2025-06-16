
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useFavorites } from '@/contexts/FavoritesContext';
import type { Course } from '@/data/types/course';

export const useFavoriteCourses = () => {
  const { favoriteIds } = useFavorites();
  
  return useQuery({
    queryKey: ['favorite-courses', favoriteIds],
    queryFn: async () => {
      if (favoriteIds.length === 0) {
        return [];
      }

      // Convert string IDs to numbers for database query
      const numericIds = favoriteIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
      
      if (numericIds.length === 0) {
        return [];
      }

      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:instructors(*)
        `)
        .in('id', numericIds);
      
      if (error) throw error;
      
      // Transform the data to match the Course type
      return data.map((course: any): Course => ({
        id: String(course.id), // Convert number to string
        title: course.title,
        description: course.description,
        longDescription: course.long_description,
        duration: course.duration,
        modules: course.modules,
        category: course.category,
        instructor: {
          name: course.instructor.name,
          title: course.instructor.title,
          bio: course.instructor.bio,
          photo: course.instructor.photo
        },
        rating: parseFloat(course.rating),
        students: course.students,
        progress: course.progress || 0,
        price: course.price,
        originalPrice: course.original_price,
        language: course.language,
        level: course.level,
        certificate: course.certificate,
        image: course.image,
        outcomes: course.outcomes || [],
        modules_detail: [], // Will be loaded separately if needed
        reviews: [] // Will be loaded separately if needed
      }));
    },
    enabled: favoriteIds.length > 0,
  });
};
