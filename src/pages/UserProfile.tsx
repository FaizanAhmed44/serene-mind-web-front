// import { useState, useRef,useEffect  } from "react";
// import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Upload, Settings, CreditCard } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { useToast } from "@/hooks/use-toast";
// import ProfileSettings from "@/components/ProfileSettings";
// import PaymentHistory from "@/components/PaymentHistory";
// import { useUserProfile, useUpdateUserProfile } from "@/hooks/useUserProfile";
// import { useAuth } from '@/hooks/useAuth';

// interface UserData {
//   name: string;
//   email: string;
//   phone: string;
//   location: string;
//   bio: string;
//   joinDate: string;
//   avatar: string;
// }

// const UserProfile = () => {
  
//   const { toast } = useToast();
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const { user } = useAuth();
//   const { data: userData, isLoading, error } = useUserProfile();
//   const updateProfileMutation = useUpdateUserProfile();
  
//   const [editedData, setEditedData] = useState(userData || {
//     name: "",
//     email: "",
//     phone: "",
//     location: "",
//     bio: "",
//     joinDate: "",
//     avatar: ""
//   });

//   // Update editedData when userData changes
//   useEffect(() => {
//     if (userData) {
//       setEditedData(userData);
//     }
//   }, [userData]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
//         <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
//           <div className="flex items-center justify-between p-4">
//             <SidebarTrigger />
//             <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
//             <div className="w-10" />
//           </div>
//         </div>
//         <div className="flex items-center justify-center min-h-96">
//           <p className="text-muted-foreground">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !userData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
//         <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
//           <div className="flex items-center justify-between p-4">
//             <SidebarTrigger />
//             <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
//             <div className="w-10" />
//           </div>
//         </div>
//         <div className="flex items-center justify-center min-h-96">
//           <p className="text-destructive">Error loading profile. Please try again.</p>
//         </div>
//       </div>
//     );
//   }

//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditedData(userData);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditedData(userData);
//   };

//   // const handleSave = () => {
//   //   updateProfileMutation.mutate(editedData, {
//   //     onSuccess: () => {
//   //       setIsEditing(false);
//   //       toast({
//   //         title: "Profile Updated",
//   //         description: "Your profile has been successfully updated.",
//   //       });
//   //     },
//   //     onError: () => {
//   //       toast({
//   //         title: "Update Failed",
//   //         description: "Failed to update profile. Please try again.",
//   //         variant: "destructive",
//   //       });
//   //     }
//   //   });
//   // };

//   // const handleSave = () => {
//   //   // Create a clean payload based on editedData
//   //   const cleanedData = {
//   //     ...editedData,
//   //     phone: editedData.phone?.trim() || undefined,
//   //     avatar: editedData.avatar?.startsWith('http') ? editedData.avatar : undefined,
//   //   };
  
//   //   updateProfileMutation.mutate(cleanedData, {
//   //     onSuccess: () => {
//   //       setIsEditing(false);
//   //       toast({
//   //         title: "Profile Updated",
//   //         description: "Your profile has been successfully updated.",
//   //       });
//   //     },
//   //     onError: (err: any) => {
//   //       toast({
//   //         title: "Update Failed",
//   //         description: err?.response?.data?.error || "Failed to update profile. Please try again.",
//   //         variant: "destructive",
//   //       });
//   //     }
//   //   });
//   // };
  
//   const handleSave = () => {
//     const cleanedData: Partial<UserData> = {};
  
//     Object.entries(editedData).forEach(([key, value]) => {
//       if (value !== null && value !== "") {
//         // Special handling for avatar
//         if (key === "avatar") {
//           if (typeof value === "string" && value.startsWith("http")) {
//             cleanedData[key as keyof UserData] = value;
//           }
//         } else {
//           cleanedData[key as keyof UserData] = value as string;
//         }
//       }
//     });
  
