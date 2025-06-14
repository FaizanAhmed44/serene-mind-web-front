
import { useState, useRef } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

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
  const [userData, setUserData] = useState<UserData>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    bio: "Passionate learner focused on mental wellness and personal development. Interested in mindfulness, cognitive behavioral therapy, and building healthy habits.",
    joinDate: "January 2024",
    avatar: "/placeholder.svg"
  });

  const [editedData, setEditedData] = useState<UserData>(userData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
  };

  const handleSave = () => {
    setUserData(editedData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            {!isEditing ? (
              <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="relative mx-auto mb-4 w-32 h-32">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={isEditing ? editedData.avatar : userData.avatar} alt={userData.name} />
                    <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
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
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{userData.name}</h2>
                <p className="text-gray-600 mb-4">{userData.email}</p>
                
                <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Joined {userData.joinDate}</span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{userData.phone}</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{userData.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details Card */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
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
                        <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{userData.name}</p>
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
                        <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{userData.email}</p>
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
                        <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{userData.phone}</p>
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
                        <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{userData.location}</p>
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
                      <p className="mt-1 text-gray-900 bg-gray-50 px-3 py-2 rounded-md min-h-[100px]">{userData.bio}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-white shadow-lg mt-6">
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-600">Courses Enrolled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">8</div>
                    <div className="text-sm text-gray-600">Courses Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">45</div>
                    <div className="text-sm text-gray-600">Hours Learned</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
