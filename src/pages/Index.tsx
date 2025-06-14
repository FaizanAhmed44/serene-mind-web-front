
import { useState } from "react";
import { Search, Clock, Book, Star, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";

const courses = [
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
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=250&fit=crop"
  },
  {
    id: 3,
    title: "Decision Making Mastery",
    description: "Develop clear frameworks for making better decisions",
    duration: "5 weeks",
    modules: 10,
    category: "Decision Making",
    instructor: "Dr. Emily Chen",
    rating: 4.7,
    students: 1563,
    progress: 30,
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=250&fit=crop"
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
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=250&fit=crop"
  }
];

const categories = ["All", "Anxiety", "Confidence", "Decision Making", "Depression", "Stress Management"];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <div className="flex-1 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Transform Your Mental Wellness Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover evidence-based courses and connect with expert therapists to overcome anxiety, 
            build confidence, and improve your mental health.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 justify-center animate-slide-up">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="transition-all"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover-lift cursor-pointer group">
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
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
                
                <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                
                <Button 
                  className="w-full" 
                  variant={course.progress > 0 ? "default" : "outline"}
                >
                  {course.progress > 0 ? "Continue Learning" : "Enroll Now"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
