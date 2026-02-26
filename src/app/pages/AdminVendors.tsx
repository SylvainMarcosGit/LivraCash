import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "@/app/hooks/useAuth";

import AppLayout from "@/app/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Search, Filter, Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/app/utils/formatters";
import { toast } from "sonner";

interface Vendor {
  id: number;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  kyc_status: "approved" | "pending" | "rejected";
  status: "active" | "inactive" | "suspended";
  total_revenue: number;
  total_transactions: number;
  commission_rate: number;
  plan: string;
  created_at: string;
}

import { api, getErrorMessage } from "@/app/services/api";

// ... (imports)

export default function AdminVendors() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kycFilter, setKycFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    // Redirect non-admin users
    if (user?.role && user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<{ success: boolean; data: Vendor[] }>("/admin/vendors");
      if (response.data.success) {
        setVendors(response.data.data);
        setFilteredVendors(response.data.data);
      }
    } catch (error) {
      toast.error("Échec du chargement des vendeurs");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchVendors();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Filter vendors
    let filtered = vendors;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (vendor) =>
          (vendor.business_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (vendor.owner_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (vendor.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (vendor.phone?.includes(searchTerm))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((vendor) => vendor.status === statusFilter);
    }

    // KYC filter
    if (kycFilter !== "all") {
      filtered = filtered.filter((vendor) => vendor.kyc_status === kycFilter);
    }

    // Plan filter
    if (planFilter !== "all") {
      filtered = filtered.filter((vendor) => (vendor.plan || 'gratuit') === planFilter);
    }

    setFilteredVendors(filtered);
  }, [searchTerm, statusFilter, kycFilter, planFilter, vendors]);

  const handleStatusChange = async (vendorId: number, newStatus: string) => {
    try {
      await api.patch(`/admin/vendors/${vendorId}/status`, { status: newStatus });
      toast.success(`Vendor status updated to ${newStatus}`);
      // Update vendor status locally
      setVendors((prev) =>
        prev.map((v) => (v.id === vendorId ? { ...v, status: newStatus as Vendor["status"] } : v))
      );


    } catch (error) {
      toast.error(`Échec de la mise à jour du statut: ${getErrorMessage(error)}`);
      // Revert optimistic update
      fetchVendors();
    }
  };

  const getStatusBadge = (status: Vendor["status"]) => {
    const variants: Record<Vendor["status"], "default" | "secondary" | "destructive"> = {
      active: "default",
      inactive: "secondary",
      suspended: "destructive",
    };

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  const getKYCBadge = (status: Vendor["kyc_status"]) => {
    const variants: Record<Vendor["kyc_status"], "default" | "secondary" | "destructive"> = {
      approved: "default",
      pending: "secondary",
      rejected: "destructive",
    };

    return (
      <Badge variant={variants[status]} className="capitalize">
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    return null;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Vendeurs</h1>
          <p className="text-gray-600 mt-1">Voir et gérer tous les vendeurs de la plateforme</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tous les Vendeurs ({filteredVendors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom, email ou téléphone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    aria-label="Search vendors"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <Filter className="size-4 mr-2" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les Statuts</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={kycFilter} onValueChange={setKycFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <Filter className="size-4 mr-2" />
                    <SelectValue placeholder="Statut KYC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les KYC</SelectItem>
                    <SelectItem value="approved">Approuvé</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="rejected">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={planFilter} onValueChange={setPlanFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <Filter className="size-4 mr-2" />
                    <SelectValue placeholder="Type de Compte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les Plans</SelectItem>
                    <SelectItem value="gratuit">Gratuit</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Commerce</TableHead>
                        <TableHead>Propriétaire</TableHead>
                        <TableHead>Revenus</TableHead>
                        <TableHead>Transac.</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Com.</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>KYC</TableHead>
                        <TableHead>Rejoint le</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVendors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                            Aucun vendeur trouvé
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredVendors.map((vendor) => (
                          <TableRow key={vendor.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div>
                                <div className="font-medium">{vendor.business_name}</div>
                                <div className="text-sm text-gray-500">{vendor.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{vendor.owner_name}</div>
                                <div className="text-sm text-gray-500">{vendor.phone}</div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(vendor.total_revenue, "XOF")}
                            </TableCell>
                            <TableCell>{vendor.total_transactions.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {vendor.plan || 'gratuit'}
                              </Badge>
                            </TableCell>
                            <TableCell>{vendor.commission_rate}%</TableCell>
                            <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                            <TableCell>{getKYCBadge(vendor.kyc_status)}</TableCell>
                            <TableCell className="text-sm">{formatDate(vendor.created_at)}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link to={`/admin/vendors/${vendor.id}`}>
                                      <Eye className="size-4 mr-2" />
                                      Voir Détails
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />

                                  {vendor.status !== "active" && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(vendor.id, "active")}>
                                      Activer
                                    </DropdownMenuItem>
                                  )}

                                  {vendor.status === "active" && (
                                    <>
                                      <DropdownMenuItem onClick={() => handleStatusChange(vendor.id, "suspended")}>
                                        Suspendre
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleStatusChange(vendor.id, "inactive")}>
                                        Désactiver
                                      </DropdownMenuItem>
                                    </>
                                  )}

                                  {vendor.status === "suspended" && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(vendor.id, "inactive")}>
                                      Désactiver
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Summary */}
              {filteredVendors.length > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Affichage de {filteredVendors.length} sur {vendors.length} vendeurs
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
