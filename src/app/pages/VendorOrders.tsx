import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/app/hooks/useAuth";
import AppLayout from "@/app/components/layout/AppLayout";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Eye, Search, ArrowUpDown, X, Calendar } from "lucide-react";
import { formatCurrency, formatDate } from "@/app/utils/formatters";
import { api } from "@/app/services/api";

interface Order {
    id: string; // The public ID (e.g., ORD-...)
    internal_id: number; // The database ID
    customer?: {
        name: string;
    };
    total_amount: number;
    status: string;
    payment_status: string;
    payment_method: string;
    created_at: string;
    items_count: number;
}

export default function VendorOrders() {
    const { isAuthenticated, user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter states
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchInput, setSearchInput] = useState(""); // Input value
    const [searchQuery, setSearchQuery] = useState(""); // Applied search
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, authLoading, navigate]);



    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const params = new URLSearchParams();

                if (startDate) params.append('start_date', startDate);
                if (endDate) params.append('end_date', endDate);
                if (searchQuery) params.append('search', searchQuery);
                params.append('sort_order', sortOrder);

                const queryString = params.toString();
                const endpoint = queryString ? `/vendor/orders?${queryString}` : '/vendor/orders';

                const response = await api.get(endpoint);
                if (response.data.success) {
                    setOrders(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated, startDate, endDate, searchQuery, sortOrder]);

    const handleSearch = () => {
        setSearchQuery(searchInput.trim());
    };

    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleClearFilters = () => {
        setStartDate("");
        setEndDate("");
        setSearchInput("");
        setSearchQuery("");
        setSortOrder("desc");
    };

    const hasActiveFilters = startDate || endDate || searchQuery || sortOrder !== "desc";

    if (authLoading || isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) return null;

    return (
        <AppLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Commandes</h1>
                    <p className="text-gray-600 mt-1">Gérez et suivez vos commandes clients</p>
                </div>

                {/* Filter Bar */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Date Range */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Date de début
                                </label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Date de fin
                                </label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            {/* Customer Search */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Search className="h-4 w-4" />
                                    Rechercher un client
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Nom du client"
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            onKeyPress={handleSearchKeyPress}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Button
                                        variant="secondary"
                                        onClick={handleSearch}
                                        disabled={!searchInput.trim()}
                                    >
                                        <Search className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 invisible">Actions</label>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                                        className="flex-1"
                                    >
                                        <ArrowUpDown className="h-4 w-4 mr-2" />
                                        {sortOrder === "desc" ? "Plus récent" : "Plus ancien"}
                                    </Button>
                                    {hasActiveFilters && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleClearFilters}
                                            title="Effacer les filtres"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {hasActiveFilters && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium">Filtres actifs:</span>
                                {startDate && <Badge variant="secondary">Du {startDate}</Badge>}
                                {endDate && <Badge variant="secondary">Au {endDate}</Badge>}
                                {searchQuery && <Badge variant="secondary">"{searchQuery}"</Badge>}
                                {sortOrder !== "desc" && <Badge variant="secondary">Plus ancien</Badge>}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Mobile View (Cards) */}
                <div className="grid gap-4 md:hidden">
                    {isLoading ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow text-gray-500">
                            {hasActiveFilters ? "Aucune commande ne correspond aux filtres" : "Aucune commande pour le moment"}
                        </div>
                    ) : (
                        orders.map((order) => (
                            <Card key={order.id} className="overflow-hidden">
                                <CardContent className="p-4 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="font-semibold text-gray-900">#{order.id}</span>
                                            <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                                        </div>
                                        <Badge
                                            variant={
                                                order.status === "delivered" ? "default" :
                                                    order.status === "cancelled" ? "destructive" :
                                                        order.status === "shipped" ? "secondary" : "outline"
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Client</span>
                                            <span className="font-medium">{order.customer?.name || "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Montant</span>
                                            <span className="font-medium">{formatCurrency(order.total_amount)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Paiement</span>
                                            <span className={`font-medium ${order.payment_status === "paid" ? "text-green-600" : "text-yellow-600"}`}>
                                                {order.payment_status}
                                            </span>
                                        </div>
                                    </div>

                                    <Link to={`/vendor/orders/${order.id}`} className="block">
                                        <Button variant="outline" className="w-full">
                                            <Eye className="size-4 mr-2" />
                                            Voir détails
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Desktop View (Table) */}
                <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        N° Commande
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Client
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Montant
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Paiement
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            {hasActiveFilters ? "Aucune commande ne correspond aux filtres" : "Aucune commande pour le moment"}
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {order.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.customer?.name || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(order.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatCurrency(order.total_amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge
                                                    variant={
                                                        order.status === "delivered" ? "default" :
                                                            order.status === "cancelled" ? "destructive" :
                                                                order.status === "shipped" ? "secondary" : "outline"
                                                    }
                                                    className={
                                                        order.status === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : ""
                                                    }
                                                >
                                                    {order.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {order.payment_method}
                                                    </span>
                                                    <span className={`text-xs ${order.payment_status === "paid" ? "text-green-600" : "text-yellow-600"
                                                        }`}>
                                                        {order.payment_status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link to={`/vendor/orders/${order.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="size-4 mr-2" />
                                                        Voir détails
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

