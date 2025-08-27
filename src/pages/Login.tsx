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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 to-primary/5 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <div className="relative z-10 max-w-md text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-8">
            <img 
              src="/lovable-uploads/0d5f19e2-335b-46b8-85f6-4784451740ba.png" 
              alt="Core Cognitive Logo" 
              className="w-12 h-12 rounded-full"
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Transform Your Mind</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join thousands of learners on their journey to mental wellness and cognitive growth.
          </p>
          <div className="flex items-center justify-center space-x-8 pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">10k+</div>
              <div className="text-sm text-muted-foreground">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Expert Sessions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center mb-8">
            <img 
              src="/lovable-uploads/0d5f19e2-335b-46b8-85f6-4784451740ba.png" 
              alt="Core Cognitive Logo" 
              className="w-16 h-16 mx-auto rounded-full mb-4"
            />
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground">Continue your learning journey with Core Cognitive</p>
          </div>
          
          <LoginForm onSubmit={handleLogin} loading={authLoading} />
          
          <div className="text-center text-sm text-muted-foreground">
            By signing in, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;