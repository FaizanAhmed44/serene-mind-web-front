
// import { useState } from "react";
// import { Shield, Bell, Trash2, CreditCard, Eye, EyeOff } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Separator } from "@/components/ui/separator";
// import { useToast } from "@/hooks/use-toast";
// import axios from "@/lib/axios"; // already configured Axios with auth headers, etc.

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

// interface ProfileSettingsProps {
//   onPasswordUpdate?: () => void;
//   onAccountDelete?: () => void;
// }

// const ProfileSettings = ({ onPasswordUpdate, onAccountDelete }: ProfileSettingsProps) => {
//   const { toast } = useToast();
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: ""
//   });

//   const [notifications, setNotifications] = useState({
//     emailUpdates: true,
//     pushNotifications: false,
//     courseReminders: true,
//     expertMessages: true,
//     weeklyDigest: false
//   });

// const handlePasswordChange = async () => {
//   if (passwordData.newPassword !== passwordData.confirmPassword) {
//     toast({
//       title: "Password Mismatch",
//       description: "New password and confirmation don't match.",
//       variant: "destructive",
//     });
//     return;
//   }

//   if (passwordData.newPassword.length < 8) {
//     toast({
//       title: "Password Too Short",
//       description: "Password must be at least 8 characters long.",
//       variant: "destructive",
//     });
//     return;
//   }

//   try {
//     await axios.post("/profile/change-password", {
//       currentPassword: passwordData.currentPassword,
//       newPassword: passwordData.newPassword,
//     });

//     toast({
//       title: "Password Updated",
//       description: "Your password has been successfully changed.",
//     });

//     setPasswordData({
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     });

//     onPasswordUpdate?.();
//   } catch (error: any) {
//     const response = error?.response?.data;

//     // If we have validation error details from backend
//     if (Array.isArray(response?.details)) {
//       response.details.forEach((detail: { msg: string }) => {
//         toast({
//           title: "Validation Error",
//           description: detail.msg,
//           variant: "destructive",
//         });
//       });
//     } else {
//       // Fallback message
//       toast({
//         title: "Password Update Failed",
//         description: response?.error || "Something went wrong. Please try again.",
//         variant: "destructive",
//       });
//     }
//   }
// };


//   const handleNotificationChange = (key: keyof typeof notifications) => {
//     setNotifications(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }));

//     toast({
//       title: "Settings Updated",
//       description: "Your notification preferences have been saved.",
//     });
//   };

//   const handleDeleteAccount = () => {
//     toast({
//       title: "Account Deletion Requested",
//       description: "Your account deletion request has been submitted.",
//       variant: "destructive",
//     });
//     onAccountDelete?.();
//   };

//   return (
//     <div className="space-y-6">
//       {/* Password & Security */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <Shield className="h-5 w-5 mr-2 text-primary" />
//             Password & Security
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <Label htmlFor="currentPassword">Current Password</Label>
//             <div className="relative">
//               <Input
//                 id="currentPassword"
//                 type={showCurrentPassword ? "text" : "password"}
//                 value={passwordData.currentPassword}
//                 onChange={(e) => setPasswordData(prev => ({
//                   ...prev,
//                   currentPassword: e.target.value
//                 }))}
//                 className="pr-10"
//               />
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                 onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//               >
//                 {showCurrentPassword ? (
//                   <EyeOff className="h-4 w-4" />
//                 ) : (
//                   <Eye className="h-4 w-4" />
//                 )}
//               </Button>
//             </div>
//           </div>

//           <div>
//             <Label htmlFor="newPassword">New Password</Label>
//             <div className="relative">
//               <Input
//                 id="newPassword"
//                 type={showNewPassword ? "text" : "password"}
//                 value={passwordData.newPassword}
//                 onChange={(e) => setPasswordData(prev => ({
//                   ...prev,
//                   newPassword: e.target.value
//                 }))}
//                 className="pr-10"
//               />
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                 onClick={() => setShowNewPassword(!showNewPassword)}
//               >
//                 {showNewPassword ? (
//                   <EyeOff className="h-4 w-4" />
//                 ) : (
//                   <Eye className="h-4 w-4" />
//                 )}
//               </Button>
//             </div>
//           </div>

//           <div>
//             <Label htmlFor="confirmPassword">Confirm New Password</Label>
//             <div className="relative">
//               <Input
//                 id="confirmPassword"
//                 type={showConfirmPassword ? "text" : "password"}
//                 value={passwordData.confirmPassword}
//                 onChange={(e) => setPasswordData(prev => ({
//                   ...prev,
//                   confirmPassword: e.target.value
//                 }))}
//                 className="pr-10"
//               />
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               >
//                 {showConfirmPassword ? (
//                   <EyeOff className="h-4 w-4" />
//                 ) : (
//                   <Eye className="h-4 w-4" />
//                 )}
//               </Button>
//             </div>
//           </div>

//           <Button onClick={handlePasswordChange} className="w-full">
//             Update Password
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Notification Preferences */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <Bell className="h-5 w-5 mr-2 text-primary" />
//             Notification Preferences
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Email Updates</Label>
//               <p className="text-sm text-muted-foreground">
//                 Receive updates about your courses and activities
//               </p>
//             </div>
//             <Switch
//               checked={notifications.emailUpdates}
//               onCheckedChange={() => handleNotificationChange('emailUpdates')}
//             />
//           </div>

//           <Separator />

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Push Notifications</Label>
//               <p className="text-sm text-muted-foreground">
//                 Get notified in your browser
//               </p>
//             </div>
//             <Switch
//               checked={notifications.pushNotifications}
//               onCheckedChange={() => handleNotificationChange('pushNotifications')}
//             />
//           </div>

