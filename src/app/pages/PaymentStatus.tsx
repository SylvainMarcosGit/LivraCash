import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "@/app/hooks/useAuth";

import AppLayout from "@/app/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { Badge } from "@/app/components/ui/badge";
import { CheckCircle2, XCircle, Clock, RefreshCw, ArrowLeft, Download } from "lucide-react";
import { formatCurrency, formatDate } from "@/app/utils/formatters";

interface PaymentDetails {
  transaction_id: string;
  reference: string;
  status: "pending" | "processing" | "success" | "failed";
  amount: number;
  currency: string;
  commission: number;
  net_amount: number;
  payment_method: string;
  provider: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  description: string;
  created_at: string;
  completed_at: string | null;
}

export default function PaymentStatus() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [progress, setProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    // Load payment details (replace with API call)
    const mockPayment: PaymentDetails = {
      transaction_id: id || "TXN_001",
      reference: "KKP-20240123-" + (id ? id.slice(-3) : "001"),
      status: "processing",
      amount: 50000,
      currency: "XOF",
      commission: 1000,
      net_amount: 49000,
      payment_method: "mobile_money",
      provider: "MTN Mobile Money",
      customer: {
        name: "John Doe",
        phone: "+229123456789",
        email: "john@example.com",
      },
      description: "Payment for order #12345",
      created_at: new Date().toISOString(),
      completed_at: null,
    };

    setPayment(mockPayment);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Update status to success after progress completes
          setTimeout(() => {
            setPayment((current) =>
              current ? { ...current, status: "success", completed_at: new Date().toISOString() } : null
            );
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(progressInterval);
  }, [id]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleNewPayment = () => {
    navigate("/payment/new");
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleDownloadReceipt = () => {
    // Mock download receipt
    console.log("Downloading receipt...");
  };

  const getStatusIcon = () => {
    switch (payment?.status) {
      case "success":
        return <CheckCircle2 className="size-16 text-green-500" />;
      case "failed":
        return <XCircle className="size-16 text-red-500" />;
      case "processing":
      case "pending":
        return <Clock className="size-16 text-yellow-500 animate-pulse" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (payment?.status) {
      case "success":
        return "Payment Successful";
      case "failed":
        return "Payment Failed";
      case "processing":
        return "Processing Payment...";
      case "pending":
        return "Payment Pending";
      default:
        return "Unknown Status";
    }
  };

  const getStatusBadge = () => {
    const variants: Record<NonNullable<PaymentDetails["status"]>, "default" | "secondary" | "destructive"> = {
      success: "default",
      pending: "secondary",
      processing: "secondary",
      failed: "destructive",
    };

    return payment?.status ? (
      <Badge variant={variants[payment.status]} className="capitalize">
        {payment.status}
      </Badge>
    ) : null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !payment) {
    return null;
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBackToDashboard}>
            <ArrowLeft className="size-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Status Display */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              {getStatusIcon()}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{getStatusText()}</h2>
                <p className="text-gray-600 mt-1">Transaction ID: {payment.reference}</p>
              </div>
              {getStatusBadge()}
            </div>

            {/* Progress Bar for Processing */}
            {(payment.status === "processing" || payment.status === "pending") && (
              <div className="mt-6 space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-center text-gray-600">
                  {progress < 100 ? "Processing payment..." : "Almost done..."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payment Details</CardTitle>
              <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isRefreshing}>
                <RefreshCw className={`size-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-lg font-semibold">{formatCurrency(payment.amount, payment.currency)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Commission</p>
                  <p className="text-lg font-semibold text-red-600">
                    -{formatCurrency(payment.commission, payment.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Net Amount</p>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(payment.net_amount, payment.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="text-lg font-semibold capitalize">
                    {payment.payment_method.replace("_", " ")}
                  </p>
                </div>
              </div>

              <hr />

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="font-medium">{payment.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-medium">{payment.customer.phone}</p>
                </div>
                {payment.customer.email && (
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{payment.customer.email}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Provider</p>
                  <p className="font-medium">{payment.provider}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-medium">{payment.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created At</p>
                  <p className="font-medium">{formatDate(payment.created_at)}</p>
                </div>
                {payment.completed_at && (
                  <div>
                    <p className="text-sm text-gray-600">Completed At</p>
                    <p className="font-medium">{formatDate(payment.completed_at)}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {payment.status === "success" && (
            <Button onClick={handleDownloadReceipt} variant="outline" className="flex-1">
              <Download className="size-4 mr-2" />
              Download Receipt
            </Button>
          )}
          <Button onClick={handleNewPayment} className="flex-1">
            Create New Payment
          </Button>
        </div>

        {/* Status Messages */}
        {payment.status === "failed" && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-900">
                <strong>Payment Failed:</strong> The transaction could not be completed. Please try again or contact support if the issue persists.
              </p>
            </CardContent>
          </Card>
        )}

        {payment.status === "pending" && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <p className="text-yellow-900">
                <strong>Waiting for Customer:</strong> The customer needs to complete the payment on their device. This may take a few minutes.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
