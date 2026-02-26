import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { CheckCircle2, Store, Printer, Home, User, Package, MapPin, Loader2 } from "lucide-react";
import { api } from "@/app/services/api";
import { formatCurrency, formatDate } from "@/app/utils/formatters";
import { Separator } from "@/app/components/ui/separator";

interface OrderDetails {
  id: number;
  order_number: string;
  created_at: string;
  total_amount: number;
  payment_method: string;
  status: string;
  shipping_address: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    phone: string;
    email: string;
  };
  items: Array<{
    id: number;
    price: number;
    quantity: number;
    product: {
      name: string;
      image: string;
    };
  }>;
  vendor?: {
    shop_settings?: {
      name: string;
    };
    first_name: string;
    last_name: string;
  };
}

export default function OrderConfirmation() {
  const { orderId, orderNumber } = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        let endpoint = "";
        if (orderNumber) {
          endpoint = `/public/orders/${orderNumber}`;
        } else if (orderId) {
          endpoint = `/orders/${orderId}`;
        } else {
          setIsLoading(false);
          return;
        }

        const response = await api.get<{ success: boolean; data: OrderDetails }>(endpoint);
        if (response.data.success) {
          setOrder(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId || orderNumber) {
      fetchOrder();
    }
  }, [orderId, orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-xl text-gray-600">Order not found</p>
        <Link to="/marketplace">
          <Button>Return to Marketplace</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white print:p-0">
      {/* Header - Hidden on Print */}
      <header className="bg-white border-b border-gray-200 print:hidden">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/marketplace" className="flex items-center gap-2">
              <Store className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LivraCash</span>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 print:p-0 print:max-w-none">

        {/* Success Message - Hidden on Print */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-start gap-4 print:hidden">
          <CheckCircle2 className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
          <div>
            <h1 className="text-lg font-semibold text-green-800 mb-1">
              Merci pour votre commande !
            </h1>
            <p className="text-green-700">
              Votre commande a été confirmée et est en cours de préparation. Un email de confirmation a été envoyé à {order.shipping_address.email}.
            </p>
          </div>
        </div>

        {/* Vendor Shop Name Display - Screen View */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 print:hidden">
          <h2 className="text-lg font-semibold text-blue-900 mb-1">
            Commande chez: <span className="text-blue-700">{order.vendor?.shop_settings?.name || `${order.vendor?.first_name || ''} ${order.vendor?.last_name || ''}`}</span>
          </h2>
          <p className="text-sm text-blue-600">
            Marché: LivraCash
          </p>
        </div>

        {/* Action Buttons - Hidden on Print */}
        <div className="flex justify-end gap-3 mb-6 print:hidden">
          <Link to="/marketplace">
            <Button variant="outline">
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer le Bon de commande
          </Button>
        </div>

        {/* Printable Content */}
        <div id="printable-content" className="space-y-4 print:space-y-2">
          {/* Header for Print - Compact Layout */}
          <div className="hidden print:block mb-4 border-b pb-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Store className="h-6 w-6 text-gray-900" />
                  <span className="text-2xl font-bold text-gray-900">LivraCash</span>
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider ml-8">Marketplace</div>
              </div>
              <div className="text-right">
                <h1 className="text-xl font-bold uppercase">Bon de commande</h1>
                <p className="text-sm font-semibold">#{order.order_number}</p>
                <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 bg-gray-50 print:bg-transparent p-2 rounded print:p-0 text-left">
              <div>
                <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Boutique</span>
                <span className="font-bold text-base text-gray-900">{order.vendor?.shop_settings?.name || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Vendeur / Marchand</span>
                <span className="font-medium text-sm text-gray-800">{order.vendor?.first_name} {order.vendor?.last_name}</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 print:gap-2">
            {/* Client Info */}
            <div className="border rounded p-3 print:p-2 print:border-gray-300">
              <h3 className="flex items-center gap-2 text-gray-900 font-semibold mb-1 text-sm uppercase">
                <User className="h-3 w-3" />
                Informations client
              </h3>
              <div className="space-y-0.5 text-sm print:text-xs">
                <p><span className="font-medium text-gray-500">Nom:</span> {order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                <p><span className="font-medium text-gray-500">Email:</span> {order.shipping_address.email}</p>
                <p><span className="font-medium text-gray-500">Téléphone:</span> {order.shipping_address.phone}</p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="border rounded p-3 print:p-2 print:border-gray-300">
              <h3 className="flex items-center gap-2 text-gray-900 font-semibold mb-1 text-sm uppercase">
                <MapPin className="h-3 w-3" />
                Livraison
              </h3>
              <div className="space-y-0.5 text-sm print:text-xs">
                <p><span className="font-medium text-gray-500">Adresse:</span> {order.shipping_address.address}</p>
                <p><span className="font-medium text-gray-500">Ville:</span> {order.shipping_address.city}</p>
                <p className="text-blue-600 font-medium print:text-black">Livraison à domicile</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="border rounded print:border-gray-300 mt-4 print:mt-2">
            <div className="p-3 border-b bg-gray-50 print:bg-gray-100 print:py-1">
              <h3 className="flex items-center gap-2 text-gray-900 font-semibold text-sm uppercase">
                <Package className="h-3 w-3" />
                Détails de la commande
              </h3>
            </div>
            <div className="p-0">
              <table className="w-full text-sm print:text-xs">
                <thead>
                  <tr className="border-b bg-gray-50/50 print:bg-white">
                    <th className="text-left font-medium text-gray-500 p-2 uppercase text-[10px]">Article</th>
                    <th className="text-right font-medium text-gray-500 p-2 uppercase text-[10px]">Prix</th>
                    <th className="text-center font-medium text-gray-500 p-2 uppercase text-[10px]">Qté</th>
                    <th className="text-right font-medium text-gray-500 p-2 uppercase text-[10px]">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2 font-medium">{item.product.name}</td>
                      <td className="p-2 text-right text-gray-600">{formatCurrency(item.price, "XOF")}</td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-right font-semibold">{formatCurrency(item.price * item.quantity, "XOF")}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200">
                    <td colSpan={3} className="p-2 text-right font-bold text-gray-900 uppercase text-xs">TOTAL:</td>
                    <td className="p-2 text-right font-bold text-lg text-primary print:text-black">{formatCurrency(order.total_amount, "XOF")}</td>
                  </tr>
                  <tr className="print:table-row hidden">
                    <td colSpan={4} className="p-2 text-right text-[10px] text-gray-500 italic">
                      Moyen de paiement: {order.payment_method === "cash_on_delivery" ? "Paiement à la livraison" : order.payment_method}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Footer Status - Center on page */}
          <div className="text-center py-8 print:hidden">
            <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4">
              <Loader2 className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Votre commande est en cours de préparation</h3>
            <p className="text-gray-600 max-w-lg mx-auto">
              Nous vous remercions d'avoir choisi LivraCash. Notre équipe travaille activement à préparer votre commande.
            </p>
          </div>

          {/* Print Footer */}
          <div className="hidden print:block text-center text-[10px] text-gray-400 mt-4 border-t pt-2">
            <p>LivraCash - https://shopzone</p>
            <p>Merci pour votre confiance !</p>
          </div>
        </div>
      </div>
    </div>
  );
}
