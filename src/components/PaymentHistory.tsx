
import { useState } from "react";
import { CreditCard, Download, Calendar, DollarSign, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  invoiceUrl?: string;
}

const PaymentHistory = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [transactions] = useState<Transaction[]>([
    {
      id: "inv_001",
      date: "2024-06-01",
      description: "Premium Course: Advanced Mindfulness",
      amount: 99.99,
      status: "completed",
      invoiceUrl: "#"
    },
    {
      id: "inv_002",
      date: "2024-05-15",
      description: "Expert Session: Dr. Sarah Wilson",
      amount: 150.00,
      status: "completed",
      invoiceUrl: "#"
    },
    {
      id: "inv_003",
      date: "2024-05-01",
      description: "Monthly Subscription",
      amount: 29.99,
      status: "completed",
      invoiceUrl: "#"
    },
    {
      id: "inv_004",
      date: "2024-04-20",
      description: "Course: Stress Management Basics",
      amount: 49.99,
      status: "completed",
      invoiceUrl: "#"
    },
    {
      id: "inv_005",
      date: "2024-04-01",
      description: "Monthly Subscription",
      amount: 29.99,
      status: "failed"
    }
  ]);

  const handleDownloadInvoice = (transaction: Transaction) => {
    if (transaction.invoiceUrl) {
      toast({
        title: "Invoice Downloaded",
        description: `Invoice for ${transaction.description} has been downloaded.`,
      });
    } else {
      toast({
        title: "Invoice Not Available",
        description: "Invoice is not available for this transaction.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "failed":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const totalSpent = transactions
    .filter(t => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-primary/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>


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
            Payment History
          </motion.h1>
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              variant="outline" 
              size="icon"
              className="h-8 w-8"
              onClick={() => navigate('/profile')}
              title="Back to Profile"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>    

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6"
      >
        {/* Payment Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.1)", transition: { duration: 0.3, ease: "easeOut" } }}
        >
          <Card>
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex items-center text-primary"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <DollarSign className="h-5 w-5 mr-2 text-primary" />
                </motion.div>
                <CardTitle>Payment Summary</CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { value: `$${totalSpent.toFixed(2)}`, label: "Total Spent" },
                  { value: transactions.filter(t => t.status === "completed").length, label: "Successful Payments" },
                  { value: transactions.length, label: "Total Transactions" },
                ].map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05, transition: { duration: 0.3, ease: "easeOut" } }}
                  >
                    <motion.div 
                      className="text-2xl font-bold text-primary"
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 + index * 0.1 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          whileHover={{ y: -5, boxShadow: "0 8px 16px rgba(0,0,0,0.1)", transition: { duration: 0.3, ease: "easeOut" } }}
        >
          <Card>
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex items-center text-primary"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                </motion.div>
                <CardTitle>Transaction History</CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors duration-200"
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.05)", transition: { duration: 0.2, ease: "easeOut" } }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <motion.h5 
                            className="text-foreground font-medium"
                            whileHover={{ x: 4, transition: { duration: 0.2, ease: "easeOut" } }}
                          >
                            {transaction.description}
                          </motion.h5>
                          <div className="flex items-center space-x-2 mt-1">
                            <motion.div
                              whileHover={{ scale: 1.1, transition: { duration: 0.2, ease: "easeOut" } }}
                            >
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                            </motion.div>
                            <motion.span
                              className="text-sm text-muted-foreground"
                              whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: "easeOut" } }}
                            >
                              {new Date(transaction.date).toLocaleDateString()}
                            </motion.span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <motion.div 
                            className="font-semibold text-foreground"
                            whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: "easeOut" } }}
                          >
                            ${transaction.amount.toFixed(2)}
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05, transition: { duration: 0.2, ease: "easeOut" } }}
                          >
                            <Badge 
                              variant="secondary" 
                              className={getStatusColor(transaction.status)}
                            >
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </Badge>
                          </motion.div>
                        </div>
                        
                        {transaction.status === "completed" && transaction.invoiceUrl && (
                          <motion.div
                            whileHover={{ scale: 1.05, transition: { duration: 0.2, ease: "easeOut" } }}
                            whileTap={{ scale: 0.95, transition: { duration: 0.2, ease: "easeOut" } }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadInvoice(transaction)}
                              className="ml-4"
                            >
                              <motion.div
                                whileHover={{ scale: 1.1, transition: { duration: 0.2, ease: "easeOut" } }}
                              >
                                <Download className="h-4 w-4 mr-1" />
                              </motion.div>
                              Invoice
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {transactions.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }}
                  >
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  </motion.div>
                  <motion.p 
                    className="text-muted-foreground"
                    whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: "easeOut" } }}
                  >
                    No transactions found
                  </motion.p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentHistory;
