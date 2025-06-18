
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Course } from '@/data/types/course';

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:instructors(*)
        `);
      
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
        modules_detail: [], // Will be loaded separately
        reviews: [] // Will be loaded separately
      }));
    },
  });
};

export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      // Convert string courseId to number for database query
      const numericCourseId = Number(courseId);
      
      if (isNaN(numericCourseId)) {
        throw new Error('Invalid course ID');
      }
      
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          instructor:instructors(*),
          course_modules(*),
          course_reviews(*)
        `)
        .eq('id', numericCourseId) // Use numeric id for database query
        .maybeSingle(); // Use maybeSingle to avoid errors when no data found
      
      if (error) throw error;
      if (!data) return null;
      
      // Transform the data to match the Course type
      const course: Course = {
        id: courseId, // Keep original string courseId for consistency
        title: data.title,
        description: data.description,
        longDescription: data.long_description,
        duration: data.duration,
        modules: data.modules,
        category: data.category,
        instructor: {
          name: data.instructor.name,
          title: data.instructor.title,
          bio: data.instructor.bio,
          photo: data.instructor.photo
        },
        rating: parseFloat(data.rating),
        students: data.students,
        progress: data.progress || 0,
        price: data.price,
        originalPrice: data.original_price,
        language: data.language,
        level: data.level,
        certificate: data.certificate,
        image: data.image,
        outcomes: data.outcomes || [],
        modules_detail: data.course_modules.map((module: any) => ({
          week: module.week,
          title: module.title,
          lessons: module.lessons,
          duration: module.duration
        })),
        reviews: data.course_reviews.map((review: any) => ({
          name: review.reviewer_name,
          rating: review.rating,
          comment: review.comment,
          date: review.review_date
        }))
      };
      
      return course;
    },
    enabled: !!courseId,
  });
};
