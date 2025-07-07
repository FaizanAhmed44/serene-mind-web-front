import { useState, useRef, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Upload, Settings, CreditCard } from "lucide-react";
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
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-background to-muted/30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.div 
          className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between p-4">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <SidebarTrigger />
            </motion.div>
            <motion.h1 
              className="text-2xl font-bold text-foreground"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              My Profile
            </motion.h1>
            <div className="w-10" />
          </div>
        </motion.div>
        <motion.div 
          className="flex items-center justify-center min-h-96"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <motion.p 
            className="text-muted-foreground"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Loading profile...
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  if (error || !userData) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-background to-muted/30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.div 
          className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between p-4">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
              <SidebarTrigger />
            </motion.div>
            <motion.h1 
              className="text-2xl font-bold text-foreground"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              My Profile
            </motion.h1>
            <div className="w-10" />
          </div>
        </motion.div>
        <motion.div 
          className="flex items-center justify-center min-h-96"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <motion.p 
            className="text-destructive"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Error loading profile. Please try again.
          </motion.p>
        </motion.div>
      </motion.div>
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
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-background to-muted/30"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.div 
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between p-4">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
            <SidebarTrigger />
          </motion.div>
          <motion.h1 
            className="text-2xl font-bold text-foreground"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            My Profile
          </motion.h1>
          <AnimatePresence>
            {!isEditing ? (
              <motion.div 
                key="edit"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.1, rotate: 2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button onClick={handleEdit}>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                  </motion.div>
                  Edit Profile
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="save-cancel"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex space-x-2"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button 
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                    </motion.div>
                    {updateProfileMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button 
                    onClick={handleCancel} 
                    variant="outline"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.4 }}
                    >
                      <X className="h-4 w-4 mr-2" />
                    </motion.div>
                    Cancel
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <TabsList className="grid w-full grid-cols-3">
              {["profile", "settings", "payments"].map((tab, index) => (
                <TabsTrigger 
                  key={tab}
                  value={tab} 
                  className="flex items-center space-x-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    {tab === "profile" && <User className="h-4 w-4" />}
                    {tab === "settings" && <Settings className="h-4 w-4" />}
                    {tab === "payments" && <CreditCard className="h-4 w-4" />}
                  </motion.div>
                  <motion.span
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </motion.span>
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>

          <AnimatePresence mode="wait">
            <TabsContent value="profile" className="space-y-8">
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Profile Overview Card */}
                <motion.div 
                  className="lg:col-span-1"
                  whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover-lift animate-slide-up">
                    <CardContent className="p-6 text-center">
                      <motion.div 
                        className="relative mx-auto mb-4 w-32 h-32"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                      >
                        <Avatar className="h-32 w-32">
                          <motion.div
                          className="relative mx-auto mb-4 w-32 h-32 rounded-full overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            <AvatarImage src={isEditing ? editedData.avatar : userData.avatar} alt={userData.name} />
                            <AvatarFallback className="text-2xl bg-primary text-white">
                              {userData.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </motion.div>
                        </Avatar>
                        {isEditing && (
                          <motion.div 
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={triggerFileInput}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ duration: 0.3 }}
                          >
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <Upload className="h-8 w-8 text-white" />
                            </motion.div>
                          </motion.div>
                        )}
                      </motion.div>

                      <AnimatePresence>
                        {isEditing && (
                          <motion.div 
                            className="mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.4 }}
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={triggerFileInput}
                                className="text-sm"
                              >
                                <motion.div
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.4 }}
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                </motion.div>
                                Change Photo
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <motion.h2 
                        className="text-2xl font-bold text-primary mb-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {userData.name}
                      </motion.h2>
                      <motion.p 
                        className="text-muted-foreground mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                      >
                        {userData.email}
                      </motion.p>

                      <motion.div 
                        className="space-y-3 text-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                      >
                        <motion.div 
                          className="flex items-center justify-center text-muted-foreground"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.4 }}
                          >
                            <Phone className="h-4 w-4 mr-2 text-primary" />
                          </motion.div>
                          <span>{userData.phone}</span>
                        </motion.div>
                        <motion.div 
                          className="flex items-center justify-center text-muted-foreground"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.4 }}
                          >
                            <MapPin className="h-4 w-4 mr-2 text-primary" />
                          </motion.div>
                          <span>{userData.location}</span>
                        </motion.div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Profile Details Card */}
                <motion.div 
                  className="lg:col-span-2"
                  whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover-lift animate-slide-up">
                    <CardHeader>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <CardTitle className="flex items-center text-primary">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.4 }}
                          >
                            <User className="h-5 w-5 mr-2 text-primary" />
                          </motion.div>
                          Profile Information
                        </CardTitle>
                      </motion.div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                            { id: "name", label: "Full Name", value: editedData.name },
                            { id: "email", label: "Email Address", value: editedData.email, type: "email" },
                            { id: "phone", label: "Phone Number", value: editedData.phone },
                            { id: "location", label: "Location", value: editedData.location },
                          ].map((field, index) => (
                            <motion.div
                              key={field.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                              <Label htmlFor={field.id}>{field.label}</Label>
                              {isEditing ? (
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Input
                                    id={field.id}
                                    type={field.type || "text"}
                                    value={field.value}
                                    onChange={(e) => handleInputChange(field.id as keyof typeof editedData, e.target.value)}
                                    className="mt-1"
                                  />
                                </motion.div>
                              ) : (
                                <motion.p 
                                  className="mt-1 text-foreground bg-muted/50 px-3 py-2 rounded-md"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {field.value}
                                </motion.p>
                              )}
                            </motion.div>
                          ))}
                        </div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 }}
                        >
                          <Label htmlFor="bio">Bio</Label>
                          {isEditing ? (
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Textarea
                                id="bio"
                                value={editedData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                className="mt-1"
                                rows={4}
                                placeholder="Tell us about yourself..."
                              />
                            </motion.div>
                          ) : (
                            <motion.p 
                              className="mt-1 text-foreground bg-muted/50 px-3 py-2 rounded-md min-h-[100px]"
                              whileHover={{ scale: 1.02 }}
                              transition={{ duration: 0.2 }}
                            >
                              {userData.bio}
                            </motion.p>
                          )}
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stats Card */}
                  <motion.div 
                    className="mt-6"
                    whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="hover-lift animate-slide-up text-primary">
                      <CardHeader>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <CardTitle>Activity Overview</CardTitle>
                        </motion.div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {[
                            { value: "12", label: "Courses Enrolled" },
                            { value: "8", label: "Courses Completed" },
                            { value: "45", label: "Hours Learned" },
                          ].map((stat, index) => (
                            <motion.div 
                              key={stat.label}
                              className="text-center"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.2, type: "spring", stiffness: 100 }}
                              whileHover={{ scale: 1.1 }}
                            >
                              <motion.div 
                                className="text-3xl font-bold text-primary"
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.5, delay: index * 0.3, repeat: 1 }}
                              >
                                {stat.value}
                              </motion.div>
                              <div className="text-sm text-muted-foreground">{stat.label}</div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <ProfileSettings />
              </motion.div>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <motion.div
                key="payments"
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <PaymentHistory />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default UserProfile;