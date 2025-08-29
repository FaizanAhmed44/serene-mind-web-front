
import { motion } from "framer-motion";
import { Calendar, Star, Clock, Users } from "lucide-react";
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
    duration:string;
    rating: number;
    description: string;
  };
}

export const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="h-full"
    >
      <Card className="h-full flex flex-col group relative overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
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
          <motion.div
            className="absolute top-3 right-3 bg-primary/10 backdrop-blur-sm rounded-full px-2 py-1 z-20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <span className="text-xs font-medium text-primary">Enrolled</span>
          </motion.div>
          <motion.img
            src={course.thumbnail}
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
              {course.description}
            </p>
          </motion.div>


          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">{course.rating}</span>
              <span>({course.students})</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
          </div>    

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <Link to={`/courses/${course.id}`} state={{ isEnrolled: true }} className="block">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all duration-300 group-hover:shadow-primary/25"
                  size="sm"
                >
                  Continue Learning
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};
