
// import { useState } from "react";
// import { Search, HelpCircle } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";

// const faqData = [
//   {
//     category: "Getting Started",
//     questions: [
//       {
//         question: "How do I create an account?",
//         answer: "You can create an account by clicking the 'Sign Up' button on the login page. Fill in your details including your name, email, and a secure password. You'll receive a confirmation email to verify your account."
//       },
//       {
//         question: "What types of mental health support do you offer?",
//         answer: "We offer a comprehensive range of mental health support including self-paced courses on anxiety management, depression support, confidence building, and decision-making skills. You can also connect with licensed therapists for one-on-one sessions."
//       },
//       {
//         question: "Is my information kept confidential?",
//         answer: "Yes, absolutely. We follow strict privacy guidelines and all your personal information and therapy sessions are kept completely confidential. We comply with HIPAA regulations to ensure your data is secure."
//       }
//     ]
//   },
//   {
//     category: "Courses & Learning",
//     questions: [
//       {
//         question: "How do the courses work?",
//         answer: "Our courses are self-paced and designed by mental health professionals. Each course includes video lessons, interactive exercises, and practical tools you can use in daily life. You can track your progress and revisit materials anytime."
//       },
//       {
//         question: "Can I access courses on mobile devices?",
//         answer: "Yes, our platform is fully responsive and works on all devices including smartphones, tablets, and computers. You can learn anywhere, anytime."
//       },
//       {
//         question: "What if I don't finish a course?",
//         answer: "There's no pressure to complete courses by a specific date. Your progress is saved automatically, and you can return to continue learning whenever you're ready."
//       }
//     ]
//   },
//   {
//     category: "Expert Sessions",
//     questions: [
//       {
//         question: "How do I book a session with an expert?",
//         answer: "Navigate to the 'Find Experts' page, browse through our licensed professionals, and click on their profile to see available time slots. You can book sessions based on your preferred date and time."
//       },
//       {
//         question: "What happens during a therapy session?",
//         answer: "Sessions are conducted via secure video calls. Your therapist will work with you to understand your concerns and develop personalized strategies. Sessions typically last 50 minutes."
//       },
//       {
//         question: "Can I reschedule or cancel sessions?",
//         answer: "Yes, you can reschedule or cancel sessions up to 24 hours before the appointment time through your dashboard without any penalty."
//       }
//     ]
//   },
//   {
//     category: "Billing & Subscriptions",
//     questions: [
//       {
//         question: "What are your pricing plans?",
//         answer: "We offer flexible pricing including individual course purchases and monthly subscription plans. Check our pricing page for current rates and what's included in each plan."
//       },
//       {
//         question: "Do you accept insurance?",
//         answer: "We're working on insurance partnerships. Currently, you can use HSA/FSA funds for therapy sessions. We provide receipts that you can submit to your insurance for potential reimbursement."
//       },
//       {
//         question: "How do I cancel my subscription?",
//         answer: "You can cancel your subscription anytime from your account settings. Your access will continue until the end of your current billing period."
//       }
//     ]
//   }
// ];

// const FAQ = () => {
//   const [searchQuery, setSearchQuery] = useState("");

//   const filteredFAQ = faqData.map(category => ({
//     ...category,
//     questions: category.questions.filter(
//       item =>
//         item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.answer.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   })).filter(category => category.questions.length > 0);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
//       <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
//         <div className="flex items-center justify-between p-4">
//           <SidebarTrigger />
//           <h1 className="text-xl font-semibold text-foreground">FAQ & Help Center</h1>
//           <div className="w-10" />
//         </div>
//       </div>

//       <div className="p-6 space-y-8">
//         {/* Hero Section */}
//         <div className="text-center py-8 animate-fade-in">
//           <div className="flex justify-center mb-4">
//             <HelpCircle className="h-16 w-16 text-primary" />
//           </div>
//           <h1 className="text-4xl font-bold text-foreground mb-4">
//             How can we help you?
//           </h1>
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//             Find answers to common questions about our platform, courses, and mental health support services.
//           </p>
//         </div>

//         {/* Search Bar */}
//         <div className="max-w-2xl mx-auto">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//             <Input
//               placeholder="Search for answers..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 h-12 text-lg"
//             />
//           </div>
//         </div>

//         {/* FAQ Content */}
//         <div className="max-w-4xl mx-auto space-y-8">
//           {filteredFAQ.length > 0 ? (
//             filteredFAQ.map((category) => (
//               <Card key={category.category} className="animate-slide-up">
//                 <CardHeader>
//                   <CardTitle className="text-2xl text-primary">
//                     {category.category}
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <Accordion type="single" collapsible className="w-full">
//                     {category.questions.map((item, index) => (
//                       <AccordionItem key={index} value={`item-${index}`}>
//                         <AccordionTrigger className="text-left">
//                           {item.question}
//                         </AccordionTrigger>
//                         <AccordionContent>
//                           <p className="text-muted-foreground leading-relaxed">
//                             {item.answer}
//                           </p>
//                         </AccordionContent>
//                       </AccordionItem>
//                     ))}
//                   </Accordion>
//                 </CardContent>
//               </Card>
//             ))
//           ) : (
//             <Card className="text-center py-12">
//               <CardContent>
//                 <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                 <h3 className="text-xl font-semibold mb-2">No results found</h3>
//                 <p className="text-muted-foreground">
//                   Try searching with different keywords or browse our categories above.
//                 </p>
//               </CardContent>
//             </Card>
//           )}
//         </div>

//         {/* Contact Section */}
//         <Card className="max-w-2xl mx-auto text-center animate-slide-up">
//           <CardHeader>
//             <CardTitle>Still need help?</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <p className="text-muted-foreground">
//               Can't find what you're looking for? Our support team is here to help.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <a
//                 href="mailto:support@corecognitive.com"
//                 className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
//               >
//                 Email Support
//               </a>
              
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default FAQ;
import { useEffect, useState } from "react";
import { Search, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import axios from "@/lib/axios";

interface FAQCategory {
  id: number;
  category: string;
  questions: {
    id: number;
    question: string;
    answer: string;
  }[];
}

const FAQ = () => {
  const [faqData, setFaqData] = useState<FAQCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/faqs")
      .then((res) => setFaqData(res.data))
      .catch(() => setError("Failed to load FAQs. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  const filteredFAQ = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Loading FAQs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-foreground">FAQ & Help Center</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <HelpCircle className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our platform, courses, and mental health support services.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map((category) => (
              <Card key={category.id} className="animate-slide-up">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">
                    {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item) => (
                      <AccordionItem key={item.id} value={`item-${item.id}`}>
                        <AccordionTrigger className="text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground leading-relaxed">
                            {item.answer}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try searching with different keywords or browse our categories above.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact Section */}
        <Card className="max-w-2xl mx-auto text-center animate-slide-up">
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@corecognitive.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Email Support
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAQ;
