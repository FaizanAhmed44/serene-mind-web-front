import { useEffect, useState } from "react";
import { Search, HelpCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import axios from "@/lib/axios";
import { CustomLoader } from "@/components/CustomLoader";
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

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Clear search input
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (loading) {
    return (
      <motion.div
        className="min-h-screen bg-background relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between p-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.4 }}
            >
              <SidebarTrigger />
            </motion.div>
            <motion.h1 
              className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              FAQ & Help Center
            </motion.h1>
            <div className="w-10" />
          </div>
        </motion.div>
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <CustomLoader />
          <div className="text-lg text-muted-foreground">Loading faqs...</div>
        </motion.div>
      </motion.div>
    );    
  }

  if (error) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.p
          className="text-destructive text-lg"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {error}
        </motion.p>
      </motion.div>
    );
  }

  return (
        <motion.div
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>


      {/* Top Bar */}
      <motion.div
        className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between p-4">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            <SidebarTrigger />
          </motion.div>
          <motion.h1
            className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            FAQ & Help Center
          </motion.h1>
          <div className="w-10" />
        </div>
      </motion.div>

      <div className="relative z-10 p-6 space-y-8">
        {/* Hero Section */}
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          >
            <motion.div
              className="relative p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.4 }}
            >
              <HelpCircle className="h-16 w-16 text-primary" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl animate-pulse" />
            </motion.div>
          </motion.div>
          
          <motion.h1
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            How can we help you?
          </motion.h1>
          
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Find answers to common questions about our platform, courses, and mental health support services. Our comprehensive FAQ covers everything you need to know.
          </motion.p>
          
          {/* Search Bar */}
          <motion.div
            className="max-w-2xl mx-auto mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-12 pr-12 h-14 text-lg bg-background/80 backdrop-blur-sm border-border/50 shadow-lg rounded-xl"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-destructive/20"
                  onClick={handleClearSearch}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* FAQ Content */}
        <motion.div
          className="max-w-5xl mx-auto space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <AnimatePresence>
            {filteredFAQ.length > 0 ? (
              filteredFAQ.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  className="group"
                  whileHover={{ y: -2 }}
                >
                  <Card className="overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <CardHeader className="relative z-10 pb-6">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full" />
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                          {category.category}
                        </CardTitle>
                      </motion.div>
                    </CardHeader>
                    <CardContent className="relative z-10 pt-0">
                      <Accordion type="single" collapsible className="w-full space-y-2">
                        {category.questions.map((item, qIndex) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 + qIndex * 0.05 + 0.3 }}
                          >
                            <AccordionItem value={`item-${item.id}`} className="border-border/30 rounded-lg overflow-hidden">
                              <motion.div
                                whileHover={{ x: 2 }}
                                transition={{ duration: 0.2 }}
                              >
                                <AccordionTrigger className="text-left text-base font-medium px-4 py-3 hover:bg-muted/30 transition-colors duration-200">
                                  {item.question}
                                </AccordionTrigger>
                              </motion.div>
                              <AccordionContent className="px-4 pb-4">
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                  className="bg-muted/20 rounded-lg p-4 border border-border/20"
                                >
                                  <p className="text-muted-foreground leading-relaxed">
                                    {item.answer}
                                  </p>
                                </motion.div>
                              </AccordionContent>
                            </AccordionItem>
                          </motion.div>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Card className="text-center py-16 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50">
                  <CardContent>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                      className="mb-6"
                    >
                      <div className="relative">
                        <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto" />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-full animate-pulse" />
                      </div>
                    </motion.div>
                    <motion.h3
                      className="text-2xl font-semibold mb-3 text-foreground"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      No results found
                    </motion.h3>
                    <motion.p
                      className="text-muted-foreground text-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      Try searching with different keywords or browse our categories above.
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
        >
          <Card className="bg-gradient-to-br from-primary/10 via-card/80 to-secondary/10 backdrop-blur-sm border-border/50 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <CardHeader className="relative z-10 pb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1.0 }}
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Still need help?
                </CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
              <motion.p
                className="text-muted-foreground text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.1 }}
              >
                Can't find what you're looking for? Our dedicated support team is here to help you with any questions or concerns.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.2 }}
              >
                <motion.a
                  href="mailto:support@corecognitive.com"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Contact Support
                </motion.a>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FAQ;


