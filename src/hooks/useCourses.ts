
// import { useQuery } from '@tanstack/react-query';
// import { supabase } from '@/integrations/supabase/client';
// import type { Course } from '@/data/types/course';

// export const useCourses = () => {
//   return useQuery({
//     queryKey: ['courses'],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from('courses')
//         .select(`
//           *,
//           instructor:instructors(*)
//         `);
      
//       if (error) throw error;
      
//       // Transform the data to match the Course type
//       return data.map((course: any): Course => ({
//         id: String(course.id), // Convert number to string
//         title: course.title,
//         description: course.description,
//         longDescription: course.long_description,
//         duration: course.duration,
//         modules: course.modules,
//         category: course.category,
//         instructor: {
//           name: course.instructor.name,
//           title: course.instructor.title,
//           bio: course.instructor.bio,
//           photo: course.instructor.photo
//         },
//         rating: parseFloat(course.rating),
//         students: course.students,
//         progress: course.progress || 0,
//         price: course.price,
//         originalPrice: course.original_price,
//         language: course.language,
//         level: course.level,
//         certificate: course.certificate,
//         image: course.image,
//         outcomes: course.outcomes || [],
//         modules_detail: [], // Will be loaded separately
//         reviews: [] // Will be loaded separately
//       }));
//     },
//   });
// };

// export const useCourse = (courseId: string) => {
//   return useQuery({
//     queryKey: ['course', courseId],
//     queryFn: async () => {
//       // Convert string courseId to number for database query
//       const numericCourseId = Number(courseId);
      
//       if (isNaN(numericCourseId)) {
//         throw new Error('Invalid course ID');
//       }
      
//       const { data, error } = await supabase
//         .from('courses')
//         .select(`
//           *,
//           instructor:instructors(*),
//           course_modules(*),
//           course_reviews(*)
//         `)
//         .eq('id', numericCourseId) // Use numeric id for database query
//         .maybeSingle(); // Use maybeSingle to avoid errors when no data found
      
//       if (error) throw error;
//       if (!data) return null;
      
//       // Transform the data to match the Course type
//       const course: Course = {
//         id: String(data.id), // Convert back to string for consistency
//         title: data.title,
//         description: data.description,
//         longDescription: data.long_description,
//         duration: data.duration,
//         modules: data.modules,
//         category: data.category,
//         instructor: {
//           name: data.instructor.name,
//           title: data.instructor.title,
//           bio: data.instructor.bio,
//           photo: data.instructor.photo
//         },
//         rating: parseFloat(data.rating.toString()),
//         students: data.students,
//         progress: data.progress || 0,
//         price: data.price,
//         originalPrice: data.original_price,
//         language: data.language,
//         level: data.level,
//         certificate: data.certificate,
//         image: data.image,
//         outcomes: data.outcomes || [],
//         modules_detail: data.course_modules.map((module: any) => ({
//           week: module.week,
//           title: module.title,
//           lessons: module.lessons,
//           duration: module.duration
//         })),
//         reviews: data.course_reviews.map((review: any) => ({
//           name: review.reviewer_name,
//           rating: review.rating,
//           comment: review.comment,
//           date: review.review_date
//         }))
//       };
      
//       return course;
//     },
//     enabled: !!courseId,
//   });
// };


// import { useQuery } from '@tanstack/react-query';
// import { getAllCourses, getCourseById, getCategories } from '../services/courseApi';
// import type { Course } from '../data/types/course';

// export const useCourses = () => {
//   return useQuery({
//     queryKey: ['courses'],
//     queryFn: getAllCourses,
//   });
// };

// export const useCourse = (courseId: string) => {
//   return useQuery({
//     queryKey: ['course', courseId],
//     queryFn: () => getCourseById(courseId),
//     enabled: !!courseId,
//   });
// };

// export const useCategories = () => {
//   return useQuery({
//     queryKey: ['categories'],
//     queryFn: getCategories,
//   });
// };



// import { useQuery, useMutation } from '@tanstack/react-query';
// import { getAllCourses, getCourseById, getCategories, enrollCourse, getUserEnrolledCourses } from '../services/courseApi';
// import type { Course } from '../data/types/course';

// export const useCourses = () => {
//   return useQuery({
//     queryKey: ['courses'],
//     queryFn: getAllCourses,
//   });
// };

// export const useCourse = (courseId: string) => {
//   return useQuery({
//     queryKey: ['course', courseId],
//     queryFn: () => getCourseById(courseId),
//     enabled: !!courseId,
//   });
// };

// export const useCategories = () => {
//   return useQuery({
//     queryKey: ['categories'],
//     queryFn: getCategories,
//   });
// };

// export const useEnrollCourse = () => {
//   return useMutation({
//     mutationFn: ({ courseId, userId }: { courseId: string; userId: string }) => enrollCourse(courseId, userId),
//   });
// };

// export const useUserEnrolledCourses = (userId: string) => {
//   return useQuery({
//     queryKey: ['enrolledCourses', userId],
//     queryFn: () => getUserEnrolledCourses(userId),
//     enabled: !!userId,
//   });
// };

import { useQuery, useMutation } from '@tanstack/react-query';
import { getAllCourses, getCourseById, getCategories, enrollCourse, getUserEnrolledCourses } from '../services/courseApi';
import type { Course } from '../data/types/course';
import { CoursesExpertAPI } from '@/api/courses';
import { useAuth } from './useAuth';

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => CoursesExpertAPI.getCourses(),
  });
};
export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });
};

export const useEnrollCourse = () => {
  const {user} = useAuth();
  return useMutation({
    mutationFn: ({ courseId }: { courseId: string}) => enrollCourse(courseId, user?.id),
  });
};  

export const useUserEnrolledCourses = (userId: string) => {
  return useQuery({
    queryKey: ['enrolledCourses', userId],
    queryFn: () => getUserEnrolledCourses(userId),
    enabled: !!userId,
    retry: 1, // Reduce retries for faster feedback on invalid userId
  });
};