import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "@/app/hooks/useAuth";
import AppLayout from "@/app/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { ArrowLeft, User, Building, MapPin, Phone, Mail, Globe, Calendar, DollarSign, Activity } from "lucide-react";
import { formatCurrency, formatDate } from "@/app/utils/formatters";
import { api, getErrorMessage } from "@/app/services/api";
import { toast } from "sonner";

interface VendorDetails {
    id: number;
    business_name: string;
    owner_name: string;
    email: string;
    phone: string;
    address: string;
    kyc_status: "approved" | "pending" | "rejected";
    status: "active" | "inactive" | "suspended";
    total_revenue: number;
    total_transactions: number;
    commission_rate: number;
    created_at: string;
    shop_settings?: {
        description?: string;
        logo_url?: string;
        banner_url?: string;
        category?: string;
    };
}

export default function AdminVendorDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();

    const [vendor, setVendor] = useState<VendorDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, authLoading, navigate]);

    useEffect(() => {
        if (user?.role && user.role !== "admin") {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchVendorDetails = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const response = await api.get<{ success: boolean; data: VendorDetails }>(`/admin/vendors/${id}`);
                if (response.data.success) {
                    setVendor(response.data.data);
                }
            } catch (error) {
                toast.error(`Échec du chargement des détails du vendeur: ${getErrorMessage(error)}`);
                navigate("/admin/vendors");
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated && user?.role === "admin") {
            fetchVendorDetails();
        }
    }, [id, isAuthenticated, user, navigate]);

    const handleStatusChange = async (newStatus: string) => {
        if (!vendor) return;

        try {
            await api.patch(`/admin/vendors/${vendor.id}/status`, { status: newStatus });
            toast.success(`Statut du vendeur mis à jour à ${newStatus}`);
            setVendor((prev) => prev ? { ...prev, status: newStatus as any } : null);
        } catch (error) {
            toast.error(`Échec de la mise à jour du statut: ${getErrorMessage(error)}`);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Chargement...</div>
            </div>
        );
    }

    if (!vendor) return null;

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => navigate("/admin/vendors")}>
                        <ArrowLeft className="size-4 mr-2" />
                        Retour aux vendeurs
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900">Détails du vendeur</h1>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Main Info */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Informations sur l'entreprise</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-start gap-6">
                                {vendor.shop_settings?.logo_url ? (
                                    <img
                                        src={vendor.shop_settings.logo_url}
                                        alt={vendor.business_name}
                                        className="w-24 h-24 rounded-lg object-cover border"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <Building className="size-10 text-gray-400" />
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <h3 className="text-xl font-semibold">{vendor.business_name}</h3>
                                    <p className="text-gray-500 flex items-center gap-2">
                                        <User className="size-4" />
                                        {vendor.owner_name}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant={vendor.status === "active" ? "default" : vendor.status === "inactive" ? "secondary" : "destructive"}>
                                            {vendor.status}
                                        </Badge>
                                        <Badge variant={vendor.kyc_status === "approved" ? "default" : vendor.kyc_status === "pending" ? "secondary" : "destructive"}>
                                            KYC: {vendor.kyc_status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <Mail className="size-4" /> Email
                                    </p>
                                    <p className="font-medium">{vendor.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <Phone className="size-4" /> Téléphone
                                    </p>
                                    <p className="font-medium">{vendor.phone}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <MapPin className="size-4" /> Adresse
                                    </p>
                                    <p className="font-medium">{vendor.address || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 flex items-center gap-2">
                                        <Calendar className="size-4" /> Rejoint le
                                    </p>
                                    <p className="font-medium">{formatDate(vendor.created_at)}</p>
                                </div>
                            </div>

                            {vendor.shop_settings?.description && (
                                <div className="pt-4 border-t">
                                    <p className="text-sm text-gray-500 mb-2">Description</p>
                                    <p className="text-gray-700">{vendor.shop_settings.description}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Stats & Actions */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Performance</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Revenu total</span>
                                    <span className="font-bold text-lg">{formatCurrency(vendor.total_revenue, "XOF")}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Transactions</span>
                                    <span className="font-bold">{vendor.total_transactions}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">Taux de commission</span>
                                    <span className="font-bold">{vendor.commission_rate}%</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {vendor.status !== "active" && (
                                    <Button className="w-full" onClick={() => handleStatusChange("active")}>
                                        Activer le vendeur
                                    </Button>
                                )}
                                {vendor.status === "active" && (
                                    <>
                                        <Button variant="outline" className="w-full text-yellow-600 border-yellow-200 hover:bg-yellow-50" onClick={() => handleStatusChange("suspended")}>
                                            Suspendre le vendeur
                                        </Button>
                                        <Button variant="destructive" className="w-full" onClick={() => handleStatusChange("inactive")}>
                                            Désactiver le vendeur
                                        </Button>
                                    </>
                                )}
                                {vendor.status === "suspended" && (
                                    <Button variant="destructive" className="w-full" onClick={() => handleStatusChange("inactive")}>
                                        Désactiver le vendeur
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
