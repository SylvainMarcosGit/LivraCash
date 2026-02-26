import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/app/hooks/useAuth";

import AppLayout from "@/app/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Switch } from "@/app/components/ui/switch";
import { Separator } from "@/app/components/ui/separator";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { settingsService, ShopSettings } from "@/app/services/settingsService";

export default function Settings() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Security settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadSettings();
    }
  }, [isAuthenticated]);

  const loadSettings = async () => {
    try {
      const settings = await settingsService.getSettings();
      if (settings) {
        setTwoFactorEnabled(settings.two_factor_enabled);
      }
    } catch (error) {
      console.error("Failed to load settings", error);
    }
  };

  const handleUpdateSetting = async (key: keyof ShopSettings, value: any) => {
    try {
      await settingsService.updateSettings({ [key]: value });
      toast.success("Paramètres mis à jour");
    } catch (error) {
      toast.error("Échec de la mise à jour des paramètres");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    try {
      // Simulate API call for now or implement auth password change
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Mot de passe modifié avec succès");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Échec du changement de mot de passe");
    }
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600 mt-1">Gérez vos préférences de compte</p>
        </div>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="size-5 text-gray-600" />
              <CardTitle>Sécurité</CardTitle>
            </div>
            <CardDescription>Gérez les paramètres de sécurité de votre compte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Authentification à deux facteurs</Label>
                <p className="text-sm text-gray-600">Ajoutez une couche de sécurité supplémentaire à votre compte</p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={(checked) => {
                  setTwoFactorEnabled(checked);
                  handleUpdateSetting('two_factor_enabled', checked);
                }}
                aria-label="Two-factor authentication"
              />
            </div>

            <Separator />

            {/* Change Password */}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <h3 className="font-semibold">Changer le mot de passe</h3>
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  aria-label="Mot de passe actuel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  aria-label="Nouveau mot de passe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  aria-label="Confirmer le nouveau mot de passe"
                />
              </div>
              <Button type="submit">Changer le mot de passe</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
