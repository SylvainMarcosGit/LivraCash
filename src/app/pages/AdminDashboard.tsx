import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "@/app/hooks/useAuth";
import AppLayout from "@/app/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { api } from "@/app/services/api";
import { formatCurrency, formatDate } from "@/app/utils/formatters";
import {
  Users,
  ShoppingCart,
  DollarSign,
  AlertCircle,
  Package,
  TrendingUp,
  TrendingDown,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

interface DashboardStats {
  vendors: {
    total: number;
    new_this_month: number;
  };
  orders: {
    total: number;
    this_month: number;
    pending: number;
  };
  revenue: {
    total: number;
    last_month: number;
    growth_percentage: number;
  };
  kyc: {
    pending: number;
  };
  products: {
    active: number;
  };
  orders_by_status: Array<{
    status: string;
    count: number;
  }>;
  recent_orders: Array<{
    id: string;
    order_number: string;
    customer_name: string;
    vendor_name: string;
    total_amount: number;
    status: string;
    created_at: string;
  }>;
}

export default function AdminDashboard() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/admin/stats");
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast.error("Échec du chargement des statistiques");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchStats();
    }
  }, [isAuthenticated, user]);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
    > = {
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

  if (!isAuthenticated || !user || user.role !== "admin" || !stats) {
    return null;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Administrateur</h1>
            <p className="text-gray-600 mt-1">Vue d'ensemble de la plateforme</p>
          </div>
          <Button variant="outline" onClick={fetchStats} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Total Vendors */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Vendeurs</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.vendors.total}</div>
              <p className="text-xs text-gray-600 mt-1">
                +{stats.vendors.new_this_month} ce mois
              </p>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orders.total}</div>
              <p className="text-xs text-gray-600 mt-1">
                {stats.orders.this_month} ce mois
              </p>
            </CardContent>
          </Card>

          {/* Platform Revenue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.revenue.total)}</div>
              <div className="flex items-center text-xs mt-1">
                {stats.revenue.growth_percentage >= 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-green-600">
                      +{stats.revenue.growth_percentage}%
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                    <span className="text-red-600">
                      {stats.revenue.growth_percentage}%
                    </span>
                  </>
                )}
                <span className="text-gray-600 ml-1">vs mois dernier</span>
              </div>
            </CardContent>
          </Card>

          {/* Pending KYC */}
          <Link to="/admin/kyc-approvals">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">KYC En Attente</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.kyc.pending}</div>
                <p className="text-xs text-orange-600 mt-1">Nécessite attention</p>
              </CardContent>
            </Card>
          </Link>

          {/* Pending Orders */}
          <Link to="/admin/orders">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commandes En Attente</CardTitle>
                <Clock className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.orders.pending}</div>
                <p className="text-xs text-gray-600 mt-1">À traiter</p>
              </CardContent>
            </Card>
          </Link>

          {/* Active Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits Actifs</CardTitle>
              <Package className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.products.active}</div>
              <p className="text-xs text-gray-600 mt-1">Sur la plateforme</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Commandes Récentes</CardTitle>
            <Link to="/admin/orders">
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recent_orders.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Aucune commande pour le moment</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        N° Commande
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Client
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Vendeur
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                        Montant
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">
                        Statut
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {stats.recent_orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <Link
                            to={`/admin/orders/${order.order_number}`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            {order.order_number}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-sm">{order.customer_name || "N/A"}</td>
                        <td className="py-3 px-4 text-sm">{order.vendor_name}</td>
                        <td className="py-3 px-4 text-right font-medium">
                          {formatCurrency(order.total_amount)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="py-3 px-4 text-right text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribution des Statuts de Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.orders_by_status.map((item) => (
                <div key={item.status} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{item.count}</div>
                  <div className="text-sm text-gray-600 mt-1 capitalize">
                    {getStatusBadge(item.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
