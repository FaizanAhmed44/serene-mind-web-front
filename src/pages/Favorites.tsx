import { useState } from "react";
import { Star, Clock, Users, BookOpen, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "@/contexts/FavoritesContext";
import { motion, AnimatePresence } from "framer-motion";
import { CoursesExpertAPI } from "@/api/courses";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { CustomLoader } from "@/components/CustomLoader";

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const { favorites, isFavorite } = useFavorites();

  const { data: enrolledCourses = [], isLoading: enrolledLoading } = useQuery({
    queryKey: ["enrolledCourses", user?.id],
    queryFn: () => CoursesExpertAPI.getEnrollment(user?.id || ""),
    enabled: !!user?.id,
  });

  const filteredCourses = favorites.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  
  if (enrolledLoading) {
    return (
      <motion.div
        className="min-h-screen bg-background relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
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
              className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              My Interest
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
          <div className="text-lg text-muted-foreground">Loading Interests...</div>
        </motion.div>
      </motion.div>
    );        
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >

    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
    </div>

      <motion.div
        className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between p-4">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            <SidebarTrigger />
          </motion.div>
          <motion.h1
            className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            My Interest   
          </motion.h1>
          <div className="w-10" />
        </div>
      </motion.div>            


      <div className="container mx-auto px-4 py-8">
        {/* Title & Search */}
        <motion.div
          className="text-center space-y-8 py-8 mb-12"
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
                  Courses You Loved
                </h1>
              </div>
            </motion.div>
            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Access your favorite courses instantly and continue your learning journey at your own pace.
              Your curated collection of transformative experiences.
            </motion.p>
          </div>

          {favorites.length === 0  ? <div></div> : (        
          <motion.div
            className="max-w-full sm:max-w-lg mx-auto flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search favorite courses..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-10"
              />
              {searchTerm && (
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
          </motion.div>)  }
          
        </motion.div>

        {/* Content */}
        {favorites.length === 0 ? (
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
                  <h3 className="text-2xl font-bold text-foreground">Discover Your Interests</h3>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                    Start exploring courses and add them to your interests to create your personalized learning collection.
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
        ) : filteredCourses.length === 0 ? (
          <motion.div
            className="text-center py-12 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            No favorite courses found matching your search.
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <motion.div
            
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <AnimatePresence>
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
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
                          className="absolute top-3 right-3 z-20"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          <FavoriteButton course={course} />
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

                        {/* Expert and Price */}
                        <motion.div
                          className="flex items-center justify-between mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 }}
                        >
                          <div className="flex items-center space-x-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground font-medium">{course.expert?.name || "Unknown"}</span>
                          </div>
                          <div className="text-lg font-bold text-primary">
                            {course.price ? `$${course.price}` : "Free"}
                          </div>
                        </motion.div>

                        {/* Action Button */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                          >
                        <button
                        onClick={() => navigate(`/courses/${course.id}` ,{ state: { isEnrolled: enrolledCourses.some((c: any) => c.courseId === course.id)  } })}
                        className="w-full py-1.5 px-4 bg-gradient-to-r from-primary to-primary/70 text-white font-semibold rounded-lg shadow-md hover:from-primary hover:to-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-all duration-300"
                        type="button"
                        >
                          View Course
                        </button>

                            {/* <Button
                              onClick={() => navigate(`/courses/${course.id}` ,{ state: { isEnrolled: enrolledCourses.some((c: any) => c.courseId === course.id)  } })}
                              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all duration-300 group-hover:shadow-primary/25"
                              size="sm"
                            >
                              View Course
                            </Button> */}
                          </motion.div>
                        </motion.div>
                      </div>
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
