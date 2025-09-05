import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  Award, 
  Clock, 
  Book, 
  Users, 
  Star,
  Download,
  Calendar,
  Play
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { CoursesExpertAPI } from "@/api/courses";
import { CustomLoader } from "@/components/CustomLoader";

const CourseSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  const { data: course, isLoading, error } = useQuery({
    queryKey: ["course", id],
    queryFn: () => CoursesExpertAPI.getCourse(id),
    enabled: !!id
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(`/courses/${id}`, {
            state: { isEnrolled: true },
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [id, navigate]);



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <CustomLoader />
          <div className="text-lg text-muted-foreground">Loading course success...</div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
          <Button asChild>
            <Link to="/">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  console.log(course);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-green-300/20 to-emerald-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <SidebarTrigger className="hover:bg-muted/80 transition-colors" />
          <div className="text-center">
            <h1 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Purchase Successful</h1>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 relative">
        {/* Success Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
            <CheckCircle className="h-14 w-14 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 animate-slide-up">
            Congratulations! 🎉
          </h1>
          <p className="text-xl text-muted-foreground mb-6 animate-slide-up delay-100">
            You've successfully enrolled in <span className="font-semibold text-green-600">{course.title}</span>
          </p>
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto animate-slide-up delay-200">
            <p className="text-sm text-muted-foreground">
              Redirecting to course in <span className="font-bold text-green-600">{countdown}</span> seconds...
            </p>
          </div>
        </div>

        {/* Course Details Card */}
        <Card className="mb-8 animate-slide-up hover:shadow-xl transition-all duration-300 border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full md:w-48 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <Badge className="mb-3">{course.category}</Badge>
                <h2 className="text-2xl font-bold mb-3">{course.title}</h2>
                <p className="text-muted-foreground mb-4">{course.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-semibold">{course.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="font-semibold">{course.duration}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Book className="h-4 w-4 mr-1" />
                      <span className="font-semibold">{course.modules.length}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Modules</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="font-semibold">{course.enrolledStudents}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Students</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={() => navigate(`/courses/${course.id}`, { state: { isEnrolled: true } })}
                    size="lg"
                    className="flex-1 md:flex-none"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Learning
                  </Button>                  
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Included */}
        <Card className="mb-8 animate-slide-up hover:shadow-xl transition-all duration-300 border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-green-600" />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">What's Included</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Lifetime access to course content</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Certificate of completion</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Mobile and desktop access</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Downloadable resources</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Expert instructor support</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructor Info */}
        <Card className="mb-8 animate-slide-up hover:shadow-xl transition-all duration-300 border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Your Instructor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <img
                src={course.expert.avatar}
                alt={course.expert.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{course.expert.name}</h3>
                <p className="text-primary mb-2">{course.expert.title}</p>
                <p className="text-sm text-muted-foreground">{course.expert.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="animate-slide-up hover:shadow-xl transition-all duration-300 border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Next Steps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h5 className="font-medium">Start with the first module</h5>
                  <p className="text-sm text-muted-foreground">Begin your learning journey with the introduction module</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h5 className="font-medium">Track your progress</h5>
                  <p className="text-sm text-muted-foreground">Mark lessons as complete to track your learning progress</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h5 className="font-medium">Earn your certificate</h5>
                  <p className="text-sm text-muted-foreground">Complete all modules to receive your certificate of completion</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseSuccess;