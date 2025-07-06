import React from "react";
import { Course } from "@/data/types/course";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CoursesExpertAPI } from "@/api/courses";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div
      className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md border hover:translate-y-[-6px] transition-all duration-300 h-full"
      initial={{ opacity: 0, scale: 0.95, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
    >
      <motion.div
        className="relative bg-clip-border mx-4 rounded-xl overflow-hidden mt-4 transition-all duration-300 bg-white text-gray-700 shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <img
          alt={course.title}
          loading="lazy"
          width={768}
          height={768}
          decoding="async"
          className="h-full w-full object-cover"
          src={course.thumbnail}
          style={{ color: "transparent" }}
        />
      </motion.div>
      {/* Make the content area a flex column that grows, so the button is always at the bottom */}
      <div className="flex flex-col flex-1 p-6">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <p className="block antialiased font-sans text-sm leading-normal mb-2 font-normal text-gray-500">
            {course.status} • {course.duration} • {course.enrolledStudents} Students
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <a
            href={`/courses/${course.id}`}
            className="text-blue-gray-900 transition-colors hover:text-gray-900"
          >
            <h5 className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-inherit mb-2 normal-case">
              {course.title}
            </h5>
          </a>
        </motion.div>
        <motion.p
          className="block antialiased font-sans text-sm leading-relaxed text-inherit mb-6 font-normal !text-gray-500"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {truncateWords(course.description, 10)}
        </motion.p>
        {/* Spacer to push button to bottom */}
        <div className="flex-1 flex items-center justify-center"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to={`/courses/${course.id}`} state={{ isEnrolled: isEnrolled }}>
            <button
              className="align-middle w-full select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-primary text-white hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] mt-4"
              type="button"
            >
              {isEnrolled ? "Go to Course" : "Enroll Now"}
            </button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
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
      <motion.div
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between p-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.4 }}
            >
              <SidebarTrigger />
            </motion.div>
            <motion.h1
              className="text-xl font-semibold truncate"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Loading...
            </motion.h1>
            <div className="w-10" />
          </div>
        </motion.div>
        <motion.div
          className="container mx-auto px-4 py-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div
            className="text-center"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Loading courses...
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  if (error) return <div>Error: {error.message}</div>;

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Header */}
      <motion.div
        className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between p-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.4 }}
          >
            <SidebarTrigger />
          </motion.div>
          <motion.h1
            className="text-xl font-semibold"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Courses
          </motion.h1>
          <div className="w-10" />
        </div>
      </motion.div>
      <div className="p-6 space-y-8">
        {/* Header */}
        <motion.div
          className="text-center space-y-6 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          
          <div className="space-y-3">
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
           

            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-primary">
            Mental Wellness Courses
            </h1>
          </motion.div>

      <motion.p
        className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Explore curated courses designed to elevate your skills and career.
      </motion.p>
    </div>

          
        </motion.div>        

        {/* Courses Grid */}
        <motion.div
          className="container mx-auto grid grid-cols-1 gap-x-2 gap-y-24 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <AnimatePresence>
            {courses.map((course: Course, index: number) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1, ease: "easeOut" }}
              >
                <CourseCard course={course} isEnrolled={enrolledCourses.some((c: any) => c.courseId === course.id)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}