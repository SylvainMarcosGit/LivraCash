import { Link } from "react-router";

import { useCart } from "@/app/hooks/useCart";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Store,
  Package
} from "lucide-react";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  const groupedByVendor = items.reduce((acc, item) => {
    if (!acc[item.vendorId]) {
      acc[item.vendorId] = {
        vendorName: item.vendorName,
        items: [],
      };
    }
    acc[item.vendorId].items.push(item);
    return acc;
  }, {} as Record<string, { vendorName: string; items: typeof items }>);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <Link to="/marketplace" className="flex items-center gap-2">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
                <Store className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">LivraCash</span>
              </Link>

              <div className="flex items-center gap-4">
                <Link to="/login">
                  <Button variant="ghost">
                    Se connecter
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </header>

        {/* Empty Cart */}
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-16 pb-16">
              <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Votre panier est vide
              </h2>
              <p className="text-gray-600 mb-8">
                Ajoutez des produits pour commencer vos achats
              </p>
              <Link to="/marketplace">
                <Button size="lg">
                  Parcourir le marché
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/marketplace" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <Store className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LivraCash</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">
                  Se connecter
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Cart Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Panier</h1>
          <p className="text-gray-600 mt-1">
            {totalItems} {totalItems === 1 ? "article" : "articles"} dans le panier
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(groupedByVendor).map(([vendorId, { vendorName, items: vendorItems }]) => (
              <Card key={vendorId}>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">{vendorName}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {vendorItems.map((item, index) => (
                    <div key={item.id}>
                      <div className="p-6 flex gap-4">
                        <div className="h-24 w-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image.startsWith('http') ? item.image : `http://127.0.0.1:8000${item.image}`}
                              alt={item.name}
                              className="w-full h-full object-contain mix-blend-multiply p-2"
                            />
                          ) : (
                            <Package className="h-10 w-10 text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {item.price.toLocaleString()} FCFA
                          </p>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                className="w-16 h-8 text-center border-0 focus-visible:ring-0"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Retirer
                            </Button>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {(item.price * item.quantity).toLocaleString()} FCFA
                          </div>
                        </div>
                      </div>
                      {index < vendorItems.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium text-gray-900">
                    {totalPrice.toLocaleString()} FCFA
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium text-gray-900">
                    Calculé à la caisse
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {totalPrice.toLocaleString()} FCFA
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Link to="/checkout" className="w-full">
                  <Button size="lg" className="w-full">
                    Passer à la caisse
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/marketplace" className="w-full">
                  <Button variant="outline" size="lg" className="w-full">
                    Continuer vos achats
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
