


// // ll
// import api from '../lib/axios';
// import { CoursesResponse, CourseResponse, Course, BackendCourse, BackendModule } from '../data/types/course';

// // Utility to validate duration (handles invalid values like "Odit nihil assumenda")
// const validateDuration = (duration: string): string => {
//   const isValid = /^(\d+\s*(hours?|minutes?|hrs?|mins?)\s*)*$/i.test(duration);
//   return isValid ? duration : 'Unknown';
// };

// const mapToFrontendCourse = (backendCourse: BackendCourse): Course => ({
//   id: backendCourse.id,
//   title: backendCourse.title,
//   description: backendCourse.description,
//   longDescription: backendCourse.description, // Fallback
//   duration: validateDuration(backendCourse.duration),
//   modules: backendCourse._count?.modules || backendCourse.modules.length,
//   category: 'General', // Default, update backend to include category
//   instructor: backendCourse.expert
//     ? {
//         name: backendCourse.expert.name,
//         title: backendCourse.expert.title,
//         bio: backendCourse.expert.bio,
//         photo: backendCourse.expert.avatar,
//       }
//     : { name: 'Unknown', title: 'Instructor', bio: '', photo: '' },
//   rating: backendCourse.rating,
//   students: backendCourse.enrolledStudents,
//   progress: 0, // Not in backend
//   price: '$99', // Default, update backend
//   originalPrice: undefined, // Not in backend
//   language: 'English', // Default, update backend
//   level: 'Beginner', // Default, update backend
//   certificate: true, // Default, update backend
//   image: backendCourse.thumbnail,
//   outcomes: [], // Not in backend
//   modules_detail: backendCourse.modules.map((module: BackendModule, index: number) => ({
//     week: index + 1,
//     title: module.title,
//     lessons: module.lessons.map(lesson => lesson.title),
//     duration: validateDuration(module.duration || 'Unknown'),
//   })),
//   reviews: [], // Not in backend
// });

// export const getAllCourses = async (): Promise<Course[]> => {
//   try {
//     const response = await api.get<CoursesResponse>('/courses');
//     return response.data.courses.map(mapToFrontendCourse);
//   } catch (error) {
//     throw new Error('Failed to fetch courses');
//   }
// };

// export const getCourseById = async (courseId: string): Promise<Course> => {
//   try {
//     const response = await api.get<CourseResponse>(`/courses/${courseId}`);
//     return mapToFrontendCourse(response.data.course);
//   } catch (error) {
//     throw new Error('Failed to fetch course');
//   }
// };

// export const getCategories = async (): Promise<string[]> => {
//   try {
//     const response = await api.get<CoursesResponse>('/courses');
//     const categories = Array.from(
//       new Set(response.data.courses.map((course) =>  'General'))
//     );
//     return ['All', ...categories];
//   } catch (error) {
//     return ['All', 'General']; // Fallback
//   }
// };

// export const enrollCourse = async (courseId: string, userId: string): Promise<void> => {
//   try {
//     const response = await api.put(`/courses/${courseId}/enroll`, { userId });
//     if (!response.data.success) {
//       throw new Error(response.data.message || 'Failed to enroll in course');
//     }
//   } catch (error) {
//     throw new Error('Failed to enroll in course');
//   }
// };
// export const getUserEnrolledCourses = async (userId: string): Promise<Course[]> => {
//   try {
//     const response = await api.get(`/courses/${userId}/enrolled`);
//     const enrollments = response.data.data || [];
//     if (!Array.isArray(enrollments)) {
//       throw new Error('Invalid response format: data is not an array');
//     }
//     // Map the `course` object from each enrollment to the frontend Course type
//     return enrollments.map(enrollment => mapToFrontendCourse(enrollment.course));
//   } catch (error: any) {
//     throw new Error(error.message || 'Failed to fetch enrolled courses');
//   }
// };



import api from '../lib/axios';
import { CoursesResponse, CourseResponse, Course, BackendCourse, BackendModule, BackendLesson } from '../data/types/course';

// Utility to validate duration
const validateDuration = (duration: string): string => {
  if (!duration || typeof duration !== 'string') return 'Unknown';
  const isValid = /^(\d+\s*(hours?|minutes?|hrs?|mins?)\s*)*$/i.test(duration);
  return isValid ? duration : 'Unknown';
};

const mapToFrontendCourse = (backendCourse: BackendCourse): Course => ({
  id: backendCourse.id,
  title: backendCourse.title || 'Untitled Course',
  description: backendCourse.description || 'No description available',
  longDescription: backendCourse.description || 'No description available',
  duration: validateDuration(backendCourse.duration),
  modules: backendCourse._count?.modules || backendCourse.modules.length || 0,
  category: 'General',
  instructor: backendCourse.expert
    ? {
        name: backendCourse.expert.name || 'Unknown Instructor',
        title: backendCourse.expert.title || 'Instructor',
        bio: backendCourse.expert.bio || 'No bio available',
        photo: backendCourse.expert.avatar || '',
      }
    : { name: 'Unknown', title: 'Instructor', bio: '', photo: '' },
  rating: backendCourse.rating || 0,
  students: backendCourse.enrolledStudents || 0,
  progress: 0,
  price: '$99',
  originalPrice: 0,
  language: 'English',
  level: 'Beginner',
  certificate: true,
  image: backendCourse.thumbnail || '',
  outcomes: [],
  modules_detail: backendCourse.modules.map((module: BackendModule, index: number) => ({
    week: index + 1,
    title: module.title || `Module ${index + 1}`,
    lessons: module.lessons.map((lesson: BackendLesson) => ({
      ...lesson,
      duration: validateDuration(lesson.duration),
      videoUrl: lesson.videoUrl || lesson.content || null,
    })),
    duration: validateDuration(module.duration || 'Unknown'),
  })),
  reviews: [],
});

export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const response = await api.get<CoursesResponse>('/courses');
    return response.data.courses.map(mapToFrontendCourse);
  } catch (error) {
    throw new Error('Failed to fetch courses');
  }
};

export const getCourseById = async (courseId: string): Promise<Course> => {
  try {
    const response = await api.get<CourseResponse>(`/courses/${courseId}`);
    return mapToFrontendCourse(response.data.course);
  } catch (error) {
    throw new Error('Failed to fetch course');
  }
};

export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await api.get<CoursesResponse>('/courses');
    const categories = Array.from(
      new Set(response.data.courses.map((course) => 'General'))
    );
    return ['All', ...categories];
  } catch (error) {
    return ['All', 'General'];
  }
};

export const enrollCourse = async (courseId: string, userId: string): Promise<void> => {
  try {
    const response = await api.put(`/courses/${courseId}/enroll`, { userId });
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to enroll in course');
    }
  } catch (error) {
    throw new Error('Failed to enroll in course');
  }
};

export const getUserEnrolledCourses = async (userId: string): Promise<Course[]> => {
  try {
    const response = await api.get(`/courses/${userId}/enrolled`);
    const enrollments = response.data.data || [];
    if (!Array.isArray(enrollments)) {
      throw new Error('Invalid response format: data is not an array');
    }
    return enrollments.map(enrollment => mapToFrontendCourse(enrollment.course));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch enrolled courses');
  }
};
