import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";

import { useCart } from "@/app/hooks/useCart";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { ProductCard } from "@/app/components/ui/ProductCard";

import { toast } from "sonner";
import {
  Store,
  Search,
  MapPin,
  Star,
  Phone,
  Mail,
  Globe,
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  MessageCircle,
  CheckCircle2,
  Facebook,
  Youtube
} from "lucide-react";

import { marketplaceService, Product, Vendor } from "@/app/services/marketplaceService";
import { Review } from "@/app/services/reviewService";



export default function VendorShop() {
  const { id } = useParams();
  const { addToCart, totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadVendorData(id);
    }
  }, [id]);

  const loadVendorData = async (vendorId: string) => {
    try {
      const [vendorData, productsData, reviewsData] = await Promise.all([
        marketplaceService.getVendor(vendorId),
        marketplaceService.getVendorProducts(vendorId),
        marketplaceService.getVendorReviews(vendorId)
      ]);
      setVendor(vendorData);
      setProducts(productsData);
      setReviews(reviewsData);
    } catch (error) {
      toast.error("Failed to load vendor data");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !vendor) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const categories = ["all", ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/marketplace" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600">Retour au marché</span>
            </Link>

            <div className="flex items-center gap-2 md:gap-4">

              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Share2 className="h-5 w-5" />
              </Button>
              <Link to="/" className="hidden md:inline">
                <Button variant="ghost">
                  Se connecter
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Vendor Header */}
      {vendor.banner && (
        <div className="w-full h-48 md:h-64 overflow-hidden relative">
          <img src={vendor.banner} alt="Shop Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      <section className="bg-white border-b relative">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Vendor Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20 border-4 border-white shadow-sm z-10">
                  <AvatarImage src={vendor.image || ""} alt={vendor.name} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                    <Store className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
                    {vendor.verified && vendor.plan !== 'gratuit' && (
                      <Badge className="bg-blue-100 text-blue-700">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Vérifié
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4">{vendor.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{vendor.rating}</span>
                      <span className="text-gray-500">({vendor.reviews} avis)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{vendor.location}</span>
                    </div>
                    <Badge variant="outline">{vendor.category}</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="md:w-80">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contacter le vendeur</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      const phone = vendor.phone.replace(/[^0-9]/g, '');
                      window.open(`https://wa.me/${phone}`, '_blank');
                    }}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Envoyer un message
                  </Button>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{vendor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{vendor.email}</span>
                    </div>
                    {vendor.website && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="h-4 w-4" />
                        <a href={`https://${vendor.website}`} className="text-blue-600 hover:underline truncate">
                          {vendor.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>sur la plateforme depuis:</span>
                      <span className="font-medium">{vendor.joinedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Temps de réponse:</span>
                      <span className="font-medium">{vendor.responseTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Produits</TabsTrigger>
            {vendor.plan !== 'gratuit' && (
              <>
                <TabsTrigger value="about">À propos</TabsTrigger>
                <TabsTrigger value="reviews">Avis</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Rechercher des produits..."
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="whitespace-nowrap"
                    >
                      {category === "all" ? "Toutes les catégories" : category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  vendorId={vendor.id}
                  vendorName={vendor.name}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-600">
                  Essayez une recherche différente
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>À propos du vendeur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{vendor.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Localisation</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-5 w-5" />
                    <span>{vendor.location}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Informations de contact</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-5 w-5" />
                      <span>{vendor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-5 w-5" />
                      <span>{vendor.email}</span>
                    </div>
                    {vendor.website && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="h-5 w-5" />
                        <a href={vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {vendor.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Réseaux sociaux</h3>
                  <div className="flex gap-4">
                    <a
                      href={vendor.facebook_url || "#"}
                      target={vendor.facebook_url ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center size-10 rounded-full transition-colors ${vendor.facebook_url ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      title="Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>

                    <a
                      href={vendor.youtube_url || "#"}
                      target={vendor.youtube_url ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center size-10 rounded-full transition-colors ${vendor.youtube_url ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      title="YouTube"
                    >
                      <Youtube className="h-5 w-5" />
                    </a>

                    <a
                      href={vendor.tiktok_url || "#"}
                      target={vendor.tiktok_url ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center size-10 rounded-full transition-colors ${vendor.tiktok_url ? "bg-black text-white hover:bg-gray-900" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      title="TikTok"
                    >
                      <svg
                        className="h-5 w-5 fill-current"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.13-.31-2.34-.25-3.41.33-.71.38-1.27 1.03-1.6 1.8-.31.82-.28 1.73.02 2.51.3.78.9 1.43 1.62 1.83.76.4 1.66.56 2.52.41.95-.12 1.84-.61 2.41-1.38.31-.48.47-1.03.54-1.59.04-1.42.02-2.85.02-4.27V.02z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-6">
              {/* Reviews Summary */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="text-center md:border-r md:pr-8">
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        {vendor.rating}
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < Math.floor(vendor.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">
                        {vendor.reviews} avis
                      </p>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-4">Répartition des notes</h3>
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = reviews.filter(r => Math.round(r.rating) === stars).length;
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                          <div key={stars} className="flex items-center gap-3 mb-2">
                            <span className="text-sm text-gray-600 w-12">{stars} étoiles</span>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 w-8 text-right">
                              {count}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center text-gray-500 py-10">No reviews yet</div>
                ) : (
                  reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {review.is_anonymous
                                ? 'A'
                                : (review.reviewer_name?.charAt(0) || review.user?.first_name?.charAt(0) || 'A')}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {review.is_anonymous
                                    ? "Anonyme"
                                    : (review.reviewer_name ||
                                      (review.user?.first_name
                                        ? `${review.user.first_name} ${review.user.last_name || ''}`.trim()
                                        : "Anonyme"))}
                                </p>
                                <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                      }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}