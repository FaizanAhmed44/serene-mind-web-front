
import coursesData from "./courses.json";

export interface Course {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  duration: string;
  modules: number;
  category: string;
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
  language: string;
  level: string;
  certificate: boolean;
  image: string;
  outcomes: string[];
  modules_detail: {
    week: number;
    title: string;
    lessons: string[];
    duration: string;
  }[];
  reviews: {
    name: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export const coursesDataRecord: Record<string, Course> = coursesData.courses;

export const enrolledCoursesData = coursesData.enrolledCourses;

export const getCourseById = (id: string): Course | undefined => {
  return coursesDataRecord[id];
};

export const getAllCourses = (): Course[] => {
  return Object.values(coursesDataRecord);
};
