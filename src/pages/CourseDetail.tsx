import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Clock, BookOpen, ChevronRight, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { motion, AnimatePresence } from "framer-motion";
import { CourseSidebar } from "@/components/CourseSidebar";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { CoursesExpertAPI } from "@/api/courses";
import type { Course } from "@/data/types/course";
import { useAuth } from "@/hooks/useAuth";
import { CustomLoader } from "@/components/CustomLoader";


interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth(); 
  const isEnrolled = location.state?.isEnrolled;
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const { data: course, isLoading: courseLoading, error: courseError } = useQuery<Course>({
    queryKey: ["courses", id],
    queryFn: () => CoursesExpertAPI.getCourse(id),
    enabled: !!id,
  });

  const { data: progress = [], isLoading: progressLoading, error: progressError } = useQuery({
    queryKey: ["progress", id],
    queryFn: () => CoursesExpertAPI.getCourseProgress(id),
    enabled: !!id && isEnrolled,
  });

  const { data: reviews = [], isLoading: reviewsLoading, error: reviewsError } = useQuery<Review[]>({
    queryKey: ["reviews", id],
    queryFn: () => CoursesExpertAPI.getCourseReviews(id!),
    enabled: !!id,
  });

  const { data: userReview, isLoading: userReviewLoading } = useQuery<Review | null>({
    queryKey: ["userReview", id, user?.id],
    queryFn: () => CoursesExpertAPI.getUserCourseReview(id!, user!.id),
    enabled: !!id && !!user?.id && isEnrolled,
  });

  const addReviewMutation = useMutation({
    mutationFn: () =>
      CoursesExpertAPI.addCourseReview(id!, user?.id!, {
        rating,
        comment,
        userName: user?.name || "Anonymous",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses", id] });
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      queryClient.invalidateQueries({ queryKey: ["userReview", id, user?.id] });
      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback.",
      });
      setRating(0);
      setComment("");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.error || "Failed to submit review.",
      });
    },
  });

  // if (courseLoading || (isEnrolled && progressLoading)) {
  //   return (
  //     <div className="min-h-screen bg-background">
  //       <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
  //         <div className="flex items-center justify-between p-4">
  //           <SidebarTrigger />
  //           <h1 className="text-xl font-semibold truncate">Loading...</h1>
  //           <div className="w-10" />
  //         </div>
  //       </div>
  //       <div className="container mx-auto px-4 py-6">
  //         <div className="text-center">Loading course details...</div>
  //       </div>
  //     </div>
  //   );
  // }

  if (courseLoading || (isEnrolled && progressLoading)) {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold truncate">Loading...</h1>
            <div className="w-10" />
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <CustomLoader />
          <div className="text-lg text-muted-foreground">Loading course details...</div>
        </div>
      </div>
    );
  }

  if (courseError || !course || (isEnrolled && progressError)) {
    const errorMessage =
      (courseError as any)?.response?.status === 403
        ? "Please verify your email to access this course."
        : (progressError as any)?.response?.status === 403
        ? "Please verify your email to access progress."
        : "Course not found or access denied.";
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
          <div className="text-center">{errorMessage}</div>
        </div>
      </div>
    );
  }

  const modules = Array.isArray(course.modules) ? course.modules : [];
  const lessonsInFirstModule =
    modules.length > 0 && Array.isArray(modules[0].lessons) ? modules[0].lessons : [];

  const courseModules =
    modules.length > 0
      ? modules.map((module, index) => {
          const lessons = Array.isArray(module.lessons)
            ? module.lessons.map((lesson, lessonIndex) => {
                const lessonId = `lesson-${index + 1}-${lessonIndex + 1}`;
                const lessonProgress = progress.find((p) => p.lessonId === lessonId);
                return {
                  id: lessonId,
                  title: lesson.title,
                  duration: lesson.duration || module.duration || "Unknown",
                  completed: lessonProgress?.completed || false,
                  current: lessonId === currentLessonId,
                  locked: !isEnrolled,
                  videoUrl: lesson.videoUrl || lesson.content || null,
                };
              })
            : [];
          const completedLessons = lessons.filter((l) => l.completed).length;
          const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;
          return {
            id: `module-${index + 1}`,
            title: module.title,
            progress: progressPercentage,
            lessons,
          };
        })
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

  if (!currentLessonId && isEnrolled && courseModules.length > 0 && courseModules[0].lessons.length > 0) {
    setCurrentLessonId(courseModules[0].lessons[0].id);
  }

  const allLessons = courseModules.flatMap((module) => module.lessons);
  const currentLessonIndex = allLessons.findIndex((lesson) => lesson.id === currentLessonId);
  const hasPrevious = currentLessonIndex > 0;
  const hasNext = currentLessonIndex < allLessons.length - 1;
  const courseProgress = allLessons.length > 0
    ? (allLessons.filter((l) => l.completed).length / allLessons.length) * 100
    : 0;

  const currentLesson =
    allLessons.find((lesson) => lesson.id === currentLessonId) || {
      title: "Course Introduction",
      duration: "Unknown",
      videoUrl: null,
      completed: false,
    };

    const handleLessonSelect = (lessonId: string) => {
      setCurrentLessonId(lessonId);
    };
      

  const handleNextLesson = () => {
    if (hasNext) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      setCurrentLessonId(nextLesson.id);
    }
  };

  const handlePreviousLesson = () => {
    if (hasPrevious) {
      const previousLesson = allLessons[currentLessonIndex - 1];
      setCurrentLessonId(previousLesson.id);
    }
  };

  const handleEnrollRedirect = () => {
    navigate(`/courses/${course.id}/enroll`);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleReviewSubmit = () => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please log in to submit a review.",
      });
      navigate("/login");
      return;
    }
    addReviewMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
        <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.4 }}
            >
              <SidebarTrigger />
            </motion.div>
          <h1 className="text-xl font-semibold truncate">{course.title}</h1>
          <FavoriteButton course={course} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {isEnrolled ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <VideoPlayer
                videoUrl="https://youtu.be/_hik41Fm2PQ?si=YQWyQiiwS0k6bYWZ"
                title={currentLesson.title}
                duration={currentLesson.duration}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                onNext={handleNextLesson}
                onPrevious={handlePreviousLesson}
                courseId={id}
                lessonId={currentLessonId || ""}
                completed={currentLesson.completed}
                allLessons={allLessons.length}
              />
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
              {courseProgress === 100 && isEnrolled && !userReview && !userReviewLoading && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review this course</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Your Rating</h4>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-6 w-6 cursor-pointer ${
                                star <= rating ? "fill-primary text-primary" : "text-muted-foreground"
                              }`}
                              onClick={() => handleRatingChange(star)}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Your Feedback</h4>
                        <Textarea
                          placeholder="Share your thoughts about the course..."
                          value={comment}
                          onChange={handleCommentChange}
                          className="min-h-[100px]"
                        />
                      </div>
                      <Button
                        disabled={!rating || !comment.trim() || addReviewMutation.isPending}
                        onClick={handleReviewSubmit}
                        className="w-full"
                      >
                        {addReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardHeader>
                  <CardTitle>Course Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviewsLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/4 mb-2"></div>
                          <div className="h-6 bg-muted rounded w-full"></div>
                        </div>
                      ))}
                    </div>
                  ) : reviewsError ? (
                    <p className="text-sm text-destructive">Failed to load reviews.</p>
                  ) : reviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No reviews yet.</p>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold">{review.userName}</h4>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
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
                    <CardTitle>Course Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reviewsLoading ? (
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="animate-pulse">
                            <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-1/4 mb-2"></div>
                            <div className="h-6 bg-muted rounded w-full"></div>
                          </div>
                        ))}
                      </div>
                    ) : reviewsError ? (
                      <p className="text-sm text-destructive">Failed to load reviews.</p>
                    ) : reviews.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No reviews yet.</p>
                    ) : (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-semibold">{review.userName}</h4>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
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