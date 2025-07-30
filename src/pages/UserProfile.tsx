import { useState, useRef, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Upload, Settings, CreditCard, Award, Clock, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import ProfileSettings from "@/components/ProfileSettings";
import PaymentHistory from "@/components/PaymentHistory";
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
}

const UserProfile = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { data: userData, isLoading, error } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();
  
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

  if (isLoading) {
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
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
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
          <p className="text-destructive">Error loading profile. Please try again.</p>
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
      {/* Header matching the design */}
      <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 md:px-6 py-4 max-w-7xl mx-auto">
          <SidebarTrigger />
          <h1 className="text-lg md:text-xl font-semibold text-foreground">My Profile</h1>
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <Tabs defaultValue="profile" className="space-y-6 md:space-y-8">
          {/* Tab Navigation */}
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-3 bg-muted/30 p-1 w-full max-w-sm">
              <TabsTrigger value="profile" className="gap-2 text-xs md:text-sm">
                <User className="h-3 w-3 md:h-4 md:w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2 text-xs md:text-sm">
                <Settings className="h-3 w-3 md:h-4 md:w-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-2 text-xs md:text-sm">
                <CreditCard className="h-3 w-3 md:h-4 md:w-4" />
                Payments
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* Left Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Profile Card */}
                <Card className="border border-border/50">
                  <CardContent className="p-6 text-center">
                    <div className="relative inline-block mb-4">
                      <Avatar className="h-20 w-20 md:h-24 md:w-24 mx-auto">
                        <AvatarImage src={isEditing ? editedData.avatar : userData.avatar} alt={userData.name} />
                        <AvatarFallback className="text-lg md:text-xl bg-primary text-primary-foreground font-semibold">
                          {userData.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute -bottom-1 -right-1 h-6 w-6 md:h-8 md:w-8 rounded-full p-0"
                          onClick={triggerFileInput}
                        >
                          <Upload className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-1">
                      {userData.name}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-4 break-all">
                      {userData.email}
                    </p>

                    <div className="space-y-3 text-xs md:text-sm">
                      {userData.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                          <span className="break-all">{userData.phone}</span>
                        </div>
                      )}
                      {userData.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                          <span>{userData.location}</span>
                        </div>
                      )}
                      {userData.created_at && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                          <span>Joined {new Date(userData.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="border border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base md:text-lg font-semibold">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { label: "Courses Enrolled", value: "12", key: "enrolled" },
                      { label: "Completed", value: "8", key: "completed" },
                      { label: "Hours Learned", value: "45", key: "hours" },
                    ].map((stat) => (
                      <div key={stat.key} className="flex justify-between items-center">
                        <span className="text-xs md:text-sm text-muted-foreground">{stat.label}</span>
                        <span className="text-sm md:text-base font-semibold text-foreground">{stat.value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                      <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {[
                        { id: "name", label: "Full Name", value: editedData.name },
                        { id: "email", label: "Email Address", value: editedData.email, type: "email" },
                        { id: "phone", label: "Phone Number", value: editedData.phone },
                        { id: "location", label: "Location", value: editedData.location },
                      ].map((field) => (
                        <div key={field.id}>
                          <Label htmlFor={field.id} className="text-xs md:text-sm font-medium text-muted-foreground">
                            {field.label}
                          </Label>
                          {isEditing ? (
                            <Input
                              id={field.id}
                              type={field.type || "text"}
                              value={field.value}
                              onChange={(e) => handleInputChange(field.id as keyof typeof editedData, e.target.value)}
                              className="mt-1 md:mt-2 text-sm"
                            />
                          ) : (
                            <p className="mt-1 md:mt-2 text-sm md:text-base text-foreground break-all">
                              {field.value || "Not provided"}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div>
                      <Label htmlFor="bio" className="text-xs md:text-sm font-medium text-muted-foreground">Bio</Label>
                      {isEditing ? (
                        <Textarea
                          id="bio"
                          value={editedData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          className="mt-1 md:mt-2 text-sm"
                          rows={3}
                          placeholder="Passionate learner with a focus on technology and innovation. Always excited to explore new subjects and expand my knowledge base."
                        />
                      ) : (
                        <p className="mt-1 md:mt-2 text-sm md:text-base text-foreground">
                          {userData.bio || "Passionate learner with a focus on technology and innovation. Always excited to explore new subjects and expand my knowledge base."}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Progress */}
                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                      <Award className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      Learning Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                      {[
                        { value: "12", label: "Courses Enrolled", color: "bg-blue-50 border-blue-200 text-blue-700", icon: BookOpen },
                        { value: "8", label: "Courses Completed", color: "bg-green-50 border-green-200 text-green-700", icon: Award },
                        { value: "45", label: "Hours Learned", color: "bg-purple-50 border-purple-200 text-purple-700", icon: Clock },
                      ].map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                          <div key={stat.label} className={`p-4 md:p-6 rounded-lg border-2 ${stat.color} text-center`}>
                            <IconComponent className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-2" />
                            <div className="text-2xl md:text-3xl font-bold mb-1">
                              {stat.value}
                            </div>
                            <div className="text-xs md:text-sm font-medium">{stat.label}</div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                      <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        action: "Completed 'Advanced JavaScript'",
                        time: "2 hours ago",
                        icon: "✅",
                        color: "bg-green-100 text-green-600"
                      },
                      {
                        action: "Earned 'Quick Learner' badge",
                        time: "1 day ago",
                        icon: "🏆",
                        color: "bg-yellow-100 text-yellow-600"
                      },
                      {
                        action: "Joined 'React Study Group'",
                        time: "3 days ago",
                        icon: "👥",
                        color: "bg-blue-100 text-blue-600"
                      },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${activity.color}`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm md:text-base text-foreground font-medium">{activity.action}</p>
                          <p className="text-xs md:text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <PaymentHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;