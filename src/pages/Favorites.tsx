import { useState } from "react";
import { Star, Clock, Users, BookOpen, Search, X } from "lucide-react";
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
          <motion.div whileHover={{ rotate: 360 }}
          transition={{ duration: 0.4 }}>
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
        {/* Title & Search */}
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Courses You Loved
              </h1>
            </motion.div>
            <motion.p
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Access your favorite courses instantly and continue your learning journey at your own pace.
            </motion.p>
          </div>

          {/* Search Bar */}
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
          </motion.div>
        </motion.div>

        {/* Content */}
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card className="text-center py-8 shadow-sm">
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                      transition: { duration: 0.3 }
                    }}                    

                  >
                    <Card
                      className="overflow-hidden rounded-2xl bg-card hover:shadow-xl transition-all duration-300 cursor-pointer border"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      <div className="relative">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                        <div className="absolute top-2 right-2">
                          <FavoriteButton course={course} />
                        </div>
                        <Badge className="absolute bottom-2 left-2 bg-primary/90 text-white shadow-sm">
                          {course.status}
                        </Badge>
                      </div>

                      <CardHeader className="p-4 space-y-1">
                        <CardTitle className="text-lg font-semibold leading-snug line-clamp-2">
                          {course.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {course.description}
                        </p>
                      </CardHeader>

                      <CardContent className="p-4 pt-0 space-y-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
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

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{course.expert?.name || "Unknown"}</span>
                          </div>
                          <div className="text-lg font-bold text-primary">
                            {course.price ? `$${course.price}` : "Free"}
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
