import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/app/hooks/useAuth";

import AppLayout from "@/app/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Search, Filter, Download, RefreshCw } from "lucide-react";
import { formatCurrency, formatDate } from "@/app/utils/formatters";
import { transactionService, Transaction } from "@/app/services/transactionService";

export default function Transactions() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const loadTransactions = async () => {
    setIsRefreshing(true);
    try {
      const response = await transactionService.getTransactions();
      setTransactions(response.data);
      setFilteredTransactions(response.data);
    } catch (error) {
      console.error("Failed to load transactions", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    // Filter transactions
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (txn) =>
          txn.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          txn.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          txn.customer_phone.includes(searchTerm) ||
          txn.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((txn) => txn.status === statusFilter);
    }

    // Payment method filter
    if (paymentMethodFilter !== "all") {
      filtered = filtered.filter((txn) => txn.payment_method === paymentMethodFilter);
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, statusFilter, paymentMethodFilter, transactions]);

  const handleRefresh = async () => {
    await loadTransactions();
  };

  const handleExport = () => {
    // Export transactions to CSV (mock implementation)
    console.log("Exporting transactions...");
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    const variants: Record<Transaction["status"], "default" | "secondary" | "destructive"> = {
      success: "default",
      pending: "secondary",
      failed: "destructive",
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
        <div className="text-lg">Chargement...</div>
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
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Consultez et gérez votre historique de transactions</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Historique des Transactions</CardTitle>
              <div className="flex items-center gap-2">
                <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isRefreshing}>
                  <RefreshCw className={`size-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                  Actualiser
                </Button>
                <Button onClick={handleExport} variant="outline" size="sm">
                  <Download className="size-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par référence, client ou téléphone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    aria-label="Rechercher des transactions"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <Filter className="size-4 mr-2" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="success">Succès</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="failed">Échec</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <Filter className="size-4 mr-2" />
                    <SelectValue placeholder="Moyen de paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les moyens</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                    <SelectItem value="card">Carte bancaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Référence</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>Montant Net</TableHead>
                        <TableHead>Moyen</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                            Aucune transaction trouvée
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransactions.map((txn) => (
                          <TableRow key={txn.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{txn.reference}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{txn.customer_name}</div>
                                <div className="text-sm text-gray-500">{txn.customer_phone}</div>
                              </div>
                            </TableCell>
                            <TableCell>{formatCurrency(txn.amount, txn.currency)}</TableCell>
                            <TableCell className="text-red-600">
                              -{formatCurrency(txn.commission, txn.currency)}
                            </TableCell>
                            <TableCell className="font-medium text-green-600">
                              {formatCurrency(txn.net_amount, txn.currency)}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="capitalize">{txn.payment_method.replace("_", " ")}</div>
                                <div className="text-sm text-gray-500">{txn.provider}</div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(txn.status)}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{formatDate(txn.created_at)}</div>
                                {txn.completed_at && (
                                  <div className="text-gray-500">
                                    Terminé le: {formatDate(txn.completed_at)}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination info */}
              {filteredTransactions.length > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Affichage de {filteredTransactions.length} sur {transactions.length} transactions
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
