
import React from "react";
import { BookOpen } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CoursesExpertAPI } from "@/api/courses";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

// Card component for an enrolled course
interface EnrolledCourseCardProps {
  course: any;
}

const EnrolledCourseCard: React.FC<EnrolledCourseCardProps> = ({ course }) => {
  return (
    <motion.div
      className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md border hover:translate-y-[-6px] transition-all duration-300 h-full cursor-pointer"
      initial={{ opacity: 0, scale: 0.95, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
    >
      <Link to={`/courses/${course.courseId}`} state={{ isEnrolled: true }} className="block h-full">
        <motion.div
          className="relative bg-clip-border mx-4 rounded-xl overflow-hidden mt-4 transition-all duration-300 bg-white text-gray-700 shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <img
            alt={course.title || "Course"}
            loading="lazy"
            width={768}
            height={768}
            decoding="async"
            className="h-48 w-full object-cover"
            src={course.thumbnail || "/placeholder.svg"}
            style={{ color: "transparent" }}
          />
        </motion.div>
        
        <div className="flex flex-col flex-1 p-6">
          <motion.div
            className="flex items-center gap-2 mb-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {course.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {course.category}
              </span>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h5 className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-inherit mb-2 normal-case line-clamp-2">
              {course.title || "Untitled Course"}
            </h5>
          </motion.div>
          
          {course.progress !== undefined && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-primary">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </motion.div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

// Loading skeleton component
const CourseCardSkeleton = () => (
  <div className="flex flex-col bg-white rounded-xl shadow-md border h-full">
    <div className="mx-4 mt-4">
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
    <div className="p-6 space-y-4">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-2 w-full" />
      </div>
    </div>
  </div>
);

// Empty state component
const EmptyState = () => (
  <motion.div
    className="flex flex-col items-center justify-center py-16 px-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <BookOpen className="w-12 h-12 text-primary" />
    </motion.div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Enrolled Courses</h3>
    <p className="text-gray-500 text-center max-w-md">
      You haven't enrolled in any courses yet. Explore our course catalog to start your learning journey!
    </p>
    <Link
      to="/courses"
      className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
    >
      Browse Courses
    </Link>
  </motion.div>
);

export default function EnrolledCourses() {
  const { user } = useAuth();
  const { data: enrolledCourses = [], isLoading: enrolledLoading } = useQuery({
    queryKey: ["enrolledCourses", user?.id],
    queryFn: () => CoursesExpertAPI.getEnrollment(user?.id || ""),
    enabled: !!user?.id,
  });

  if (enrolledLoading) {
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
          <div className="grid grid-cols-1 gap-x-2 gap-y-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-6">
            {[...Array(6)].map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  }

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
            My Enrolled Courses
          </motion.h1>
          <div className="w-10" />
        </div>
      </motion.div>

      <div className="p-6 space-y-8">
        {/* Page Title */}
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
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <BookOpen className="w-8 h-8 text-primary" />
              </motion.div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-primary">
                My Enrolled Courses
              </h1>
            </motion.div>

            <motion.p
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Continue your learning journey with your enrolled courses.
            </motion.p>
          </div>
        </motion.div>

        {/* Courses Grid or Empty State */}
        {enrolledCourses.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            className="container mx-auto grid grid-cols-1 gap-x-2 gap-y-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <AnimatePresence>
              {enrolledCourses.map((course: any, index: number) => (
                <motion.div
                  key={course.id || index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1, ease: "easeOut" }}
                >
                  <EnrolledCourseCard course={course} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
