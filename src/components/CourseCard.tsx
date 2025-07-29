
import { motion } from "framer-motion";
import { Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    thumbnail: string;
    publishedWeeksAgo: number;
    students: number;
    description: string;
  };
}

export const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
      className="h-full"
    >
      <Card className="h-full flex flex-col shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden bg-white border border-gray-200 rounded-brand">
        <motion.div
          className="relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0"
            whileHover={{ opacity: 0.3 }}
            transition={{ duration: 0.3 }}
          />
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover transition-transform duration-300"
          />
        </motion.div>
        
        <CardHeader className="pb-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <CardTitle className="text-lg font-semibold text-foreground line-clamp-2 leading-tight">
              {course.title}
            </CardTitle>
          </motion.div>
        </CardHeader>
        
        <CardContent className="flex-1 pb-4">
          <motion.p
            className="text-sm text-muted-foreground line-clamp-3 leading-relaxed"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {course.description}
          </motion.p>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4 pt-0">
          <motion.div
            className="flex items-center justify-between w-full text-xs text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Published: {course.publishedWeeksAgo} weeks ago</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{course.students.toLocaleString()} Students</span>
            </div>
          </motion.div>
          
          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Link to={`/courses/${course.id}`} state={{ isEnrolled: true }}>
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
              >
                View Course
              </Button>
            </Link>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
