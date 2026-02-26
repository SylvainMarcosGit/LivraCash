import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useAuth } from "@/app/hooks/useAuth";
import AppLayout from "@/app/components/layout/AppLayout";
import { api } from "@/app/services/api";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ArrowLeft, Printer, Trash2, Ban, CheckCircle, Store, User, MapPin, Package } from "lucide-react";
import { formatCurrency, formatDate } from "@/app/utils/formatters";
import { toast } from "sonner";
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

interface OrderItem {
    id: number;
    product?: {
        name: string;
        image_url?: string;
    };
    quantity: number;
    price: number;
    subtotal: number;
}

interface Order {
    id: string;
    order_number: string;
    customer: {
        name: string;
    };
    vendor?: {
        id: number;
        first_name: string;
        last_name: string;
        shop_settings?: {
            name: string;
        };
    };
    items: OrderItem[];
    total_amount: number;
    status: string;
    payment_status: string;
    payment_method: string;
    created_at: string;
    shipping_address?: {
        firstName: string;
        lastName: string;
        email?: string;
        address: string;
        city: string;
        phone: string;
    };
    vendor_blocked: boolean;
}

export default function AdminOrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user, isLoading: authLoading } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
            navigate("/login");
        }
    }, [isAuthenticated, authLoading, user, navigate]);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/admin/orders/${id}`);
                if (response.data.success) {
                    setOrder(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch order:", error);
                console.error("Failed to fetch order:", error);
                toast.error("Échec du chargement de la commande");
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated && user?.role === 'admin' && id) {
            fetchOrder();
        }
    }, [isAuthenticated, user, id]);

    const handlePrint = () => {
        window.print();
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/admin/orders/${id}`);
            toast.success("Commande supprimée avec succès");
            navigate("/admin/orders");
        } catch (error) {
            console.error("Failed to delete order:", error);
            toast.error("Échec de la suppression");
        }
    };

    const handleToggleBlock = async () => {
        if (!order) return;

        try {
            const endpoint = order.vendor_blocked
                ? `/admin/orders/${id}/unblock-vendor`
                : `/admin/orders/${id}/block-vendor`;

            await api.post(endpoint);

            toast.success(
                order.vendor_blocked
                    ? "Accès vendeur rétabli"
                    : "Vendeur bloqué avec succès"
            );

            setOrder({ ...order, vendor_blocked: !order.vendor_blocked });
        } catch (error) {
            console.error("Failed to toggle vendor block:", error);
            toast.error("Échec de la mise à jour");
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
            pending: { label: "En attente", variant: "secondary" },
            approved: { label: "Approuvée", variant: "default" },
            processing: { label: "En cours", variant: "default" },
            shipped: { label: "Expédiée", variant: "default" },
            delivered: { label: "Livrée", variant: "default" },
            cancelled: { label: "Annulée", variant: "destructive" },
            rejected: { label: "Rejetée", variant: "destructive" },
        };

        const config = statusConfig[status] || { label: status, variant: "outline" };
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    if (authLoading || isLoading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Chargement...</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!order) {
        return (
            <AppLayout>
                <div className="text-center py-12">
                    <p className="text-gray-600">Commande introuvable</p>
                    <Link to="/admin/orders">
                        <Button className="mt-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour aux commandes
                        </Button>
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="space-y-6 print:space-y-2">
                {/* Action Buttons - Hidden on Print */}
                <div className="flex items-center justify-between print:hidden">
                    <div className="flex items-center gap-4">
                        <Link to="/admin/orders">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Détails de la commande
                            </h1>
                            <p className="text-gray-600 mt-1">{order.order_number}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePrint}>
                            <Printer className="h-4 w-4 mr-2" />
                            Imprimer
                        </Button>
                        <Button
                            variant={order.vendor_blocked ? "default" : "outline"}
                            onClick={handleToggleBlock}
                        >
                            {order.vendor_blocked ? (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Débloquer vendeur
                                </>
                            ) : (
                                <>
                                    <Ban className="h-4 w-4 mr-2" />
                                    Bloquer vendeur
                                </>
                            )}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
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
                                <p><span className="font-medium text-gray-500">Nom:</span> {order.shipping_address?.firstName || order.customer?.name || "N/A"} {order.shipping_address?.lastName || ""}</p>
                                {order.shipping_address?.email && (
                                    <p><span className="font-medium text-gray-500">Email:</span> {order.shipping_address.email}</p>
                                )}
                                <p><span className="font-medium text-gray-500">Téléphone:</span> {order.shipping_address?.phone || "N/A"}</p>
                            </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="border rounded p-3 print:p-2 print:border-gray-300">
                            <h3 className="flex items-center gap-2 text-gray-900 font-semibold mb-1 text-sm uppercase">
                                <MapPin className="h-3 w-3" />
                                Livraison
                            </h3>
                            <div className="space-y-0.5 text-sm print:text-xs">
                                <p><span className="font-medium text-gray-500">Adresse:</span> {order.shipping_address?.address || "N/A"}</p>
                                <p><span className="font-medium text-gray-500">Ville:</span> {order.shipping_address?.city || "N/A"}</p>
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
                                            <td className="p-2 font-medium">{item.product?.name || "Produit"}</td>
                                            <td className="p-2 text-right text-gray-600">{formatCurrency(item.price)}</td>
                                            <td className="p-2 text-center">{item.quantity}</td>
                                            <td className="p-2 text-right font-semibold">{formatCurrency(item.subtotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t-2 border-gray-200">
                                        <td colSpan={3} className="p-2 text-right font-bold text-gray-900 uppercase text-xs">TOTAL:</td>
                                        <td className="p-2 text-right font-bold text-lg text-primary print:text-black">{formatCurrency(order.total_amount)}</td>
                                    </tr>
                                    <tr className="print:table-row hidden">
                                        <td colSpan={4} className="p-2 text-right text-[10px] text-gray-500 italic">
                                            Mode de paiement: {order.payment_method === "cash_on_delivery" ? "Paiement à la livraison" : order.payment_method}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Admin Info - Screen Only */}
                    <div className="print:hidden mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Informations Admin</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Statut:</span>
                                    {getStatusBadge(order.status)}
                                </div>
                                {order.vendor_blocked && (
                                    <div className="pt-2 border-t">
                                        <Badge variant="destructive" className="text-sm">
                                            <Ban className="h-3 w-3 mr-1" />
                                            Accès vendeur bloqué
                                        </Badge>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Print Footer */}
                    <div className="hidden print:block text-center text-[10px] text-gray-400 mt-4 border-t pt-2">
                        <p>LivraCash - Marketplace en ligne</p>
                        <p>Merci pour votre confiance !</p>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
