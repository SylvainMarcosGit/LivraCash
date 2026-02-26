import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Progress } from "@/app/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Smartphone, CreditCard, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function PaymentInterface() {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = async (method: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setPaymentSuccess(false);

    // Simulate payment processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setPaymentSuccess(true);
          toast.success("Payment successful!");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Interface</CardTitle>
          <CardDescription>Accept payments via Mobile Money or Card</CardDescription>
        </CardHeader>
        <CardContent>
          {paymentSuccess ? (
            <div className="text-center py-8">
              <div className="bg-green-100 rounded-full size-16 mx-auto flex items-center justify-center mb-4">
                <Check className="size-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">Amount: {amount} XOF</p>
              <Button onClick={() => {
                setPaymentSuccess(false);
                setAmount("");
                setProgress(0);
              }}>
                New Payment
              </Button>
            </div>
          ) : isProcessing ? (
            <div className="py-8">
              <div className="text-center mb-4">
                <Loader2 className="size-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-lg font-medium">Processing Payment...</p>
                <p className="text-sm text-gray-600 mt-2">Please wait while we process your transaction</p>
              </div>
              <Progress value={progress} className="mt-4" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (XOF) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="100"
                />
              </div>

              <Tabs defaultValue="mobile" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="mobile">
                    <Smartphone className="size-4 mr-2" />
                    Mobile Money
                  </TabsTrigger>
                  <TabsTrigger value="card">
                    <CreditCard className="size-4 mr-2" />
                    Card Payment
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="mobile" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" placeholder="+229 XX XX XX XX" />
                  </div>
                  <div className="space-y-2">
                    <Label>Provider</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {["MTN", "Moov", "Celtiis"].map((provider) => (
                        <Button key={provider} variant="outline" type="button">
                          {provider}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button onClick={() => handlePayment("mobile")} className="w-full">
                    Pay with Mobile Money
                  </Button>
                </TabsContent>

                <TabsContent value="card" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number *</Label>
                    <Input id="card-number" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date *</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input id="cvv" type="password" placeholder="123" maxLength={3} />
                    </div>
                  </div>
                  <Button onClick={() => handlePayment("card")} className="w-full">
                    Pay with Card
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
