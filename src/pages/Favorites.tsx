
import { useState } from "react";
import { Heart, Clock, Book, Star, User, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock favorite courses data
const favoriteCourses = [
  {
    id: 1,
    title: "Overcoming Anxiety",
    description: "Learn practical techniques to manage and reduce anxiety in daily life",
    duration: "6 weeks",
    modules: 12,
    category: "Anxiety",
    instructor: "Dr. Sarah Johnson",
    rating: 4.8,
    students: 2847,
    progress: 0,
    dateAdded: "2024-01-15",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=250&fit=crop"
  },
  {
    id: 2,
    title: "Confident Public Speaking",
    description: "Build confidence and overcome fear of public speaking",
    duration: "4 weeks",
    modules: 8,
    category: "Confidence",
    instructor: "Mark Thompson",
    rating: 4.9,
    students: 1924,
    progress: 65,
    dateAdded: "2024-01-10",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=250&fit=crop"
  },
  {
    id: 4,
    title: "Managing Depression",
    description: "Evidence-based strategies for understanding and managing depression",
    duration: "8 weeks",
    modules: 16,
    category: "Depression",
    instructor: "Dr. Michael Rodriguez",
    rating: 4.9,
    students: 3201,
    progress: 0,
    dateAdded: "2024-01-05",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=250&fit=crop"
  }
];

const categories = ["All Categories", "Anxiety", "Confidence", "Decision Making", "Depression", "Stress Management"];
const sortOptions = [
  { value: "recent", label: "Recently Added" },
  { value: "alphabetical", label: "Alphabetical" },
  { value: "rating", label: "Highest Rated" },
  { value: "progress", label: "Progress" }
];

const Favorites = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("recent");

  const filteredCourses = favoriteCourses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "rating":
          return b.rating - a.rating;
        case "progress":
          return b.progress - a.progress;
        case "recent":
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });

  const removeFavorite = (courseId: number) => {
    // In a real app, this would update the favorites in state management or backend
    console.log(`Removing course ${courseId} from favorites`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <div className="text-center">
            <h1 className="text-lg font-semibold text-foreground">My Favorites</h1>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center py-6 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-red-500 mr-3" />
            <h1 className="text-3xl font-bold text-foreground">Favorite Courses</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Keep track of courses you love and want to revisit. Your personal learning collection.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            {favoriteCourses.length} {favoriteCourses.length === 1 ? 'course' : 'courses'} saved
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg p-6 shadow-sm animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search your favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Favorites Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchQuery || selectedCategory !== "All Categories" ? "No matching favorites" : "No favorites yet"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedCategory !== "All Categories" 
                ? "Try adjusting your search or filter criteria" 
                : "Start adding courses to your favorites to see them here"}
            </p>
            <Button asChild>
              <Link to="/">Browse Courses</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover-lift cursor-pointer group relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFavorite(course.id);
                  }}
                >
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </Button>
                
                <Link to={`/courses/${course.id}`}>
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute bottom-3 left-3 bg-primary text-primary-foreground">
                      {course.category}
                    </Badge>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Book className="h-4 w-4" />
                        <span>{course.modules} modules</span>
                      </div>
                    </div>
                    
                    {course.progress > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span className="text-sm">{course.students.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>by {course.instructor}</span>
                      <span>Added {new Date(course.dateAdded).toLocaleDateString()}</span>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      variant={course.progress > 0 ? "default" : "outline"}
                    >
                      {course.progress > 0 ? "Continue Learning" : "Start Course"}
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
