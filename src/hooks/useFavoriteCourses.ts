
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
        duration: course.duration,
        thumbnail: course.image,
        price: course.price,
        currency: "USD",
        rating: parseFloat(course.rating),
        enrolledStudents: course.students,
        status: course.level,
        verified: course.certificate,
        expert: {
          id: course.instructor?.id || "unknown",
          email: course.instructor?.email || "",
          password: "",
          name: course.instructor?.name || "Unknown",
          title: course.instructor?.title || "",
          bio: course.instructor?.bio || "",
          avatar: course.instructor?.avatar || "",
          specializations: [],
          credentials: []
        }
      }));
    },
    enabled: favoriteIds.length > 0,
  });
};
