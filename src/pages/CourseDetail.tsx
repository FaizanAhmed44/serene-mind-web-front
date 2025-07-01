
// // ll
// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Star, Clock, Users, BookOpen, ChevronRight, Award, Globe, BarChart3 } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { VideoPlayer } from "@/components/VideoPlayer";
// import { CourseSidebar } from "@/components/CourseSidebar";
// import { useCourse, useUserEnrolledCourses } from "@/hooks/useCourses";
// import { useAuth } from "@/hooks/useAuth";

// const CourseDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [currentLessonId, setCurrentLessonId] = useState("1-1");

//   const { data: course, isLoading, error } = useCourse(id || "");
//   const { data: enrolledCourses = [], isLoading: enrolledLoading } = useUserEnrolledCourses(user?.id || "");

//   useEffect(() => {
//     if (id && enrolledCourses) {
//       setIsEnrolled(enrolledCourses.some((c) => c.id === id));
//     }
//   }, [id, enrolledCourses]);

//   if (isLoading || enrolledLoading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
//           <div className="flex items-center justify-between p-4">
//             <SidebarTrigger />
//             <h1 className="text-xl font-semibold truncate">Loading...</h1>
//             <div className="w-10" />
//           </div>
//         </div>
//         <div className="container mx-auto px-4 py-6">
//           <div className="text-center">Loading course details...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !course) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
//           <div className="flex items-center justify-between p-4">
//             <SidebarTrigger />
//             <h1 className="text-xl font-semibold truncate">Course Not Found</h1>
//             <div className="w-10" />
//           </div>
//         </div>
//         <div className="container mx-auto px-4 py-6">
//           <div className="text-center">Course not found</div>
//         </div>
//       </div>
//     );
//   }

//   // Use backend modules, with fallback for empty modules
//   const courseModules = course.modules_detail.length > 0
//     ? course.modules_detail.map((module, index) => ({
//         id: `module-${index + 1}`,
//         title: module.title,
//         progress: 0, // Not in backend
//         lessons: module.lessons.map((lesson, lessonIndex) => ({
//           id: `lesson-${index + 1}-${lessonIndex + 1}`,
//           title: lesson,
//           duration: module.duration || 'Unknown',
//           completed: false,
//           current: lessonIndex === 0 && index === 0,
//           locked: !isEnrolled,
//         })),
//       }))
//     : [
//         {
//           id: "1",
//           title: "Introduction",
//           progress: 0,
//           lessons: [
//             { id: "1-1", title: "Course Overview", duration: "Unknown", completed: false, current: true, locked: !isEnrolled },
//           ],
//         },
//       ];

//   const currentLesson = courseModules
//     .flatMap(m => m.lessons)
//     .find(l => l.id === currentLessonId) || { title: "Course Introduction", duration: "Unknown" };

//   const handleLessonSelect = (lessonId: string) => {
//     setCurrentLessonId(lessonId);
//   };

