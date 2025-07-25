import { useEffect, useState } from "react";
import { Search, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.p
          className="text-muted-foreground text-lg"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Loading FAQs...
        </motion.p>
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
      className="min-h-screen bg-gradient-to-br from-background to-muted/30"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {/* Top Bar */}
      <motion.div
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between p-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.4 }}
          >
            <SidebarTrigger />
          </motion.div>
          <motion.h1
            className="text-xl font-semibold text-foreground"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            FAQ & Help Center
          </motion.h1>
          <div className="w-10" />
        </div>
      </motion.div>

      <div className="p-6 space-y-8">
        {/* Hero Section */}
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="flex justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          >
            <motion.div
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.4 }}
            >
              <HelpCircle className="h-16 w-16 text-primary" />
            </motion.div>
          </motion.div>
          <motion.h1
            className="text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            How can we help you?
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Find answers to common questions about our platform, courses, and mental health support services.
          </motion.p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
        >
          <div className="relative">
            <motion.div
              className="absolute left-3 top-3 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Search />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02, borderColor: "#3b82f6" }}
              transition={{ duration: 0.2 }}
            >
              <Input
                placeholder="   Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* FAQ Content */}
        <motion.div
          className="max-w-4xl mx-auto space-y-8"
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
                  whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                >
                  <Card>
                    <CardHeader>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                      >
                        <CardTitle className="text-2xl text-primary">
                          {category.category}
                        </CardTitle>
                      </motion.div>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((item, qIndex) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 + qIndex * 0.05 + 0.3 }}
                          >
                            <AccordionItem value={`item-${item.id}`}>
                              <motion.div
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                              >
                                <AccordionTrigger className="text-left text-[16px]">
                                  {item.question}
                                </AccordionTrigger>
                              </motion.div>
                              <AnimatePresence>
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: "easeOut" }}
                                >
                                  <AccordionContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                      {item.answer}
                                    </p>
                                  </AccordionContent>
                                </motion.div>
                              </AnimatePresence>
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
                <Card className="text-center py-12">
                  <CardContent>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                    >
                      <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    </motion.div>
                    <motion.h3
                      className="text-xl font-semibold mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      No results found
                    </motion.h3>
                    <motion.p
                      className="text-muted-foreground"
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
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9, ease: "easeOut" }}
          whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
        >
          <Card>
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1.0 }}
              >
                <CardTitle>Still need help?</CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.1 }}
              >
                Can't find what you're looking for? Our support team is here to help.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.2 }}
              >
                <motion.a
                  href="mailto:support@corecognitive.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Email Support
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