//     updateProfileMutation.mutate(cleanedData, {
//       onSuccess: () => {
//         setIsEditing(false);
//         toast({
//           title: "Profile Updated",
//           description: "Your profile has been successfully updated.",
//         });
//       },
//       onError: (err: any) => {
//         console.error("Update error:", err);
//         toast({
//           title: "Update Failed",
//           description:
//             err?.response?.data?.error ||
//             "Failed to update profile. Please try again.",
//           variant: "destructive",
//         });
//       },
//     });
//   };
  


//   const handleInputChange = (field: keyof typeof editedData, value: string) => {
//     setEditedData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       // Check file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         toast({
//           title: "File too large",
//           description: "Please select an image smaller than 5MB.",
//           variant: "destructive",
//         });
//         return;
//       }

//       // Check file type
//       if (!file.type.startsWith('image/')) {
//         toast({
//           title: "Invalid file type",
//           description: "Please select a valid image file.",
//           variant: "destructive",
//         });
//         return;
//       }

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const imageUrl = e.target?.result as string;
//         setEditedData(prev => ({
//           ...prev,
//           avatar: imageUrl
//         }));
//         toast({
//           title: "Image uploaded",
//           description: "Profile picture has been updated. Don't forget to save your changes.",
//         });
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
//       <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
//         <div className="flex items-center justify-between p-4">
//           <SidebarTrigger />
//           <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
//           {!isEditing ? (
//             <Button onClick={handleEdit}>
//               <Edit2 className="h-4 w-4 mr-2" />
//               Edit Profile
//             </Button>
//           ) : (
//             <div className="flex space-x-2">
//               <Button 
//                 onClick={handleSave}
//                 disabled={updateProfileMutation.isPending}
//               >
//                 <Save className="h-4 w-4 mr-2" />
//                 {updateProfileMutation.isPending ? "Saving..." : "Save"}
//               </Button>
//               <Button onClick={handleCancel} variant="outline">
//                 <X className="h-4 w-4 mr-2" />
//                 Cancel
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="p-6">
//         <Tabs defaultValue="profile" className="space-y-6">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="profile" className="flex items-center space-x-2">
//               <User className="h-4 w-4" />
//               <span>Profile</span>
//             </TabsTrigger>
//             <TabsTrigger value="settings" className="flex items-center space-x-2">
//               <Settings className="h-4 w-4" />
//               <span>Settings</span>
//             </TabsTrigger>
//             <TabsTrigger value="payments" className="flex items-center space-x-2">
//               <CreditCard className="h-4 w-4" />
//               <span>Payments</span>
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="profile" className="space-y-8">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Profile Overview Card */}
//               <div className="lg:col-span-1">
//                 <Card className="hover-lift animate-slide-up">
//                   <CardContent className="p-6 text-center">
//                     <div className="relative mx-auto mb-4 w-32 h-32">
//                       <Avatar className="h-32 w-32">
//                         <AvatarImage src={isEditing ? editedData.avatar : userData.avatar} alt={userData.name} />
//                         <AvatarFallback className="text-2xl bg-primary/10 text-primary">
//                           {userData.name.split(' ').map(n => n[0]).join('')}
//                         </AvatarFallback>
//                       </Avatar>
//                       {isEditing && (
//                         <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={triggerFileInput}>
//                           <Upload className="h-8 w-8 text-white" />
//                         </div>
//                       )}
//                     </div>

//                     {isEditing && (
//                       <div className="mb-4">
//                         <input
//                           ref={fileInputRef}
//                           type="file"
//                           accept="image/*"
//                           onChange={handleImageUpload}
//                           className="hidden"
//                         />
//                         <Button 
//                           variant="outline" 
//                           size="sm" 
//                           onClick={triggerFileInput}
//                           className="text-sm"
//                         >
//                           <Upload className="h-4 w-4 mr-2" />
//                           Change Photo
//                         </Button>
//                       </div>
//                     )}
                    
//                     <h2 className="text-2xl font-bold text-foreground mb-2">{userData.name}</h2>
//                     <p className="text-muted-foreground mb-4">{userData.email}</p>
                    
