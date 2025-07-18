import { motion, AnimatePresence } from "framer-motion";
import { BookOpen } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { CoursesExpertAPI } from "@/api/courses";

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
  const { data: enrolledCourses = [], isLoading, error } = useQuery<Enrollment[]>({
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
          className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between p-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <SidebarTrigger />
            </motion.div>
            <motion.h1
              className="text-xl font-semibold text-foreground truncate"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Loading...
            </motion.h1>
            <div className="w-10" />
          </div>
        </motion.div>
        <motion.div
          className="container mx-auto px-4 py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="text-center text-muted-foreground">
            Loading enrolled courses...
          </div>
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
      className="min-h-screen bg-background"
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
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
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

      <div className="container mx-auto px-4 ">
        <motion.div
          className="text-center space-y-6 py-6"
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
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-primary">
              Empower Your Learning Journey
            </h1>
          </motion.div>
          <motion.p
          
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            Explore and continue learning with the courses you've joined to support your personal growth and mental well-being.
          </motion.p>
        </motion.div>

        {enrolledCourses.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <motion.p
              className="text-muted-foreground font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              No enrolled courses yet.
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <AnimatePresence>
              {enrolledCourses.map((enrollment, index) => {
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



