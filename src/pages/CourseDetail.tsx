
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Clock, Users, Star, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { courses } from "@/data/courses";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ReviewDialog } from "@/components/ReviewDialog";

const CourseDetail = () => {
  const { id } = useParams();
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  const course = courses.find(c => c.id === parseInt(id || "0"));

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
    setIsEnrolled(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
          <h1 className="text-lg font-semibold text-foreground truncate max-w-md">
            {course.title}
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Course Header */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Badge variant="secondary">{course.category}</Badge>
                  <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
                  <p className="text-lg text-muted-foreground">{course.description}</p>
                </div>
                <FavoriteButton course={course} />
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{course.enrolled} enrolled</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-current text-yellow-400" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.lessons} lessons</span>
                </div>
              </div>

              {course.progress !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              )}
            </div>

            {/* Course Content */}
            <Card>
              <CardHeader>
                <CardTitle>What you'll learn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {course.objectives?.map((objective, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{objective}</span>
                  </div>
                )) || (
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Understand core concepts and practical applications</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Develop hands-on skills through interactive exercises</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Apply knowledge to real-world scenarios</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={course.instructor?.avatar} />
                    <AvatarFallback>{course.instructor?.name?.split(' ').map(n => n[0]).join('') || 'IN'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{course.instructor?.name || 'Expert Instructor'}</h3>
                    <p className="text-muted-foreground">{course.instructor?.title || 'Mental Health Professional'}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {course.instructor?.experience || 'Years of experience in mental health and wellness'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <Play className="h-12 w-12 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{course.price}</div>
                  {course.originalPrice && course.originalPrice !== course.price && (
                    <div className="text-sm text-muted-foreground line-through">
                      {course.originalPrice}
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lessons</span>
                    <span>{course.lessons}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Level</span>
                    <span className="capitalize">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Access</span>
                    <span>Lifetime</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  {isEnrolled ? (
                    <Button className="w-full" asChild>
                      <Link to={`/course/${course.id}/learn`}>
                        Continue Learning
                      </Link>
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={handleEnroll}>
                      Enroll Now
                    </Button>
                  )}
                  
                  <ReviewDialog courseTitle={course.title} />
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
