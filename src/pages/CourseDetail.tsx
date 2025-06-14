
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Clock, Users, BookOpen, Download, Play, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface CourseInstructor {
  name: string;
  title: string;
  bio: string;
  photo: string;
}

interface CourseReview {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface CourseLesson {
  title: string;
  duration: string;
  videoUrl: string;
}

interface CourseModule {
  title: string;
  lessons: CourseLesson[];
}

interface CourseResource {
  name: string;
  type: string;
  url: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  instructor: CourseInstructor;
  duration: string;
  rating: number;
  students: number;
  price: string;
  tags: string[];
  progress: number;
  reviews: CourseReview[];
  modules: CourseModule[];
  resources: CourseResource[];
}

const CourseDetail = () => {
  const { id } = useParams();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Mock course data - this would normally come from an API
  const course: Course = {
    id: 1,
    title: "Mindfulness and Stress Management",
    description: "Learn evidence-based techniques for managing stress, anxiety, and building resilience through mindfulness practices. This comprehensive course covers meditation, breathing exercises, and cognitive strategies.",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
    instructor: {
      name: "Dr. Sarah Wilson",
      title: "Clinical Psychologist & Mindfulness Expert",
      bio: "Dr. Wilson has over 15 years of experience in clinical psychology and mindfulness-based interventions.",
      photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face"
    },
    duration: "6 weeks",
    rating: 4.8,
    students: 1247,
    price: "$79",
    tags: ["Mindfulness", "Stress Management", "Mental Health"],
    progress: 65,
    reviews: [
      {
        name: "Emily R.",
        rating: 5,
        comment: "This course completely changed my approach to stress. The techniques are practical and easy to implement.",
        date: "2 weeks ago"
      },
      {
        name: "Michael T.",
        rating: 5,
        comment: "Dr. Wilson's teaching style is clear and compassionate. Highly recommend this course.",
        date: "1 month ago"
      }
    ],
    modules: [
      {
        title: "Introduction to Mindfulness",
        lessons: [
          { title: "What is Mindfulness?", duration: "12 min", videoUrl: "#" },
          { title: "Benefits of Mindful Living", duration: "15 min", videoUrl: "#" },
          { title: "Getting Started", duration: "10 min", videoUrl: "#" }
        ]
      },
      {
        title: "Breathing Techniques",
        lessons: [
          { title: "Basic Breathing Exercises", duration: "18 min", videoUrl: "#" },
          { title: "Advanced Techniques", duration: "20 min", videoUrl: "#" }
        ]
      }
    ],
    resources: [
      { name: "Mindfulness Workbook", type: "PDF", url: "#" },
      { name: "Guided Meditation Audio", type: "MP3", url: "#" },
      { name: "Progress Tracker", type: "PDF", url: "#" }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-foreground">Course Details</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Course Header */}
        <Card className="animate-fade-in">
          <CardContent className="p-0">
            <div className="relative h-64 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-t-lg overflow-hidden">
              <img 
                src={course.imageUrl} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end">
                <div className="p-8 text-white">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-white/20 text-white">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{course.description}</p>
              </CardContent>
            </Card>

            {/* Course Modules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Course Content</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-3">{module.title}</h3>
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded">
                          <div className="flex items-center space-x-3">
                            <Play className="h-4 w-4 text-primary" />
                            <span className="text-sm text-foreground">{lesson.title}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                        </div>
                      ))}
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
                    <h3 className="font-semibold text-foreground">{course.instructor.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{course.instructor.title}</p>
                    <p className="text-sm text-muted-foreground">{course.instructor.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.reviews.map((review, index) => (
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-primary mb-2">{course.price}</div>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>

                <Button className="w-full mb-4" size="lg">
                  Continue Learning
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsReviewModalOpen(true)}
                >
                  Leave a Review
                </Button>
              </CardContent>
            </Card>

            {/* Resources */}
            {course.resources && course.resources.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="h-5 w-5" />
                    <span>Resources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {course.resources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{resource.name}</p>
                        <p className="text-xs text-muted-foreground">{resource.type}</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
