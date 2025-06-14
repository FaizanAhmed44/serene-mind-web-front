
import { useState } from "react";
import { CreditCard, Download, Calendar, DollarSign } from "lucide-react";
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
      // In a real app, this would download the actual invoice
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
    <div className="space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-primary" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">${totalSpent.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{transactions.filter(t => t.status === "completed").length}</div>
              <div className="text-sm text-muted-foreground">Successful Payments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{transactions.length}</div>
              <div className="text-sm text-muted-foreground">Total Transactions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-primary" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">
                        {transaction.description}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-foreground">
                        ${transaction.amount.toFixed(2)}
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={getStatusColor(transaction.status)}
                      >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Badge>
                    </div>
                    
                    {transaction.status === "completed" && transaction.invoiceUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(transaction)}
                        className="ml-4"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Invoice
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {transactions.length === 0 && (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistory;
