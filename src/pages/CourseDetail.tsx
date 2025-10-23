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
  const [showAll, setShowAll] = useState(false); 
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

  if (courseLoading || (isEnrolled && progressLoading)) {
    return (
      <motion.div
        className="min-h-screen bg-background relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between p-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.4 }}
            >
              <SidebarTrigger />
            </motion.div>
            <motion.h1 
              className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Course Details
            </motion.h1>
            <div className="w-10" />
          </div>
        </motion.div>
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <CustomLoader />
          <div className="text-lg text-muted-foreground">Loading Course Details...</div>
        </motion.div>
      </motion.div>
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
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-xl border-b border-border/20">
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Background Elements */}
      
      
    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
    </div>

    <motion.div
      className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between p-3 sm:p-4 gap-3">
        {/* Sidebar Trigger */}
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.4 }}
          className="shrink-0"
        >
          <SidebarTrigger />
        </motion.div>

        {/* Responsive Course Title */}
        <motion.h1
          className="flex-1 text-center text-base sm:text-lg md:text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent truncate px-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          title={course.title} // Tooltip on hover (optional accessibility)
        >
          {course.title}
        </motion.h1>

        {/* Favorite Button */}
        <div className="shrink-0">
          <FavoriteButton course={course} />
        </div>
      </div>
    </motion.div>


      <div className="container mx-auto px-4 py-6 relative z-10">
        {isEnrolled ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <VideoPlayer
                  videoUrl={currentLesson.videoUrl}
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="hover-scale"
              >
                <Card className="border-border/20 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      About this course
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {course.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg"
                      >
                        <div className="text-2xl font-bold text-primary">
                          {modules.length}
                        </div>
                        <div className="text-sm text-muted-foreground">Modules</div>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg"
                      >
                        <div className="text-2xl font-bold text-secondary">
                          {course.duration || "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg"
                      >
                        <div className="text-2xl font-bold text-accent">
                          {course.status || "Beginner"}
                        </div>
                        <div className="text-sm text-muted-foreground">Level</div>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 rounded-lg"
                      >
                        <div className="text-2xl font-bold text-yellow-600">
                          {typeof course.rating === "number" ? course.rating.toFixed(1) : "N/A"}
                        </div>
                        <div className="text-sm text-muted-foreground">Rating</div>
                      </motion.div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">What you'll learn</h4>
                      <div className="grid gap-3">
                        {lessonsInFirstModule.length > 0 ? (
                          lessonsInFirstModule.map((lesson, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                              className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <span className="text-sm text-foreground">{lesson.title}</span>
                            </motion.div>
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
              </motion.div>

              {courseProgress === 100 && isEnrolled && !userReview && !userReviewLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="hover-scale"
                >
                  <Card className="border-border/20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-t-lg">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Review this course
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Your Rating</h4>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <motion.div
                                key={star}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Star
                                  className={`h-6 w-6 cursor-pointer transition-colors ${
                                    star <= rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                                  }`}
                                  onClick={() => handleRatingChange(star)}
                                />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Your Feedback</h4>
                          <Textarea
                            placeholder="Share your thoughts about the course..."
                            value={comment}
                            onChange={handleCommentChange}
                            className="min-h-[100px] border-border/30 bg-background/50"
                          />
                        </div>
                        <Button
                          disabled={!rating || !comment.trim() || addReviewMutation.isPending}
                          onClick={handleReviewSubmit}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          {addReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="hover-scale"
              >
                <Card className="border-border/20 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Course Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
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
                        {reviews.slice(0, showAll ? reviews.length : 3).map((review, index) => (
                          <motion.div 
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b pb-4 last:border-b-0 p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-semibold">{review.userName}</h4>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </motion.div>
                        ))}
                        {reviews.length > 4 && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowAll(!showAll)}
                            className="text-sm text-primary hover:underline mt-4 font-medium"
                          >
                            {showAll ? 'Show Less' : 'See More'}
                          </motion.button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CourseSidebar
                modules={courseModules}
                onLessonSelect={handleLessonSelect}
                isEnrolled={isEnrolled}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Hero Course Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500"
            >
              <div className="w-full h-[400px] relative group">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    loading="lazy"
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <Button
                        size="lg"
                        className="rounded-full w-20 h-20 bg-white/90 text-primary hover:bg-white shadow-2xl"
                        onClick={handleEnrollRedirect}
                      >
                        <BookOpen className="h-10 w-10" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {course.title}
                  </h1>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {course.description}
                  </p>
                  <div className="flex items-center space-x-8 text-sm">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-2 bg-primary/10 px-3 py-2 rounded-lg"
                    >
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">{course.duration || "N/A"}</span>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-2 bg-yellow-500/10 px-3 py-2 rounded-lg"
                    >
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">
                        {typeof course.rating === "number" ? course.rating.toFixed(1) : "N/A"}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="hover-scale"
                >
                  <Card className="border-border/20 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Course content
                      </CardTitle>
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
                    <CardContent className="p-6 space-y-4">
                      {modules.map((module, index) => (
                        <motion.div 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="border border-border/30 rounded-lg p-4 bg-muted/20 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="font-medium text-foreground">{module.title}</h4>
                            <span className="text-sm text-muted-foreground bg-primary/10 px-2 py-1 rounded">
                              {module.duration || "N/A"}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {Array.isArray(module.lessons) &&
                            module.lessons.length > 0 ? (
                              module.lessons.slice(0, 3).map((lesson, lessonIndex) => (
                                <motion.div
                                  key={lessonIndex}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.5 + lessonIndex * 0.05 }}
                                  className="flex items-center text-sm text-muted-foreground p-2 bg-background/50 rounded"
                                >
                                  <ChevronRight className="h-4 w-4 mr-2 text-primary" />
                                  {lesson.title}
                                </motion.div>
                              ))
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                No lessons available.
                              </div>
                            )}
                            {Array.isArray(module.lessons) &&
                              module.lessons.length > 3 && (
                                <div className="text-sm text-muted-foreground ml-6 p-2 bg-accent/10 rounded">
                                  +{module.lessons.length - 3} more lessons
                                </div>
                              )}
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="hover-scale"
                >
                  <Card className="border-border/20 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Course Reviews
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
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
                          {reviews.map((review, index) => (
                            <motion.div 
                              key={review.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="border-b pb-4 last:border-b-0 p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-semibold">{review.userName}</h4>
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
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
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="hover-scale"
                >
                  <Card className="border-border/20 bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-lg">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        Instructor
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <motion.img
                          whileHover={{ scale: 1.05 }}
                          src={course.expert?.avatar}
                          alt={course.expert?.name || "Instructor"}
                          className="w-16 h-16 rounded-full object-cover shadow-lg"
                        />
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">
                            {course.expert?.name || "Unknown"}
                          </h3>
                          <p className="text-sm text-primary mb-2 font-medium">
                            {course.expert?.title || "Unknown"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {course.expert?.bio || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="sticky top-24 border-border/20 bg-card/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-4xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text mb-2"
                      >
                        ${course.price || "Free"}
                      </motion.div>
                      <div className="text-sm text-muted-foreground mb-4">
                        Course Price
                      </div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-2xl font-bold text-primary mb-2"
                      >
                        {typeof course.enrolledStudents === "number"
                          ? course.enrolledStudents
                          : 0}
                      </motion.div>
                      <div className="text-sm text-muted-foreground">
                        Enrolled Students
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className="w-full mb-4 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
                        size="lg"
                        onClick={handleEnrollRedirect}
                      >
                        {isEnrolled ? "Enrolled" : "Enroll Now"}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;