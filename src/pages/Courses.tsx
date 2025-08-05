import React, { useState } from "react";
import { Course } from "@/data/types/course";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CoursesExpertAPI } from "@/api/courses";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Search, X,Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomLoader } from "@/components/CustomLoader";

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
  return (
    <motion.div
      className="relative flex flex-col h-full bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, scale: 0.95, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
    >
      {/* Thumbnail with Gradient Overlay */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          alt={course.title}
          loading="lazy"
          width={768}
          height={768}
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          src={course.thumbnail || "/placeholder-image.jpg"} // Fallback image
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="inline-block bg-primary/80 text-white text-xs font-medium px-2 py-1 rounded-full shadow-md">
            {course.status || "Ongoing"}
          </span>
        </div>
      </div>

      {/* Course Details */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{course.duration || "N/A"}</span>
            <span className="text-gray-400">•</span>
            <span>{course.enrolledStudents || 0} Students</span>
          </div>
          {course.rating && (
            <div className="flex items-center gap-1 text-yellow-500">
              <span className="text-sm font-medium">{course.rating}</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
          )}
        </div>

        <Link
          to={`/courses/${course.id}`}
          className="block hover:text-primary transition-colors"
        >
          <h5 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2 mb-2">
            {course.title}
          </h5>
        </Link>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
          {truncateWords(course.description || "No description available", 15)}
        </p>

        {/* Price and Expert */}
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-2 text-gray-500">
            <span className="font-medium text-gray-700">
              {course.expert?.name || "Unknown Expert"}
            </span>
          </div>
          <span className="font-semibold text-primary">
            {course.price ? `$${course.price}` : "Free"}
          </span>
        </div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to={`/courses/${course.id}`} state={{ isEnrolled: isEnrolled }}>
            <button
              className="w-full py-2 px-4 bg-gradient-to-r from-primary to-primary/70 text-white font-semibold rounded-lg shadow-md hover:from-primary hover:to-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-all duration-200"
              type="button"
            >
              {isEnrolled ? "Continue Course" : "Enroll Now"}
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
  const { data: enrolledCourses = [], isLoading: enrolledLoading } = useQuery({
    queryKey: ["enrolledCourses", user?.id],
    queryFn: () => CoursesExpertAPI.getEnrollment(user?.id || ""),
    enabled: !!user?.id,
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Filter courses based on search query
  const filteredCourses = courses?.filter(
    (course: Course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (isLoading || enrolledLoading) {
    return (
      <motion.div
        className="min-h-screen bg-background relative"
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
          className="absolute inset-0 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <CustomLoader />
          <motion.div
            className="text-lg text-muted-foreground"
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
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
          {/* Search Bar */}
          <motion.div
            className="max-w-full sm:max-w-lg mx-auto flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={handleClearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          className="container mx-auto grid grid-cols-1 gap-x-2 gap-y-24 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <AnimatePresence>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course: Course, index: number) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1, ease: "easeOut" }}
                >
                  <CourseCard course={course} isEnrolled={enrolledCourses.some((c: any) => c.courseId === course.id)} />
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full text-center text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                No courses found matching your search.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
