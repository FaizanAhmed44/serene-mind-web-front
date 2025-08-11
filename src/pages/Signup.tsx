
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { SignupForm } from "@/components/auth/SignupForm";
import { SignUpFormData } from "@/data/types/auth";

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSignup = async (formData: SignUpFormData) => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Check if password contains at least one capital letter, one small letter, and one digit
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordPattern.test(formData.password)) {
      toast({
        title: "Weak Password",
        description: "Password must contain at least one uppercase letter, one lowercase letter, and one digit.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await signUp(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName
      );
      
      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account.",
        });
        navigate("/login");
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <AuthHeader
          title="Join Core Cognitive"
          subtitle="Create your account and start your mental wellness journey"
        />
        <SignupForm onSubmit={handleSignup} loading={authLoading} />
      </div>
    </div>
  );
};

export default Signup;