//   const handleEnrollRedirect = () => {
//     navigate(`/courses/${course.id}/enroll`);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
//         <div className="flex items-center justify-between p-4">
//           <SidebarTrigger />
//           <h1 className="text-xl font-semibold truncate">{course.title}</h1>
//           <div className="w-10" />
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-6">
//         {isEnrolled ? (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 space-y-6">
//               <VideoPlayer
//                 videoUrl="#"
//                 title={currentLesson.title}
//                 duration={currentLesson.duration}
//                 hasNext={true}
//                 hasPrevious={true}
//               />
//               <Card>
//                 <CardHeader>
//                   <CardTitle>About this course</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-muted-foreground leading-relaxed mb-4">
//                     {course.longDescription}
//                   </p>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-primary">{course.modules}</div>
//                       <div className="text-sm text-muted-foreground">Modules</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-primary">{course.duration}</div>
//                       <div className="text-sm text-muted-foreground">Duration</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-primary">{course.level}</div>
//                       <div className="text-sm text-muted-foreground">Level</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-primary">{course.language}</div>
//                       <div className="text-sm text-muted-foreground">Language</div>
//                     </div>
//                   </div>
//                   <div className="space-y-4">
//                     <h4 className="font-semibold">What you'll learn</h4>
//                     <div className="grid gap-2">
//                       {course.outcomes.map((outcome, index) => (
//                         <div key={index} className="flex items-start space-x-2">
//                           <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
//                           <span className="text-sm text-muted-foreground">{outcome}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//             <div>
//               <CourseSidebar
//                 modules={courseModules}
//                 onLessonSelect={handleLessonSelect}
//                 isEnrolled={isEnrolled}
//               />
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-8">
//             <div className="relative">
//               <div className="aspect-video bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg overflow-hidden">
//                 <img
//                   src={course.image}
//                   alt={course.title}
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
//                   <Button size="lg" className="rounded-full w-16 h-16">
//                     <BookOpen className="h-8 w-8" />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               <div className="lg:col-span-2 space-y-6">
//                 <div>
//                   <div className="flex flex-wrap gap-2 mb-4">
//                     <Badge variant="secondary">{course.category}</Badge>
//                     <Badge variant="outline">{course.level}</Badge>
//                     {course.certificate && <Badge variant="outline">Certificate</Badge>}
//                   </div>
//                   <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
//                   <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
//                   <div className="flex items-center space-x-6 text-sm">
//                     <div className="flex items-center space-x-1">
//                       <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                       <span className="font-medium">{course.rating.toFixed(1)}</span>
//                       <span className="text-muted-foreground">({course.students} students)</span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <Clock className="h-4 w-4" />
//                       <span>{course.duration}</span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <Globe className="h-4 w-4" />
//                       <span>{course.language}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Course content</CardTitle>
//                     <p className="text-sm text-muted-foreground">
//                       {course.modules} modules • {course.modules_detail.reduce((acc, mod) => acc + mod.lessons.length, 0)} lessons
//                     </p>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {course.modules_detail.map((module, index) => (
//                       <div key={index} className="border rounded-lg p-4">
//                         <div className="flex justify-between items-center mb-3">
//                           <h4 className="font-medium">Week {module.week}: {module.title}</h4>
//                           <span className="text-sm text-muted-foreground">{module.duration}</span>
//                         </div>
//                         <div className="space-y-2">
//                           {module.lessons.slice(0, 3).map((lesson, lessonIndex) => (
//                             <div key={lessonIndex} className="flex items-center text-sm text-muted-foreground">
//                               <ChevronRight className="h-4 w-4 mr-2" />
//                               {lesson}
//                             </div>
//                           ))}
//                           {module.lessons.length > 3 && (
//                             <div className="text-sm text-muted-foreground ml-6">
//                               +{module.lessons.length - 3} more lessons
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Instructor</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex items-start space-x-4">
//                       <img
//                         src={course.instructor.photo}
//                         alt={course.instructor.name}
//                         className="w-16 h-16 rounded-full object-cover"
//                       />
//                       <div>
//                         <h3 className="font-semibold">{course.instructor.name}</h3>
//                         <p className="text-sm text-muted-foreground mb-2">{course.instructor.title}</p>
//                         <p className="text-sm text-muted-foreground">{course.instructor.bio}</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//               <div>
//                 <Card className="sticky top-24">
//                   <CardContent className="p-6">
//                     <div className="text-center mb-6">
//                       <div className="text-3xl font-bold text-primary mb-2">{course.price}</div>
//                     </div>
//                     <Button className="w-full mb-4" size="lg" onClick={handleEnrollRedirect}>
//                       Enroll Now
//                     </Button>
//                     <div className="space-y-3 text-sm">
//                       <div className="flex items-center space-x-2">
//                         <Award className="h-4 w-4 text-primary" />
//                         <span>Certificate of completion</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Users className="h-4 w-4 text-primary" />
//                         <span>{course.students} students enrolled</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <BarChart3 className="h-4 w-4 text-primary" />
//                         <span>{course.level} level</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Globe className="h-4 w-4 text-primary" />
//                         <span>{course.language} language</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseDetail;

// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Star, Clock, Users, BookOpen, ChevronRight, Award, Globe, BarChart3 } from "lucide-react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { VideoPlayer } from "@/components/VideoPlayer";
// import { CourseSidebar } from "@/components/CourseSidebar";
// import { useCourse, useUserEnrolledCourses } from "@/hooks/useCourses";
// import { useAuth } from "@/hooks/useAuth";

