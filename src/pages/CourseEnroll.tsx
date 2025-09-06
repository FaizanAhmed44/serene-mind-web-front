import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Clock, 
  Book, 
  Star, 
  CheckCircle, 
  Award,
  Globe,
  Users,
  CreditCard,
  Shield,
  ArrowLeft,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { CoursesExpertAPI } from "@/api/courses";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CustomLoader } from "@/components/CustomLoader";

const CourseEnroll = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState("full");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    agreeTerms: false,
    agreeMarketing: false
  });
  const queryClient = useQueryClient();

  // Define pricing plans based on course price
  const { data: course, isLoading, error } = useQuery({
    queryKey: ["course", id],
    queryFn: () => CoursesExpertAPI.getCourse(id),
    enabled: !!id
  });

  const pricingPlans = course
    ? [
        {
          id: "full",
          name: "Full Course Access",
          price: 420,
          description: "One-time payment for lifetime access to all course content",
          features: [
            "Full course access",
            "Certificate of completion",
            "Lifetime access",
            "Expert support"
          ]
        },
        {
          id: "subscription",
          name: "Monthly Subscription",
          price: Math.ceil(420/12),
          description: "Pay monthly for access to all course content",
          features: [
            "Full course access",
            "Certificate of completion",
            "Cancel anytime",
            "Expert support"
          ]
        }
      ]
    : [];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  const {mutate: enrollCourse, isPending: isEnrollPending, isError: isEnrollError} = useMutation({
    mutationFn: () => CoursesExpertAPI.enrollCourse(course.id, user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses", id] });
      toast({
        title: "Enrollment Successful!",
        description: "Your course enrollment is complete. You can now start learning.",
      });
      navigate(`/courses/${course.id}/success`);
    },
  });

  const handleEnroll = async () => {
    if (!formData.agreeTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to enroll in the course.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    if (!course) {
      toast({
        title: "Course Not Found",
        description: "Unable to enroll. Please try again.",
        variant: "destructive"
      });
      return;
    }

    enrollCourse();
  };
  if (isEnrollPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 animate-pulse" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-bounce" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-xl animate-pulse" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
          <CustomLoader />
          <div className="text-lg text-muted-foreground animate-pulse">Processing enrollment...</div>
        </div>
      </div>
    );
  }
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 flex items-center justify-center">
        {/* <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Founds</h1>
          <Button asChild>
            <Link to="/">Back to Courses</Link>
          </Button>
        </div> */}
      </div>
    );
  }

  const selectedPlanData = pricingPlans.find(plan => plan.id === selectedPlan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-xl animate-bounce" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl animate-pulse" />
      
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <div className="text-center">
            <h1 className="text-lg font-semibold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Course Enrollment</h1>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-6 hover:bg-muted/50 transition-all duration-300">
            <Link to={`/courses/${course.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Link>
          </Button>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text">
              Enroll in {course.title}
            </h1>
            <p className="text-muted-foreground text-lg">Complete your enrollment to start your learning journey</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Enrollment Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Summary */}
            <Card className="animate-fade-in bg-card/80 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
              <CardContent className="relative p-6">
                <div className="flex items-start space-x-6">
                  <div className="relative group">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-32 h-20 object-cover rounded-xl shadow-lg ring-2 ring-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:ring-primary/30"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="flex-1">
                    <Badge className="mb-3 bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-primary/20 hover:bg-primary/15 hover:scale-105 transition-all duration-300">
                      Category
                    </Badge>
                    <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">{course.title}</h2>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{course.description}</p>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-300">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 animate-pulse" />
                        <span className="font-semibold">{course.rating?.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-300">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all duration-300">
                        <Book className="h-4 w-4 text-secondary" />
                        <span className="font-medium">{course.modules?.length} modules</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="animate-fade-in bg-card/80 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                  <div className="p-3 rounded-xl bg-green-500/10">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Payment Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300 hover:scale-[1.02]">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center space-x-3 cursor-pointer font-medium">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <span>Credit/Debit Card</span>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="space-y-6 pt-6 border-t border-border/30 animate-fade-in">
                    <div>
                      <Label htmlFor="cardNumber" className="text-sm font-medium mb-2 block">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all duration-300"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate" className="text-sm font-medium mb-2 block">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                          placeholder="MM/YY"
                          className="bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all duration-300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-sm font-medium mb-2 block">CVV</Label>
                        <Input
                          id="cvv"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange("cvv", e.target.value)}
                          placeholder="123"
                          className="bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className="animate-fade-in bg-card/80 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
              <CardContent className="relative p-6 space-y-6">
                <div className="flex items-start space-x-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I agree to the <Link to="#" className="text-primary underline hover:text-primary/80 transition-colors">Terms of Service</Link> and <Link to="#" className="text-primary underline hover:text-primary/80 transition-colors">Privacy Policy</Link>
                  </Label>
                </div>
                <div className="flex items-start space-x-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300">
                  <Checkbox
                    id="marketing"
                    checked={formData.agreeMarketing}
                    onCheckedChange={(checked) => handleInputChange("agreeMarketing", checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="marketing" className="text-sm leading-relaxed cursor-pointer">
                    I would like to receive marketing communications about new courses and offers
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-28 animate-fade-in bg-card/80 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
              <CardHeader className="relative">
                <CardTitle className="text-xl font-bold flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-8">
                {/* Instructor Info */}
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300 hover:scale-[1.02]">
                  <div className="relative">
                    <img
                      src={course.expert?.avatar}
                      alt={course.expert?.name}
                      className="w-14 h-14 rounded-full object-cover shadow-lg ring-2 ring-primary/20"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{course.expert?.name}</p>
                    <p className="text-sm text-muted-foreground">{course.expert?.title}</p>
                  </div>
                </div>

                {/* Course Features */}
                <div className="space-y-4">
                  {[
                    { icon: CheckCircle, text: "Lifetime access", color: "text-green-500" },
                    { icon: Globe, text: "Mobile and desktop access", color: "text-blue-500" },
                    { icon: Award, text: "Certificate of completion", color: "text-purple-500" },
                    { icon: Users, text: "Expert support", color: "text-orange-500" }
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-all duration-300 hover:scale-[1.02]"
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <feature.icon className={`h-5 w-5 ${feature.color}`} />
                      <span className="text-sm font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="space-y-4 pt-6 border-t border-border/30">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                    <span className="font-medium">{selectedPlanData?.name}</span>
                    <span className="font-semibold text-lg">${course.price}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text">${course.price}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleEnroll} 
                  className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold py-3" 
                  size="lg" 
                  disabled={isEnrollPending}
                >
                  {isEnrollPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Complete Purchase"
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground p-3 rounded-lg bg-muted/20">
                  <Shield className="h-4 w-4 inline mr-2 text-green-500" />
                  Secure checkout with 256-bit SSL encryption
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEnroll;