import { useState, useRef,useEffect  } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Upload, Settings, CreditCard } from "lucide-react";
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

  // Update editedData when userData changes
  useEffect(() => {
    if (userData) {
      setEditedData(userData);
    }
  }, [userData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <div className="w-10" />
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
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <div className="w-10" />
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

  // const handleSave = () => {
  //   updateProfileMutation.mutate(editedData, {
  //     onSuccess: () => {
  //       setIsEditing(false);
  //       toast({
  //         title: "Profile Updated",
  //         description: "Your profile has been successfully updated.",
  //       });
  //     },
  //     onError: () => {
  //       toast({
  //         title: "Update Failed",
  //         description: "Failed to update profile. Please try again.",
  //         variant: "destructive",
  //       });
  //     }
  //   });
  // };

  // const handleSave = () => {
  //   // Create a clean payload based on editedData
  //   const cleanedData = {
  //     ...editedData,
  //     phone: editedData.phone?.trim() || undefined,
  //     avatar: editedData.avatar?.startsWith('http') ? editedData.avatar : undefined,
  //   };
  
  //   updateProfileMutation.mutate(cleanedData, {
  //     onSuccess: () => {
  //       setIsEditing(false);
  //       toast({
  //         title: "Profile Updated",
  //         description: "Your profile has been successfully updated.",
  //       });
  //     },
  //     onError: (err: any) => {
  //       toast({
  //         title: "Update Failed",
  //         description: err?.response?.data?.error || "Failed to update profile. Please try again.",
  //         variant: "destructive",
  //       });
  //     }
  //   });
  // };
  
  const handleSave = () => {
    const cleanedData: Partial<UserData> = {};
  
    Object.entries(editedData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        // Special handling for avatar
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
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Check file type
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          {!isEditing ? (
            <Button onClick={handleEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button 
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {updateProfileMutation.isPending ? "Saving..." : "Save"}
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Payments</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Overview Card */}
              <div className="lg:col-span-1">
                <Card className="hover-lift animate-slide-up">
                  <CardContent className="p-6 text-center">
                    <div className="relative mx-auto mb-4 w-32 h-32">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={isEditing ? editedData.avatar : userData.avatar} alt={userData.name} />
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                          {userData.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={triggerFileInput}>
                          <Upload className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <div className="mb-4">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={triggerFileInput}
                          className="text-sm"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Change Photo
                        </Button>
                      </div>
                    )}
                    
                    <h2 className="text-2xl font-bold text-foreground mb-2">{userData.name}</h2>
                    <p className="text-muted-foreground mb-4">{userData.email}</p>
                    
                    <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      {/* <span>Joined {userData.joinDate}</span> */}
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-center text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{userData.phone}</span>
                      </div>
                      <div className="flex items-center justify-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{userData.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Details Card */}
              <div className="lg:col-span-2">
                <Card className="hover-lift animate-slide-up">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-primary" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          {isEditing ? (
                            <Input
                              id="name"
                              value={editedData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 text-foreground bg-muted/50 px-3 py-2 rounded-md">{userData.name}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          {isEditing ? (
                            <Input
                              id="email"
                              type="email"
                              value={editedData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 text-foreground bg-muted/50 px-3 py-2 rounded-md">{userData.email}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          {isEditing ? (
                            <Input
                              id="phone"
                              value={editedData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 text-foreground bg-muted/50 px-3 py-2 rounded-md">{userData.phone}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="location">Location</Label>
                          {isEditing ? (
                            <Input
                              id="location"
                              value={editedData.location}
                              onChange={(e) => handleInputChange('location', e.target.value)}
                              className="mt-1"
                            />
                          ) : (
                            <p className="mt-1 text-foreground bg-muted/50 px-3 py-2 rounded-md">{userData.location}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        {isEditing ? (
                          <Textarea
                            id="bio"
                            value={editedData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            className="mt-1"
                            rows={4}
                            placeholder="Tell us about yourself..."
                          />
                        ) : (
                          <p className="mt-1 text-foreground bg-muted/50 px-3 py-2 rounded-md min-h-[100px]">{userData.bio}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Card */}
                <Card className="hover-lift animate-slide-up mt-6">
                  <CardHeader>
                    <CardTitle>Activity Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">12</div>
                        <div className="text-sm text-muted-foreground">Courses Enrolled</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">8</div>
                        <div className="text-sm text-muted-foreground">Courses Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">45</div>
                        <div className="text-sm text-muted-foreground">Hours Learned</div>
                      </div>
                    </div>
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
