
import { Play } from "lucide-react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getCourseById } from "@/data/courses";
import { UserAvatar } from "@/components/UserAvatar";

const CourseDetail = () => {
  const { id } = useParams();
  const course = getCourseById(id || '0');

  if (!course) {
    return <div>Course not found</div>;
  }

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
                    <AvatarImage src={course.instructor.photo} alt={course.instructor.name} />
                    <AvatarFallback>{course.instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{course.instructor.name}</p>
                    <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                  </div>
                </div>

                <h2 className="text-xl font-semibold mb-4">Course Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {course.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge variant="secondary">{course.level}</Badge>
                  <Badge variant="secondary">{course.language}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift animate-slide-up">
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.modules_detail.map((module, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <Play className="h-4 w-4 text-primary" />
                      <span>Week {module.week}: {module.title}</span>
                      <span className="ml-auto text-sm text-muted-foreground">{module.duration}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-3xl font-bold">{course.price}</div>
                  {course.originalPrice && (
                    <div className="text-sm text-muted-foreground line-through">
                      ${course.originalPrice}
                    </div>
                  )}
                  <Button className="w-full">Enroll Now</Button>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Students:</span>
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <span>{course.rating}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Certificate:</span>
                      <span>{course.certificate ? 'Yes' : 'No'}</span>
                    </div>
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
