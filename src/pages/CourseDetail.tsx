
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Clock, 
  Book, 
  Star, 
  User, 
  Calendar, 
  CheckCircle, 
  Play, 
  Award,
  Globe,
  Users,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarTrigger } from "@/components/ui/sidebar";

const courseData = {
  "1": {
    id: 1,
    title: "Overcoming Anxiety",
    description: "Learn practical techniques to manage and reduce anxiety in daily life through evidence-based cognitive behavioral therapy methods.",
    longDescription: "This comprehensive course provides you with the tools and strategies needed to understand, manage, and overcome anxiety. Through a combination of theoretical knowledge and practical exercises, you'll learn how anxiety works, identify your personal triggers, and develop a toolkit of coping strategies that you can use in any situation.",
    duration: "6 weeks",
    modules: 12,
    category: "Anxiety",
    instructor: {
      name: "Dr. Sarah Johnson",
      title: "Licensed Clinical Psychologist",
      bio: "Dr. Sarah Johnson has over 12 years of experience in clinical psychology, specializing in anxiety disorders and cognitive behavioral therapy.",
      photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face"
    },
    rating: 4.8,
    students: 2847,
    progress: 0,
    price: "$149",
    language: "English",
    level: "Beginner",
    certificate: true,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=450&fit=crop",
    outcomes: [
      "Understand the science behind anxiety and how it affects your body and mind",
      "Identify personal anxiety triggers and develop awareness of your patterns",
      "Master breathing techniques and progressive muscle relaxation",
      "Learn cognitive restructuring to challenge anxious thoughts",
      "Develop a personalized anxiety management plan",
      "Build confidence in handling anxiety-provoking situations"
    ],
    modules_detail: [
      {
        week: 1,
        title: "Understanding Anxiety",
        lessons: [
          "What is Anxiety? The Science Behind It",
          "Types of Anxiety Disorders",
          "Identifying Your Anxiety Triggers"
        ],
        duration: "2 hours"
      },
      {
        week: 2,
        title: "Physical Techniques",
        lessons: [
          "Breathing Exercises for Immediate Relief",
          "Progressive Muscle Relaxation",
          "Grounding Techniques"
        ],
        duration: "2.5 hours"
      },
      {
        week: 3,
        title: "Cognitive Strategies",
        lessons: [
          "Challenging Negative Thoughts",
          "Cognitive Restructuring Techniques",
          "Building Positive Self-Talk"
        ],
        duration: "3 hours"
      }
    ],
    reviews: [
      {
        name: "Emily Rodriguez",
        rating: 5,
        comment: "This course completely changed my approach to managing anxiety. The practical techniques are easy to implement and really work!",
        date: "2 weeks ago"
      },
      {
        name: "Michael Chen",
        rating: 5,
        comment: "Dr. Johnson's expertise really shows. The content is well-structured and the exercises are incredibly helpful.",
        date: "1 month ago"
      }
    ]
  }
};

const CourseDetail = () => {
  const { id } = useParams();
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  
  const course = courseData[id as keyof typeof courseData];

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
          <Button asChild>
            <Link to="/">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <div className="text-center">
            <h1 className="text-lg font-semibold text-foreground">Course Details</h1>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-fade-in">
              <div className="mb-4">
                <Badge className="mb-4">{course.category}</Badge>
                <h1 className="text-4xl font-bold text-foreground mb-4">{course.title}</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {course.description}
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating}</span>
                  <span>({course.students.toLocaleString()} students)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Book className="h-4 w-4" />
                  <span>{course.modules} modules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>{course.language}</span>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg animate-slide-up">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Button size="lg" className="bg-white text-black hover:bg-white/90">
                  <Play className="h-5 w-5 mr-2" />
                  Preview Course
                </Button>
              </div>
            </div>
          </div>

          {/* Enrollment Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 animate-slide-up">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">{course.price}</div>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </div>
                
                {course.progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Your Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-3" />
                  </div>
                )}
                
                <Button className="w-full" size="lg" asChild>
                  <Link to={`/courses/${course.id}/enroll`}>
                    {course.progress > 0 ? "Continue Learning" : "Enroll Now"}
                  </Link>
                </Button>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Mobile and desktop access</span>
                  </div>
                  {course.certificate && (
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-green-500" />
                      <span>Certificate of completion</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span>Expert support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content Tabs */}
        <Tabs defaultValue="overview" className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {course.longDescription}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{course.duration}</div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Book className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{course.modules} Modules</div>
                    <div className="text-sm text-muted-foreground">Content</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{course.level}</div>
                    <div className="text-sm text-muted-foreground">Level</div>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-4">What You'll Learn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.outcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{outcome}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="curriculum" className="space-y-4">
            {course.modules_detail.map((module, index) => (
              <Card key={index}>
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedModule(expandedModule === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Week {module.week}: {module.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{module.duration} • {module.lessons.length} lessons</p>
                    </div>
                    {expandedModule === index ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </CardHeader>
                {expandedModule === index && (
                  <CardContent>
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded">
                          <Play className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{lesson}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="instructor">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={course.instructor.photo}
                    alt={course.instructor.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{course.instructor.name}</h3>
                    <p className="text-muted-foreground mb-2">{course.instructor.title}</p>
                    <p className="text-sm leading-relaxed">{course.instructor.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {course.reviews.map((review, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{review.name}</h4>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetail;
