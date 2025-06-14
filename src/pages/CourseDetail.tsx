import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Clock, Users, PlayCircle, Download, Award, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Course } from "@/data/courses";
import ReviewDialog from "@/components/ReviewDialog";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  // Mock course data - replace with actual data fetching
  const course: Course = {
    id: 1,
    title: "Mindfulness Meditation for Beginners",
    instructor: "Dr. Emily Carter",
    description: "Learn the basics of mindfulness meditation and reduce stress in your daily life.",
    duration: "6 weeks",
    lessons: 12,
    students: 456,
    rating: 4.8,
    reviews: 89,
    progress: 75,
    tags: ["Mindfulness", "Meditation", "Stress Reduction"],
    modules: [
      {
        title: "Introduction to Mindfulness",
        lessons: [
          { title: "What is Mindfulness?", duration: "15 min", videoUrl: "https://example.com/video1" },
          { title: "Benefits of Meditation", duration: "20 min", videoUrl: "https://example.com/video2" }
        ]
      },
      {
        title: "Basic Meditation Techniques",
        lessons: [
          { title: "Breath Awareness", duration: "25 min", videoUrl: "https://example.com/video3" },
          { title: "Body Scan Meditation", duration: "30 min", videoUrl: "https://example.com/video4" }
        ]
      },
      {
        title: "Mindfulness in Daily Life",
        lessons: [
          { title: "Mindful Eating", duration: "15 min", videoUrl: "https://example.com/video5" },
          { title: "Mindful Walking", duration: "20 min", videoUrl: "https://example.com/video6" }
        ]
      }
    ],
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    resources: [
      { title: "Guided Meditation Script", url: "https://example.com/script.pdf" },
      { title: "Mindfulness Exercises", url: "https://example.com/exercises.pdf" }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-foreground">Course Detail</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Course Header */}
        <Card className="animate-fade-in">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="relative mb-4">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="rounded-lg object-cover w-full h-64"
                  />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{course.title}</h1>
                <p className="text-lg text-muted-foreground mb-4">
                  {course.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{course.rating}</span>
                    <span className="text-muted-foreground">({course.reviews} reviews)</span>
                  </div>
                  <span className="text-muted-foreground">{course.lessons} lessons</span>
                  <span className="text-muted-foreground">{course.duration}</span>
                </div>
              </div>
              
              <div className="lg:border-l lg:border-muted-foreground/20 lg:pl-8 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Instructor</h3>
                  <p className="text-muted-foreground">{course.instructor}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Progress</h3>
                  <Progress value={course.progress} className="mb-2" />
                  <p className="text-muted-foreground">{course.progress}% completed</p>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <Button onClick={() => navigate(`/courses/${course.id}/enroll`)}>
                    Continue Learning
                  </Button>
                  <Button variant="outline" onClick={() => setIsReviewDialogOpen(true)}>
                    Add a Review
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Content */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Course Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="modules" className="w-full">
              <TabsList>
                <TabsTrigger value="modules">Modules</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              <TabsContent value="modules" className="space-y-4">
                {course.modules.map((module, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">{module.title}</h3>
                    <ul className="space-y-1">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <li key={lessonIndex} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <PlayCircle className="h-4 w-4 text-primary" />
                            <span>{lesson.title}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="resources" className="space-y-4">
                {course.resources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Download className="h-4 w-4 text-primary" />
                      <span>{resource.title}</span>
                    </div>
                    <Button variant="link" className="p-0 h-auto" onClick={() => window.open(resource.url, '_blank')}>
                      Download
                    </Button>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Reviews Section */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                name: "Alice Johnson",
                rating: 5,
                comment: "This course is amazing! I've learned so much about mindfulness.",
                date: "2 weeks ago"
              },
              {
                name: "Bob Williams",
                rating: 4,
                comment: "Great course, but I wish there were more resources.",
                date: "1 month ago"
              }
            ].map((review, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-foreground">{review.name}</h4>
                  <div className="flex items-center space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mb-2">{review.comment}</p>
                <span className="text-sm text-muted-foreground">{review.date}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Review Dialog */}
      <ReviewDialog isOpen={isReviewDialogOpen} onClose={() => setIsReviewDialogOpen(false)} />
    </div>
  );
};

export default CourseDetail;