// import { useEffect, useState } from "react";
// import { Search, HelpCircle, X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import axios from "@/lib/axios";
// import { CustomLoader } from "@/components/CustomLoader";
// interface FAQCategory {
//   id: number;
//   category: string;
//   questions: {
//     id: number;
//     question: string;
//     answer: string;
//   }[];
// }

// const FAQ = () => {
//   const [faqData, setFaqData] = useState<FAQCategory[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     axios
//       .get("/faqs")
//       .then((res) => setFaqData(res.data))
//       .catch(() => setError("Failed to load FAQs. Please try again later."))
//       .finally(() => setLoading(false));
//   }, []);

//   const filteredFAQ = faqData
//     .map((category) => ({
//       ...category,
//       questions: category.questions.filter(
//         (item) =>
//           item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           item.answer.toLowerCase().includes(searchQuery.toLowerCase())
//       ),
//     }))
//     .filter((category) => category.questions.length > 0);

//   // Handle search input change
//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };

//   // Clear search input
//   const handleClearSearch = () => {
//     setSearchQuery("");
//   };

//   if (loading) {
//     return (
//       <motion.div
//         className="min-h-screen bg-background relative"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <motion.div
//           className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
//           initial={{ y: -50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.4, delay: 0.1 }}
//         >
//           <div className="flex items-center justify-between p-4">
//             <motion.div
//               whileHover={{ rotate: 360 }}
//               transition={{ duration: 0.4 }}
//             >
//               <SidebarTrigger />
//             </motion.div>
//             <motion.h1
//               className="text-xl font-semibold text-foreground truncate"
//               initial={{ x: -20, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ duration: 0.4, delay: 0.2 }}
//             >
//              FAQ & Help Center
//             </motion.h1>
//             <div className="w-10" />
//           </div>
//         </motion.div>
//         <motion.div
//           className="absolute inset-0 flex flex-col items-center justify-center gap-4"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.4, delay: 0.3 }}
//         >
//           <CustomLoader />
//           <div className="text-lg text-muted-foreground">Loading FAQs...</div>
//         </motion.div>
//       </motion.div>
//     );
//   }

//   if (error) {
//     return (
//       <motion.div
//         className="min-h-screen flex items-center justify-center"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <motion.p
//           className="text-destructive text-lg"
//           animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
//           transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
//         >
//           {error}
//         </motion.p>
//       </motion.div>
//     );
//   }

//   return (
//     <motion.div
//       className="min-h-screen bg-gradient-to-br from-background to-muted/30"
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.7, ease: "easeOut" }}
//     >
//       {/* Top Bar */}
//       <motion.div
//         className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
//         initial={{ y: -50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//       >
//         <div className="flex items-center justify-between p-4">
//           <motion.div
//             whileHover={{ rotate: 360 }}
//             transition={{ duration: 0.4 }}
//           >
//             <SidebarTrigger />
//           </motion.div>
//           <motion.h1
//             className="text-xl font-semibold text-foreground"
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.5, delay: 0.3 }}
//           >
//             FAQ & Help Center
//           </motion.h1>
//           <div className="w-10" />
//         </div>
//       </motion.div>

//       <div className="p-6 space-y-4">
//         {/* Hero Section */}
//         <motion.div
//           className="text-center py-8"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
//         >
//           <motion.div
//             className="flex justify-center mb-4"
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
//           >
//             <motion.div
//               whileHover={{ scale: 1.2, rotate: 360 }}
//               transition={{ duration: 0.4 }}
//             >
//               <HelpCircle className="h-16 w-16 text-primary" />
//             </motion.div>
//           </motion.div>
//           <motion.h1
//             className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.5 }}
//           >
//             How can we help you?
//           </motion.h1>
//           <motion.p
//             className="text-xl text-muted-foreground max-w-2xl mx-auto"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.6 }}
//           >
//             Find answers to common questions about our platform, courses, and mental health support services.
//           </motion.p>
//           {/* Search Bar */}
//           <motion.div
//             className="max-w-full sm:max-w-lg mx-auto flex items-center gap-2 mt-8"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.7 }}
//           >
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 type="text"
//                 placeholder="Search for answers..."
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 className="pl-10 pr-10"
//               />
//               {searchQuery && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2"
//                   onClick={handleClearSearch}
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               )}
//             </div>
//           </motion.div>
//         </motion.div>

