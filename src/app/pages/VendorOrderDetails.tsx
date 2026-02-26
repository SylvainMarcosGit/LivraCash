import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "@/app/hooks/useAuth";
import AppLayout from "@/app/components/layout/AppLayout";

import { api } from "@/app/services/api";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
    ArrowLeft,
    Package,
    User,
    MapPin,
    Printer,
    Loader2,
    Store
} from "lucide-react";
import { formatCurrency, formatDate } from "@/app/utils/formatters";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/select";

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
    subtotal: number;
    image_url?: string;
}

interface OrderDetails {
    id: string;
    status: string;
    payment_status: string;
    payment_method: string;
    created_at: string;
    total_amount: number;
    customer: {
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
    };
    items: OrderItem[];
}

export default function VendorOrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user, isLoading: authLoading } = useAuth();

    const statusLabels: Record<string, string> = {
        pending: "En attente",
        processing: "En cours",
        shipped: "Expédié",
        delivered: "Livré",
        cancelled: "Annulé"
    };

    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [shopName, setShopName] = useState<string>("");

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, authLoading, navigate]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!id) return;
            try {
                const response = await api.get(`/vendor/orders/${id}`);
                if (response.data.success) {
                    setOrder(response.data.data);
                }
            } catch (error) {
                toast.error("Failed to load order details");
                navigate("/vendor/orders");
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchOrderDetails();
        }
    }, [id, isAuthenticated, navigate]);

    useEffect(() => {
        const fetchShopSettings = async () => {
            try {
                const response = await api.get("/settings");
                if (response.data.success && response.data.data) {
                    setShopName(response.data.data.name || `${user?.first_name || ''} ${user?.last_name || ''}`);
                }
            } catch (error) {
                console.error("Failed to fetch shop settings:", error);
                setShopName(`${user?.first_name || ''} ${user?.last_name || ''}`);
            }
        };

        if (isAuthenticated && user) {
            fetchShopSettings();
        }
    }, [isAuthenticated, user]);

    const handleStatusChange = async (newStatus: string) => {
        if (!order) return;
        setIsUpdating(true);
        try {
            const response = await api.patch(`/vendor/orders/${order.id}/status`, { status: newStatus });
            if (response.data.success) {
                setOrder((prev) => prev ? { ...prev, status: newStatus } : null);
                setOrder((prev) => prev ? { ...prev, status: newStatus } : null);
                toast.success(`Statut mis à jour avec succès: ${statusLabels[newStatus] || newStatus}`);
            }
        } catch (error) {
            toast.error("Échec de la mise à jour du statut");
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!order || !isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-xl text-gray-600 mb-4">Commande introuvable</p>
                <Button onClick={() => navigate("/vendor/orders")}>Retour aux commandes</Button>
            </div>
        );
    }

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50 print:bg-white print:p-0">
                <div className="container mx-auto px-4 py-8 print:p-0 print:max-w-none">

                    {/* Action Buttons - Hidden on Print */}
                    <div className="flex justify-between items-center mb-6 print:hidden">
                        <Button variant="outline" size="sm" onClick={() => navigate("/vendor/orders")}>
                            <ArrowLeft className="size-4 mr-2" />
                            Retour aux commandes
                        </Button>
                        <div className="flex gap-3">
                            <Select
                                value={order.status}
                                onValueChange={handleStatusChange}
                                disabled={isUpdating}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Mettre à jour le statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">En attente</SelectItem>
                                    <SelectItem value="processing">En cours</SelectItem>
                                    <SelectItem value="shipped">Expédié</SelectItem>
                                    <SelectItem value="delivered">Livré</SelectItem>
                                    <SelectItem value="cancelled">Annulé</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handlePrint}>
                                <Printer className="h-4 w-4 mr-2" />
                                Imprimer le Bon de commande
                            </Button>
                        </div>
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
                                    <p className="text-sm font-semibold">#{order.id}</p>
                                    <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4 bg-gray-50 print:bg-transparent p-2 rounded print:p-0 text-left">
                                <div>
                                    <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Boutique</span>
                                    <span className="font-bold text-base text-gray-900">{shopName || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-[10px] uppercase tracking-wider">Vendeur / Marchand</span>
                                    <span className="font-medium text-sm text-gray-800">{user?.first_name} {user?.last_name}</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Badge - Screen View Only */}
                        <div className="print:hidden mb-4">
                            <Badge
                                variant={
                                    order.status === "delivered" ? "default" :
                                        order.status === "cancelled" ? "destructive" :
                                            order.status === "pending" ? "outline" : "secondary"
                                }
                                className="text-base px-4 py-2"
                            >
                                {statusLabels[order.status] || order.status}
                            </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 print:gap-2">
                            {/* Client Info */}
                            <div className="border rounded p-3 print:p-2 print:border-gray-300">
                                <h3 className="flex items-center gap-2 text-gray-900 font-semibold mb-1 text-sm uppercase">
                                    <User className="h-3 w-3" />
                                    Informations client
                                </h3>
                                <div className="space-y-0.5 text-sm print:text-xs">
                                    <p><span className="font-medium text-gray-500">Nom:</span> {order.customer.name}</p>
                                    <p><span className="font-medium text-gray-500">Email:</span> {order.customer.email}</p>
                                    <p><span className="font-medium text-gray-500">Téléphone:</span> {order.customer.phone}</p>
                                </div>
                            </div>

                            {/* Delivery Info */}
                            <div className="border rounded p-3 print:p-2 print:border-gray-300">
                                <h3 className="flex items-center gap-2 text-gray-900 font-semibold mb-1 text-sm uppercase">
                                    <MapPin className="h-3 w-3" />
                                    Livraison
                                </h3>
                                <div className="space-y-0.5 text-sm print:text-xs">
                                    <p><span className="font-medium text-gray-500">Adresse:</span> {order.customer.address}</p>
                                    <p><span className="font-medium text-gray-500">Ville:</span> {order.customer.city}</p>
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
                                                <td className="p-2 font-medium">{item.product_name}</td>
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
                                                Moyen de paiement: {order.payment_method}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Print Footer */}
                        <div className="hidden print:block text-center text-[10px] text-gray-400 mt-4 border-t pt-2">
                            <p>LivraCash - https://shopzone</p>
                            <p>Merci pour votre confiance !</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
