
// import { useState } from "react";
// import { Search, Clock, Book, Star, User } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { Progress } from "@/components/ui/progress";
// import { FavoriteButton } from "@/components/FavoriteButton";
// import { Link } from "react-router-dom";
// import { useCourses } from "@/hooks/useCourses";
// import { useCategories } from "@/hooks/useIndexCourses";
// import type { Course } from "@/data/types/course";

// const Index = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   const { data: courses = [], isLoading: coursesLoading } = useCourses();
//   const { data: categories = [], isLoading: categoriesLoading } = useCategories();

//   const filteredCourses = courses.filter((course: Course) => {
//     const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   if (coursesLoading || categoriesLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
//         <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
//           <div className="flex items-center justify-between p-4">
//             <SidebarTrigger />
//             <div className="flex-1 max-w-md mx-auto">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                 <Input
//                   placeholder="Search courses..."
//                   disabled
//                   className="pl-10"
//                 />
//               </div>
//             </div>
//             <div className="w-10" />
//           </div>
//         </div>
//         <div className="p-6 space-y-8">
//           <div className="text-center py-8">
//             <div className="animate-pulse">
//               <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
//               <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {[...Array(8)].map((_, i) => (
//               <Card key={i} className="animate-pulse">
//                 <div className="h-48 bg-gray-300 rounded-t-lg"></div>
//                 <CardHeader>
//                   <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//                   <div className="h-3 bg-gray-300 rounded w-full"></div>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <div className="h-3 bg-gray-300 rounded w-1/2"></div>
//                   <div className="h-3 bg-gray-300 rounded w-2/3"></div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
//       <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
//         <div className="flex items-center justify-between p-4">
//           <SidebarTrigger />
//           <div className="flex-1 max-w-md mx-auto">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//               <Input
//                 placeholder="Search courses..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </div>
//           <div className="w-10" />
//         </div>
//       </div>

//       <div className="p-6 space-y-8">
//         <div className="text-center py-8 animate-fade-in">
//           <h1 className="text-4xl font-bold text-foreground mb-4">
//             Transform Your Mental Wellness Journey
//           </h1>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             Discover evidence-based courses and connect with expert therapists to overcome anxiety, 
//             build confidence, and improve your mental health.
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-2 justify-center animate-slide-up">
//           {categories.map((category) => (
//             <Button
//               key={category}
//               variant={selectedCategory === category ? "default" : "outline"}
//               onClick={() => setSelectedCategory(category)}
//               className="transition-all"
//             >
//               {category}
//             </Button>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredCourses.map((course: Course) => (
//             <Card key={course.id} className="hover-lift cursor-pointer group">
//               <Link to={`/courses/${course.id}`}>
//                 <div className="relative overflow-hidden rounded-t-lg">
//                   <img
//                     src={course.image}
//                     alt={course.title}
//                     className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//                   />
//                   <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
//                     {course.category}
//                   </Badge>
//                   <div className="absolute top-3 right-3">
//                     <FavoriteButton course={course} variant="ghost" />
//                   </div>
//                 </div>
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
//                   <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex items-center justify-between text-sm text-muted-foreground">
//                     <div className="flex items-center space-x-1">
//                       <Clock className="h-4 w-4" />
//                       <span>{course.duration}</span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <Book className="h-4 w-4" />
//                       <span>{course.modules} modules</span>
//                     </div>
//                   </div>
                  
//                   {course.progress && course.progress > 0 && (
//                     <div className="space-y-2">
//                       <div className="flex justify-between text-sm">
//                         <span>Progress</span>
//                         <span>{course.progress}%</span>
//                       </div>
//                       <Progress value={course.progress} className="h-2" />
//                     </div>
//                   )}
                  
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       <div className="flex items-center space-x-1">
//                         <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                         <span className="text-sm font-medium">{course.rating}</span>
//                       </div>
//                       <div className="flex items-center space-x-1 text-muted-foreground">
//                         <User className="h-4 w-4" />
//                         <span className="text-sm">{course.students.toLocaleString()}</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   <p className="text-sm text-muted-foreground">by {course.instructor.name}</p>
                  
//                   <Button 
//                     className="w-full" 
//                     variant={course.progress && course.progress > 0 ? "default" : "outline"}
//                   >
//                     {course.progress && course.progress > 0 ? "Continue Learning" : "Enroll Now"}
//                   </Button>
//                 </CardContent>
//               </Link>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };


