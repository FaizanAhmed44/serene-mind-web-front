import { Play } from "lucide-react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { courses } from "@/data/courses";
import { EnrollmentCard } from "@/components/EnrollmentCard";
import { UserAvatar } from "@/components/UserAvatar";

const CourseDetail = () => {
  const { id } = useParams();
  const course = courses.find(c => c.id === parseInt(id || '0'));

  if (!course) {
    return <div>Course not found</div>;
  }

  // Create a course object with optional progress for the EnrollmentCard
  const courseWithProgress = {
    ...course,
    progress: course.progress || 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
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
                    <p className="font-semibold">{course.instructor.name}</p>
                    <p className="text-sm text-muted-foreground">{course.instructor.credentials}</p>
                  </div>
                </div>

                <h2 className="text-xl font-semibold mb-4">Course Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {course.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {course.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift animate-slide-up">
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Course content would go here */}
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    <Play className="h-4 w-4 text-primary" />
                    <span>Introduction to the Course</span>
                    <span className="ml-auto text-sm text-muted-foreground">5 min</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    <Play className="h-4 w-4 text-muted-foreground" />
                    <span>Understanding the Basics</span>
                    <span className="ml-auto text-sm text-muted-foreground">15 min</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    <Play className="h-4 w-4 text-muted-foreground" />
                    <span>Advanced Techniques</span>
                    <span className="ml-auto text-sm text-muted-foreground">20 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <EnrollmentCard course={courseWithProgress} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
