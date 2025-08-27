import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { SignupForm } from "@/components/auth/SignupForm";
import { SignUpFormData } from "@/data/types/auth";
import { useCountingAnimation } from "@/hooks/useCountingAnimation";

const Signup = () => {
  const navigate = useNavigate();
  const { signUp, user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Counting animations for updated stats
  const wellnessSeekersCount = useCountingAnimation({ target: 20, duration: 3000, delay: 800, suffix: 'k+' });
  const mindfulnessSessionsCount = useCountingAnimation({ target: 300, duration: 3200, delay: 1000, suffix: '+' });
  const growthRateCount = useCountingAnimation({ target: 90, duration: 2800, delay: 1200, suffix: '%' });

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
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col lg:flex-row animate-fade-in">
      {/* Left Side - Hero Section with Updated Gradient */}
      
         <div className="hidden lg:flex lg:w-1/2 min-h-screen bg-gradient-to-br from-primary via-primary/90 to-secondary relative overflow-hidden items-center justify-center p-6 sm:p-8 lg:p-12 animate-slide-in-left">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-white/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent)] bg-[size:20px_20px]" />
  
      
        {/* Content */}
        <div className="relative z-10 max-w-lg text-center text-[#FFFFFF] space-y-6 lg:space-y-8 animate-fade-in-up">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-[#FFFFFF]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 lg:mb-8 animate-scale-in hover-lift">
            <img 
              src="/lovable-uploads/0d5f19e2-335b-46b8-85f6-4784451740ba.png" 
              alt="Core Cognitive Logo" 
              className="w-8 h-8 sm:w-12 sm:h-12 rounded-full"
            />
          </div>
          
          <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              Start Your Journey,
              <br />
              <span className="text-[#FFFFFF]/90">Embrace Wellness</span>
            </h1>
            <p className="text-base sm:text-lg text-[#FFFFFF]/80 leading-relaxed max-w-md mx-auto">
              Become part of a supportive community focused on mindfulness and personal growth with expert-led programs.
            </p>
          </div>
          
          {/* Updated Stats */}
          <div className="flex items-center justify-center space-x-6 sm:space-x-8 pt-6 lg:pt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center hover-lift interactive">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#FFFFFF] font-montserrat">
                {wellnessSeekersCount}
              </div>
              <div className="text-xs sm:text-sm text-[#FFFFFF]/70">Wellness Seekers</div>
            </div>
            <div className="w-px h-8 bg-[#FFFFFF]/30" />
            <div className="text-center hover-lift interactive">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#FFFFFF] font-montserrat">
                {mindfulnessSessionsCount}
              </div>
              <div className="text-xs sm:text-sm text-[#FFFFFF]/70">Mindfulness Sessions</div>
            </div>
            <div className="w-px h-8 bg-[#FFFFFF]/30" />
            <div className="text-center hover-lift interactive">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#FFFFFF] font-montserrat">
                {growthRateCount}
              </div>
              <div className="text-xs sm:text-sm text-[#FFFFFF]/70">Growth Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-[#FFFFFF] animate-slide-in-right">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-[#272829]">Join Core Cognitive</h2>
            <p className="text-sm sm:text-base text-[#272829]/70">
              Create your account and start your mental wellness journey
            </p>
          </div>
          
          {/* Form */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <SignupForm onSubmit={handleSignup} loading={authLoading} />
          </div>
          
          {/* Footer */}
          <div className="text-center text-xs sm:text-sm text-[#272829]/70">
            By signing up, you agree to our{" "}
            <a href="#" className="text-[#184349] hover:underline font-medium">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-[#184349] hover:underline font-medium">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;