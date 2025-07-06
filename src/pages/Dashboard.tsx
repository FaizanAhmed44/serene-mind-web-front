
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

const Dashboard = () => {
  const { data: upcomingSessions = [], isLoading: upcomingLoading } = useUpcomingSessions();
  const { data: completedSessions = [], isLoading: completedLoading } = useCompletedSessions();
  const { data: dashboardStats = [], isLoading: statsLoading } = useDashboardStats();
  const { data: userData, isLoading, error } = useUserProfile();
  const [completedSessionsState, setCompletedSessionsState] = useState(completedSessions);

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

  const defaultStats = [
    {
      title: "Total Sessions",
      value: upcomingSessions.length + completedSessions.length,
      icon: Calendar,
      change: "+2 this month",
      color: "primary"
    },
    {
      title: "Hours of Therapy",
      value: "24.5",
      icon: Clock,
      change: "+4.2 hours",
      color: "secondary"
    },
    {
      title: "Progress Score",
      value: "85%",
      icon: TrendingUp,
      change: "+12% improvement",
      color: "accent"
    },
    {
      title: "Completed Goals",
      value: "7/10",
      icon: CheckCircle,
      change: "3 remaining",
      color: "primary"
    }
  ];

  const stats = dashboardStats.length > 0 ? dashboardStats : defaultStats;

  if (upcomingLoading || completedLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-6">
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-6">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <h1 className="text-4xl font-bold mb-3 tracking-tight text-primary">
            Welcome back, {userData?.name}!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Continue your mental wellness journey with personalized insights and expert guidance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={stat.title} className="border-0 shadow-sm bg-gradient-to-br from-white to-muted/20 hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground font-medium">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Upcoming Sessions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl text-primary font-semibold">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">No upcoming sessions</p>
                </div>
              ) : (
                upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-transparent rounded-xl border border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-foreground">{session.expertName}</h4>
                        <p className="text-sm text-muted-foreground">{session.type}</p>
                        <p className="text-sm font-medium text-primary">{session.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-medium">{session.duration}</Badge>
                      <Button size="sm" className="h-9 px-4">Join</Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Completed Sessions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl text-primary  font-semibold">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10">
                  <CheckCircle className="h-5 w-5 text-secondary" />
                </div>
                Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {completedSessionsState.length === 0 ? (
                <div className="text-center py-8">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">No completed sessions</p>
                </div>
              ) : (
                completedSessionsState.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-transparent rounded-xl border border-border/50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10">
                        <User className="h-6 w-6 text-secondary" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold text-foreground">{session.expertName}</h4>
                        <p className="text-sm text-muted-foreground">{session.type}</p>
                        <p className="text-sm font-medium text-secondary">{session.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="font-medium">{session.duration}</Badge>
                      {session.canReview && !session.hasReviewed && (
                        <ReviewDialog
                          expertName={session.expertName}
                          sessionType={session.type}
                          onReviewSubmitted={() => handleReviewSubmitted(session.id)}
                        >
                          <Button size="sm" variant="outline" className="h-9 px-4">
                            <Star className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </ReviewDialog>
                      )}
                      {session.hasReviewed && (
                        <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-700">
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
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-primary font-semibold">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
                <BookOpen className="h-5 w-5 text-accent" />
              </div>
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Overall Mental Wellness</span>
                <span className="text-lg font-bold text-foreground">85%</span>
              </div>
              <Progress value={85} className="h-3" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Anxiety Management</span>
                <span className="text-lg font-bold text-foreground">78%</span>
              </div>
              <Progress value={78} className="h-3" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Confidence Building</span>
                <span className="text-lg font-bold text-foreground">92%</span>
              </div>
              <Progress value={92} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
