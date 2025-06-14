
import { Calendar, Book, Clock, User, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { enrolledCoursesData } from "@/data/courses";
import { upcomingSessionsData } from "@/data/sessions";
import { dashboardStatsData } from "@/data/stats";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleContinueLearning = (courseId: number, courseTitle: string) => {
    console.log(`Navigating to course ${courseId}: ${courseTitle}`);
    toast.success(`Continuing with ${courseTitle}...`);
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Welcome Section */}
        <div className="animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h2>
          <p className="text-lg text-muted-foreground">Continue your mental wellness journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
          {dashboardStatsData.map((stat) => (
            <Card key={stat.label} className="hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Courses */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Book className="h-5 w-5 text-primary" />
                <span>Current Courses</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {enrolledCoursesData.map((course) => (
                <div key={course.id} className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Next: {course.nextLesson}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">{course.timeSpent}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-3" />
                  </div>
                  <Button 
                    className="w-full" 
                    size="sm"
                    onClick={() => handleContinueLearning(course.id, course.title)}
                  >
                    Continue Learning
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Upcoming Sessions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessionsData.map((session) => (
                <div key={session.id} className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-foreground">{session.type}</h3>
                      <p className="text-sm text-muted-foreground">with {session.expertName}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{session.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Reschedule
                    </Button>
                    <Button size="sm" className="flex-1">
                      Join Session
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Schedule New Session
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Book className="h-6 w-6" />
                <span>Browse Courses</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <User className="h-6 w-6" />
                <span>Find Expert</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Calendar className="h-6 w-6" />
                <span>Book Session</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