// const CourseDetail = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [isEnrolled, setIsEnrolled] = useState(false);
//   const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);

//   const { data: course, isLoading, error } = useCourse(id || "");
//   const { data: enrolledCourses = [], isLoading: enrolledLoading } = useUserEnrolledCourses(user?.id || "");

//   useEffect(() => {
//     if (id && enrolledCourses) {
//       // Check if the current course ID matches any enrolled course ID
//       setIsEnrolled(enrolledCourses.some((c) => c.id === id));
//     }
//   }, [id, enrolledCourses]);

//   useEffect(() => {
//     // Set the first lesson as current when course data loads and user is enrolled
//     if (course && isEnrolled && course.modules_detail.length > 0 && !currentLessonId) {
//       setCurrentLessonId(`lesson-1-1`);
//     }
//   }, [course, isEnrolled, currentLessonId]);

//   if (isLoading || enrolledLoading) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
//           <div className="flex items-center justify-between p-4">
//             <SidebarTrigger />
//             <h1 className="text-xl font-semibold truncate">Loading...</h1>
//             <div className="w-10" />
//           </div>
//         </div>
//         <div className="container mx-auto px-4 py-6">
//           <div className="text-center">Loading course details...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !course) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
//           <div className="flex items-center justify-between p-4">
//             <SidebarTrigger />
//             <h1 className="text-xl font-semibold truncate">Course Not Found</h1>
//             <div className="w-10" />
//           </div>
//         </div>
//         <div className="container mx-auto px-4 py-6">
//           <div className="text-center">Course not found</div>
//         </div>
//       </div>
//     );
//   }

//   // Map backend modules to frontend structure for CourseSidebar
//   const courseModules = course.modules_detail.length > 0
//     ? course.modules_detail.map((module, index) => ({
//         id: `module-${index + 1}`,
//         title: module.title,
//         progress: 0, // Not tracked in backend
//         lessons: module.lessons.map((lesson, lessonIndex) => ({
//           id: `lesson-${index + 1}-${lessonIndex + 1}`,
//           title: lesson.title, // Use lesson title from BackendLesson
//           duration: lesson.duration || module.duration || 'Unknown', // Prefer lesson duration
//           completed: false, // Not tracked in backend
//           current: `lesson-${index + 1}-${lessonIndex + 1}` === currentLessonId,
//           locked: !isEnrolled,
//           videoUrl: lesson.videoUrl || lesson.content || null, // Include videoUrl for VideoPlayer
//         })),
//       }))
//     : [
//         {
//           id: "1",
//           title: "Introduction",
//           progress: 0,
//           lessons: [
//             {
//               id: "1-1",
//               title: "Course Overview",
//               duration: "Unknown",
//               completed: false,
//               current: true,
//               locked: !isEnrolled,
//               videoUrl: null,
//             },
//           ],
//         },
//       ];

//   const currentLesson = courseModules
//     .flatMap(m => m.lessons)
//     .find(l => l.id === currentLessonId) || {
//       title: "Course Introduction",
//       duration: "Unknown",
//       videoUrl: null,
//     };

//   const handleLessonSelect = (lessonId: string) => {
//     setCurrentLessonId(lessonId);
//   };

