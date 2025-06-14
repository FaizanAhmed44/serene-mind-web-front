
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Users, Star, Play, BookOpen, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getCourseById } from "@/data/courses";

const CourseDetail = () => {
  const { id } = useParams();
  const [activeLesson, setActiveLesson] = useState(0);
  
  const course = getCourseById(id || "0");
  
  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Link to="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const lessons = [
    { id: 1, title: "Introduction to Mindfulness", duration: "15 min", completed: true },
    { id: 2, title: "Breathing Techniques", duration: "20 min", completed: true },
    { id: 3, title: "Body Scan Meditation", duration: "25 min", completed: false },
    { id: 4, title: "Mindful Walking", duration: "18 min", completed: false },
    { id: 5, title: "Advanced Techniques", duration: "30 min", completed: false },
  ];

  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const progressPercentage = (completedLessons / lessons.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/dashboard">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-600 mt-1">by {course.instructor.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Content */}
        <div className="lg:col-span-2">
          {/* Video Player Placeholder */}
          <Card className="mb-6">
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="h-16 w-16 mx-auto mb-4 opacity-80" />
                  <h3 className="text-xl font-semibold mb-2">{lessons[activeLesson].title}</h3>
                  <p className="text-gray-300">Duration: {lessons[activeLesson].duration}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">About This Course</h2>
              <p className="text-gray-600 mb-4">
                {course.longDescription}
              </p>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Total: {course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{lessons.length} Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Certificate Included</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Progress */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Completed</span>
                  <span>{completedLessons} of {lessons.length} lessons</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-sm text-gray-600">{Math.round(progressPercentage)}% Complete</p>
              </div>
            </CardContent>
          </Card>

          {/* Lessons List */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Course Lessons</h3>
              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      activeLesson === index 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveLesson(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          lesson.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {lesson.completed ? '✓' : index + 1}
                        </div>
                        <div>
                          <p className={`font-medium ${activeLesson === index ? 'text-blue-600' : 'text-gray-900'}`}>
                            {lesson.title}
                          </p>
                          <p className="text-sm text-gray-500">{lesson.duration}</p>
                        </div>
                      </div>
                      {activeLesson === index && (
                        <Play className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enroll Button */}
          <Link to={`/courses/${course.id}/enroll`}>
            <Button className="w-full" size="lg">
              Continue Learning
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
