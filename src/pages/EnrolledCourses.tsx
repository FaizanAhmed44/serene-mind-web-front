import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, X } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { CoursesExpertAPI } from "@/api/courses";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CustomLoader } from "@/components/CustomLoader";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  rating?: number;
  enrolledStudents: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  verified?: string;
  reason?: string | null;
}

interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  course: Course;
}

const EnrolledCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: enrolledCourses = [], isLoading, error } = useQuery<Enrollment[]>({
    queryKey: ["enrolledCourses", user?.id],
    queryFn: () => CoursesExpertAPI.getEnrollment(user?.id || ""),
    enabled: !!user?.id,
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Filter enrolled courses based on search query
  const filteredCourses = enrolledCourses.filter(
    (enrollment) =>
      enrollment.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enrollment.course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <motion.div
        className="min-h-screen bg-background relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between p-4">
            <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.4 }}
              
            >
              <SidebarTrigger />
            </motion.div>
            <motion.h1
              className="text-xl font-semibold text-foreground truncate"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Enrolled Courses
            </motion.h1>
            <div className="w-10" />
          </div>
        </motion.div>
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <CustomLoader />
          <div className="text-lg text-muted-foreground">Loading enrolled courses...</div>
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-12">
          <motion.div
            className="text-center text-red-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Error: {error.message}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center justify-between p-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.4 }}
          >
            <SidebarTrigger />
          </motion.div>
          <motion.h1
            className="text-xl font-semibold text-foreground"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            My Enrolled Courses
          </motion.h1>
          <div className="w-10" />
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          className="text-center space-y-8 py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-secondary/30 blur-3xl rounded-full scale-150 opacity-70" />
              <h1 className="relative text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/90 to-secondary bg-clip-text text-transparent leading-tight">
                Your Learning Journey
              </h1>
            </div>
          </motion.div>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            Explore and continue learning with the courses you've joined to support your personal growth and mental well-being.
            Transform your potential into progress.
          </motion.p>
          {/* Search Bar */}
          <motion.div
            className="max-w-full sm:max-w-lg mx-auto flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search enrolled courses..."
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

        {enrolledCourses.length === 0 ? 
        
        (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="text-center py-16 shadow-elegant border-0 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm">
                <CardContent className="space-y-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl rounded-full scale-150 opacity-60" />
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 mx-auto border border-primary/20">
                      <BookOpen className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">Start Your Learning Adventure</h3>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                      No enrolled courses yet. Start exploring courses and enroll to begin your transformative learning journey.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button 
                        onClick={() => navigate("/courses")}
                        size="lg"
                        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg"
                      >
                        Browse Courses
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
        ) 
        
        : filteredCourses.length === 0 ? (
          <motion.div
            className="text-center py-12 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            No enrolled courses found matching your search.
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <AnimatePresence>
              {filteredCourses.map((enrollment, index) => {
                const weeksAgo = Math.floor(
                  (new Date().getTime() - new Date(enrollment.course.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24 * 7)
                );
                return (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  >
                    <CourseCard
                      course={{
                        id: enrollment.course.id,
                        title: enrollment.course.title,
                        thumbnail: enrollment.course.thumbnail,
                        publishedWeeksAgo: weeksAgo,
                        students: enrollment.course.enrolledStudents,
                        description: enrollment.course.description,
                        rating:enrollment.course.rating,
                        duration:enrollment.course.duration,
                      }}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EnrolledCourses;