import { useState } from "react";
import { Search, Clock, Book, Star, User, Globe, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Link } from "react-router-dom";
import { useCourses, useCategories } from "@/hooks/useCourses";
import type { Course } from "@/data/types/course";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: courses = [], isLoading: coursesLoading } = useCourses();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const filteredCourses = courses.filter((course: Course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (coursesLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <div className="flex-1 max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search courses..."
                  disabled
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-10" />
          </div>
        </div>
        <div className="p-6 space-y-8">
          <div className="text-center py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <div className="flex-1 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 space-y-8">
        <div className="text-center py-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Explore Our Courses
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover expertly crafted courses to enhance your skills and knowledge, taught by industry professionals.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center animate-slide-up">
          {categories.map((category: string) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="transition-all"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course: Course) => (
            <Card key={course.id} className="hover-lift cursor-pointer group">
              <Link to={`/courses/${course.id}`}>
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                    {course.category}
                  </Badge>
                  <div className="absolute top-3 right-3">
                    <FavoriteButton course={course} variant="ghost" />
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Book className="h-4 w-4" />
                      <span>{course.modules} modules</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{course.students.toLocaleString()} students</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4" />
                      <span>{course.language}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BarChart3 className="h-4 w-4" />
                      <span>{course.level}</span>
                    </div>
                  </div>
                  {/* <p className="text-sm text-muted-foreground">
                    by {course.instructor.name} ({course.instructor.title})
                  </p> */}
                  <Button
                    className="w-full"
                    variant={course.progress && course.progress > 0 ? "default" : "outline"}
                  >
                    {course.progress && course.progress > 0 ? "Continue Learning" : `Enroll for ${course.price}`}
                  </Button>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;


// ----------------------
// import { useState } from "react";
// import { Search, Clock, Book, Star, User,BarChart3,Globe } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { Progress } from "@/components/ui/progress";
// import { FavoriteButton } from "@/components/FavoriteButton";
// import { Link } from "react-router-dom";
// import { useCourses, useCategories } from "@/hooks/useCourses";
// import type { Course } from "@/data/types/course";

// const Index = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");

//   const { data: courses = [], isLoading: coursesLoading } = useCourses();
//   const { data: categories = [], isLoading: categoriesLoading } = useCategories();

//   const filteredCourses = courses.filter((course: Course) => {
//     const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   if (coursesLoading || categoriesLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
//         <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
//           <div className="flex items-center justify-between p-4">
//             <SidebarTrigger />
//             <div className="flex-1 max-w-md mx-auto">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//                 <Input
//                   placeholder="Search courses..."
//                   disabled
//                   className="pl-10"
//                 />
//               </div>
//             </div>
//             <div className="w-10" />
//           </div>
//         </div>
//         <div className="p-6 space-y-8">
//           <div className="text-center py-8">
//             <div className="animate-pulse">
//               <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
//               <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {[...Array(8)].map((_, i) => (
//               <Card key={i} className="animate-pulse">
//                 <div className="h-48 bg-gray-300 rounded-t-lg"></div>
//                 <CardHeader>
//                   <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//                   <div className="h-3 bg-gray-300 rounded w-full"></div>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <div className="h-3 bg-gray-300 rounded w-1/2"></div>
//                   <div className="h-3 bg-gray-300 rounded w-2/3"></div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
//       <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
//         <div className="flex items-center justify-between p-4">
//           <SidebarTrigger />
//           <div className="flex-1 max-w-md mx-auto">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//               <Input
//                 placeholder="Search courses..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </div>
//           <div className="w-10" />
//         </div>
//       </div>

//       <div className="p-6 space-y-8">
//         <div className="text-center py-8 animate-fade-in">
//           <h1 className="text-4xl font-bold text-foreground mb-4">
//             Explore Our Courses
//           </h1>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             Discover expertly crafted courses to enhance your skills and knowledge, taught by industry professionals.
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-2 justify-center animate-slide-up">
//           {categories.map((category: string) => (
//             <Button
//               key={category}
//               variant={selectedCategory === category ? "default" : "outline"}
//               onClick={() => setSelectedCategory(category)}
//               className="transition-all"
//             >
//               {category}
//             </Button>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredCourses.map((course: Course) => (
//             <Card key={course.id} className="hover-lift cursor-pointer group">
//               <Link to={`/courses/${course.id}`}>
//                 <div className="relative overflow-hidden rounded-t-lg">
//                   <img
//                     src={course.image}
//                     alt={course.title}
//                     className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//                   />
//                   <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
//                     {course.category}
//                   </Badge>
//                   <div className="absolute top-3 right-3">
//                     <FavoriteButton course={course} variant="ghost" />
//                   </div>
//                 </div>
//                 <CardHeader className="pb-3">
//                   <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
//                   <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex items-center justify-between text-sm text-muted-foreground">
//                     <div className="flex items-center space-x-1">
//                       <Clock className="h-4 w-4" />
//                       <span>{course.duration}</span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <Book className="h-4 w-4" />
//                       <span>{course.modules} modules</span>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-between text-sm text-muted-foreground">
//                     <div className="flex items-center space-x-1">
//                       <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                       <span>{course.rating.toFixed(1)}</span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <User className="h-4 w-4" />
//                       <span>{course.students.toLocaleString()} students</span>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-between text-sm text-muted-foreground">
//                     <div className="flex items-center space-x-1">
//                       <Globe className="h-4 w-4" />
//                       <span>{course.language}</span>
//                     </div>
//                     <div className="flex items-center space-x-1">
//                       <BarChart3 className="h-4 w-4" />
//                       <span>{course.level}</span>
//                     </div>
//                   </div>
//                   {/* <p className="text-sm text-muted-foreground">
//                     by {course.instructor.name} ({course.instructor.title})
//                   </p> */}
//                   <Button
//                     className="w-full"
//                     variant={course.progress && course.progress > 0 ? "default" : "outline"}
//                   >
//                     {course.progress && course.progress > 0 ? "Continue Learning" : `Enroll for ${course.price}`}
//                   </Button>
//                 </CardContent>
//               </Link>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Index;