//                     <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
//                       <Calendar className="h-4 w-4 mr-2" />
//                       {/* <span>Joined {userData.joinDate}</span> */}
//                     </div>

//                     <div className="space-y-3 text-sm">
//                       <div className="flex items-center justify-center text-muted-foreground">
//                         <Phone className="h-4 w-4 mr-2" />
//                         <span>{userData.phone}</span>
//                       </div>
//                       <div className="flex items-center justify-center text-muted-foreground">
//                         <MapPin className="h-4 w-4 mr-2" />
//                         <span>{userData.location}</span>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Profile Details Card */}
//               <div className="lg:col-span-2">
//                 <Card className="hover-lift animate-slide-up">
//                   <CardHeader>
//                     <CardTitle className="flex items-center">
//                       <User className="h-5 w-5 mr-2 text-primary" />
//                       Profile Information
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="p-6">
//                     <div className="space-y-6">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                           <Label htmlFor="name">Full Name</Label>
//                           {isEditing ? (
//                             <Input
//                               id="name"
//                               value={editedData.name}
//                               onChange={(e) => handleInputChange('name', e.target.value)}
//                               className="mt-1"
//                             />
//                           ) : (
//                             <p className="mt-1 text-foreground bg-muted/50 px-3 py-2 rounded-md">{userData.name}</p>
//                           )}
//                         </div>

//                         <div>
//                           <Label htmlFor="email">Email Address</Label>
//                           {isEditing ? (
//                             <Input
//                               id="email"
//                               type="email"
//                               value={editedData.email}
//                               onChange={(e) => handleInputChange('email', e.target.value)}
//                               className="mt-1"
//                             />
//                           ) : (
//                             <p className="mt-1 text-foreground bg-muted/50 px-3 py-2 rounded-md">{userData.email}</p>
//                           )}
//                         </div>

//                         <div>
//                           <Label htmlFor="phone">Phone Number</Label>
//                           {isEditing ? (
//                             <Input
//                               id="phone"
//                               value={editedData.phone}
//                               onChange={(e) => handleInputChange('phone', e.target.value)}
//                               className="mt-1"
//                             />
//                           ) : (
//                             <p className="mt-1 text-foreground bg-muted/50 px-3 py-2 rounded-md">{userData.phone}</p>
//                           )}
//                         </div>

//                         <div>
//                           <Label htmlFor="location">Location</Label>
//                           {isEditing ? (
//                             <Input
//                               id="location"
//                               value={editedData.location}
//                               onChange={(e) => handleInputChange('location', e.target.value)}
//                               className="mt-1"
//                             />
//                           ) : (
//                             <p className="mt-1 text-foreground bg-muted/50 px-3 py-2 rounded-md">{userData.location}</p>
//                           )}
//                         </div>
//                       </div>

//                       <div>
//                         <Label htmlFor="bio">Bio</Label>
//                         {isEditing ? (
//                           <Textarea
//                             id="bio"
//                             value={editedData.bio}
//                             onChange={(e) => handleInputChange('bio', e.target.value)}
//                             className="mt-1"
//                             rows={4}
//                             placeholder="Tell us about yourself..."
//                           />
//                         ) : (
//                           <p className="mt-1 text-foreground bg-muted/50 px-3 py-2 rounded-md min-h-[100px]">{userData.bio}</p>
//                         )}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Stats Card */}
//                 <Card className="hover-lift animate-slide-up mt-6">
//                   <CardHeader>
//                     <CardTitle>Activity Overview</CardTitle>
//                   </CardHeader>
//                   <CardContent className="p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                       <div className="text-center">
//                         <div className="text-3xl font-bold text-primary">12</div>
//                         <div className="text-sm text-muted-foreground">Courses Enrolled</div>
//                       </div>
//                       <div className="text-center">
//                         <div className="text-3xl font-bold text-primary">8</div>
//                         <div className="text-sm text-muted-foreground">Courses Completed</div>
//                       </div>
//                       <div className="text-center">
//                         <div className="text-3xl font-bold text-primary">45</div>
//                         <div className="text-sm text-muted-foreground">Hours Learned</div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </TabsContent>

