import React, { useState } from "react";
import { Course } from "@/data/types/course";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CoursesExpertAPI } from "@/api/courses";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Search, X,Star, Clock } from "lucide-react";
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="h-full"
    >
      <div className="h-full flex flex-col group relative overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg rounded-lg">
        {/* Course Thumbnail with Overlay */}
        <motion.div
          className="relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 z-10"
            transition={{ duration: 0.3 }}
          />
          {isEnrolled && (
            <motion.div
              className="absolute top-3 right-3 bg-primary/10 backdrop-blur-sm rounded-full px-2 py-1 z-20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <span className="text-xs font-medium text-primary">Enrolled</span>
            </motion.div>
          )}
          <motion.img
            src={course.thumbnail || "/placeholder-image.jpg"}
            alt={`${course.title} course thumbnail`}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
        
        {/* Course Content */}
        <div className="flex flex-col flex-1 p-5">
          {/* Title Section */}
          <motion.div
            className="mb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300">
              {course.title}
            </h3>
          </motion.div>
          
          {/* Description */}
          <motion.div
            className="mb-4 flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {truncateWords(course.description || "No description available", 15)}
            </p>
          </motion.div>

          {/* Stats Section */}
          {/* <motion.div
            className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/30 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="text-center">
              <div className="text-sm font-semibold text-foreground">{course.rating || "N/A"}</div>
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                Rating
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold text-foreground">{course.enrolledStudents || 0}</div>
              <div className="text-xs text-muted-foreground">Students</div>
            </div>
          </motion.div> */}

          {/* Rating and Duration */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">{course.rating}</span>
              <span>({course.enrolledStudents})</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
          </div>

          {/* Duration and Price */}
          <motion.div
            className="flex items-center justify-between text-sm text-muted-foreground mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
          >
            <span>{course.duration || "N/A"}</span>
            <span className="font-semibold text-primary">
              {course.price ? `$${course.price}` : "Free"}
            </span>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Link to={`/courses/${course.id}`} state={{ isEnrolled: isEnrolled }} className="block">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  className="w-full py-1.5 px-4 bg-gradient-to-r from-primary to-primary/70 text-white font-semibold rounded-lg shadow-md hover:from-primary hover:to-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-all duration-300"
                  type="button"
                >
                  {isEnrolled ? "Continue Course" : "Enroll Now"}
                </button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
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
              Courses
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
      className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Header */}
      <motion.div
        className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm"
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
      <div className="p-6 space-y-12">
        {/* Header */}
        <motion.div
          className="text-center space-y-8 py-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="space-y-6">
            <motion.div
              className="flex items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-secondary/30 blur-3xl rounded-full scale-150 opacity-70" />
                <h1 className="relative text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent leading-tight">
                  Mental Wellness Courses
                </h1>
              </div>
            </motion.div>
            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Explore curated courses designed to elevate your mental wellness and career growth. 
              Expert-led programs for lasting transformation.
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
          className="grid grid-cols-1 gap-x-2 gap-y-24 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-5"
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
