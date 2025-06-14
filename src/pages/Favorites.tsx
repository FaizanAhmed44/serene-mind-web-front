import { useState } from "react";
import { Heart, Star, Users, Clock, BookOpen, Play, ChevronRight, TrendingUp, Award, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Link } from "react-router-dom";

// Interest categories data
const interestCategories = [
  { id: 1, name: "Mental Health", courses: 24, icon: "🧠", color: "bg-blue-500" },
  { id: 2, name: "Stress Management", courses: 18, icon: "🧘", color: "bg-green-500" },
  { id: 3, name: "Anxiety Relief", courses: 15, icon: "💚", color: "bg-purple-500" },
  { id: 4, name: "Confidence Building", courses: 12, icon: "💪", color: "bg-orange-500" },
  { id: 5, name: "Depression Support", courses: 21, icon: "🌟", color: "bg-pink-500" },
  { id: 6, name: "Mindfulness", courses: 19, icon: "🌸", color: "bg-indigo-500" },
];

// Recommended courses based on interests
const recommendedCourses = [
  {
    id: 1,
    title: "Cognitive Behavioral Therapy Basics",
    instructor: "Dr. Sarah Johnson",
    university: "Stanford University",
    rating: 4.8,
    reviews: 2847,
    duration: "6 weeks",
    level: "Beginner",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
    category: "Mental Health",
    enrolled: 45000,
    certificate: true
  },
  {
    id: 2,
    title: "Mindfulness and Stress Reduction",
    instructor: "Dr. Michael Chen",
    university: "Yale University",
    rating: 4.9,
    reviews: 1924,
    duration: "4 weeks",
    level: "Intermediate",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
    category: "Stress Management",
    enrolled: 32000,
    certificate: true
  },
  {
    id: 3,
    title: "Building Emotional Resilience",
    instructor: "Prof. Lisa Wang",
    university: "Harvard University",
    rating: 4.7,
    reviews: 3201,
    duration: "8 weeks",
    level: "Advanced",
    image: "https://images.unsplash.com/photo-1552581234-26160f608093?w=400&h=250&fit=crop",
    category: "Confidence Building",
    enrolled: 28000,
    certificate: true
  }
];

// Learning goals
const learningGoals = [
  { icon: Target, title: "Reduce Anxiety", progress: 75, courses: 3 },
  { icon: Award, title: "Build Confidence", progress: 45, courses: 2 },
  { icon: TrendingUp, title: "Stress Management", progress: 60, courses: 4 },
];

const Favorites = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900">Your Learning Interests</h1>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Your Potential</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore courses tailored to your mental wellness journey. Build skills that matter for your personal growth and well-being.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {learningGoals.map((goal, index) => (
              <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <goal.icon className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                    <p className="text-sm text-gray-500">{goal.courses} courses</p>
                  </div>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <p className="text-sm text-gray-600 mt-2">{goal.progress}% complete</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Interest Categories */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Browse by Interest</h2>
            <Button variant="outline" className="text-blue-600 hover:text-blue-700">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {interestCategories.map((category) => (
              <Card 
                key={category.id} 
                className="p-4 hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center text-white text-xl mx-auto mb-3`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.courses} courses</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* My Saved Courses */}
        {favorites.length > 0 && (
          <section className="animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Saved Courses</h2>
              <p className="text-gray-600">{favorites.length} course{favorites.length !== 1 ? 's' : ''} saved</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                  <Link to={`/courses/${course.id}`}>
                    <div className="relative">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 left-3 bg-white text-gray-900 hover:bg-white">
                        {course.category}
                      </Badge>
                      <div className="absolute top-3 right-3">
                        <FavoriteButton course={course} variant="ghost" />
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-700 mb-4">by {course.instructor}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-gray-900">{course.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                      </div>
                      
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <Play className="h-4 w-4 mr-2" />
                        {course.progress > 0 ? "Continue Learning" : "Enroll Now"}
                      </Button>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Recommended for You */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
              <p className="text-gray-600">Based on your interests and learning goals</p>
            </div>
            <Button variant="outline" className="text-blue-600 hover:text-blue-700">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-xl transition-shadow group">
                <Link to={`/courses/${course.id}`}>
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-white text-gray-900 hover:bg-white">
                      {course.category}
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs">
                        {course.level}
                      </Badge>
                      {course.certificate && (
                        <Badge variant="outline" className="text-xs ml-2 text-green-600 border-green-600">
                          Certificate
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{course.university}</p>
                    <p className="text-sm text-gray-700 mb-4">by {course.instructor}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium text-gray-900">{course.rating}</span>
                          <span>({course.reviews.toLocaleString()})</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.enrolled.toLocaleString()} enrolled</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>View Course</span>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Play className="h-4 w-4 mr-2" />
                      Enroll Now
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </section>

        {/* Popular This Week */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular This Week</h2>
            <Button variant="outline" className="text-blue-600 hover:text-blue-700">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Trending: Emotional Intelligence</h3>
                  <p className="text-gray-600">15 new courses added this week</p>
                  <Button variant="link" className="p-0 h-auto text-blue-600">
                    Explore Now <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">New Certificates Available</h3>
                  <p className="text-gray-600">Professional certificates in mental wellness</p>
                  <Button variant="link" className="p-0 h-auto text-blue-600">
                    Learn More <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Favorites;
