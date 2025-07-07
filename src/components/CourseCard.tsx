
import { motion } from "framer-motion";
import { Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

interface CourseCardProps {
  course: {
    title: string;
    thumbnail: string;
    publishedWeeksAgo: number;
    students: number;
    description: string;
  };
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const handleViewCourse = () => {
    console.log(`View course: ${course.title}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-full"
    >
      <Card className="h-full flex flex-col shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden bg-white border border-gray-200 rounded-brand">
        <div className="relative overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground line-clamp-2 leading-tight">
            {course.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 pb-4">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {course.description}
          </p>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4 pt-0">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Published: {course.publishedWeeksAgo} weeks ago</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{course.students.toLocaleString()} Students</span>
            </div>
          </div>
          
          <Button 
            onClick={handleViewCourse}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors"
          >
            View Course
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