//   const handleEnrollRedirect = () => {
//     navigate(`/courses/${course.id}/enroll`);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
//         <div className="flex items-center justify-between p-4">
//           <SidebarTrigger />
//           <h1 className="text-xl font-semibold truncate">{course.title}</h1>
//           <div className="w-10" />
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-6">
//         {isEnrolled ? (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 space-y-6">
//               <VideoPlayer
//                 videoUrl={currentLesson.videoUrl || "#"}
//                 title={currentLesson.title}
//                 duration={currentLesson.duration}
//                 hasNext={courseModules.some(m => m.lessons.some(l => l.id !== currentLessonId))}
//                 hasPrevious={courseModules.some(m => m.lessons.some(l => l.id !== currentLessonId))}
//               />
//               <Card>
//                 <CardHeader>
//                   <CardTitle>About this course</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-muted-foreground leading-relaxed mb-4">
//                     {course.longDescription}
//                   </p>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-primary">{course.modules}</div>
//                       <div className="text-sm text-muted-foreground">Modules</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-primary">{course.duration}</div>
//                       <div className="text-sm text-muted-foreground">Duration</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-primary">{course.level}</div>
//                       <div className="text-sm text-muted-foreground">Level</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-primary">{course.language}</div>
//                       <div className="text-sm text-muted-foreground">Language</div>
//                     </div>
//                   </div>
//                   <div className="space-y-4">
//                     <h4 className="font-semibold">What you'll learn</h4>
//                     <div className="grid gap-2">
//                       {course.outcomes.map((outcome, index) => (
//                         <div key={index} className="flex items-start space-x-2">
//                           <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
//                           <span className="text-sm text-muted-foreground">{outcome}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//             <div>
//               <CourseSidebar
//                 modules={courseModules}
//                 onLessonSelect={handleLessonSelect}
//                 isEnrolled={isEnrolled}
//               />
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-8">
//             <div className="relative">
//               <div className="aspect-video bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg overflow-hidden">
//                 <img
//                   src={course.image}
//                   alt={course.title}
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
//                   <Button size="lg" className="rounded-full w-16 h-16" onClick={handleEnrollRedirect}>
//                     <BookOpen className="h-8 w-8" />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               <div className="lg:col-span-2 space-y-6">
//                 <div>
//                   <div className="flex flex-wrap gap-2 mb-4">
//                     <Badge variant="secondary">{course.category}</Badge>
//                     <Badge variant="outline">{course.level}</Badge>
//                     {course.certificate && <Badge variant="outline">Certificate</Badge>}
//                   </div>
//                   <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
//                   <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
//                   <div className="flex items-center space-x-6 text-sm">
//                     <div className="flex items-center space-x-1">
//                       <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                       <span className="font-medium">{course.rating.toFixed(1)}</span>
//                       <span className="text-muted-foreground">({course.students} students)</span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <Clock className="h-4 w-4" />
//                       <span>{course.duration}</span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <Globe className="h-4 w-4" />
//                       <span>{course.language}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Course content</CardTitle>
//                     <p className="text-sm text-muted-foreground">
//                       {course.modules} modules • {course.modules_detail.reduce((acc, mod) => acc + mod.lessons.length, 0)} lessons
//                     </p>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {course.modules_detail.map((module, index) => (
//                       <div key={index} className="border rounded-lg p-4">
//                         <div className="flex justify-between items-center mb-3">
//                           <h4 className="font-medium">Module {module.week}: {module.title}</h4>
//                           <span className="text-sm text-muted-foreground">{module.duration}</span>
//                         </div>
//                         <div className="space-y-2">
//                           {module.lessons.slice(0, 3).map((lesson, lessonIndex) => (
//                             <div key={lessonIndex} className="flex items-center text-sm text-muted-foreground">
//                               <ChevronRight className="h-4 w-4 mr-2" />
//                               {lesson.title}
//                             </div>
//                           ))}
//                           {module.lessons.length > 3 && (
//                             <div className="text-sm text-muted-foreground ml-6">
//                               +{module.lessons.length - 3} more lessons
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Instructor</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex items-start space-x-4">
//                       <img
//                         src={course.instructor.photo}
//                         alt={course.instructor.name}
//                         className="w-16 h-16 rounded-full object-cover"
//                       />
//                       <div>
//                         <h3 className="font-semibold">{course.instructor.name}</h3>
//                         <p className="text-sm text-muted-foreground mb-2">{course.instructor.title}</p>
//                         <p className="text-sm text-muted-foreground">{course.instructor.bio}</p>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//               <div>
//                 <Card className="sticky top-24">
//                   <CardContent className="p-6">
//                     <div className="text-center mb-6">
//                       <div className="text-3xl font-bold text-primary mb-2">{course.price}</div>
//                     </div>
//                     <Button className="w-full mb-4" size="lg" onClick={handleEnrollRedirect}>
//                       Enroll Now
//                     </Button>
//                     <div className="space-y-3 text-sm">
//                       <div className="flex items-center space-x-2">
//                         <Award className="h-4 w-4 text-primary" />
//                         <span>Certificate of completion</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Users className="h-4 w-4 text-primary" />
//                         <span>{course.students} students enrolled</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <BarChart3 className="h-4 w-4 text-primary" />
//                         <span>{course.level} level</span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Globe className="h-4 w-4 text-primary" />
//                         <span>{course.language} language</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CourseDetail;