//           <TabsContent value="settings" className="space-y-6">
//             <ProfileSettings />
//           </TabsContent>

//           <TabsContent value="payments" className="space-y-6">
//             <PaymentHistory />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;
import { useState, useRef, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Upload, Settings, CreditCard, Award, BarChart2, BookOpen, UserCircle, RefreshCw, Bell, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Assuming these components are available or you'd create them
import ProfileSettings from "@/components/ProfileSettings";
import PaymentHistory from "@/components/PaymentHistory";
// Assuming these hooks are correctly implemented for your backend
import { useUserProfile, useUpdateUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from '@/hooks/useAuth';

interface UserData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  joinDate: string;
  avatar: string;
  coursesEnrolled?: number;
  coursesCompleted?: number;
  hoursLearned?: number;
  userRole?: string;
}

// --- Tailwind CSS Custom Colors (Make sure these are in your tailwind.config.js) ---
// theme: {
//   extend: {
//     colors: {
//       'primary-dark-teal': '#184349',
//       'secondary-deep-blue': '#202a42', // Used as a gradient end color or for specific dark elements
//       'accent-charcoal': '#272829', // Used for primary text/dark details
//       'white-background': '#FFFFFF',
//       'light-gray-bg': '#F9FAFB', // For the main content background
//     },
//     // ... existing animations and keyframes
//   },
// },

const UserProfile = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user, logout } = useAuth();
  const { data: userData, isLoading, error, refetch } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();

  const [editedData, setEditedData] = useState<UserData>(() => ({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    joinDate: "",
    avatar: "",
    coursesEnrolled: 0,
    coursesCompleted: 0,
    hoursLearned: 0,
    userRole: "Learner",
  }));

  useEffect(() => {
    if (userData) {
      setEditedData({
        ...userData,
        coursesEnrolled: userData.coursesEnrolled || 0,
        coursesCompleted: userData.coursesCompleted || 0,
        hoursLearned: userData.hoursLearned || 0,
        userRole: userData.userRole || "Learner",
      });
    }
  }, [userData]);

  const handleEdit = () => {
    setIsEditing(true);
    if (userData) {
      setEditedData({
        ...userData,
        coursesEnrolled: userData.coursesEnrolled || 0,
        coursesCompleted: userData.coursesCompleted || 0,
        hoursLearned: userData.hoursLearned || 0,
        userRole: userData.userRole || "Learner",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userData) {
      setEditedData({
        ...userData,
        coursesEnrolled: userData.coursesEnrolled || 0,
        coursesCompleted: userData.coursesCompleted || 0,
        hoursLearned: userData.hoursLearned || 0,
        userRole: userData.userRole || "Learner",
      });
    }
  };

  const handleSave = () => {
    const cleanedData: Partial<UserData> = {};

    Object.entries(editedData).forEach(([key, value]) => {
      if (value !== null && value !== "" && value !== undefined) {
        if (key === "avatar") {
          if (typeof value === "string" && value.startsWith("http")) {
            cleanedData[key as keyof UserData] = value;
          }
        } else {
          cleanedData[key as keyof UserData] = value as any;
        }
      }
    });

    delete cleanedData.joinDate;
    delete cleanedData.coursesEnrolled;
    delete cleanedData.coursesCompleted;
    delete cleanedData.hoursLearned;
    delete cleanedData.userRole; // Role is display-only for now, not directly editable here

    updateProfileMutation.mutate(cleanedData, {
      onSuccess: () => {
        setIsEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        refetch();
      },
      onError: (err: any) => {
        console.error("Update error:", err);
        toast({
          title: "Update Failed",
          description:
            err?.response?.data?.error ||
            "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const handleInputChange = (field: keyof UserData, value: string | number) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file (e.g., JPG, PNG).",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setEditedData(prev => ({
          ...prev,
          avatar: imageUrl
        }));
        toast({
          title: "Image uploaded",
          description: "Profile picture has been updated. Don't forget to save your changes!",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // --- Loading State Skeleton ---
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-light-gray-bg text-accent-charcoal">
        {/* Top Navbar */}
        <div className="bg-white-background border-b border-gray-200 p-4 flex justify-between items-center shadow-sm animate-fade-in-down">
          <Skeleton className="h-8 w-32 bg-gray-200 rounded-md" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-full bg-gray-200" />
            <Skeleton className="h-8 w-24 bg-gray-200 rounded-md" />
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 p-6 sm:p-8 lg:p-12 animate-fade-in">
          <div className="max-w-4xl mx-auto py-10 space-y-8">
            <Skeleton className="mx-auto h-32 w-32 rounded-full mb-6 bg-gray-200 animate-pulse" />
            <Skeleton className="h-9 w-56 mx-auto mb-2 bg-gray-200 animate-pulse" /> {/* Smaller name */}
            <Skeleton className="h-6 w-48 mx-auto bg-gray-200 animate-pulse" />
            <Skeleton className="h-8 w-32 mx-auto bg-primary-dark-teal rounded-full mb-6 animate-pulse" /> {/* Badge skeleton */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <Skeleton className="h-28 rounded-xl bg-gray-100 animate-pulse" />
              <Skeleton className="h-28 rounded-xl bg-gray-100 animate-pulse" />
              <Skeleton className="h-28 rounded-xl bg-gray-100 animate-pulse" />
            </div>

            <Skeleton className="h-12 w-full rounded-full mb-8 bg-gray-100 animate-pulse" /> {/* Tabs skeleton */}

            <div className="space-y-6">
              <Skeleton className="h-[180px] rounded-xl bg-gray-100 animate-pulse" />
              <Skeleton className="h-[280px] rounded-xl bg-gray-100 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error || !userData) {
    return (
      <div className="flex flex-col min-h-screen bg-red-50 text-red-700">
         {/* Top Navbar for error context */}
        <div className="bg-white-background border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
          <span className="text-lg font-semibold text-accent-charcoal">LearnerFlow</span>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-600"> <Bell className="h-6 w-6" /> </Button>
            <Avatar className="h-8 w-8 border border-gray-200">
                <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">?</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 animate-fade-in">
          <UserCircle className="h-24 w-24 text-red-500 mb-6 animate-bounce-slow" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-red-600 mb-4 text-center">Profile Not Found!</h1>
          <p className="text-red-500 text-lg sm:text-xl mb-8 text-center max-w-lg leading-relaxed">
            It seems we're having trouble loading your profile details. Please try refreshing the page.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
          >
            <RefreshCw className="h-5 w-5 mr-2 animate-spin-slow" />
            Retry Loading Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-light-gray-bg text-accent-charcoal font-sans overflow-hidden">
      {/* Top Navbar for Quick Actions/Notifications */}
      <header className="bg-white-background border-b border-gray-200 p-4 flex justify-between items-center shadow-sm animate-fade-in-down">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold text-accent-charcoal">Welcome, {user?.name || "User"}!</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100 hover:text-primary-dark-teal transition-colors duration-200">
            <Bell className="h-6 w-6" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                <Avatar className="h-8 w-8 border border-gray-200">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="font-medium hidden sm:block">{userData.name.split(' ')[0]}</span>
                <ChevronDown className="h-4 w-4 ml-1 text-gray-500 transition-transform duration-200" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-gray-200 rounded-lg shadow-lg animate-in fade-in zoom-in-95 duration-200" align="end">
              <DropdownMenuLabel className="font-semibold text-gray-800 border-b border-gray-100 pb-2">My Account</DropdownMenuLabel>
              <DropdownMenuItem className="flex items-center space-x-2 text-gray-700 hover:bg-gray-50 cursor-pointer p-2 rounded-md transition-colors duration-150">
                <UserCircle className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2 text-gray-700 hover:bg-gray-50 cursor-pointer p-2 rounded-md transition-colors duration-150">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="flex items-center space-x-2 text-red-600 hover:bg-red-50 cursor-pointer p-2 rounded-md transition-colors duration-150">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-12 bg-light-gray-bg overflow-auto">
        <div className="max-w-4xl mx-auto py-10">
          {/* Profile Header (Avatar, Name, Email, Role) */}
          <div className="text-center mb-12 animate-in fade-in zoom-in-90 duration-700 delay-100">
            <div className="relative mx-auto mb-6 w-32 h-32 group animate-pop-in"> {/* Reduced size */}
              <Avatar className="h-32 w-32 border-4 border-primary-dark-teal shadow-lg transition-all duration-300 group-hover:border-secondary-deep-blue rounded-full">
                <AvatarImage src={isEditing ? editedData.avatar : userData.avatar} alt={userData.name} className="object-cover" />
                <AvatarFallback className="text-5xl font-bold bg-gray-200 text-primary-dark-teal"> {/* Adjusted fallback size */}
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-accent-charcoal bg-opacity-60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer" onClick={triggerFileInput}>
                  <Upload className="h-8 w-8 text-white animate-pulse-slow" /> {/* Icon size adjusted */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>
            <h1 className="text-4xl font-extrabold text-accent-charcoal tracking-tight mb-2 animate-fade-in-text delay-200"> {/* Reduced size */}
              {userData.name}
            </h1>
            <p className="text-lg text-gray-600 animate-fade-in-text delay-300">{userData.email}</p>
            {userData.userRole && (
              <Badge className="mt-3 px-4 py-1.5 bg-primary-dark-teal text-white rounded-full text-sm font-medium shadow-sm transition-transform duration-200 hover:scale-105 animate-in zoom-in-90 delay-400">
                {userData.userRole}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-12 animate-in fade-in zoom-in-95 duration-700 delay-500">
            {!isEditing ? (
              <Button
                onClick={handleEdit}
                className="bg-gradient-to-r from-primary-dark-teal to-secondary-deep-blue text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl active:scale-95"
              >
                <Edit2 className="h-5 w-5 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending}
                  className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400 px-8 py-3 rounded-full shadow-sm transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
                >
                  <X className="h-5 w-5 mr-2" />
                  Cancel
                </Button>
              </>
            )}
          </div>

          {/* Activity Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white border border-gray-200 text-accent-charcoal rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-[1.02] animate-in fade-in zoom-in-95 duration-700 delay-600">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-10 w-10 text-primary-dark-teal mx-auto mb-3 transition-transform duration-200 group-hover:scale-110" />
                <div className="text-5xl font-extrabold text-primary-dark-teal mb-1">{userData.coursesEnrolled || 0}</div>
                <div className="text-sm text-gray-600">Courses Enrolled</div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 text-accent-charcoal rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-[1.02] animate-in fade-in zoom-in-95 duration-700 delay-700">
              <CardContent className="p-6 text-center">
                <Award className="h-10 w-10 text-primary-dark-teal mx-auto mb-3 transition-transform duration-200 group-hover:scale-110" />
                <div className="text-5xl font-extrabold text-primary-dark-teal mb-1">{userData.coursesCompleted || 0}</div>
                <div className="text-sm text-gray-600">Courses Completed</div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 text-accent-charcoal rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-[1.02] animate-in fade-in zoom-in-95 duration-700 delay-800">
              <CardContent className="p-6 text-center">
                <BarChart2 className="h-10 w-10 text-primary-dark-teal mx-auto mb-3 transition-transform duration-200 group-hover:scale-110" />
                <div className="text-5xl font-extrabold text-primary-dark-teal mb-1">{userData.hoursLearned || 0}</div>
                <div className="text-sm text-gray-600">Hours Learned</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Details, Settings, Payments */}
          <Tabs defaultValue="profile" className="w-full animate-in fade-in-up duration-700 delay-900">
            <TabsList className="flex justify-around bg-gray-100 p-2 rounded-full shadow-sm border border-gray-200 mb-8">
              <TabsTrigger value="profile" className="flex-1 flex items-center justify-center space-x-2 text-base font-medium text-gray-700 data-[state=active]:bg-white data-[state=active]:text-primary-dark-teal data-[state=active]:shadow-md rounded-full transition-all duration-300 ease-out hover:bg-gray-50">
                <User className="h-5 w-5" />
                <span>Profile Details</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 flex items-center justify-center space-x-2 text-base font-medium text-gray-700 data-[state=active]:bg-white data-[state=active]:text-primary-dark-teal data-[state=active]:shadow-md rounded-full transition-all duration-300 ease-out hover:bg-gray-50">
                <Settings className="h-5 w-5" />
                <span>Account Settings</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex-1 flex items-center justify-center space-x-2 text-base font-medium text-gray-700 data-[state=active]:bg-white data-[state=active]:text-primary-dark-teal data-[state=active]:shadow-md rounded-full transition-all duration-300 ease-out hover:bg-gray-50">
                <CreditCard className="h-5 w-5" />
                <span>Payment History</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 animate-in fade-in-up duration-500">
              {/* About Me Card */}
              <Card className="bg-white border border-gray-200 text-accent-charcoal rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-700 delay-1000">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center text-xl text-accent-charcoal">
                    <BookOpen className="h-6 w-6 mr-3 text-primary-dark-teal" />
                    About Me
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={editedData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="mt-1 min-h-[140px] resize-y bg-gray-50 border-gray-300 text-accent-charcoal placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-dark-teal focus-visible:ring-offset-2 transition-all duration-200 ease-in-out"
                      placeholder="Tell us about yourself and your interests..."
                    />
                  ) : (
                    <p className="mt-1 text-gray-700 bg-gray-50 px-5 py-4 rounded-lg min-h-[140px] whitespace-pre-wrap leading-relaxed transition-all duration-300 ease-in-out">
                      {userData.bio || "No biography provided. Click 'Edit Profile' to add one!"}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Personal Information Card */}
              <Card className="bg-white border border-gray-200 text-accent-charcoal rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-700 delay-[1100ms]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center text-xl text-accent-charcoal">
                    <User className="h-6 w-6 mr-3 text-primary-dark-teal" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-600">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editedData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="mt-2 bg-gray-50 border-gray-300 text-accent-charcoal placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-dark-teal focus-visible:ring-offset-2 transition-all duration-200 ease-in-out"
                        />
                      ) : (
                        <div className="mt-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out flex items-center">
                          <User className="h-4 w-4 mr-2 text-primary-dark-teal transition-transform duration-200" />{userData.name}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-600">Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editedData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="mt-2 bg-gray-50 border-gray-300 text-accent-charcoal placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-dark-teal focus-visible:ring-offset-2 transition-all duration-200 ease-in-out"
                        />
                      ) : (
                        <div className="mt-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-primary-dark-teal transition-transform duration-200" />{userData.email}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-600">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={editedData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="mt-2 bg-gray-50 border-gray-300 text-accent-charcoal placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-dark-teal focus-visible:ring-offset-2 transition-all duration-200 ease-in-out"
                          placeholder="e.g., +1 (555) 123-4567"
                        />
                      ) : (
                        <div className="mt-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-primary-dark-teal transition-transform duration-200" />{userData.phone || "N/A"}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-sm font-medium text-gray-600">Location</Label>
                      {isEditing ? (
                        <Input
                          id="location"
                          value={editedData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="mt-2 bg-gray-50 border-gray-300 text-accent-charcoal placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-dark-teal focus-visible:ring-offset-2 transition-all duration-200 ease-in-out"
                          placeholder="e.g., New York, USA"
                        />
                      ) : (
                        <div className="mt-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-lg transition-all duration-300 ease-in-out flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-primary-dark-teal transition-transform duration-200" />{userData.location || "Not specified"}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6 animate-in fade-in-up duration-500">
              <ProfileSettings />
            </TabsContent>

            <TabsContent value="payments" className="mt-6 animate-in fade-in-up duration-500">
              <PaymentHistory />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;