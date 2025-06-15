
import coursesData from "./courses.json";
import type { Course } from "./types/course";

export const coursesDataRecord: Record<string, Course> = coursesData.courses as Record<string, Course>;

export const enrolledCoursesData = coursesData.enrolledCourses;

export const getCourseById = (id: string): Course | undefined => {
  return coursesDataRecord[id];
};

export const getAllCourses = (): Course[] => {
  return Object.values(coursesDataRecord);
};
