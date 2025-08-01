import { useState } from "react";
import { Shield, Bell, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "react-router-dom";
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
  AlertDialogFooter,
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
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    pushNotifications: false,
    courseReminders: true,
    expertMessages: true,
    weeklyDigest: false,
  });

  const handlePasswordChange = async () => {
    setIsLoading(true);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      setIsLoading(false);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete("/auth/delete-account");
      toast({
        title: "Account Deactivated",
        description: "Your account has been deactivated successfully.",
        variant: "destructive",
      });
      localStorage.removeItem("token");
      onAccountDelete?.();

      window.location.href = "/login";
    } catch (error: any) {
      const response = error?.response?.data;
      toast({
        title: "Account Deletion Failed",
        description: response?.error || "Failed to deactivate account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Password & Security */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <Shield className="h-5 w-5 mr-2 text-primary" />
              <CardTitle>Password & Security</CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: "currentPassword", label: "Current Password", value: passwordData.currentPassword, show: showCurrentPassword, setShow: setShowCurrentPassword },
              { id: "newPassword", label: "New Password", value: passwordData.newPassword, show: showNewPassword, setShow: setShowNewPassword },
              { id: "confirmPassword", label: "Confirm New Password", value: passwordData.confirmPassword, show: showConfirmPassword, setShow: setShowConfirmPassword },
            ].map((field, index) => (
              <motion.div 
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <Label htmlFor={field.id} className="text-sm font-medium text-muted-foreground">{field.label}</Label>
                <div className="relative mt-1">
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id={field.id}
                      type={field.show ? "text" : "password"}
                      value={field.value}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          [field.id]: e.target.value,
                        }))
                      }
                      className="pr-12 h-10 text-sm rounded-md border border-input bg-background"
                      placeholder="Enter password"
                    />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => field.setShow(!field.show)}
                      aria-label={`Toggle ${field.label} visibility`}
                    >
                      <AnimatePresence mode="wait">
                        {field.show ? (
                          <motion.div
                            key="eye-off"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                          >
                            <EyeOff className="h-4 w-4 text-primary" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="eye"
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                onClick={handlePasswordChange} 
                className="w-full h-10 text-sm" 
                disabled={isLoading}
              >
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="update"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Update Password
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <Bell className="h-5 w-5 mr-2 text-primary" />
              <CardTitle>Notification Preferences</CardTitle>
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
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">{notification.label}</Label>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Switch
                      checked={notification.checked}
                      onCheckedChange={() => handleNotificationChange(notification.key as keyof typeof notifications)}
                    />
                  </motion.div>
                </div>
                {index < 4 && <Separator className="my-4" />}
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Account */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-destructive">
          <CardHeader>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center text-destructive"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              <CardTitle>Delete Account</CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-muted-foreground mb-4"
            >
              Once you delete your account, there is no going back. Please be certain.
            </motion.p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button variant="destructive" className="h-10 text-sm">Delete Account</Button>
                </motion.div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-semibold">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-muted-foreground">
                      This action cannot be undone. This will permanently delete your
                      account and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AlertDialogCancel className="h-10 text-sm">Cancel</AlertDialogCancel>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 text-sm"
                      >
                        Delete Account
                      </AlertDialogAction>
                    </motion.div>
                  </AlertDialogFooter>
                </motion.div>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ProfileSettings;