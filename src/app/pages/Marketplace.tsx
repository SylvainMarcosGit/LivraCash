import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useCart } from "@/app/hooks/useCart";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import {
  Store,
  Search,
  MapPin,
  Star,
  Filter,
  ArrowLeft,
  ShoppingCart
} from "lucide-react";
import { api } from "@/app/services/api";

interface Vendor {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  location: string;
  products: number;
  image: string | null;
  verified: boolean;
  plan: string;
}

const categories = [
  "All Categories",
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Beauty",
  "Sports",
  "Books",
  "Food & Beverage",
  "Kids & Baby"
];

export default function Marketplace() {
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("popular");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await api.get("/marketplace/vendors");
      setVendors(response.data.data);
    } catch (error) {
      console.error("Failed to fetch vendors", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedVendors = [...filteredVendors].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "reviews":
        return b.reviews - a.reviews;
      case "products":
        return b.products - a.products;
      default:
        return b.reviews - a.reviews; // popular
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <Store className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LivraCash</span>
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

              <Link to="/login" className="hidden sm:inline">
                <Button variant="ghost">
                  Connexion
                </Button>
              </Link>
              <Link to="/register" className="hidden md:inline">
                <Button>
                  Devenez vendeur
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Découvrez des vendeurs exceptionnels
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Parcourez des centaines de vendeurs vérifiés et trouvez exactement ce dont vous avez besoin
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-lg p-2 flex gap-2 shadow-lg">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Recherchez des vendeurs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900"
                />
              </div>
              <Button className="px-8">
                Recherche
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="font-semibold text-gray-900">Filtres</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Le plus populaire</SelectItem>
                  <SelectItem value="rating">Le mieux noté</SelectItem>
                  <SelectItem value="reviews">Le plus revu</SelectItem>
                  <SelectItem value="products">Le plus de produits</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Affichage <span className="font-semibold text-gray-900">{sortedVendors.length}</span> Vendeurs
          </p>
        </div>

        {/* Vendor Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedVendors.map((vendor) => (
            <Link key={vendor.id} to={`/shop/${vendor.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                    <Store className="h-16 w-16 text-blue-600" />
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{vendor.name}</CardTitle>
                    {vendor.verified && vendor.plan !== 'gratuit' && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                        Vérifié
                      </Badge>
                    )}
                  </div>

                  <CardDescription className="line-clamp-2">
                    {vendor.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900">{vendor.rating}</span>
                    <span className="text-gray-500">({vendor.reviews} Avis)</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{vendor.location}</span>
                  </div>

                  <Badge variant="outline">{vendor.category}</Badge>
                </CardContent>

                <CardFooter className="border-t pt-4">
                  <div className="w-full flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {vendor.products} Produits
                    </span>
                    <Button variant="ghost" size="sm">
                      Visiter la boutique
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {sortedVendors.length === 0 && (
          <div className="text-center py-16">
            <Store className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun vendeur trouvé
            </h3>
            <p className="text-gray-600">
              Essayez d'ajuster votre recherche ou vos filtres
            </p>
          </div>
        )}
      </div>
    </div>
  );
}