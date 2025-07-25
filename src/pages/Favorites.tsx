import { useState } from "react";
import { Star, Clock, Users, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/contexts/FavoritesContext";
import { motion, AnimatePresence } from "framer-motion";

const Favorites = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { favorites, isFavorite } = useFavorites();

  const filteredCourses = favorites.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Header */}
      <motion.div
        className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between p-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <SidebarTrigger />
          </motion.div>
          <motion.h1
            className="text-xl font-semibold text-foreground"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
          >
            My Interests
          </motion.h1>
          <div className="w-10" />
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-6">
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
           

            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-primary">
            Courses You Loved
            </h1>
          </motion.div>

      <motion.p
        className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Quickly access your most loved courses and continue learning at your own pace.
      </motion.p>
    </div>

          
        </motion.div>        

        
        {/* Filters */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeInOut" }}
        >
          <div className="flex-1">
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </motion.div>

        {/* Content */}
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: "easeInOut" }}
          >
            <Card className="text-center py-8">
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">No interests yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring courses and add them to your interests to see them here.
                  </p>
                  <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5, ease: "easeInOut" }}
          >
            <motion.div
              className="flex justify-between items-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6, ease: "easeInOut" }}
            >
              <p className="text-sm text-muted-foreground">
                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7, ease: "easeInOut" }}
            >
              <AnimatePresence>
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1, ease: "easeInOut" }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      transition: { duration: 0.3, ease: "easeInOut" }
                    }}
                  >
                    <Card 
                      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      <div className="relative">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <FavoriteButton course={course} />
                        </div>
                        <Badge className="absolute top-2 left-2">
                          {course.status}
                        </Badge>
                      </div>
                      
                      <CardHeader className="space-y-2">
                        <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{course.rating}</span>
                            <span className="text-muted-foreground">({course.enrolledStudents})</span>
                          </div>
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{course.duration}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{course.expert?.name || "Unknown"}</span>
                          </div>
                          <div className="text-lg font-semibold text-primary">
                            ${course.price || "Free"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Favorites;