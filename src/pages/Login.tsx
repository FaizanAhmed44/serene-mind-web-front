import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { LoginForm } from "@/components/auth/LoginForm";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  // Handle verification query parameters
  useEffect(() => {
    const verified = searchParams.get('verified');
    const error = searchParams.get('error');

    if (verified === 'true') {
      toast({
        title: "Email Verified",
        description: "Your email has been successfully verified. Please log in.",
      });
    } else if (verified === 'already_verified') {
      toast({
        title: "Email Already Verified",
        description: "Your email is already verified. Please log in.",
      });
    } else if (error === 'no_token') {
      toast({
        title: "Verification Error",
        description: "Verification token is missing.",
        variant: "destructive",
      });
    } else if (error === 'invalid_token') {
      toast({
        title: "Verification Error",
        description: "Invalid or expired verification token.",
        variant: "destructive",
      });
    } else if (error === 'verification_failed') {
      toast({
        title: "Verification Failed",
        description: "An error occurred during verification. Please try again.",
        variant: "destructive",
      });
    }

    // Clear query parameters to prevent repeated toasts on page refresh
    if (verified || error) {
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams, toast]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/dashboard", { replace: true });
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
          title="Welcome Back"
          subtitle="Sign in to your Core Cognitive account"
        />
        <LoginForm onSubmit={handleLogin} loading={authLoading} />
      </div>
    </div>
  );
};

export default Login;