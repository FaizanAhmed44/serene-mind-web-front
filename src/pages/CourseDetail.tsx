
import { Play } from "lucide-react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { courses } from "@/data/courses";
import { UserAvatar } from "@/components/UserAvatar";

const CourseDetail = () => {
  const { id } = useParams();
  const course = courses.find((c) => c.id === parseInt(id || '0'));

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
          <UserAvatar />
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="hover-lift animate-slide-up">
              <CardContent className="p-6">
                <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center">
                  <Play className="h-16 w-16 text-muted-foreground" />
                </div>
                
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={course.instructor.image} alt={course.instructor.name} />
                    <AvatarFallback>{course.instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{course.instructor.name}</p>
                    <p className="text-sm text-muted-foreground">{course.instructor.specialty}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6">{course.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{course.level}</Badge>
                  <Badge variant="outline">{course.duration}</Badge>
                  <Badge variant="outline">{course.category}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Course Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.modules.map((module, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{module.title}</p>
                        <p className="text-sm text-muted-foreground">{module.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div>
                    <span className="text-3xl font-bold text-foreground">${course.price}</span>
                    <p className="text-sm text-muted-foreground">One-time payment</p>
                  </div>
                  
                  <Button className="w-full" size="lg">
                    Enroll Now
                  </Button>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>✓ Lifetime access</p>
                    <p>✓ Certificate of completion</p>
                    <p>✓ 30-day money-back guarantee</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