//         {/* FAQ Content */}
//         <motion.div
//           className="max-w-4xl mx-auto space-y-8"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.5, delay: 0.8 }}
//         >
//           <AnimatePresence>
//             {filteredFAQ.length > 0 ? (
//               filteredFAQ.map((category, index) => (
//                 <motion.div
//                   key={category.id}
//                   initial={{ opacity: 0, y: 50 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 50 }}
//                   transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
//                   whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
//                 >
//                   <Card>
//                     <CardHeader>
//                       <motion.div
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
//                       >
//                         <CardTitle className="text-2xl text-primary">
//                           {category.category}
//                         </CardTitle>
//                       </motion.div>
//                     </CardHeader>
//                     <CardContent>
//                       <Accordion type="single" collapsible className="w-full">
//                         {category.questions.map((item, qIndex) => (
//                           <motion.div
//                             key={item.id}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.4, delay: index * 0.1 + qIndex * 0.05 + 0.3 }}
//                           >
//                             <AccordionItem value={`item-${item.id}`}>
//                               <motion.div
//                                 whileHover={{ x: 5 }}
//                                 transition={{ duration: 0.2 }}
//                               >
//                                 <AccordionTrigger className="text-left text-[16px]">
//                                   {item.question}
//                                 </AccordionTrigger>
//                               </motion.div>
//                               <AnimatePresence>
//                                 <motion.div
//                                   initial={{ height: 0, opacity: 0 }}
//                                   animate={{ height: "auto", opacity: 1 }}
//                                   exit={{ height: 0, opacity: 0 }}
//                                   transition={{ duration: 0.3, ease: "easeOut" }}
//                                 >
//                                   <AccordionContent>
//                                     <p className="text-muted-foreground leading-relaxed">
//                                       {item.answer}
//                                     </p>
//                                   </AccordionContent>
//                                 </motion.div>
//                               </AnimatePresence>
//                             </AccordionItem>
//                           </motion.div>
//                         ))}
//                       </Accordion>
//                     </CardContent>
//                   </Card>
//                 </motion.div>
//               ))
//             ) : (
//               <motion.div
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.8 }}
//                 transition={{ duration: 0.5, ease: "easeOut" }}
//               >
//                 <Card className="text-center py-12">
//                   <CardContent>
//                     <motion.div
//                       initial={{ scale: 0 }}
//                       animate={{ scale: 1 }}
//                       transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
//                     >
//                       <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                     </motion.div>
//                     <motion.h3
//                       className="text-xl font-semibold mb-2"
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.4, delay: 0.2 }}
//                     >
//                       No results found
//                     </motion.h3>
//                     <motion.p
//                       className="text-muted-foreground"
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.4, delay: 0.3 }}
//                     >
//                       Try searching with different keywords about our categories above.
//                     </motion.p>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>

//         {/* Contact Section */}
//         <motion.div
//           className="max-w-2xl mx-auto text-center"
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
//           whileHover={{ y: -5, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
//         >
//           <Card>
//             <CardHeader>
//               <motion.div
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.4, delay: 1.0 }}
//               >
//                 <CardTitle>Still need help?</CardTitle>
//               </motion.div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <motion.p
//                 className="text-muted-foreground"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: 1.1 }}
//               >
//                 Can't find what you're looking for? Our support team is here to help.
//               </motion.p>
//               <motion.div
//                 className="flex flex-col sm:flex-row gap-4 justify-center"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: 1.2 }}
//               >
//                 <motion.a
//                   href="mailto:support@corecognitive.com"
//                   className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
//                   whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
//                   whileTap={{ scale: 0.95 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   Email Support
//                 </motion.a>
//               </motion.div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default FAQ;