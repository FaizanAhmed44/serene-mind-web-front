// // export interface BackendLesson {
// //   id: string;
// //   title: string;
// //   duration: string;
// //   videoUrl?: string | null;
// //   content?: string | null;
// //   type: 'video' | 'text';
// //   orderIndex: number;
// // }

// // export interface BackendModule {
// //   id: string;
// //   title: string;
// //   duration?: string;
// //   lessons: BackendLesson[];
// //   orderIndex: number;
// //   description?: string;
// //   courseId: string;
// //   createdAt: string;
// //   updatedAt: string;
// // }

// // export interface BackendCourse {
// //   id: string;
// //   title: string;
// //   description: string;
// //   duration: string;
// //   thumbnail: string;
// //   rating: number;
// //   enrolledStudents: number;
// //   status: string;
// //   expertId?: string;
// //   createdAt: string;
// //   updatedAt: string;
// //   verified: boolean;
// //   expert?: {
// //     name: string;
// //     title: string;
// //     bio: string;
// //     avatar: string;
// //   };
// //   modules: BackendModule[];
// //   _count?: {
// //     modules: number;
// //   };
// //   category?: string;
// //   price?: string;
// //   language?: string;
// //   level?: string;
// //   certificate?: boolean;
// // }

// // export interface CoursesResponse {
// //   message: string;
// //   courses: BackendCourse[];
// // }

// // export interface CourseResponse {
// //   message: string;
// //   course: BackendCourse;
// // }

// // export interface ModuleDetail {
// //   week: number;
// //   title: string;
// //   lessons: string[]; // Lesson titles
// //   duration: string;
// //   videoUrl?: string; // First video URL for the module
// // }

// // export interface Course {
// //   id: string;
// //   title: string;
// //   description: string;
// //   longDescription: string;
// //   duration: string;
// //   modules: number;
// //   category: string;
// //   instructor: {
// //     name: string;
// //     title: string;
// //     bio: string;
// //     photo: string;
// //   };
// //   rating: number;
// //   students: number;
// //   progress: number;
// //   price: string;
// //   originalPrice?: string;
// //   language: string;
// //   level: string;
// //   certificate: boolean;
// //   image: string;
// //   outcomes: string[];
// //   modules_detail: ModuleDetail[];
// //   reviews: Array<{
// //     id: string;
// //     rating: number;
// //     comment: string;
// //     user: string;
// //     date: string;
// //   }>;
// //   backendModules: BackendModule[]; // Add to store full module data
// // }

// // export const validateDuration = (duration: string): string => {
// //   const isValid = /^(\d+\s*(hours?|minutes?|hrs?|mins?)\s*)*$/i.test(duration);
// //   return isValid ? duration : 'Unknown';
// // };

// // export const mapToFrontendCourse = (backendCourse: BackendCourse): Course => ({
// //   id: backendCourse.id,
// //   title: backendCourse.title,
// //   description: backendCourse.description,
// //   longDescription: backendCourse.description,
// //   duration: validateDuration(backendCourse.duration),
// //   modules: backendCourse._count?.modules || backendCourse.modules.length,
// //   category: backendCourse.category || 'General',
// //   instructor: backendCourse.expert
// //     ? {
// //         name: backendCourse.expert.name,
// //         title: backendCourse.expert.title,
// //         bio: backendCourse.expert.bio,
// //         photo: backendCourse.expert.avatar,
// //       }
// //     : { name: 'Unknown', title: 'Instructor', bio: '', photo: '' },
// //   rating: backendCourse.rating,
// //   students: backendCourse.enrolledStudents,
// //   progress: 0,
// //   price: backendCourse.price || '$99',
// //   originalPrice: backendCourse.price ? `$${parseInt(backendCourse.price.replace('$', '')) * 1.2}` : undefined,
// //   language: backendCourse.language || 'English',
// //   level: backendCourse.level || 'Beginner',
// //   certificate: backendCourse.certificate ?? true,
// //   image: backendCourse.thumbnail,
// //   outcomes: [],
// //   modules_detail: backendCourse.modules.map((module: BackendModule, index: number) => ({
// //     week: index + 1,
// //     title: module.title,
// //     lessons: module.lessons.map(lesson => lesson.title),
// //     duration: validateDuration(module.duration || 'Unknown'),
// //     videoUrl: module.lessons.find(lesson => lesson.type === 'video' && (lesson.videoUrl || lesson.content))?.videoUrl ||
// //               module.lessons.find(lesson => lesson.type === 'video' && lesson.content)?.content ||
// //               'https://example.com/placeholder-video.mp4',
// //   })),
// //   reviews: [],
// //   backendModules: backendCourse.modules, // Store full module data
// // });



