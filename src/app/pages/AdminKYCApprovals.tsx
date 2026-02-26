import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/app/hooks/useAuth";

import AppLayout from "@/app/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { CheckCircle2, XCircle, Clock, FileText, User, Building, CreditCard, Eye } from "lucide-react";
import { formatDate } from "@/app/utils/formatters";
import { toast } from "sonner";

import { adminService, KYCApplication } from "@/app/services/adminService";

// Override local interface if needed, but better to update service
// For now, let's just cast or update logic. 
// Actually, `adminService.ts` defines `KYCApplication`. 
// I should update `adminService.ts` first.


export default function AdminKYCApprovals() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState<KYCApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<KYCApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    // Redirect non-admin users
    if (user?.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const fetchApplications = async () => {
    try {
      const data = await adminService.getKYCApplications();
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch KYC applications", error);
      toast.error("Échec du chargement des demandes");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleReview = (app: KYCApplication, action: "approve" | "reject") => {
    setSelectedApp(app);
    setReviewAction(action);
    setReviewNotes("");
    setIsReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedApp) return;

    setIsProcessing(true);

    try {
      await adminService.reviewKYCApplication(selectedApp.id, reviewAction, reviewNotes);

      // Update application status locally
      setApplications((prev) =>
        prev.map((app) =>
          app.id === selectedApp.id
            ? { ...app, status: reviewAction === "approve" ? "approved" : "rejected" }
            : app
        )
      );

      toast.success(`Demande KYC ${reviewAction === "approve" ? "approuvée" : "rejetée"}`);
      setIsReviewDialogOpen(false);
      // Refresh list to be sure
      fetchApplications();
    } catch (error) {
      toast.error("Échec du traitement de l'examen");
    } finally {
      setIsProcessing(false);
    }
  };

  /* Filters */
  const pendingApps = applications.filter((app) =>
    app.status === "pending" || app.status === "draft" || app.status === "submitted" || app.status === "under_review"
  );
  const approvedApps = applications.filter((app) => app.status === "approved");
  const rejectedApps = applications.filter((app) => app.status === "rejected");

  const getStatusBadge = (status: KYCApplication["status"]) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      approved: "default",
      pending: "secondary",
      draft: "secondary",
      submitted: "secondary",
      under_review: "outline",
      rejected: "destructive",
    };

    const icons: Record<string, JSX.Element> = {
      approved: <CheckCircle2 className="size-3 mr-1" />,
      pending: <Clock className="size-3 mr-1" />,
      draft: <Clock className="size-3 mr-1" />,
      submitted: <Clock className="size-3 mr-1" />,
      under_review: <Clock className="size-3 mr-1" />,
      rejected: <XCircle className="size-3 mr-1" />,
    };

    return (
      <Badge variant={variants[status] || "outline"} className="capitalize">
        {icons[status] || <Clock className="size-3 mr-1" />}
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

  const ApplicationCard = ({ app }: { app: KYCApplication }) => (
    <Card key={app.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{app.business_name}</CardTitle>
            <CardDescription>{app.owner_name}</CardDescription>
          </div>
          {getStatusBadge(app.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="size-4 text-gray-400" />
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{app.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Building className="size-4 text-gray-400" />
            <div>
              <p className="text-gray-600">Type</p>
              <p className="font-medium capitalize">{app.business_type.replace("_", " ")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="size-4 text-gray-400" />
            <div>
              <p className="text-gray-600">ID Type</p>
              <p className="font-medium capitalize">{app.id_type?.replace("_", " ")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-gray-400" />
            <div>
              <p className="text-gray-600">Submitted</p>
              <p className="font-medium">{formatDate(app.submitted_at)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Documents:</p>
          <div className="flex flex-wrap gap-2">
            {app.documents.id_document_front && (
              <a href={app.documents.id_document_front} target="_blank" rel="noopener noreferrer">
                <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer">
                  <FileText className="size-3 mr-1" />
                  ID Front
                  <Eye className="size-3 ml-1" />
                </Badge>
              </a>
            )}
            {app.documents.selfie && (
              <a href={app.documents.selfie} target="_blank" rel="noopener noreferrer">
                <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer">
                  <User className="size-3 mr-1" />
                  Selfie
                  <Eye className="size-3 ml-1" />
                </Badge>
              </a>
            )}
          </div>
        </div>

        {(app.status === "pending" || app.status === "draft" || app.status === "submitted" || app.status === "under_review") && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => handleReview(app, "reject")}
            >
              <XCircle className="size-4 mr-2" />
              Rejeter
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => handleReview(app, "approve")}
            >
              <CheckCircle2 className="size-4 mr-2" />
              Approuver
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approbations KYC</h1>
          <p className="text-gray-600 mt-1">Examiner et approuver les demandes KYC des vendeurs</p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente d'examen</CardTitle>
              <Clock className="size-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApps.length}</div>
              <p className="text-xs text-gray-600 mt-1">En attente d'approbation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approuvé</CardTitle>
              <CheckCircle2 className="size-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedApps.length}</div>
              <p className="text-xs text-gray-600 mt-1">Vérifié avec succès</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejeté</CardTitle>
              <XCircle className="size-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedApps.length}</div>
              <p className="text-xs text-gray-600 mt-1">Non approuvé</p>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              En attente ({pendingApps.length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approuvé ({approvedApps.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejeté ({rejectedApps.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingApps.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Clock className="size-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune demande KYC en attente</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {pendingApps.map((app) => (
                  <ApplicationCard key={app.id} app={app} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {approvedApps.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <CheckCircle2 className="size-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune demande approuvée pour le moment</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {approvedApps.map((app) => (
                  <ApplicationCard key={app.id} app={app} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedApps.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <XCircle className="size-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucune demande rejetée</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {rejectedApps.map((app) => (
                  <ApplicationCard key={app.id} app={app} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {reviewAction === "approve" ? "Approuver" : "Rejeter"} Demande KYC
              </DialogTitle>
              <DialogDescription>
                {selectedApp?.business_name} - {selectedApp?.owner_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reviewNotes">Notes d'examen</Label>
                <Textarea
                  id="reviewNotes"
                  placeholder={
                    reviewAction === "approve"
                      ? "Ajouter des notes d'approbation (optionnel)..."
                      : "Veuillez fournir un motif de rejet..."
                  }
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={4}
                  required={reviewAction === "reject"}
                  aria-label="Review notes"
                />
              </div>
              {reviewAction === "reject" && reviewNotes.length === 0 && (
                <p className="text-sm text-red-600">Veuillez fournir un motif de rejet</p>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsReviewDialogOpen(false)}
                disabled={isProcessing}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={isProcessing || (reviewAction === "reject" && !reviewNotes)}
                variant={reviewAction === "approve" ? "default" : "destructive"}
              >
                {isProcessing ? "Traitement..." : reviewAction === "approve" ? "Approuver" : "Rejeter"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
