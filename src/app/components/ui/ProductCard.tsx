import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/app/hooks/useCart";
import { toast } from "sonner";
import { favoriteService } from "@/app/services/favoriteService";
import { useAuth } from "@/app/hooks/useAuth";
import { ReviewDialog } from "@/app/components/ui/ReviewDialog";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    currency?: string; // Optional
    image?: string | null; // Single image from backend
    images?: string[]; // Array of up to 3 image URLs (legacy or multiple)
    category: string;
    inStock?: boolean; // Camel case from legacy/frontend types
    in_stock?: boolean; // Snake case from backend
    rating?: number; // Optional
    reviews?: number; // Optional
  };
  vendorId: string;
  vendorName: string;
}

export function ProductCard({ product, vendorId, vendorName }: ProductCardProps) {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(product.is_favorited || false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  // Normalize properties
  const inStock = product.in_stock !== undefined ? product.in_stock : product.inStock;

  // Normalize images
  const images = product.images || (product.image ? [product.image] : []);
  const displayImage = images[currentImageIndex]
    ? (images[currentImageIndex].startsWith('http')
      ? images[currentImageIndex]
      : `http://127.0.0.1:8000${images[currentImageIndex]}`)
    : null;

  const handleAddToCart = () => {
    if (inStock) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        vendorId: vendorId,
        vendorName: vendorName,
        image: images[0] || null
      });
      toast.success("Ajouté au panier");
    }
  };

  const { isAuthenticated } = useAuth();

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour ajouter aux favoris");
      return;
    }

    // Optimistic update
    const previousState = isFavorited;
    setIsFavorited(!previousState);
    setIsFavoriteLoading(true);

    try {
      await favoriteService.toggleFavorite(product.id);
      // Success - state already updated optimistically
    } catch (error) {
      // Revert on failure
      setIsFavorited(previousState);
      toast.error("Échec de la mise à jour des favoris");
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        {/* Image Gallery */}
        <div
          className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden group"
          onMouseLeave={() => setCurrentImageIndex(0)}
        >
          {displayImage ? (
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <ShoppingCart className="h-12 w-12 text-gray-400" />
          )}

          {!inStock && (
            <Badge variant="secondary" className="absolute top-2 right-2 bg-red-100 text-red-700">
              Rupture de stock
            </Badge>
          )}

          {/* Image Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === index
                    ? "bg-gray-800 w-6"
                    : "bg-gray-400 hover:bg-gray-600"
                    }`}
                  onMouseEnter={() => setCurrentImageIndex(index)}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Hover area for image navigation */}
          {images.length > 1 && (
            <div className="absolute inset-0 flex opacity-0 group-hover:opacity-100 transition-opacity">
              {images.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 cursor-pointer"
                  onMouseEnter={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        <CardTitle className="text-lg">{product.name}</CardTitle>
        <div
          className="flex items-center gap-1 text-sm mt-1 text-muted-foreground cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
          onClick={() => setIsReviewDialogOpen(true)}
        >
          <Star className={`h-3 w-3 ${product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
          <span className="font-medium text-gray-900">{product.rating || 0}</span>
          <span className="text-gray-500">({product.reviews_count || product.reviews || 0})</span>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">
            {product.price.toLocaleString()}
          </span>
          <span className="text-gray-600">{product.currency || "FCFA"}</span>
        </div>
        <Badge variant="outline" className="mt-2">{product.category}</Badge>
      </CardContent>

      <CardFooter className="gap-2 flex-shrink-0">
        <Button
          className="flex-1"
          disabled={!inStock}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {inStock ? "Ajouter au panier" : "Rupture de stock"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleToggleFavorite}
          disabled={isFavoriteLoading}
          className={isFavorited ? "text-red-500 hover:text-red-600" : ""}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
        </Button>
      </CardFooter>

      <ReviewDialog
        isOpen={isReviewDialogOpen}
        onClose={() => setIsReviewDialogOpen(false)}
        productId={product.id}
        productName={product.name}
        onReviewSubmitted={() => {
          setIsReviewDialogOpen(false);
        }}
      />
    </Card>
  );
}
