

import React from "react";
import { Course } from "@/data/types/course";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CoursesExpertAPI } from "@/api/courses";
import { useQuery } from "@tanstack/react-query";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

// Card component for a single course
interface CourseCardProps {
  course: Course;
  isEnrolled: boolean;
}

function truncateWords(text: string, wordLimit: number): string {
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "…";
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isEnrolled }) => {
  console.log(isEnrolled);
  return (
    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md border hover:translate-y-[-6px] transition-all duration-300 h-full">
      <div className="relative bg-clip-border mx-4 rounded-xl overflow-hidden mt-4 transition-all duration-300 bg-white text-gray-700 shadow-lg">
        <img
          alt={course.title}
          loading="lazy"
          width={768}
          height={768}
          decoding="async"
          className="h-full w-full object-cover "
          src={course.thumbnail}
          style={{ color: "transparent" }}
        />
      </div>
      {/* Make the content area a flex column that grows, so the button is always at the bottom */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2">
          <p className="block antialiased font-sans text-sm leading-normal mb-2 font-normal text-gray-500">
            {course.status} • {course.duration} • {course.enrolledStudents} Students
          </p>
        </div>
        <a
          href={`/courses/${course.id}`}
          className="text-blue-gray-900 transition-colors hover:text-gray-900"
        >
          <h5 className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-inherit mb-2 normal-case">
            {course.title}
          </h5>
        </a>
        <p className="block antialiased font-sans text-sm leading-relaxed text-inherit mb-6 font-normal !text-gray-500">
          {truncateWords(course.description, 10)}
        </p>
        {/* Spacer to push button to bottom */}
        <div className="flex-1 flex items-center justify-center"></div>
        <Link to={`/courses/${course.id}`} state={{ isEnrolled: isEnrolled }}>
          <button
            className="align-middle w-full select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg border border-gray-900 text-gray-900 hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] mt-4"
            type="button"
          >
            {isEnrolled ? "Go to Course" : "Enroll Now"}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default function Courses() {

  const { data: courses, isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: () => CoursesExpertAPI.getCourses(),
  });

  const { user } = useAuth();
  console.log(user);
  const { data: enrolledCourses = [], isLoading: enrolledLoading } = useQuery({
    queryKey: ["enrolledCourses", user?.id],
    queryFn: () => CoursesExpertAPI.getEnrollment(user?.id || ""),
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold truncate">Loading...</h1>
            <div className="w-10" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">Loading courses...</div>
        </div>
      </div>
    );
  }

  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">Courses</h1>
          <div className="w-10" />
        </div>
      </div>
      <div className="my-10">
        <div className="container mx-auto grid grid-cols-1 gap-x-2 gap-y-24 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-6">
          {courses.map((course : Course) => (
            <>
            <CourseCard key={course.id} course={course} isEnrolled={enrolledCourses.some((c: any) => c.courseId === course.id)} /></>
          ))}
        </div>
      </div>
    </>
  );
}