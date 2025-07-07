
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";

const EnrolledCourses = () => {
  const course = {
    title: "Cognitive Behavioral Therapy Basics",
    thumbnail: "https://source.unsplash.com/featured/?cbt",
    publishedWeeksAgo: 12,
    students: 2146,
    description:
      "Comprehensive program for understanding and managing anxiety disorders using clinical strategies and CBT frameworks.",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <BookOpen className="h-8 w-8 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground">My Enrolled Courses</h1>
          </div>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <CourseCard course={course} />
          <CourseCard course={course} />
          <CourseCard course={course} />
        </motion.div>
      </div>
    </div>
  );
};

export default EnrolledCourses;
