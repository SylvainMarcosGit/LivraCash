import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/app/hooks/useAuth";
import AppLayout from "@/app/components/layout/AppLayout";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Switch } from "@/app/components/ui/switch";
import { toast } from "sonner";
import { Store, Upload, Palette, Globe, Save, Loader2, X, Eye, EyeOff, ShoppingCart, Truck, DollarSign } from "lucide-react";
import { api, getErrorMessage } from "@/app/services/api";

const categories = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Beauty",
  "Sports",
  "Books",
  "Food & Beverage",
  "Kids & Baby",
  "Health & Wellness",
  "Automotive",
  "Art & Crafts",
  "Services"
];

import { Copy, Check } from "lucide-react";

export default function ShopSettings() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [shopSettings, setShopSettings] = useState({
    id: "",
    name: "",
    description: "",
    category: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    isPublic: true,
    acceptOnlineOrders: true,
    minOrderAmount: "0",
    shippingAvailable: true,
    primaryColor: "#2563eb",
    logoUrl: "",
    bannerUrl: "",
    // New fields from backend structure
    language: "en",
    timezone: "Africa/Porto-Novo",
    currency: "XOF",
    email_notifications: true,
    sms_notifications: false,
    transaction_alerts: true,
    marketing_emails: false,
    two_factor_enabled: false,
    facebook_url: "",
    youtube_url: "",
    tiktok_url: ""
  });

  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  // Preview URLs
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");

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

  useEffect(() => {
    const fetchSettings = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoadingSettings(true);
        const response = await api.get("/settings");
        if (response.data.success) {
          const data = response.data.data;
          setShopSettings({
            ...shopSettings,
            ...data,
            // Map backend snake_case to frontend camelCase if needed, or stick to one.
            // Current state uses mixed. Let's align with backend response where possible or map manually.
            name: data.name || "",
            description: data.description || "",
            category: data.category || "",
            phone: data.phone || "",
            email: data.email || "",
            website: data.website || "",
            address: data.address || "",
            isPublic: Boolean(data.is_public),
            acceptOnlineOrders: Boolean(data.accept_online_orders),
            shippingAvailable: Boolean(data.shipping_available),
            minOrderAmount: String(data.min_order_amount || 0),
            primaryColor: data.primary_color || "#2563eb",
            facebook_url: data.facebook_url || "",
            youtube_url: data.youtube_url || "",
            tiktok_url: data.tiktok_url || "",
          });

          if (response.data.logo_url) setLogoPreview(response.data.logo_url);
          if (response.data.banner_url) setBannerPreview(response.data.banner_url);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        toast.error("Failed to load shop settings");
      } finally {
        setIsLoadingSettings(false);
      }
    };

    fetchSettings();
  }, [isAuthenticated]);

  const handleChange = (field: string, value: string | boolean) => {
    setShopSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (type === 'logo') {
        setLogoFile(file);
        setLogoPreview(URL.createObjectURL(file));
      } else {
        setBannerFile(file);
        setBannerPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();

      // Append text fields
      Object.keys(shopSettings).forEach(key => {
        // Map frontend keys to backend keys if different
        let backendKey = key;
        if (key === 'isPublic') backendKey = 'is_public';
        if (key === 'acceptOnlineOrders') backendKey = 'accept_online_orders';
        if (key === 'shippingAvailable') backendKey = 'shipping_available';
        if (key === 'minOrderAmount') backendKey = 'min_order_amount';
        if (key === 'primaryColor') backendKey = 'primary_color';

        // Skip internal state keys or handled separately
        if (['logoUrl', 'bannerUrl'].includes(key)) return;

        const value = shopSettings[key as keyof typeof shopSettings];
        if (value !== null && value !== undefined) {
          // Convert booleans to "1"/"0" for FormData because Laravel "boolean" validation rules
          // might not accept "true"/"false" strings from FormData.
          if (typeof value === 'boolean') {
            formData.append(backendKey, value ? '1' : '0');
          } else {
            formData.append(backendKey, value.toString());
          }
        }
      });

      // Append files
      if (logoFile) formData.append('logo', logoFile);
      if (bannerFile) formData.append('banner', bannerFile);

      // Send method spoofing for PUT if we wanted to use PUT, but we can use POST for update
      // Controller uses POST /settings in route definition usually? Let's check api.php
      // api.php: Route::post('/settings', [\App\Http\Controllers\API\ShopSettingController::class, 'update']);

      const response = await api.post("/settings", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        toast.success("Settings updated successfully");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres de la boutique</h1>
          <p className="text-gray-600 mt-1">Gérez les informations et l'apparence de votre boutique</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">
              <Store className="h-4 w-4 mr-2" />
              Général
            </TabsTrigger>
            <TabsTrigger value="branding">
              <Palette className="h-4 w-4 mr-2" />
              Marque & Apparence
            </TabsTrigger>
            {/* Commented out for v1 - Advanced Settings */}

          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
                <CardDescription>
                  Mettez à jour les informations principales de votre boutique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="shop-name">Nom de la boutique</Label>
                  <Input
                    id="shop-name"
                    value={shopSettings.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Entrez le nom de la boutique"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={shopSettings.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Entrez une description de votre boutique"
                    rows={4}
                  />
                  <p className="text-sm text-gray-500">
                    {shopSettings.description.length}/500 caractères
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie principale</Label>
                  <Select
                    value={shopSettings.category}
                    onValueChange={(value) => handleChange("category", value)}
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

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shopSettings.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="+229 XX XX XX XX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email professionnel</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shopSettings.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="contact@shop.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Site web (optionnel)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={shopSettings.website}
                    onChange={(e) => handleChange("website", e.target.value)}
                    placeholder="www.yourshop.com"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="facebook_url">Facebook URL</Label>
                    <Input
                      id="facebook_url"
                      type="url"
                      value={shopSettings.facebook_url}
                      onChange={(e) => handleChange("facebook_url", e.target.value)}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube_url">YouTube URL</Label>
                    <Input
                      id="youtube_url"
                      type="url"
                      value={shopSettings.youtube_url}
                      onChange={(e) => handleChange("youtube_url", e.target.value)}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tiktok_url">TikTok URL</Label>
                    <Input
                      id="tiktok_url"
                      type="url"
                      value={shopSettings.tiktok_url}
                      onChange={(e) => handleChange("tiktok_url", e.target.value)}
                      placeholder="https://tiktok.com/@..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse physique</Label>
                  <Textarea
                    id="address"
                    value={shopSettings.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="Entrez l'adresse de votre boutique"
                    rows={2}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} size="lg" disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Enregistrer les modifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>Marque & Apparence</CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de votre boutique sur le marché
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Logo de la boutique</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer" onClick={() => document.getElementById('logo-upload')?.click()}>
                    {logoPreview ? (
                      <img src={logoPreview} alt="Shop Logo" className="h-24 mx-auto object-contain" />
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">Cliquez pour télécharger un logo</p>
                        <p className="text-xs text-gray-500">PNG, JPG or SVG (max 2MB)</p>
                        <Button variant="outline" className="mt-4">Choisir un fichier</Button>
                      </>
                    )}
                    <input
                      type="file"
                      id="logo-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'logo')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bannière de la boutique</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer relative" onClick={() => document.getElementById('logo-upload')?.click()}>
                    {logoPreview ? (
                      <div className="relative">
                        <img src={logoPreview} alt="Shop Logo" className="h-32 mx-auto object-contain" />
                        <Button variant="ghost" size="icon" className="absolute top-0 right-0" onClick={(e) => { e.stopPropagation(); setLogoFile(null); setLogoPreview(""); }}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600 mb-2">Cliquez pour télécharger une bannière</p> {/* Reusing translation key for now or add new one */}
                        <p className="text-xs text-gray-500">PNG, JPG (max 5MB)</p>
                      </>
                    )}

                    <input
                      type="file"
                      id="banner-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'banner')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primary-color">Couleur principale</Label>
                  <div className="flex gap-4 items-center">
                    <Input
                      id="primary-color"
                      type="color"
                      value={shopSettings.primaryColor}
                      onChange={(e) => handleChange("primaryColor", e.target.value)}
                      className="w-20 h-12 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={shopSettings.primaryColor}
                      onChange={(e) => handleChange("primaryColor", e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Cette couleur sera utilisée pour les boutons et accents de votre page boutique.
                  </p>
                </div>

                <div className="border rounded-lg p-6 bg-gray-50">
                  <h3 className="font-semibold text-gray-900 mb-4">Aperçu</h3>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="h-16 w-16 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: shopSettings.primaryColor }}
                      >
                        <Store className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">{shopSettings.name}</h4>
                        <p className="text-sm text-gray-600">{shopSettings.category}</p>
                      </div>
                    </div>
                    <Button style={{ backgroundColor: shopSettings.primaryColor }} className="text-white">
                      Voir la boutique
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-gray-50">
                  <h3 className="font-semibold text-gray-900 mb-4">Lien de la boutique</h3>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={`${window.location.origin}/shop/${shopSettings.id || user?.id}`}
                      className="bg-white"
                    />
                    <Button variant="outline" size="icon" onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/shop/${shopSettings.id || user?.id}`);
                      toast.success("Lien copié !");
                    }}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Partagez ce lien avec vos clients pour qu'ils puissent visiter votre boutique.
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} size="lg" disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Enregistrer les modifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commented out for v1 - Advanced Settings Tab */}

        </Tabs>
      </div>
    </AppLayout>
  );
}
