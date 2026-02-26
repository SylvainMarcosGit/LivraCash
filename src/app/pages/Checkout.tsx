import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

import { useCart } from "@/app/hooks/useCart";
import { orderService } from "@/app/services/orderService";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { toast } from "sonner";
import {
  ShoppingCart,
  ArrowLeft,
  Store,
  Package,
  Loader2,
  Banknote
} from "lucide-react";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "cash_on_delivery"
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await orderService.createOrder({
        shipping_address: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          phone: formData.phone,
          email: formData.email
        },
        payment_method: formData.paymentMethod,
        items: items.map((item: any) => ({
          id: item.productId,
          quantity: item.quantity,
          vendorId: item.vendorId,
          price: item.price
        }))
      });

      setIsSuccess(true);
      clearCart();
      toast.success("Commande passée avec succès");

      // Redirect to confirmation page of the first order (or list if multiple)
      if (response?.data && response.data.length > 0) {
        navigate(`/order-confirmation/${response.data[0].order_number}`);
      } else {
        navigate("/marketplace");
      }
    } catch (error) {
      toast.error("Échec de la commande");
      console.error(error);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      navigate("/cart");
    }
  }, [items, navigate, isSuccess]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/cart" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <Store className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LivraCash</span>
            </Link>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShoppingCart className="h-4 w-4" />
              <span>{items.length} articles</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Checkout Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Caisse</h1>
          <p className="text-gray-600 mt-1">Vérifiez vos articles, informations de livraison et paiement</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations de contact</CardTitle>
                  <CardDescription>
                    Entrez vos coordonnées pour la livraison
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("phone", e.target.value)}
                      placeholder="+229 XX XX XX XX"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Adresse de livraison</CardTitle>
                  <CardDescription>
                    Où devrions-nous livrer votre commande ?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("address", e.target.value)}
                      placeholder="Entrez votre adresse complète"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("city", e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Moyen de paiement</CardTitle>
                  <CardDescription>
                    Sélectionnez votre mode de paiement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                    <div className="flex items-center gap-3">
                      <Banknote className="h-6 w-6 text-blue-600" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Paiement à la livraison</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Payez uniquement à la réception de votre commande
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600 font-semibold">ℹ️</span>
                      <span>
                        Le paiement sera collecté lors de la livraison. Veuillez préparer le montant exact.
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Résumé de la commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item: any) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="h-16 w-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`}
                              alt={item.name}
                              className="w-full h-full object-contain mix-blend-multiply p-1"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qté: {item.quantity}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {(item.price * item.quantity).toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-medium text-gray-900">
                        {totalPrice.toLocaleString()} FCFA
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Livraison</span>
                      <span className="font-medium text-gray-900">
                        Gratuit
                      </span>
                    </div>

                    <Separator />

                    <div className="flex justify-between pt-2">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-gray-900">
                        {totalPrice.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardContent className="pt-0">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      <>
                        Commander
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}