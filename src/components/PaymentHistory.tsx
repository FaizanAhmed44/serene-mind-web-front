
// import { useState } from "react";
// import { CreditCard, Download, Calendar, DollarSign } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { useToast } from "@/hooks/use-toast";

// interface Transaction {
//   id: string;
//   date: string;
//   description: string;
//   amount: number;
//   status: "completed" | "pending" | "failed";
//   invoiceUrl?: string;
// }

// const PaymentHistory = () => {
//   const { toast } = useToast();
  
//   const [transactions] = useState<Transaction[]>([
//     {
//       id: "inv_001",
//       date: "2024-06-01",
//       description: "Premium Course: Advanced Mindfulness",
//       amount: 99.99,
//       status: "completed",
//       invoiceUrl: "#"
//     },
//     {
//       id: "inv_002",
//       date: "2024-05-15",
//       description: "Expert Session: Dr. Sarah Wilson",
//       amount: 150.00,
//       status: "completed",
//       invoiceUrl: "#"
//     },
//     {
//       id: "inv_003",
//       date: "2024-05-01",
//       description: "Monthly Subscription",
//       amount: 29.99,
//       status: "completed",
//       invoiceUrl: "#"
//     },
//     {
//       id: "inv_004",
//       date: "2024-04-20",
//       description: "Course: Stress Management Basics",
//       amount: 49.99,
//       status: "completed",
//       invoiceUrl: "#"
//     },
//     {
//       id: "inv_005",
//       date: "2024-04-01",
//       description: "Monthly Subscription",
//       amount: 29.99,
//       status: "failed"
//     }
//   ]);

//   const handleDownloadInvoice = (transaction: Transaction) => {
//     if (transaction.invoiceUrl) {
//       // In a real app, this would download the actual invoice
//       toast({
//         title: "Invoice Downloaded",
//         description: `Invoice for ${transaction.description} has been downloaded.`,
//       });
//     } else {
//       toast({
//         title: "Invoice Not Available",
//         description: "Invoice is not available for this transaction.",
//         variant: "destructive",
//       });
//     }
//   };

//   const getStatusColor = (status: Transaction["status"]) => {
//     switch (status) {
//       case "completed":
//         return "bg-green-100 text-green-800 hover:bg-green-100";
//       case "pending":
//         return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
//       case "failed":
//         return "bg-red-100 text-red-800 hover:bg-red-100";
//       default:
//         return "bg-gray-100 text-gray-800 hover:bg-gray-100";
//     }
//   };

//   const totalSpent = transactions
//     .filter(t => t.status === "completed")
//     .reduce((sum, t) => sum + t.amount, 0);

//   return (
//     <div className="space-y-6">
//       {/* Payment Summary */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <DollarSign className="h-5 w-5 mr-2 text-primary" />
//             Payment Summary
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="text-center">
//               <div className="text-2xl font-bold text-primary">${totalSpent.toFixed(2)}</div>
//               <div className="text-sm text-muted-foreground">Total Spent</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-primary">{transactions.filter(t => t.status === "completed").length}</div>
//               <div className="text-sm text-muted-foreground">Successful Payments</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-primary">{transactions.length}</div>
//               <div className="text-sm text-muted-foreground">Total Transactions</div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Transaction History */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <CreditCard className="h-5 w-5 mr-2 text-primary" />
//             Transaction History
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {transactions.map((transaction) => (
//               <div
//                 key={transaction.id}
//                 className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
//               >
//                 <div className="flex-1">
//                   <div className="flex items-center space-x-4">
//                     <div className="flex-1">
//                       <h4 className="font-medium text-foreground">
//                         {transaction.description}
//                       </h4>
//                       <div className="flex items-center space-x-2 mt-1">
//                         <Calendar className="h-4 w-4 text-muted-foreground" />
//                         <span className="text-sm text-muted-foreground">
//                           {new Date(transaction.date).toLocaleDateString()}
//                         </span>
//                       </div>
//                     </div>
                    
//                     <div className="text-right">
//                       <div className="font-semibold text-foreground">
//                         ${transaction.amount.toFixed(2)}
//                       </div>
//                       <Badge 
//                         variant="secondary" 
//                         className={getStatusColor(transaction.status)}
//                       >
//                         {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
//                       </Badge>
//                     </div>
                    
//                     {transaction.status === "completed" && transaction.invoiceUrl && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleDownloadInvoice(transaction)}
//                         className="ml-4"
//                       >
//                         <Download className="h-4 w-4 mr-1" />
//                         Invoice
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           {transactions.length === 0 && (
//             <div className="text-center py-8">
//               <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//               <p className="text-muted-foreground">No transactions found</p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default PaymentHistory;
import { useState } from "react";
import { CreditCard, Download, Calendar, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Payment Summary */}
      <motion.div
        whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CardTitle className="flex items-center text-primary">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.4 }}
                >
                  <DollarSign className="h-5 w-5 mr-2 text-primary" />
                </motion.div>
                Payment Summary
              </CardTitle>
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
                  transition={{ duration: 0.4, delay: index * 0.2, type: "spring", stiffness: 100 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div 
                    className="text-2xl font-bold text-primary"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, delay: index * 0.3, repeat: 1 }}
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
        whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <CardTitle className="flex items-center text-primary">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.4 }}
                >
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                </motion.div>
                Transaction History
              </CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <motion.h5 
                          className=" text-foreground"
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {transaction.description }
                        </motion.h5>
                        <div className="flex items-center space-x-2 mt-1">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.4 }}
                          >
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                          </motion.div>
                          <motion.span
                            className="text-sm text-muted-foreground"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            {new Date(transaction.date).toLocaleDateString()}
                          </motion.span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <motion.div 
                          className="font-semibold text-foreground"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          ${transaction.amount.toFixed(2)}
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
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
                          whileHover={{ scale: 1.1, rotate: 2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadInvoice(transaction)}
                            className="ml-4"
                          >
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.4 }}
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
                transition={{ duration: 0.4 }}
                className="text-center py-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                </motion.div>
                <motion.p 
                  className="text-muted-foreground"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  No transactions found
                </motion.p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PaymentHistory;