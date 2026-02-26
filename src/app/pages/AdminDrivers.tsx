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
import { Search, Phone, MapPin, Truck, Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/app/services/api";

// Type definition
interface Driver {
    id: number;
    name: string;
    phone: string;
    zone: string;
    status: string;
    orders_completed: number;
    rating: number;
    contacted_count?: number;
    orders_count?: number;
    completed_orders_count?: number;
}

// Initial Mock data
const INITIAL_DRIVERS: Driver[] = [
    {
        id: 1,
        name: "Jean Kouassi",
        phone: "+22901234567",
        zone: "Cotonou - Akpakpa",
        status: "available",
        orders_completed: 145,
        rating: 4.8
    },
    {
        id: 2,
        name: "Moussa Diop",
        phone: "+22997000000",
        zone: "Cotonou - Cadjehoun",
        status: "busy",
        orders_completed: 89,
        rating: 4.5
    },
    {
        id: 3,
        name: "Eric Mensah",
        phone: "+22966112233",
        zone: "Calavi",
        status: "offline",
        orders_completed: 210,
        rating: 4.9
    },
    {
        id: 4,
        name: "Sophie Tognon",
        phone: "+22990123456",
        zone: "Porto-Novo",
        status: "available",
        orders_completed: 56,
        rating: 4.6
    },
    {
        id: 5,
        name: "Ibrahim Salami",
        phone: "+22995443322",
        zone: "Cotonou - Zogbo",
        status: "available",
        orders_completed: 312,
        rating: 4.9
    }
];

export default function AdminDrivers() {
    const { isAuthenticated, user } = useAuth();
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal states
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);

    // Form states
    const [formData, setFormData] = useState<Partial<Driver>>({
        name: "",
        phone: "",
        zone: "",
        status: "available"
    });

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/drivers');
            setDrivers(response.data);
        } catch (error) {
            console.error("Failed to fetch drivers:", error);
            toast.error("Impossible de charger les livreurs");
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

    const handleWhatsAppClick = (phone: string, name: string) => {
        const message = `Bonjour ${name}, c'est l'administration LivraCash.`;
        const url = `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    // CRUD Operations
    const handleAdd = async () => {
        try {
            const response = await api.post('/admin/drivers', formData);
            setDrivers([response.data, ...drivers]);
            setIsAddOpen(false);
            resetForm();
            toast.success("Livreur ajouté avec succès");
        } catch (error) {
            console.error("Failed to add driver:", error);
            toast.error("Erreur lors de l'ajout du livreur");
        }
    };

    const handleEdit = async () => {
        if (!currentDriver) return;
        try {
            const response = await api.put(`/admin/drivers/${currentDriver.id}`, formData);
            const updatedDrivers = drivers.map(d =>
                d.id === currentDriver.id ? response.data : d
            );
            setDrivers(updatedDrivers);
            setIsEditOpen(false);
            resetForm();
            toast.success("Livreur mis à jour avec succès");
        } catch (error) {
            console.error("Failed to update driver:", error);
            toast.error("Erreur lors de la mise à jour du livreur");
        }
    };

    const handleDelete = async () => {
        if (!currentDriver) return;
        try {
            await api.delete(`/admin/drivers/${currentDriver.id}`);
            setDrivers(drivers.filter(d => d.id !== currentDriver.id));
            setIsDeleteOpen(false);
            setCurrentDriver(null);
            toast.success("Livreur supprimé avec succès");
        } catch (error) {
            console.error("Failed to delete driver:", error);
            toast.error("Erreur lors de la suppression du livreur");
        }
    };

    const openEditModal = (driver: Driver) => {
        setCurrentDriver(driver);
        setFormData({
            name: driver.name,
            phone: driver.phone,
            zone: driver.zone,
            status: driver.status
        });
        setIsEditOpen(true);
    };

    const openDeleteModal = (driver: Driver) => {
        setCurrentDriver(driver);
        setIsDeleteOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            phone: "",
            zone: "",
            status: "available"
        });
        setCurrentDriver(null);
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
                            Gestion des Livreurs
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Liste des livreurs partenaires et contact direct
                        </p>
                    </div>
                    <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un livreur
                    </Button>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Rechercher un livreur..."
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacté</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Livraisons</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8">
                                                <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                                                <p className="mt-2 text-gray-500">Chargement des livreurs...</p>
                                            </td>
                                        </tr>
                                    ) : filteredDrivers.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-8 text-gray-500">
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
                                                <td className="px-4 py-4 text-sm">
                                                    <div className="font-medium text-blue-600">{driver.contacted_count || 0}</div>
                                                    <div className="text-xs text-gray-500">fois</div>
                                                </td>
                                                <td className="px-4 py-4 text-sm">
                                                    <div className="font-medium text-green-600">{driver.completed_orders_count || 0}</div>
                                                    <div className="text-xs text-gray-500">sur {driver.orders_count || 0}</div>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-gray-700 hover:text-blue-600"
                                                            onClick={() => {
                                                                setCurrentDriver(driver);
                                                                setIsHistoryOpen(true);
                                                            }}
                                                        >
                                                            Historique
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-gray-500 hover:text-blue-600"
                                                            onClick={() => openEditModal(driver)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700 text-white"
                                                            onClick={() => handleWhatsAppClick(driver.phone, driver.name)}
                                                        >
                                                            <Phone className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-gray-500 hover:text-red-600"
                                                            onClick={() => openDeleteModal(driver)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Add Driver Dialog */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Ajouter un livreur</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Téléphone</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zone">Zone</Label>
                                <Input
                                    id="zone"
                                    value={formData.zone}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, zone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Statut</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value: string) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Disponible</SelectItem>
                                        <SelectItem value="busy">En course</SelectItem>
                                        <SelectItem value="offline">Hors ligne</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                                Annuler
                            </Button>
                            <Button onClick={handleAdd}>
                                Enregistrer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Driver Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Modifier un livreur</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Nom</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-phone">Téléphone</Label>
                                <Input
                                    id="edit-phone"
                                    value={formData.phone}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-zone">Zone</Label>
                                <Input
                                    id="edit-zone"
                                    value={formData.zone}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, zone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-status">Statut</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value: string) => setFormData({ ...formData, status: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Disponible</SelectItem>
                                        <SelectItem value="busy">En course</SelectItem>
                                        <SelectItem value="offline">Hors ligne</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                                Annuler
                            </Button>
                            <Button onClick={handleEdit}>
                                Enregistrer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Supprimer un livreur</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer ce livreur ? Cette action est irréversible.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                                Annuler
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                Supprimer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Driver History Dialog */}
                <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Historique - {currentDriver?.name}</DialogTitle>
                            <DialogDescription>
                                Statistiques et historique des commandes du livreur
                            </DialogDescription>
                        </DialogHeader>

                        {currentDriver && (
                            <div className="space-y-6">
                                {/* Statistics Cards */}
                                <div className="grid grid-cols-3 gap-4">
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-blue-600">
                                                    {currentDriver.contacted_count || 0}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">Fois contacté</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-green-600">
                                                    {currentDriver.completed_orders_count || 0}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">Livraisons complétées</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="pt-6">
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-purple-600">
                                                    {currentDriver.orders_count ?
                                                        Math.round((currentDriver.completed_orders_count || 0) / currentDriver.orders_count * 100)
                                                        : 0}%
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">Taux de réussite</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Order History - Placeholder */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-3">Historique des commandes</h3>
                                    <div className="text-center py-8 text-gray-500 border rounded-lg">
                                        Chargement de l'historique...
                                    </div>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsHistoryOpen(false)}>
                                Fermer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
