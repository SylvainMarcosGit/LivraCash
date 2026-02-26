import { useState, useEffect } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import { useAuth } from "@/app/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Search, Phone, MapPin, Truck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/app/services/api";

// Type definitions
interface Driver {
    id: number;
    name: string;
    phone: string;
    zone: string;
    status: string;
}

interface Order {
    id: string; // This is order_number from API
    internal_id: number; // This is the DB ID
    order_number: string;
    customer: {
        name: string;
    };
    shipping_address: {
        address: string;
        city: string;
        phone: string;
    };
    total_amount: string;
    status: string;
}

export default function VendorDrivers() {
    const { isAuthenticated, user, isLoading } = useAuth();
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Contact Modal states
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [contactingDriver, setContactingDriver] = useState<Driver | null>(null);
    const [selectedOrderId, setSelectedOrderId] = useState<string>("none");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [driversRes, ordersRes] = await Promise.all([
                api.get('/vendor/drivers'),
                api.get('/vendor/orders')
            ]);

            setDrivers(driversRes.data);

            // Filter for active orders that might need delivery
            // We exclude executed orders (delivered, cancelled, rejected)
            const activeOrders = ordersRes.data.data.filter((o: Order) =>
                !['delivered', 'cancelled', 'rejected'].includes(o.status)
            );
            setOrders(activeOrders);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast.error("Impossible de charger les données");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "available":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Disponible</Badge>;
            case "busy":
                return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">En course</Badge>;
            case "offline":
                return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Hors ligne</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const openContactModal = (driver: Driver) => {
        setContactingDriver(driver);
        setSelectedOrderId("none");
        setIsContactOpen(true);
    };

    const handleWhatsAppClick = async () => {
        if (!contactingDriver) return;

        let message = `Bonjour ${contactingDriver.name}, c'est pour une livraison.`;
        let printUrl = "";

        if (selectedOrderId !== "none") {
            try {
                // Assign driver and get signed URL
                // Use internal_id (database ID) for assignment
                const order = orders.find(o => o.internal_id.toString() === selectedOrderId);

                if (!order) return;

                const response = await api.post(`/vendor/orders/${order.internal_id}/assign-driver`, {
                    driver_id: contactingDriver.id
                });

                printUrl = response.data.print_url;

                if (order) {
                    message = `Bonjour ${contactingDriver.name}, pouvez-vous livrer la commande #${order.order_number} ?\n` +
                        `Client: ${order.customer.name}\n` +
                        `Adresse: ${order.shipping_address.address}, ${order.shipping_address.city}\n` +
                        `Montant: ${order.total_amount}\n\n` +
                        `📄 Bon de commande: ${printUrl}`;
                }

                toast.success("Bon de commande généré et livreur assigné !");
                // Update local status if needed or refresh orders
            } catch (error) {
                console.error("Failed to assign driver:", error);
                toast.error("Impossible d'assigner le livreur ou de générer le lien.");
                return; // Stop if assignment fails
            }
        }

        const url = `https://wa.me/${contactingDriver.phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        setIsContactOpen(false);
    };

    const filteredDrivers = drivers.filter(driver =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.zone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Livreurs Disponibles
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Contactez un livreur pour vos expéditions
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Rechercher un livreur..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Liste des Livreurs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zone</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Contact</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-8">
                                                <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                                                <p className="mt-2 text-gray-500">Chargement des livreurs...</p>
                                            </td>
                                        </tr>
                                    ) : filteredDrivers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-8 text-gray-500">
                                                Aucun livreur trouvé
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredDrivers.map((driver) => (
                                            <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                                            <Truck className="h-4 w-4" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">{driver.name}</div>
                                                            <div className="text-xs text-gray-500">{driver.phone}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center text-gray-600">
                                                        <MapPin className="h-3 w-3 mr-1" />
                                                        {driver.zone}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {getStatusBadge(driver.status)}
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                        onClick={() => openContactModal(driver)}
                                                    >
                                                        <Phone className="h-4 w-4 mr-2" />
                                                        WhatsApp
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Dialog */}
                <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Contacter {contactingDriver?.name}</DialogTitle>
                            <DialogDescription>
                                Sélectionnez une commande pour joindre les détails de livraison au message.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="order-select">Joindre une commande (Optionnel)</Label>
                                <Select
                                    value={selectedOrderId}
                                    onValueChange={setSelectedOrderId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une commande..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Aucune commande</SelectItem>
                                        {orders.map((order) => (
                                            <SelectItem key={order.internal_id} value={order.internal_id.toString()}>
                                                {order.customer.name} - {order.shipping_address.phone} - 📄 Bon de commande
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsContactOpen(false)}>
                                Annuler
                            </Button>
                            <Button onClick={handleWhatsAppClick} className="bg-green-600 hover:bg-green-700 text-white">
                                <Phone className="h-4 w-4 mr-2" />
                                Envoyer sur WhatsApp
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