import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Clock, Users, BookOpen, ChevronRight, Award, Globe, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { CourseSidebar } from "@/components/CourseSidebar";
import { useCourse, useUserEnrolledCourses } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useAuth";

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);

  const { data: course, isLoading, error } = useCourse(id || "");
  const { data: enrolledCourses = [], isLoading: enrolledLoading } = useUserEnrolledCourses(user?.id || "");

  useEffect(() => {
    if (id && enrolledCourses) {
      setIsEnrolled(enrolledCourses.some((c) => c.id === id));
    }
  }, [id, enrolledCourses]);

  useEffect(() => {
    if (course && isEnrolled && course.modules_detail.length > 0 && !currentLessonId) {
      setCurrentLessonId(`lesson-1-1`);
    }
  }, [course, isEnrolled, currentLessonId]);

  if (isLoading || enrolledLoading) {
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

  // Map backend modules to frontend structure for CourseSidebar
  const courseModules = course.modules_detail.length > 0
    ? course.modules_detail.map((module, index) => ({
        id: `module-${index + 1}`,
        title: module.title,
        progress: 0,
        lessons: module.lessons.map((lesson, lessonIndex) => ({
          id: `lesson-${index + 1}-${lessonIndex + 1}`,
          title: lesson.title,
          duration: lesson.duration || module.duration || 'Unknown',
          completed: false,
          current: `lesson-${index + 1}-${lessonIndex + 1}` === currentLessonId,
          locked: !isEnrolled,
          videoUrl: lesson.videoUrl || lesson.content || null,
        })),
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
              videoUrl: null,
            },
          ],
        },
      ];

  const currentLesson = courseModules
    .flatMap(m => m.lessons)
    .find(l => l.id === currentLessonId) || {
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
          <div className="w-10" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {isEnrolled ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <VideoPlayer
                videoUrl={currentLesson.videoUrl || "#"}
                title={currentLesson.title}
                duration={currentLesson.duration}
                hasNext={courseModules.some(m => m.lessons.some(l => l.id !== currentLessonId))}
                hasPrevious={courseModules.some(m => m.lessons.some(l => l.id !== currentLessonId))}
              />
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
                      <div className="text-2xl font-bold text-primary">{course.level || 'Beginner'}</div>
                      <div className="text-sm text-muted-foreground">Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{course.language || 'English'}</div>
                      <div className="text-sm text-muted-foreground">Language</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">What you'll learn</h4>
                    <div className="grid gap-2">
                      {course.outcomes.length > 0 ? (
                        course.outcomes.map((outcome, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{outcome}</span>
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
              <div className="aspect-video bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg overflow-hidden">
                <img
                  src={course.image || 'https://via.placeholder.com/1200x600'}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button size="lg" className="rounded-full w-16 h-16" onClick={handleEnrollRedirect}>
                    <BookOpen className="h-8 w-8" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">{course.category || 'General'}</Badge>
                    <Badge variant="outline">{course.level || 'Beginner'}</Badge>
                    {course.certificate && <Badge variant="outline">Certificate</Badge>}
                  </div>
                  <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                  <p className="text-lg text-muted-foreground mb-6">{course.description}</p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{course.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({course.students} students)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4" />
                      <span>{course.language || 'English'}</span>
                    </div>
                  </div>
                </div>
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
                          <h4 className="font-medium">Module {module.week}: {module.title}</h4>
                          <span className="text-sm text-muted-foreground">{module.duration}</span>
                        </div>
                        <div className="space-y-2">
                          {module.lessons.slice(0, 3).map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="flex items-center text-sm text-muted-foreground">
                              <ChevronRight className="h-4 w-4 mr-2" />
                              {lesson.title}
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
                <Card>
                  <CardHeader>
                    <CardTitle>Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <img
                        src={course.instructor.photo || 'https://via.placeholder.com/64'}
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
              <div>
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-primary mb-2">{course.price}</div>
                    </div>
                    <Button className="w-full mb-4" size="lg" onClick={handleEnrollRedirect}>
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
                        <span>{course.level || 'Beginner'} level</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <span>{course.language || 'English'} language</span>
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
