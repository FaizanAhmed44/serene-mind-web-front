
import coursesData from "./courses.json";
import type { Course } from "./types/course";

export const coursesDataRecord: Record<string, Course> = Object.fromEntries(
  Object.entries(coursesData.courses as Record<string, any>).map(([key, course]) => [
    key,
    {
      ...course,
      id: String(course.id) // Ensure id is string
    }
  ])
);

export const enrolledCoursesData = coursesData.enrolledCourses;

export const getCourseById = (id: string): Course | undefined => {
  return coursesDataRecord[id];
};

export const getAllCourses = (): Course[] => {
  return Object.values(coursesDataRecord);
};
