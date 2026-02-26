import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/app/hooks/useAuth";
import AppLayout from "@/app/components/layout/AppLayout";
import { api } from "@/app/services/api";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Eye, Search, ArrowUpDown, X, Calendar, Trash2, Ban, Printer, AlertCircle } from "lucide-react";
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

interface Order {
    id: string;
    internal_id: number;
    order_number: string;
    customer?: {
        name: string;
    };
    vendor?: {
        id: number;
        first_name: string;
        last_name: string;
    };
    total_amount: number;
    status: string;
    payment_status: string;
    payment_method: string;
    created_at: string;
    items_count: number;
    vendor_blocked: boolean;
}

interface Vendor {
    id: number;
    business_name: string | null;
    owner_name: string;
}

export default function AdminOrders() {
    const { isAuthenticated, user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter states
    const [vendorId, setVendorId] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

    // Delete dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

    // Derived state for stats
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount.toString()), 0);
    const commission = totalRevenue * 0.02;

    useEffect(() => {
        if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
            navigate("/login");
        }
    }, [isAuthenticated, authLoading, user, navigate]);

    // Fetch vendors for filter dropdown
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await api.get('/admin/vendors');
                if (response.data.success) {
                    setVendors(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch vendors:", error);
            }
        };

        if (isAuthenticated && user?.role === 'admin') {
            fetchVendors();
        }
    }, [isAuthenticated, user]);

    // Fetch orders with filters
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const params = new URLSearchParams();

                if (vendorId && vendorId !== 'all') params.append('vendor_id', vendorId);
                if (startDate) params.append('start_date', startDate);
                if (endDate) params.append('end_date', endDate);
                if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
                if (searchQuery) params.append('search', searchQuery);
                params.append('sort_order', sortOrder);

                const queryString = params.toString();
                const endpoint = queryString ? `/admin/orders?${queryString}` : '/admin/orders';

                const response = await api.get(endpoint);
                if (response.data.success) {
                    setOrders(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                toast.error("Échec du chargement des commandes");
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated && user?.role === 'admin') {
            fetchOrders();
        }
    }, [isAuthenticated, user, vendorId, startDate, endDate, statusFilter, searchQuery, sortOrder]);

    const handleSearch = () => {
        setSearchQuery(searchInput.trim());
    };

    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const clearFilters = () => {
        setVendorId("all");
        setStartDate("");
        setEndDate("");
        setStatusFilter("all");
        setSearchInput("");
        setSearchQuery("");
        setSortOrder("desc");
    };

    const hasActiveFilters = (vendorId && vendorId !== 'all') || startDate || endDate || (statusFilter && statusFilter !== 'all') || searchQuery;

    const handleDeleteOrder = async () => {
        if (!orderToDelete) return;

        try {
            await api.delete(`/admin/orders/${orderToDelete}`);
            toast.success("Commande supprimée avec succès");
            setOrders(orders.filter(o => o.id !== orderToDelete));
            setDeleteDialogOpen(false);
            setOrderToDelete(null);
        } catch (error) {
            console.error("Failed to delete order:", error);
            toast.error("Échec de la suppression");
        }
    };

    const handleBlockVendor = async (orderId: string, currentlyBlocked: boolean) => {
        try {
            const endpoint = currentlyBlocked
                ? `/admin/orders/${orderId}/unblock-vendor`
                : `/admin/orders/${orderId}/block-vendor`;

            await api.post(endpoint);

            toast.success(
                currentlyBlocked
                    ? "Accès vendeur rétabli"
                    : "Vendeur bloqué avec succès"
            );

            // Update local state
            setOrders(orders.map(o =>
                o.id === orderId ? { ...o, vendor_blocked: !currentlyBlocked } : o
            ));
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

    return (
        <AppLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Gestion des Commandes
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Gérer toutes les commandes de la plateforme
                    </p>
                </div>

                {/* Revenue Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Chiffre d'Affaires Total</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(totalRevenue)}</h3>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Commission Plateforme (2%)</p>
                            <h3 className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(commission)}</h3>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filtres</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Vendor Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Vendeur</label>
                                <Select value={vendorId} onValueChange={setVendorId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tous les vendeurs" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les vendeurs</SelectItem>
                                        {vendors.map((vendor) => (
                                            <SelectItem key={vendor.id} value={vendor.id.toString()}>
                                                {vendor.business_name || vendor.owner_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Statut</label>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tous les statuts" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les statuts</SelectItem>
                                        <SelectItem value="pending">En attente</SelectItem>
                                        <SelectItem value="approved">Approuvée</SelectItem>
                                        <SelectItem value="processing">En cours</SelectItem>
                                        <SelectItem value="shipped">Expédiée</SelectItem>
                                        <SelectItem value="delivered">Livrée</SelectItem>
                                        <SelectItem value="cancelled">Annulée</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Start Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date début</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* End Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date fin</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Rechercher par N° commande ou client..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyPress={handleSearchKeyPress}
                                    className="pl-10"
                                />
                            </div>
                            <Button onClick={handleSearch} disabled={!searchInput.trim()}>
                                <Search className="h-4 w-4 mr-2" />
                                Rechercher
                            </Button>
                            {hasActiveFilters && (
                                <Button variant="outline" onClick={clearFilters}>
                                    <X className="h-4 w-4 mr-2" />
                                    Effacer
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Orders List */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>
                            Commandes ({orders.length})
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                        >
                            <ArrowUpDown className="h-4 w-4 mr-2" />
                            {sortOrder === "desc" ? "Plus récent" : "Plus ancien"}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Aucune commande trouvée</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                N° Commande
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Date
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Client
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Vendeur
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Montant
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                Statut
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-900">{order.order_number || order.id}</span>
                                                        {order.vendor_blocked && (
                                                            <Badge variant="destructive" className="text-xs">
                                                                <Ban className="h-3 w-3 mr-1" />
                                                                Bloqué
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">
                                                    {formatDate(order.created_at)}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-900">
                                                    {order.customer?.name || "N/A"}
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-900">
                                                    {order.vendor ? `${order.vendor.first_name} ${order.vendor.last_name}` : "N/A"}
                                                </td>
                                                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                    {formatCurrency(order.total_amount)}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {getStatusBadge(order.status)}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link to={`/admin/orders/${order.id}`}>
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleBlockVendor(order.id, order.vendor_blocked)}
                                                            title={order.vendor_blocked ? "Débloquer vendeur" : "Bloquer vendeur"}
                                                        >
                                                            <Ban className={`h-4 w-4 ${order.vendor_blocked ? 'text-red-600' : 'text-gray-600'}`} />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setOrderToDelete(order.id);
                                                                setDeleteDialogOpen(true);
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
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
                        <AlertDialogAction onClick={handleDeleteOrder} className="bg-red-600 hover:bg-red-700">
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
