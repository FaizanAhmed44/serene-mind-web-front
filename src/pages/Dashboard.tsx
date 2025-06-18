
import { useState } from "react";
import { Calendar, Clock, User, BookOpen, Star, TrendingUp, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUpcomingSessions, useCompletedSessions } from "@/hooks/useSessions";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import ReviewDialog from "@/components/ReviewDialog";
import { useUserProfile } from "@/hooks/useUserProfile";


interface UserData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  joinDate: string;
  avatar: string;
}

const Dashboard = () => {
  const { data: upcomingSessions = [], isLoading: upcomingLoading } = useUpcomingSessions();
  const { data: completedSessions = [], isLoading: completedLoading } = useCompletedSessions();
  const { data: dashboardStats = [], isLoading: statsLoading } = useDashboardStats();

  const { data: userData, isLoading, error } = useUserProfile();
  const [completedSessionsState, setCompletedSessionsState] = useState(completedSessions);

  // Update local state when data changes
  useState(() => {
    setCompletedSessionsState(completedSessions);
  });

  const handleReviewSubmitted = (sessionId: number) => {
    setCompletedSessionsState(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, hasReviewed: true }
          : session
      )
    );
  };

  // Default stats if database is empty
  const defaultStats = [
    {
      title: "Total Sessions",
      value: upcomingSessions.length + completedSessions.length,
      icon: Calendar,
      change: "+2 this month"
    },
    {
      title: "Hours of Therapy",
      value: "24.5",
      icon: Clock,
      change: "+4.2 hours"
    },
    {
      title: "Progress Score",
      value: "85%",
      icon: TrendingUp,
      change: "+12% improvement"
    },
    {
      title: "Completed Goals",
      value: "7/10",
      icon: CheckCircle,
      change: "3 remaining"
    }
  ];

  const stats = dashboardStats.length > 0 ? dashboardStats : defaultStats;

  if (upcomingLoading || completedLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
            <div className="w-10" />
          </div>
        </div>
        <div className="p-6 flex items-center justify-center">
          <div className="text-lg text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Welcome Section */}
        <div className="text-center py-4 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userData?.name}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Continue your mental wellness journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Sessions */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Upcoming Sessions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No upcoming sessions</p>
              ) : (
                upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{session.expertName}</h4>
                        <p className="text-sm text-muted-foreground">{session.type}</p>
                        <p className="text-sm text-muted-foreground">{session.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{session.duration}</Badge>
                      <Button size="sm" className="ml-2">Join</Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Completed Sessions */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Recent Sessions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {completedSessionsState.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No completed sessions</p>
              ) : (
                completedSessionsState.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{session.expertName}</h4>
                        <p className="text-sm text-muted-foreground">{session.type}</p>
                        <p className="text-sm text-muted-foreground">{session.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{session.duration}</Badge>
                      {session.canReview && !session.hasReviewed && (
                        <ReviewDialog
                          expertName={session.expertName}
                          sessionType={session.type}
                          onReviewSubmitted={() => handleReviewSubmitted(session.id)}
                        >
                          <Button size="sm" variant="outline" className="ml-2">
                            <Star className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </ReviewDialog>
                      )}
                      {session.hasReviewed && (
                        <Badge variant="outline" className="ml-2">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          Reviewed
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>Your Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Overall Mental Wellness</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Anxiety Management</span>
                <span className="font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Confidence Building</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
