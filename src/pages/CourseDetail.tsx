
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Clock, Users, BookOpen, Download, ChevronRight, Award, Globe, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { CourseSidebar } from "@/components/CourseSidebar";
import { getCourseById } from "@/data/courses";

const CourseDetail = () => {
  const { id } = useParams();
  const [isEnrolled, setIsEnrolled] = useState(false); // Changed from true to false
  const [currentLessonId, setCurrentLessonId] = useState("1-1");
  
  const course = getCourseById(id || "1");
  
  if (!course) {
    return <div>Course not found</div>;
  }

  // Mock course modules with video lessons
  const courseModules = [
    {
      id: "1",
      title: "Introduction to Mindfulness",
      progress: 75,
      lessons: [
        { id: "1-1", title: "What is Mindfulness?", duration: "12:30", completed: true, current: true, locked: false },
        { id: "1-2", title: "Benefits of Mindful Living", duration: "15:45", completed: false, current: false, locked: false },
        { id: "1-3", title: "Getting Started", duration: "10:20", completed: false, current: false, locked: false }
      ]
    },
    {
      id: "2", 
      title: "Breathing Techniques",
      progress: 25,
      lessons: [
        { id: "2-1", title: "Basic Breathing Exercises", duration: "18:15", completed: false, current: false, locked: !isEnrolled },
        { id: "2-2", title: "Advanced Techniques", duration: "20:30", completed: false, current: false, locked: !isEnrolled }
      ]
    }
  ];

  const currentLesson = courseModules
    .flatMap(m => m.lessons)
    .find(l => l.id === currentLessonId);

  const handleLessonSelect = (lessonId: string) => {
    setCurrentLessonId(lessonId);
  };

  const handleEnroll = () => {
    setIsEnrolled(true);
    console.log("User enrolled in course:", course.title);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold truncate">{course.title}</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {isEnrolled ? (
          // Enrolled user view - Video player layout
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video player section */}
            <div className="lg:col-span-2 space-y-6">
              <VideoPlayer
                videoUrl="#"
                title={currentLesson?.title || "Course Introduction"}
                duration={currentLesson?.duration || "12:30"}
                hasNext={true}
                hasPrevious={true}
              />
              
              {/* Course info tabs */}
              <Card>
                <CardHeader>
                  <CardTitle>About this course</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {course.longDescription}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{course.modules}</div>
                      <div className="text-sm text-muted-foreground">Modules</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{course.duration}</div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{course.level}</div>
                      <div className="text-sm text-muted-foreground">Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{course.language}</div>
                      <div className="text-sm text-muted-foreground">Language</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">What you'll learn</h4>
                    <div className="grid gap-2">
                      {course.outcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Course sidebar */}
            <div>
              <CourseSidebar
                modules={courseModules}
                onLessonSelect={handleLessonSelect}
                isEnrolled={isEnrolled}
              />
            </div>
          </div>
        ) : (
          // Non-enrolled user view - Course preview
          <div className="space-y-8">
            {/* Hero section */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button size="lg" className="rounded-full w-16 h-16">
                    <BookOpen className="h-8 w-8" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">{course.category}</Badge>
                    <Badge variant="outline">{course.level}</Badge>
                    {course.certificate && <Badge variant="outline">Certificate</Badge>}
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                  <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{course.rating}</span>
                      <span className="text-muted-foreground">({course.students} students)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4" />
                      <span>{course.language}</span>
                    </div>
                  </div>
                </div>

                {/* What you'll learn */}
                <Card>
                  <CardHeader>
                    <CardTitle>What you'll learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {course.outcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-sm">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Course content preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Course content</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {course.modules} modules • {course.modules_detail.reduce((acc, mod) => acc + mod.lessons.length, 0)} lessons
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {course.modules_detail.map((module, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">Week {module.week}: {module.title}</h4>
                          <span className="text-sm text-muted-foreground">{module.duration}</span>
                        </div>
                        <div className="space-y-2">
                          {module.lessons.slice(0, 3).map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="flex items-center text-sm text-muted-foreground">
                              <ChevronRight className="h-4 w-4 mr-2" />
                              {lesson}
                            </div>
                          ))}
                          {module.lessons.length > 3 && (
                            <div className="text-sm text-muted-foreground ml-6">
                              +{module.lessons.length - 3} more lessons
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Instructor */}
                <Card>
                  <CardHeader>
                    <CardTitle>Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <img
                        src={course.instructor.photo}
                        alt={course.instructor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{course.instructor.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{course.instructor.title}</p>
                        <p className="text-sm text-muted-foreground">{course.instructor.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enrollment sidebar */}
              <div>
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-primary mb-2">{course.price}</div>
                      {course.originalPrice && (
                        <div className="text-lg line-through text-muted-foreground">${course.originalPrice}</div>
                      )}
                    </div>
                    
                    <Button className="w-full mb-4" size="lg" onClick={handleEnroll}>
                      Enroll Now
                    </Button>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span>Certificate of completion</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{course.students} students enrolled</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <span>{course.level} level</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <span>{course.language} language</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
