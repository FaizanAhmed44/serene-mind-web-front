import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Clock, BookOpen, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { CourseSidebar } from "@/components/CourseSidebar";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useQuery } from "@tanstack/react-query";
import { CoursesExpertAPI } from "@/api/courses";
import type { Course } from "@/data/types/course";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation()
  const isEnrolled = location.state?.isEnrolled;
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);

  const { data: course, isLoading, error } = useQuery<Course>({
    queryKey: ["courses", id],
    queryFn: () => CoursesExpertAPI.getCourse(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold truncate">Loading...</h1>
            <div className="w-10" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">Loading course details...</div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold truncate">Course Not Found</h1>
            <div className="w-10" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">Course not found</div>
        </div>
      </div>
    );
  }

  // Defensive: ensure modules/lessons are arrays
  const modules = Array.isArray(course.modules) ? course.modules : [];
  const lessonsInFirstModule =
    modules.length > 0 && Array.isArray(modules[0].lessons) ? modules[0].lessons : [];

  // Map backend modules to frontend structure for CourseSidebar
  const courseModules =
    modules.length > 0
      ? modules.map((module, index) => ({
          id: `module-${index + 1}`,
          title: module.title,
          progress: 0,
          lessons: Array.isArray(module.lessons)
            ? module.lessons.map((lesson, lessonIndex) => ({
                id: `lesson-${index + 1}-${lessonIndex + 1}`,
                title: lesson.title,
                duration: lesson.duration || module.duration || "Unknown",
                completed: false,
                current: `lesson-${index + 1}-${lessonIndex + 1}` === currentLessonId,
                locked: !isEnrolled,
                videoUrl: lesson.videoUrl || lesson.content || null,
              }))
            : [],
        }))
      : [
          {
            id: "1",
            title: "Introduction",
            progress: 0,
            lessons: [
              {
                id: "1-1",
                title: "Course Overview",
                duration: "Unknown",
                completed: false,
                current: true,
                locked: !isEnrolled,
                videoUrl: "https://youtu.be/NLKwRW2y-sg?si=vJlY-M5zyZzoVFb1",
              },
            ],
          },
        ];

  const currentLesson =
    courseModules
      .flatMap((m) => m.lessons)
      .find((l) => l.id === currentLessonId) || {
      title: "Course Introduction",
      duration: "Unknown",
      videoUrl: null,
    };

  const handleLessonSelect = (lessonId: string) => {
    setCurrentLessonId(lessonId);
  };

  const handleEnrollRedirect = () => {
    navigate(`/courses/${course.id}/enroll`);
  };

  return (
    <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold truncate">{course.title}</h1>
            <FavoriteButton course={course} />
          </div>
        </div>

      <div className="container mx-auto px-4 py-6">
        {isEnrolled ? 
        (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {currentLesson.videoUrl && <VideoPlayer
                videoUrl={"https://youtu.be/NLKwRW2y-sg?si=vJlY-M5zyZzoVFb1"}
                title={currentLesson.title}
                duration={currentLesson.duration}
                hasNext={courseModules.some((m) =>
                  m.lessons.some((l) => l.id !== currentLessonId)
                )}
                hasPrevious={courseModules.some((m) =>
                  m.lessons.some((l) => l.id !== currentLessonId)
                )}
              />}
              <Card>
                <CardHeader>
                  <CardTitle>About this course</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {course.description}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {modules.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Modules</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {course.duration || "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {course.status || "Beginner"}
                      </div>
                      <div className="text-sm text-muted-foreground">Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {typeof course.rating === "number" ? course.rating.toFixed(1) : "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground">Rating</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">What you'll learn</h4>
                    <div className="grid gap-2">
                      {lessonsInFirstModule.length > 0 ? (
                        lessonsInFirstModule.map((lesson, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{lesson.title}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          No learning outcomes available.
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <CourseSidebar
                modules={courseModules}
                onLessonSelect={handleLessonSelect}
                isEnrolled={isEnrolled}
              />
            </div>
          </div>
        ) : (
          
          <div className="space-y-8">
            
            <div className="relative">
              <div className="w-full h-[400px] rounded-lg overflow-hidden relative">
                {/* Course thumbnail as background */}
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail}
                    loading="lazy"
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                  <Button
                    size="lg"
                    className="rounded-full w-16 h-16"
                    onClick={handleEnrollRedirect}
                  >
                    <BookOpen className="h-8 w-8" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                  <p className="text-lg text-muted-foreground mb-6">
                    {course.description}
                  </p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration || "N/A"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>Rating:</span>
                      <span>
                        {typeof course.rating === "number" ? course.rating.toFixed(1) : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Course content</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {modules.length} modules •{" "}
                      {modules.reduce(
                        (acc, mod) =>
                          acc +
                          (Array.isArray(mod.lessons) ? mod.lessons.length : 0),
                        0
                      )}{" "}
                      lessons
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {modules.map((module, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">{module.title}</h4>
                          <span className="text-sm text-muted-foreground">
                            {module.duration || "N/A"}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {Array.isArray(module.lessons) &&
                          module.lessons.length > 0 ? (
                            module.lessons.slice(0, 3).map((lesson, lessonIndex) => (
                              <div
                                key={lessonIndex}
                                className="flex items-center text-sm text-muted-foreground"
                              >
                                <ChevronRight className="h-4 w-4 mr-2" />
                                {lesson.title}
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              No lessons available.
                            </div>
                          )}
                          {Array.isArray(module.lessons) &&
                            module.lessons.length > 3 && (
                              <div className="text-sm text-muted-foreground ml-6">
                                +{module.lessons.length - 3} more lessons
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <img
                        src={course.expert?.avatar}
                        alt={course.expert?.name || "Instructor"}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">
                          {course.expert?.name || "Unknown"}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {course.expert?.title || "Unknown"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {course.expert?.bio || "Unknown"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-primary mb-2">
                        ${course.price || "Free"}
                      </div>
                      <div className="text-sm text-muted-foreground mb-4">
                        Course Price
                      </div>
                      <div className="text-2xl font-bold text-primary mb-2">
                        {typeof course.enrolledStudents === "number"
                          ? course.enrolledStudents
                          : 0}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Enrolled Students
                      </div>
                    </div>
                    <Button
                      className="w-full mb-4"
                      size="lg"
                      onClick={handleEnrollRedirect}
                    >
                      {isEnrolled ? "Enrolled" : "Enroll Now"}
                    </Button>
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
