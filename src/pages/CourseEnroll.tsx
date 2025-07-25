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
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <div className="text-center">
            <h1 className="text-lg font-semibold text-foreground">Course Enrollment</h1>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to={`/courses/${course.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">Enroll in {course.title}</h1>
          <p className="text-muted-foreground">Complete your enrollment to start learning</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Enrollment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Summary */}
            <Card className="animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <Badge className="mb-2">Category</Badge>
                    <h2 className="text-xl font-semibold mb-1">{course.title}</h2>
                    <p className="text-sm text-muted-foreground mb-2">{course.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating?.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Book className="h-4 w-4" />
                        <span>{course.modules?.length} modules</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Payment Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      <span>Credit/Debit Card</span>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange("cvv", e.target.value)}
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className="animate-slide-up">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I agree to the <Link to="#" className="text-primary underline">Terms of Service</Link> and <Link to="#" className="text-primary underline">Privacy Policy</Link>
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="marketing"
                    checked={formData.agreeMarketing}
                    onCheckedChange={(checked) => handleInputChange("agreeMarketing", checked as boolean)}
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
            <Card className="sticky top-24 animate-slide-up">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Instructor Info */}
                <div className="flex items-center space-x-3">
                  <img
                    src={course.expert?.avatar}
                    alt={course.expert?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">{course.expert?.name}</p>
                    <p className="text-xs text-muted-foreground">{course.expert?.title}</p>
                  </div>
                </div>

                {/* Course Features */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Mobile and desktop access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-green-500" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span>Expert support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span>30-day money-back guarantee</span>
                  </div>  
                </div>

                {/* Pricing */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span>{selectedPlanData?.name}</span>
                    <span>${course.price}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${course.price}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleEnroll} 
                  className="w-full" 
                  size="lg" 
                  disabled={isEnrollPending}
                >
                  {isEnrollPending ? "Processing..." : "Complete Purchase"}
                </Button>

                <div className="text-center text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 inline mr-1" />
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