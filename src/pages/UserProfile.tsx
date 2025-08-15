import { useState, useRef, useEffect } from "react";
import { User, Phone, MapPin, Calendar, Edit2, Save, X, Upload, Settings, CreditCard, Award, Clock, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import ProfileSettings from "@/components/ProfileSettings";
import PaymentHistory from "@/components/PaymentHistory";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { CoursesExpertAPI } from "@/api/courses";
import { CustomLoader } from "@/components/CustomLoader";
import { BookingSessionsAPI } from '@/api/bookingSessions';
import { useNavigate } from 'react-router-dom';

interface UserData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  joinDate: string;
  avatar: string;
}

const UserProfile = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { data: userData, isLoading, error } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();
  const navigate = useNavigate();
  
  const [editedData, setEditedData] = useState(userData || {
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    joinDate: "",
    avatar: ""
  });

  useEffect(() => {
    if (userData) {
      setEditedData(userData);
    }
  }, [userData]);

  const { data: completedCount = 0, isLoading: isCompletedLoading, error: completedError } = useQuery<number>({
    queryKey: ["completedCoursesCount", user?.id],
    queryFn: () => CoursesExpertAPI.getCompletedCoursesCount(user!.id),
    enabled: !!user?.id,
  });

  const {
    data: enrolledSessionLength = 0,
    isLoading: isEnrolledSessionLoading,
    error: enrolledSessionError,
  } = useQuery<number>({
    queryKey: ["enrolledSessionLength", user?.id],
    queryFn: () => BookingSessionsAPI.getBookingLength(user?.id || ""),
    enabled: !!user?.id,
  });

  const { data: enrollmentLength = 0, isLoading: isEnrolledLoading, error: enrolledError } = useQuery<number>({
    queryKey: ["enrollmentLength", user?.id],
    queryFn: () => CoursesExpertAPI.getEnrollmentLength(user?.id || ""),
    enabled: !!user?.id,
  });

  if (isLoading || isCompletedLoading || isEnrolledLoading || isEnrolledSessionLoading) {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-foreground">Profile</h1>
            <div className="w-20" />
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <CustomLoader />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-lg text-muted-foreground"
          >
            Loading profile...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error || !userData || completedError || enrolledError || enrolledSessionError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-foreground">Profile</h1>
            <div className="w-20" />
          </div>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-destructive"
          >
            Error loading profile. Please try again.
          </motion.p>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
  };

  const handleSave = () => {
    const cleanedData: Partial<UserData> = {};
  
    Object.entries(editedData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        if (key === "avatar") {
          if (typeof value === "string" && value.startsWith("http")) {
            cleanedData[key as keyof UserData] = value;
          }
        } else {
          cleanedData[key as keyof UserData] = value as string;
        }
      }
    });
  
    updateProfileMutation.mutate(cleanedData, {
      onSuccess: () => {
        setIsEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
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

  const handleInputChange = (field: keyof typeof editedData, value: string) => {
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
          description: "Please select a valid image file.",
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
          description: "Profile picture has been updated. Don't forget to save your changes.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10"
      >
        <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-7xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.4 }}
          >
            <SidebarTrigger />
          </motion.div>
          <h1 className="text-lg md:text-xl font-semibold text-foreground">My Profile</h1>
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8"
                onClick={() => navigate('/settings')}
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8"
                onClick={() => navigate('/payment-history')}
                title="Payment History"
              >
                <CreditCard className="h-4 w-4" />
              </Button>
            </motion.div>
            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button onClick={handleEdit} variant="outline" size="sm" className="gap-2 text-xs md:text-sm">
                    <Edit2 className="h-3 w-3 md:h-4 md:w-4" />
                    Edit Profile
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="actions"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-2"
                >
                  <Button 
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    size="sm"
                    className="gap-2 text-xs md:text-sm"
                  >
                    <Save className="h-3 w-3 md:h-4 md:w-4" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm" className="gap-2 text-xs md:text-sm">
                    <X className="h-3 w-3 md:h-4 md:w-4" />
                    Cancel
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8"
      >
        <div className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="border border-border/50">
                  <CardContent className="p-6 text-center">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="relative inline-block mb-4"
                    >
                      <Avatar className="h-20 w-20 md:h-24 md:w-24 mx-auto">
                        <AvatarImage src={isEditing ? editedData.avatar : userData.avatar} alt={userData.name} />
                        <AvatarFallback className="text-lg md:text-xl bg-primary text-primary-foreground font-semibold">
                          {userData.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && 
                        (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Button
                              size="sm"
                              variant="secondary"
                              className="absolute -bottom-1 -right-1 h-6 w-6 md:h-8 md:w-8 rounded-full p-0"
                              onClick={triggerFileInput}
                            >
                              <Upload className="h-3 w-3 md:h-4 md:w-4" />
                            </Button>
                          </motion.div>
                        )}
                    </motion.div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    <motion.h3 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="text-lg md:text-xl font-semibold text-foreground mb-1"
                    >
                      {userData.name}
                    </motion.h3>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="text-xs md:text-sm text-muted-foreground mb-4 break-all"
                    >
                      {userData.email}
                    </motion.p>

                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="flex flex-col items-center space-y-3 text-xs md:text-sm"
                    >
                      {userData.phone && (
                        <motion.div 
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <Phone className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                          <span className="break-all">{userData.phone}</span>
                        </motion.div>
                      )}
                      {userData.location && (
                        <motion.div 
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <MapPin className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                          <span>{userData.location}</span>
                        </motion.div>
                      )}
                      {userData.created_at && (
                        <motion.div 
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-2 text-muted-foreground"
                        >
                          <Calendar className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                          <span>Joined {new Date(userData.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                        </motion.div>
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="border border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base md:text-lg font-semibold text-primary">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "Courses Enrolled", value: enrollmentLength, key: "enrolled" },
                      { label: "Completed", value: completedCount, key: "completed" },
                      { label: "Enrolled Sessions", value: enrolledSessionLength, key: "hours" },
                    ].map((stat, index) => (
                      <motion.div 
                        key={stat.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                        className="flex justify-between items-center"
                      >
                        <span className="text-xs md:text-sm text-muted-foreground">{stat.label}</span>
                        <span className="text-sm md:text-base font-semibold text-foreground">{stat.value}</span>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="border border-border/50">
                  <CardHeader>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center gap-2 text-base md:text-lg text-primary font-semibold"
                    >
                      <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      Personal Information
                    </motion.div>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {[
                        { id: "name", label: "Full Name", value: editedData.name },
                        { id: "email", label: "Email Address", value: editedData.email, type: "email" },
                        { id: "phone", label: "Phone Number", value: editedData.phone },
                        { id: "location", label: "Location", value: editedData.location },
                      ].map((field, index) => (
                        <motion.div 
                          key={field.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                        >
                          <Label htmlFor={field.id} className="text-xs md:text-sm font-medium text-muted-foreground">
                            {field.label}
                          </Label>
                          {isEditing && field.id !== "email" ? (
                            <motion.div
                              whileFocus={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Input
                                id={field.id}
                                type={field.type || "text"}
                                value={field.value}
                                onChange={(e) => handleInputChange(field.id as keyof typeof editedData, e.target.value)}
                                className="mt-1 md:mt-2 text-sm"
                                placeholder="type here.."
                              />
                            </motion.div>
                          ) : (
                            <p
                              className={`mt-1 md:mt-2 text-sm md:text-base break-all ${
                                field.value ? "text-foreground" : "text-gray-400"
                              }`}
                            >
                              {field.value || "Not provided"}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.9 }}
                    >
                      <Label htmlFor="bio" className="text-xs md:text-sm font-medium text-muted-foreground">Bio</Label>
                      {isEditing ? (
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Textarea
                            id="bio"
                            value={editedData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            className="mt-1 md:mt-2 text-sm"
                            rows={3}
                            placeholder="e.g Passionate learner with a focus on technology and innovation. Always excited to explore new subjects and expand my knowledge base."
                          />
                        </motion.div>
                      ) : (
                        <p className={`mt-1 md:mt-2 text-sm md:text-base ${
                          userData.bio ? "text-foreground" : "text-gray-400"
                        }`}>
                          {userData.bio || "e.g Passionate learner with a focus on technology and innovation. Always excited to explore new subjects and expand my knowledge base."}
                        </p>
                      )}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Learning Progress */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="border border-border/50">
                  <CardHeader>
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center gap-2 text-base md:text-lg text-primary font-semibold"
                    >
                      <Award className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      Learning Progress
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                      {[
                        { value: enrollmentLength, label: "Courses Enrolled", color: "bg-blue-50 border-blue-200 text-blue-700", icon: BookOpen },
                        { value: completedCount, label: "Courses Completed", color: "bg-green-50 border-green-200 text-green-700", icon: Award },
                        { value: "45", label: "Hours Learned", color: "bg-purple-50 border-purple-200 text-purple-700", icon: Clock },
                      ].map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                          <motion.div
                            key={stat.label}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className={`p-4 md:p-6 rounded-lg border-2 ${stat.color} text-center`}
                          >
                            <IconComponent className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2" />
                            <div className="text-2xl md:text-3xl font-bold mb-1">
                              {stat.value}
                            </div>
                            <div className="text-xs md:text-sm font-medium">{stat.label}</div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>              
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;



// import { useState, useRef, useEffect } from "react";
// import { User, Phone, MapPin, Calendar, Edit2, Save, X, Upload, Settings, CreditCard, Award, Clock, BookOpen } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
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
// import { useQuery } from '@tanstack/react-query';
// import { CoursesExpertAPI } from "@/api/courses";
// import { CustomLoader } from "@/components/CustomLoader";
// import { BookingSessionsAPI } from '@/api/bookingSessions';

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

//   useEffect(() => {
//     if (userData) {
//       setEditedData(userData);
//     }
//   }, [userData]);

//   const { data: completedCount = 0, isLoading: isCompletedLoading, error: completedError } = useQuery<number>({
//     queryKey: ["completedCoursesCount", user?.id],
//     queryFn: () => CoursesExpertAPI.getCompletedCoursesCount(user!.id),
//     enabled: !!user?.id,
//   });
//     // Fetch total enrolled courses
//   const {
//     data: enrolledSessionLength = 0,
//     isLoading: isEnrolledSessionLoading,
//     error: enrolledSessionError,
//   } = useQuery<number>({
//     queryKey: ["enrolledSessionLength", user?.id],
//     queryFn: () => BookingSessionsAPI.getBookingLength(user?.id || ""),
//     enabled: !!user?.id,
//   });


//   const { data: enrollmentLength = 0, isLoading:isEnrolledLoading, error:enrolledError } = useQuery<number>({
//     queryKey: ["enrollmentLength", user?.id],
//     queryFn: () => CoursesExpertAPI.getEnrollmentLength(user?.id || ""),
//     enabled: !!user?.id,
//   });

//   if (isLoading || isCompletedLoading || isEnrolledLoading || isEnrolledSessionLoading) {
//     return (
//       <div className="min-h-screen bg-background relative">
//         <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
//           <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
//             <SidebarTrigger />
//             <h1 className="text-xl font-semibold text-foreground">Profile</h1>
//             <div className="w-20" />
//           </div>
//         </div>
//         <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
//           <CustomLoader />
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             className="text-lg text-muted-foreground"
//           >
//             Loading profile...
//           </motion.p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !userData || completedError || enrolledError || enrolledSessionError) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
//           <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
//             <SidebarTrigger />
//             <h1 className="text-xl font-semibold text-foreground">Profile</h1>
//             <div className="w-20" />
//           </div>
//         </div>
//         <div className="flex items-center justify-center min-h-96">
//           <motion.p 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             className="text-destructive"
//           >
//             Error loading profile. Please try again.
//           </motion.p>
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

//   const handleSave = () => {
//     const cleanedData: Partial<UserData> = {};
  
//     Object.entries(editedData).forEach(([key, value]) => {
//       if (value !== null && value !== "") {
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
//           err?.response?.data?.error ||
//           "Failed to update profile. Please try again.",
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
//       if (file.size > 5 * 1024 * 1024) {
//         toast({
//           title: "File too large",
//           description: "Please select an image smaller than 5MB.",
//           variant: "destructive",
//         });
//         return;
//       }

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
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <motion.div 
//         initial={{ y: -50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5 }}
//         className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10"
//       >
//         <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-7xl mx-auto">
//           <motion.div
//             whileHover={{ scale: 1.2, rotate: 360 }}
//             transition={{ duration: 0.4 }}
//           >
//             <SidebarTrigger />
//           </motion.div>
//           <h1 className="text-lg md:text-xl font-semibold text-foreground">My Profile</h1>
//           <AnimatePresence mode="wait">
//             {!isEditing ? (
//               <motion.div
//                 key="edit"
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 transition={{ duration: 0.2 }}
//               >
//                 <Button onClick={handleEdit} variant="outline" size="sm" className="gap-2 text-xs md:text-sm">
//                   <Edit2 className="h-3 w-3 md:h-4 md:w-4" />
//                   Edit Profile
//                 </Button>
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="actions"
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.95 }}
//                 transition={{ duration: 0.2 }}
//                 className="flex gap-2"
//               >
//                 <Button 
//                   onClick={handleSave}
//                   disabled={updateProfileMutation.isPending}
//                   size="sm"
//                   className="gap-2 text-xs md:text-sm"
//                 >
//                   <Save className="h-3 w-3 md:h-4 md:w-4" />
//                   {updateProfileMutation.isPending ? "Saving..." : "Save"}
//                 </Button>
//                 <Button onClick={handleCancel} variant="outline" size="sm" className="gap-2 text-xs md:text-sm">
//                   <X className="h-3 w-3 md:h-4 md:w-4" />
//                   Cancel
//                 </Button>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </motion.div>

//       {/* Content */}
//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.6, delay: 0.2 }}
//         className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8"
//       >
//         <Tabs defaultValue="profile" className="space-y-6 md:space-y-8">
//           {/* Tab Navigation */}          
//           <div className="flex justify-center w-full ">
//             <TabsList className="grid grid-cols-3 bg-muted/30 p-1 w-full ">
//               <TabsTrigger 
//                 value="profile" 
//                 className="gap-2 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
//               >
//                 <User className="h-3 w-3 md:h-4 md:w-4" />
//                 Profile 
//               </TabsTrigger>
//               <TabsTrigger 
//                 value="settings" 
//                 className="gap-2 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
//               >
//                 <Settings className="h-3 w-3 md:h-4 md:w-4" />
//                 Settings
//               </TabsTrigger>
//               <TabsTrigger 
//                 value="payments" 
//                 className="gap-2 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
//               >
//                 <CreditCard className="h-3 w-3 md:h-4 md:w-4" />
//                 Payments
//               </TabsTrigger>
//             </TabsList>
//           </div>

//           <TabsContent value="profile" className="space-y-6 md:space-y-8">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
//               {/* Left Sidebar */}
//               <div className="lg:col-span-1 space-y-6">
//                 {/* Profile Card */}
//                 <motion.div
//                   initial={{ x: -50, opacity: 0 }}
//                   animate={{ x: 0, opacity: 1 }}
//                   transition={{ duration: 0.5, delay: 0.4 }}
//                 >
//                   <Card className="border border-border/50">
//                     <CardContent className="p-6 text-center">
//                       <motion.div 
//                         whileHover={{ scale: 1.05 }}
//                         transition={{ duration: 0.3 }}
//                         className="relative inline-block mb-4"
//                       >
//                         <Avatar className="h-20 w-20 md:h-24 md:w-24 mx-auto">
//                           <AvatarImage src={isEditing ? editedData.avatar : userData.avatar} alt={userData.name} />
//                           <AvatarFallback className="text-lg md:text-xl bg-primary text-primary-foreground font-semibold">
//                             {userData.name.split(' ').map(n => n[0]).join('')}
//                           </AvatarFallback>
//                         </Avatar>
//                         {isEditing && 
//                         (
//                           <motion.div
//                             initial={{ scale: 0 }}
//                             animate={{ scale: 1 }}
//                             transition={{ duration: 0.3 }}
//                           >
//                             <Button
//                               size="sm"
//                               variant="secondary"
//                               className="absolute -bottom-1 -right-1 h-6 w-6 md:h-8 md:w-8 rounded-full p-0"
//                               onClick={triggerFileInput}
//                             >
//                               <Upload className="h-3 w-3 md:h-4 md:w-4" />
//                             </Button>
//                           </motion.div>
//                         )}
//                       </motion.div>

//                       <input
//                         ref={fileInputRef}
//                         type="file"
//                         accept="image/*"
//                         onChange={handleImageUpload}
//                         className="hidden"
//                       />

//                       <motion.h3 
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5, delay: 0.5 }}
//                         className="text-lg md:text-xl font-semibold text-foreground mb-1"
//                       >
//                         {userData.name}
//                       </motion.h3>
//                       <motion.p 
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5, delay: 0.6 }}
//                         className="text-xs md:text-sm text-muted-foreground mb-4 break-all"
//                       >
//                         {userData.email}
//                       </motion.p>

//                       <motion.div 
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5, delay: 0.7 }}
//                         className="flex flex-col items-center space-y-3 text-xs md:text-sm"
//                       >
//                         {userData.phone && (
//                           <motion.div 
//                             whileHover={{ x: 5 }}
//                             className="flex items-center gap-2 text-muted-foreground"
//                           >
//                             <Phone className="h-3 w-3 md:h-4 md:w-4 text-primary" />
//                             <span className="break-all">{userData.phone}</span>
//                           </motion.div>
//                         )}
//                         {userData.location && (
//                           <motion.div 
//                             whileHover={{ x: 5 }}
//                             className="flex items-center gap-2 text-muted-foreground"
//                           >
//                             <MapPin className="h-3 w-3 md:h-4 md:w-4 text-primary" />
//                             <span>{userData.location}</span>
//                           </motion.div>
//                         )}
//                         {userData.created_at && (
//                           <motion.div 
//                             whileHover={{ x: 5 }}
//                             className="flex items-center gap-2 text-muted-foreground"
//                           >
//                             <Calendar className="h-3 w-3 md:h-4 md:w-4 text-primary" />
//                             <span>Joined {new Date(userData.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
//                           </motion.div>
//                         )}
//                       </motion.div>
//                     </CardContent>
//                   </Card>
//                 </motion.div>

//                 {/* Quick Stats */}
//                 <motion.div
//                   initial={{ x: -50, opacity: 0 }}
//                   animate={{ x: 0, opacity: 1 }}
//                   transition={{ duration: 0.5, delay: 0.5 }}
//                 >
//                   <Card className="border border-border/50">
//                     <CardHeader className="pb-3">
//                       <CardTitle className="text-base md:text-lg font-semibold text-primary">Quick Stats</CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-3">
//                       {[
//                         { label: "Courses Enrolled", value: enrollmentLength, key: "enrolled" },
//                         { label: "Completed", value: completedCount, key: "completed" },
//                         { label: "Enrolled Sessions", value: enrolledSessionLength, key: "hours" },
//                       ].map((stat, index) => (
//                         <motion.div 
//                           key={stat.key}
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
//                           className="flex justify-between items-center"
//                         >
//                           <span className="text-xs md:text-sm text-muted-foreground">{stat.label}</span>
//                           <span className="text-sm md:text-base font-semibold text-foreground">{stat.value}</span>
//                         </motion.div>
//                       ))}
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               </div>

//               {/* Main Content */}
//               <div className="lg:col-span-2 space-y-6">
//                 {/* Personal Information */}
//                 <motion.div
//                   initial={{ x: 50, opacity: 0 }}
//                   animate={{ x: 0, opacity: 1 }}
//                   transition={{ duration: 0.5, delay: 0.4 }}
//                 >
//                   <Card className="border border-border/50">
//                     <CardHeader>
//                       <motion.div 
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5 }}
//                         className="flex items-center gap-2 text-base md:text-lg text-primary font-semibold"
//                       >
//                         <User className="h-4 w-4 md:h-5md:w-5 text-primary" />
//                         Personal Information
//                       </motion.div>
//                     </CardHeader>
//                     <CardContent className="space-y-4 md:space-y-6">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//                         {[
//                           { id: "name", label: "Full Name", value: editedData.name },
//                           { id: "email", label: "Email Address", value: editedData.email, type: "email" },
//                           { id: "phone", label: "Phone Number", value: editedData.phone },
//                           { id: "location", label: "Location", value: editedData.location },
//                         ].map((field, index) => (
//                           <motion.div 
//                             key={field.id}
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
//                           >
//                             <Label htmlFor={field.id} className="text-xs md:text-sm font-medium text-muted-foreground">
//                               {field.label}
//                             </Label>
//                             {isEditing && field.id !== "email"  ? (
//                               <motion.div
//                                 whileFocus={{ scale: 1.02 }}
//                                 transition={{ duration: 0.2 }}
//                               >
//                                 <Input
//                                   id={field.id}
//                                   type={field.type || "text"}
//                                   value={field.value}
//                                   onChange={(e) => handleInputChange(field.id as keyof typeof editedData, e.target.value)}
//                                   className="mt-1 md:mt-2 text-sm"
//                                   placeholder="type here.."
//                                 />
//                               </motion.div>
//                             ) : (
//                               <p
//                                 className={`mt-1 md:mt-2 text-sm md:text-base break-all ${
//                                   field.value ? "text-foreground" : "text-gray-400"
//                                 }`}
//                               >
//                                 {field.value || "Not provided"}
//                               </p>
//                             )}
//                           </motion.div>
//                         ))}
//                       </div>

//                       <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.4, delay: 0.9 }}
//                       >
//                         <Label htmlFor="bio" className="text-xs md:text-sm font-medium text-muted-foreground">Bio</Label>
//                         {isEditing ? (
//                           <motion.div
//                             whileFocus={{ scale: 1.02 }}
//                             transition={{ duration: 0.2 }}
//                           >
//                             <Textarea
//                               id="bio"
//                               value={editedData.bio}
//                               onChange={(e) => handleInputChange('bio', e.target.value)}
//                               className="mt-1 md:mt-2 text-sm"
//                               rows={3}
//                               placeholder="e.g Passionate learner with a focus on technology and innovation. Always excited to explore new subjects and expand my knowledge base."
//                             />
//                           </motion.div>
//                         ) : (
//                           <p className={`mt-1 md:mt-2 text-sm md:text-base ${
//                             userData.bio ? "text-foreground" : "text-gray-400"
//                           }`}>
//                             {userData.bio || "e.g Passionate learner with a focus on technology and innovation. Always excited to explore new subjects and expand my knowledge base."}
//                           </p>
//                         )}
//                       </motion.div>
//                     </CardContent>
//                   </Card>
//                 </motion.div>

//                 {/* Learning Progress */}
//                 <motion.div
//                   initial={{ x: 50, opacity: 0 }}
//                   animate={{ x: 0, opacity: 1 }}
//                   transition={{ duration: 0.5, delay: 0.5 }}
//                 >
//                   <Card className="border border-border/50">
//                     <CardHeader>
//                       <motion.div 
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5 }}
//                         className="flex items-center gap-2 text-base md:text-lg text-primary  font-semibold"
//                       >
//                         <Award className="h-4 w-4 md:h-5 md:w-5 text-primary" />
//                         Learning Progress
//                       </motion.div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
//                         {[
//                           { value: enrollmentLength, label: "Courses Enrolled", color: "bg-blue-50 border-blue-200 text-blue-700", icon: BookOpen },
//                           { value: completedCount, label: "Courses Completed", color: "bg-green-50 border-green-200 text-green-700", icon: Award },
//                           { value: "45", label: "Hours Learned", color: "bg-purple-50 border-purple-200 text-purple-700", icon: Clock },
//                         ].map((stat, index) => {
//                           const IconComponent = stat.icon;
//                           return (
//                             <motion.div
//                               key={stat.label}
//                               initial={{ scale: 0.8, opacity: 0 }}
//                               animate={{ scale: 1, opacity: 1 }}
//                               transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
//                               whileHover={{ scale: 1.05 }}
//                               className={`p-4 md:p-6 rounded-lg border-2 ${stat.color} text-center`}
//                             >
//                               <IconComponent className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2" />
//                               <div className="text-2xl md:text-3xl font-bold mb-1">
//                                 {stat.value}
//                               </div>
//                               <div className="text-xs md:text-sm font-medium">{stat.label}</div>
//                             </motion.div>
//                           );
//                         })}
//                       </div>
//                     </CardContent>
//                   </Card>              
//                 </motion.div>
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
//       </motion.div>
//     </div>
//   );
// };

// export default UserProfile;