// // ll
// export interface BackendLesson {
//   id: string;
//   title: string;
//   type: string;
//   duration: string;
//   orderIndex: number;
//   content?: string;
//   textContent?: string | null;
//   videoUrl?: string | null;
// }

// export interface BackendModule {
//   id: string;
//   title: string;
//   description?: string;
//   duration?: string;
//   orderIndex: number;
//   courseId: string;
//   createdAt: string;
//   updatedAt: string;
//   lessons: BackendLesson[];
// }

// export interface BackendCourse {
//   id: string;
//   title: string;
//   description: string;
//   duration: string;
//   thumbnail: string;
//   rating: number;
//   enrolledStudents: number;
//   status: string;
//   expertId: string;
//   createdAt: string;
//   updatedAt: string;
//   verified: boolean;
//   modules: BackendModule[];
//   _count?: {
//     modules: number;
//   };
//   expert?: {
//     id: string;
//     name: string;
//     title: string;
//     avatar: string;
//     bio: string;
//     specializations: string[];
//     rating: number;
//   };
// }

// export interface Course {
//   id: string;
//   title: string;
//   description: string;
//   longDescription: string;
//   duration: string;
//   modules: number;
//   category: string;
//   instructor: {
//     name: string;
//     title: string;
//     bio: string;
//     photo: string;
//   };
//   rating: number;
//   students: number;
//   progress?: number;
//   price: string;
//   originalPrice?: number;
//   language: string;
//   level: string;
//   certificate: boolean;
//   image: string;
//   outcomes: string[];
//   modules_detail: {
//     week: number;
//     title: string;
//     lessons: string[];
//     duration: string;
//   }[];
//   reviews: {
//     name: string;
//     rating: number;
//     comment: string;
//     date: string;
//   }[];
// }

// export interface CoursesResponse {
//   message: string;
//   courses: BackendCourse[];
// }

// export interface CourseResponse {
//   message: string;
//   course: BackendCourse;
// }


export interface BackendLesson {
  id: string;
  title: string;
  type: string;
  duration: string;
  orderIndex: number;
  content?: string;
  textContent?: string | null;
  videoUrl?: string | null;
}

export interface BackendModule {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  orderIndex: number;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  lessons: BackendLesson[];
}

export interface BackendCourse {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  rating: number;
  enrolledStudents: number;
  status: string;
  expertId: string;
  createdAt: string;
  updatedAt: string;
  verified: boolean;
  modules: BackendModule[];
  _count?: {
    modules: number;
  };
  expert?: {
    id: string;
    name: string;
    title: string;
    avatar: string;
    bio: string;
    specializations: string[];
    rating: number;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  duration: string;
  modules: number;
  category?: string; // Optional, as backend may not provide
  instructor: {
    name: string;
    title: string;
    bio: string;
    photo: string;
  };
  rating: number;
  students: number;
  progress?: number;
  price: string;
  originalPrice?: number;
  language?: string; // Optional
  level?: string; // Optional
  certificate?: boolean; // Optional
  image: string;
  outcomes: string[]; // Can be empty
  modules_detail: {
    week: number;
    title: string;
    lessons: BackendLesson[];
    duration: string;
  }[];
  reviews: {
    name: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export interface CoursesResponse {
  message: string;
  courses: BackendCourse[];
}

export interface CourseResponse {
  message: string;
  course: BackendCourse;
}
