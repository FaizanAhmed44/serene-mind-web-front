
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { IndexCourse } from '@/data/types/index-course';

export const useIndexCourses = () => {
  return useQuery({
    queryKey: ['index-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:instructors(name)
        `);
      
      if (error) throw error;
      
      // Transform the data to match the IndexCourse type
      return data.map((course: any): IndexCourse => ({
        id: course.id,
        title: course.title,
        description: course.description,
        duration: course.duration,
        modules: course.modules,
        category: course.category,
        instructor: course.instructor.name,
        rating: parseFloat(course.rating),
        students: course.students,
        progress: course.progress || 0,
        image: course.image
      }));
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('category')
        .order('category');
      
      if (error) throw error;
      
      // Get unique categories and add "All" at the beginning
      const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
      return ['All', ...uniqueCategories];
    },
  });
};