//           <Separator />

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Course Reminders</Label>
//               <p className="text-sm text-muted-foreground">
//                 Reminders about upcoming sessions
//               </p>
//             </div>
//             <Switch
//               checked={notifications.courseReminders}
//               onCheckedChange={() => handleNotificationChange('courseReminders')}
//             />
//           </div>

//           <Separator />

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Expert Messages</Label>
//               <p className="text-sm text-muted-foreground">
//                 Direct messages from mental health experts
//               </p>
//             </div>
//             <Switch
//               checked={notifications.expertMessages}
//               onCheckedChange={() => handleNotificationChange('expertMessages')}
//             />
//           </div>

//           <Separator />

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Weekly Digest</Label>
//               <p className="text-sm text-muted-foreground">
//                 Weekly summary of your progress
//               </p>
//             </div>
//             <Switch
//               checked={notifications.weeklyDigest}
//               onCheckedChange={() => handleNotificationChange('weeklyDigest')}
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Delete Account */}
//       <Card className="border-destructive">
//         <CardHeader>
//           <CardTitle className="flex items-center text-destructive">
//             <Trash2 className="h-5 w-5 mr-2" />
//             Delete Account
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-muted-foreground mb-4">
//             Once you delete your account, there is no going back. Please be certain.
//           </p>
//           <AlertDialog>
//             <AlertDialogTrigger asChild>
//               <Button variant="destructive">
//                 Delete Account
//               </Button>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   This action cannot be undone. This will permanently delete your
//                   account and remove all your data from our servers.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                 <AlertDialogAction 
//                   onClick={handleDeleteAccount}
//                   className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                 >
//                   Delete Account
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default ProfileSettings;

import { useState } from "react";
import { Shield, Bell, Trash2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProfileSettingsProps {
  onPasswordUpdate?: () => void;
  onAccountDelete?: () => void;
}

const ProfileSettings = ({ onPasswordUpdate, onAccountDelete }: ProfileSettingsProps) => {
  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    pushNotifications: false,
    courseReminders: true,
    expertMessages: true,
    weeklyDigest: false
  });

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.post("/profile/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      onPasswordUpdate?.();
    } catch (error: any) {
      const response = error?.response?.data;

      if (Array.isArray(response?.details)) {
        response.details.forEach((detail: { msg: string }) => {
          toast({
            title: "Validation Error",
            description: detail.msg,
            variant: "destructive",
          });
        });
      } else {
        toast({
          title: "Password Update Failed",
          description: response?.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion Requested",
      description: "Your account deletion request has been submitted.",
      variant: "destructive",
    });
    onAccountDelete?.();
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Password & Security */}
      <motion.div
        whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <CardTitle className="flex items-center text-primary">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.4 }}
                >
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                </motion.div>
                Password & Security
              </CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: "currentPassword", label: "Current Password", value: passwordData.currentPassword, setter: setShowCurrentPassword, show: showCurrentPassword },
              { id: "newPassword", label: "New Password", value: passwordData.newPassword, setter: setShowNewPassword, show: showNewPassword },
              { id: "confirmPassword", label: "Confirm New Password", value: passwordData.confirmPassword, setter: setShowConfirmPassword, show: showConfirmPassword },
            ].map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
              >
                <Label htmlFor={field.id}>{field.label}</Label>
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.02, borderColor: "#3b82f6" }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id={field.id}
                      type={field.show ? "text" : "password"}
                      value={field.value}
                      onChange={(e) => setPasswordData(prev => ({
                        ...prev,
                        [field.id]: e.target.value
                      }))}
                      className="pr-10"
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => field.setter(!field.show)}
                    >
                      <motion.div
                        animate={{ rotate: field.show ? 360 : 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        {field.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </motion.div>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button onClick={handlePasswordChange} className="w-full">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  Update Password
                </motion.span>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div
        whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <CardTitle className="flex items-center text-primary">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.4 }}
                >
                  <Bell className="h-5 w-5 mr-2 text-primary" />
                </motion.div>
                Notification Preferences
              </CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "emailUpdates", label: "Email Updates", description: "Receive updates about your courses and activities", checked: notifications.emailUpdates },
              { key: "pushNotifications", label: "Push Notifications", description: "Get notified in your browser", checked: notifications.pushNotifications },
              { key: "courseReminders", label: "Course Reminders", description: "Reminders about upcoming sessions", checked: notifications.courseReminders },
              { key: "expertMessages", label: "Expert Messages", description: "Direct messages from mental health experts", checked: notifications.expertMessages },
              { key: "weeklyDigest", label: "Weekly Digest", description: "Weekly summary of your progress", checked: notifications.weeklyDigest },
            ].map((notification, index) => (
              <motion.div
                key={notification.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
              >
                <div className="flex items-center justify-between">
                  <motion.div
                    className="space-y-0.5"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label>{notification.label}</Label>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Switch
                      checked={notification.checked}
                      // onCheckedChange={() => handleNotificationChange(notification.key)}
                    />
                  </motion.div>
                </div>
                {index < 4 && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  >
                    <Separator />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Account */}
      <motion.div
        whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-destructive">
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <CardTitle className="flex items-center text-destructive">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.4 }}
                >
                  <Trash2 className="h-5 w-5 mr-2" />
                </motion.div>
                Delete Account
              </CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.p 
              className="text-muted-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              Once you delete your account, there is no going back. Please be certain.
            </motion.p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </motion.div>
              </AlertDialogTrigger>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove all your data from our servers.
                        </AlertDialogDescription>
                      </motion.div>
                    </AlertDialogHeader>
                    {/* <AlertDialogFooter>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <AlertDialogAction 
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Account
                        </AlertDialogAction>
                      </motion.div>
                    </AlertDialogFooter> */}
                  </AlertDialogContent>
                </motion.div>
              </AnimatePresence>
            </AlertDialog>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ProfileSettings;