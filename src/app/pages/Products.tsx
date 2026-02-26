import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/app/hooks/useAuth";
import AppLayout from "@/app/components/layout/AppLayout";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { Switch } from "@/app/components/ui/switch";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Upload,
  Save,
  X
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";

import { productService, Product } from "@/app/services/productService";
import { getErrorMessage } from "@/app/services/api";

const categories = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Beauty",
  "Sports",
  "Books",
  "Food & Beverage",
  "Kids & Baby"
];



/* REMOVED MOCK DATA */

// Define form data type to include file object
interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  inStock: boolean;
  stockQuantity: string;
  images: string[]; // For preview
  imageFiles: File[]; // For upload
}

export default function Products() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]); // Initialize empty
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFunctionLoading, setIsFunctionLoading] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    category: "Electronics",
    inStock: true,
    stockQuantity: "0",
    image: "", // Legacy, unused in form
    images: [],
    imageFiles: []
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Calculate remaining slots
      const currentCount = formData.images.length;
      const remainingSlots = 3 - currentCount;

      if (remainingSlots <= 0) {
        toast.error("Maximum 3 images autorisées");
        e.target.value = ''; // Reset
        return;
      }

      // Take only as many as allowed
      const newFiles = Array.from(files).slice(0, remainingSlots);

      if (files.length > remainingSlots) {
        toast.warning(`Seules les images restantes ont été ajoutées`);
      }

      const newImageUrls = newFiles.map(file => URL.createObjectURL(file));

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImageUrls],
        imageFiles: [...prev.imageFiles, ...newFiles]
      }));

      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = [...prev.images];
      const newImageFiles = [...prev.imageFiles];

      // Calculate how many were existing (not in imageFiles)
      const existingCount = prev.images.length - prev.imageFiles.length;

      // If we are removing a NEW file (index within the new files range)
      if (index >= existingCount) {
        // The index in imageFiles is shifted by existingCount
        newImageFiles.splice(index - existingCount, 1);
      }

      newImages.splice(index, 1);

      return {
        ...prev,
        images: newImages,
        imageFiles: newImageFiles
      };
    });
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const loadProducts = async () => {
    try {
      const response = await productService.getProducts();
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
    }
  }, [isAuthenticated]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createFormData = (data: ProductFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('category', data.category);
    formData.append('in_stock', data.inStock ? '1' : '0');
    formData.append('stock_quantity', data.stockQuantity);

    if (data.imageFiles && data.imageFiles.length > 0) {
      data.imageFiles.forEach((file) => {
        formData.append('images[]', file);
      });
    }
    return formData;
  };

  const handleAddProduct = async () => {
    setIsFunctionLoading(true);
    try {
      const data = createFormData(formData);
      await productService.createProduct(data);

      toast.success("Produit ajouté avec succès");
      setIsAddDialogOpen(false);
      resetForm();
      loadProducts();
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.error(error);
    } finally {
      setIsFunctionLoading(false);
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;
    setIsFunctionLoading(true);

    try {
      const data = createFormData(formData);
      // Backend handles _method=PUT logic or we use POST with _method spoofing in service
      await productService.updateProduct(selectedProduct.id, data);

      toast.success("Produit mis à jour avec succès");
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      resetForm();
      loadProducts();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsFunctionLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    setIsFunctionLoading(true);

    try {
      await productService.deleteProduct(selectedProduct.id);
      toast.success("Produit supprimé avec succès");
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
      loadProducts();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsFunctionLoading(false);
    }
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category,
      inStock: product.in_stock,
      stockQuantity: product.stock_quantity.toString(),
      images: product.images && product.images.length > 0
        ? product.images.map((img: string) => img.startsWith('http') ? img : `http://127.0.0.1:8000${img}`)
        : (product.image ? [product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`] : []),
      imageFiles: []
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Electronics",
      inStock: true,
      stockQuantity: "0",
      images: [],
      imageFiles: []
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const getLimit = () => {
    const plan = user?.plan ? user.plan.toLowerCase() : 'free';
    if (plan === 'standard') return 50;
    if (plan === 'pro') return Infinity;
    return 10;
  };

  const limit = getLimit();
  const isLimitReached = products.length >= limit;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gérer les produits</h1>
            <p className="text-gray-600 mt-1">Ajoutez, modifiez et gérez votre inventaire</p>
            {isLimitReached && (
              <p className="text-sm font-medium text-amber-600 mt-2 flex items-center">
                <Package className="h-4 w-4 mr-1" />
                Vous avez atteint la limite de {limit} produits pour votre forfait {user?.plan}.
                <button onClick={() => navigate('/pricing')} className="ml-1 underline">Passer au forfait supérieur</button>
              </p>
            )}
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={(open: boolean) => {
            if (open && isLimitReached) {
              toast.error(`Vous avez atteint la limite de ${limit} produits.`);
              return;
            }
            setIsAddDialogOpen(open);
          }}>
            <DialogTrigger asChild>
              <Button size="lg" disabled={isLimitReached}>
                <Plus className="h-5 w-5 mr-2" />
                Ajouter un produit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter un produit</DialogTitle>
                <DialogDescription>
                  Remplissez les informations ci-dessous pour ajouter un nouveau produit.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-name">Nom du produit</Label>
                  <Input
                    id="new-name"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Entrez le nom du produit"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-description">Description</Label>
                  <Textarea
                    id="new-description"
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Entrez la description du produit"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-price">Prix</Label>
                    <div className="flex gap-2">
                      <Input
                        id="new-price"
                        type="number"
                        value={formData.price}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="0"
                      />
                      <span className="flex items-center text-gray-600">FCFA</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-category">Catégorie</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value: string) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-stock">Quantité en stock</Label>
                  <Input
                    id="new-stock"
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="new-in-stock">En stock</Label>
                    <p className="text-sm text-gray-500">Ce produit est-il disponible à la vente ?</p>
                  </div>
                  <Switch
                    id="new-in-stock"
                    checked={formData.inStock}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, inStock: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Images du produit</Label>
                  <Input
                    type="file"
                    id="image-upload"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors relative overflow-hidden"
                  >
                    {formData.images.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {formData.images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img src={img} alt={`Preview ${idx}`} className="h-24 w-full object-cover rounded-md" />
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        {formData.images.length < 3 && (
                          <div
                            className="h-24 w-full border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-blue-400"
                            onClick={() => document.getElementById('image-upload')?.click()}
                          >
                            <Plus className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600 mb-1">
                          Cliquez pour télécharger des images
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG (max 2MB, max 3)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                  Annuler
                </Button>
                <Button onClick={handleAddProduct} disabled={!formData.name || !formData.price}>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Stats */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{products.length}</div>
              <div className="text-gray-600">Total Produits</div>
            </div>
            <div className="border-l pl-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {products.filter(p => p.in_stock).length}
              </div>
              <div className="text-gray-600">En stock</div>
            </div>
            <div className="border-l pl-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {products.filter(p => !p.in_stock).length}
              </div>
              <div className="text-gray-600">Rupture de stock</div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image.startsWith('http') ? product.image : `http://127.0.0.1:8000${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 mix-blend-multiply"
                    />
                  ) : (
                    <Package className="h-16 w-16 text-gray-400" />
                  )}
                  {!product.in_stock && (
                    <Badge variant="secondary" className="absolute top-2 right-2 bg-red-100 text-red-700">
                      Rupture de stock
                    </Badge>
                  )}
                </div>

                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="outline">{product.category}</Badge>
                </div>

                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {product.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600">FCFA</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Stock:</span>
                  <span className={`font-medium ${product.in_stock ? "text-green-600" : "text-red-600"}`}>
                    {product.stock_quantity} unités
                  </span>
                </div>
              </CardContent>

              <CardFooter className="gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => openEditDialog(product)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => openDeleteDialog(product)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? "Essayez une autre recherche" : "Ajoutez votre premier produit pour commencer"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-5 w-5 mr-2" />
                  Ajouter un produit
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le produit</DialogTitle>
              <DialogDescription>
                Modifiez les informations du produit ci-dessous.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nom du produit</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Entrez le nom du produit"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Entrez la description du produit"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Prix</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0"
                    />
                    <span className="flex items-center text-gray-600">FCFA</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category">Catégorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: string) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-stock">Quantité en stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="edit-in-stock">En stock</Label>
                  <p className="text-sm text-gray-500">Ce produit est-il disponible à la vente ?</p>
                </div>
                <Switch
                  id="edit-in-stock"
                  checked={formData.inStock}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, inStock: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Images du produit</Label>
                <Input
                  type="file"
                  id="edit-image-upload"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer relative overflow-hidden"
                  onClick={() => document.getElementById('edit-image-upload')?.click()}
                >
                  {formData.images.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {formData.images.map((img, idx) => (
                        <img key={idx} src={img} alt={`Preview ${idx}`} className="h-24 w-full object-cover rounded-md" />
                      ))}
                    </div>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1">
                        Cliquez pour télécharger des images
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG (max 2MB, max 3)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); setSelectedProduct(null); resetForm(); }}>
                Annuler
              </Button>
              <Button onClick={handleEditProduct} disabled={!formData.name || !formData.price}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer le produit</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer <strong>{selectedProduct?.name}</strong>? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setSelectedProduct(null)}>
                Annuler
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteProduct}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
