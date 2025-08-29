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
      className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="sticky top-0 z-20 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <SidebarTrigger />
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                My Learning Journey
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {enrolledCourses.length} course{enrolledCourses.length !== 1 ? 's' : ''} enrolled
              </p>
            </motion.div>
            <div className="w-10" />
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5" />
        <div className="container mx-auto px-4 py-12 relative">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                  Continue
                </span>
                <br />
                <span className="text-foreground">Your Learning</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Access your enrolled courses and track your progress on your mental wellness journey
              </p>
            </motion.div>

            {/* Enhanced Search Bar */}
            <motion.div
              className="max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 p-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search your enrolled courses..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-12 pr-12 py-3 bg-transparent border-0 text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50"
                        onClick={handleClearSearch}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 pb-12">
        {enrolledCourses.length === 0 ? (
          <motion.div
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl blur-xl" />
              <Card className="relative bg-background/80 backdrop-blur-sm border-border/50 text-center py-12 shadow-lg">
                <CardContent className="space-y-6">
                  <motion.div
                    className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mx-auto mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <BookOpen className="h-10 w-10 text-primary" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Ready to Start Learning?
                    </h3>
                    <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                      Discover expert-led courses designed to support your mental wellness journey.
                    </p>
                    <Button 
                      onClick={() => navigate("/courses")}
                      className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Explore Courses
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ) : filteredCourses.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms to find your enrolled courses.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <div className="mb-8">
              <motion.h3
                className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
              >
                Your Enrolled Courses
              </motion.h3>
            </div>
            
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
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
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 30, scale: 0.9 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.9 + index * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        <div className="relative">
                          <CourseCard
                            course={{
                              id: enrollment.course.id,
                              title: enrollment.course.title,
                              thumbnail: enrollment.course.thumbnail,
                              publishedWeeksAgo: weeksAgo,
                              students: enrollment.course.enrolledStudents,
                              description: enrollment.course.description,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EnrolledCourses;
