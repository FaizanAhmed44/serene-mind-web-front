    import { useEffect } from "react";
    import { useNavigate, useSearchParams } from "react-router-dom";
    import { useAuth } from "@/hooks/useAuth";
    import { useToast } from "@/hooks/use-toast";
    import { AuthHeader } from "@/components/auth/AuthHeader";
    import { LoginForm } from "@/components/auth/LoginForm";
    import { useCountingAnimation } from "@/hooks/useCountingAnimation";

    const Login = () => {
      const navigate = useNavigate();
      const { signIn, user, loading: authLoading } = useAuth();
      const { toast } = useToast();
      const [searchParams, setSearchParams] = useSearchParams();

      // Counting animations for stats
      const activeLearnersCount = useCountingAnimation({ target: 10, duration: 3000, delay: 800, suffix: 'k+' });
      const expertSessionsCount = useCountingAnimation({ target: 500, duration: 3200, delay: 1000, suffix: '+' });
      const successRateCount = useCountingAnimation({ target: 95, duration: 2800, delay: 1200, suffix: '%' });

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
        <div className="min-h-screen bg-background flex flex-col lg:flex-row animate-fade-in">
          {/* Left Side - Hero Section with Gradient */}
          <div className="hidden lg:flex lg:w-1/2 min-h-screen bg-gradient-to-br from-primary via-primary/90 to-secondary relative overflow-hidden items-center justify-center p-6 sm:p-8 lg:p-12 animate-slide-in-left">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-white/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent)] bg-[size:20px_20px]" />                  
            {/* Content */}
            <div className="relative z-10 max-w-lg text-center text-white space-y-6 lg:space-y-8 animate-fade-in-up">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 lg:mb-8 animate-scale-in hover-lift">
                <img 
                  src="/lovable-uploads/0d5f19e2-335b-46b8-85f6-4784451740ba.png" 
                  alt="Core Cognitive Logo" 
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded-full"
                />
              </div>
              
              <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
                  Transform Your Mind,
                  <br />
                  <span className="text-white/90">Transform Your Life</span>
                </h1>
                <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-md mx-auto">
                  Join thousands of learners on their journey to mental wellness and cognitive growth with expert-guided sessions.
                </p>
              </div>
              
              {/* Stats */}
              <div className="flex items-center justify-center space-x-6 sm:space-x-8 pt-6 lg:pt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="text-center hover-lift interactive">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-montserrat">
                    {activeLearnersCount}
                  </div>
                  <div className="text-xs sm:text-sm text-white/70">Active Learners</div>
                </div>
                <div className="w-px h-8 bg-white/30" />
                <div className="text-center hover-lift interactive">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-montserrat">
                    {expertSessionsCount}
                  </div>
                  <div className="text-xs sm:text-sm text-white/70">Expert Sessions</div>
                </div>
                <div className="w-px h-8 bg-white/30" />
                <div className="text-center hover-lift interactive">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white font-montserrat">
                    {successRateCount}
                  </div>
                  <div className="text-xs sm:text-sm text-white/70">Success Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="lg:w-1/2 w-full flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background animate-slide-in-right">
            <div className="w-full max-w-md space-y-6 lg:space-y-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {/* Mobile Logo */}
              <div className="lg:hidden text-center animate-scale-in">
                <img 
                  src="/lovable-uploads/0d5f19e2-335b-46b8-85f6-4784451740ba.png" 
                  alt="Core Cognitive Logo" 
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full mb-4 hover-lift"
                />
              </div>
              
              {/* Header */}
              <div className="text-center space-y-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Welcome back</h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Continue your learning journey with Core Cognitive
                </p>
              </div>
              
              {/* Form */}
              <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <LoginForm onSubmit={handleLogin} loading={authLoading} />
              </div>
              
              {/* Footer */}
              <div className="text-center text-xs sm:text-sm text-muted-foreground">
                By signing in, you agree to our{" "}
                <a href="#" className="text-primary hover:underline font-medium">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-primary hover:underline font-medium">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      );
    };

    export default Login;