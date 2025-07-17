
import { useState } from "react";
import { Star, Clock, Users, BookOpen, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useNavigate } from "react-router-dom";
import { useFavoriteCourses } from "@/hooks/useFavoriteCourses";
import { useCategories } from "@/hooks/useIndexCourses";

const Favorites = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: favoriteCourses = [], isLoading, error } = useFavoriteCourses();

  const filteredCourses = favoriteCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">My Interests</h1>
            <div className="w-10" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">Loading your interests...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold">My Interests</h1>
            <div className="w-10" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-muted-foreground">
            Failed to load your interests. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">My Interests</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Content */}
        {favoriteCourses.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent className="space-y-4">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-2">No interests yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start exploring courses and add them to your interests to see them here.
                </p>
                <Button onClick={() => navigate("/courses")}>Browse Courses</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card 
                  key={course.id} 
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
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;
