import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Card, CardContent } from "@/app/components/ui/card";
import { api } from "@/app/services/api";
import { Upload, X, FileText, Camera } from "lucide-react";
import { toast } from "sonner";

const kycSchema = z.object({
  id_type: z.enum(["cni", "passport", "driving_license"], {
    required_error: "Veuillez sélectionner un type de pièce d'identité",
  }),
  id_number: z.string().min(1, "Le numéro de la pièce est requis"),
  id_expiry_date: z.string().min(1, "La date d'expiration est requise"),
});

type KYCFormData = z.infer<typeof kycSchema>;

interface KYCDocumentStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  data: any;
}

export default function KYCDocumentStep({ onNext, onBack, data }: KYCDocumentStepProps) {
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(data?.id_card_url || null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(data?.selfie_url || null);
  const [isUploading, setIsUploading] = useState(false);

  // useForm hook setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      id_type: data?.id_type || undefined,
      id_number: data?.id_number || "",
      id_expiry_date: data?.id_expiry_date || "",
    },
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "id_card" | "selfie"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La taille du fichier doit être inférieure à 5 Mo");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (type === "id_card") {
      setIdFile(file);
      setIdPreview(previewUrl);
    } else {
      setSelfieFile(file);
      setSelfiePreview(previewUrl);
    }
  };

  const removeFile = (type: "id_card" | "selfie") => {
    if (type === "id_card") {
      setIdFile(null);
      setIdPreview(null);
    } else {
      setSelfieFile(null);
      setSelfiePreview(null);
    }
  };

  const onSubmit = async (formData: KYCFormData) => {
    if (!idFile && !data?.id_card_url) {
      toast.error("Veuillez télécharger votre pièce d'identité");
      return;
    }
    if (!selfieFile && !data?.selfie_url) {
      toast.error("Veuillez télécharger un selfie avec votre pièce d'identité");
      return;
    }

    try {
      setIsUploading(true);

      const submitData = new FormData();
      submitData.append("id_type", formData.id_type);
      submitData.append("id_number", formData.id_number);
      submitData.append("id_expiry_date", formData.id_expiry_date);
      submitData.append("current_step", "3");

      if (idFile) {
        submitData.append("id_card", idFile);
      }
      if (selfieFile) {
        submitData.append("selfie", selfieFile);
      }

      const response = await api.post("/onboarding", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Documents téléchargés avec succès");
        onNext({
          ...formData,
          ...response.data.data
        });
      }
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Échec du téléchargement des documents. Veuillez réessayer.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Vérification d'identité</h2>
        <p className="text-sm text-gray-500">
          Nous devons vérifier votre identité pour nous conformer à la réglementation.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ID Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="id_type">Type de pièce d'identité</Label>
            <Select
              onValueChange={(value) => setValue("id_type", value as any)}
              defaultValue={data?.id_type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cni">Carte d'identité nationale</SelectItem>
                <SelectItem value="passport">Passeport</SelectItem>
                <SelectItem value="driving_license">Permis de conduire</SelectItem>
              </SelectContent>
            </Select>
            {errors.id_type && (
              <p className="text-xs text-red-500">{errors.id_type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="id_number">Numéro de la pièce</Label>
            <Input
              id="id_number"
              placeholder="Ex: 123456789"
              {...register("id_number")}
            />
            {errors.id_number && (
              <p className="text-xs text-red-500">{errors.id_number.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="id_expiry_date">Date d'expiration</Label>
            <Input
              id="id_expiry_date"
              type="date"
              {...register("id_expiry_date")}
            />
            {errors.id_expiry_date && (
              <p className="text-xs text-red-500">{errors.id_expiry_date.message}</p>
            )}
          </div>
        </div>

        {/* Document Uploads Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

          {/* ID Card Upload Card */}
          <div className="space-y-2">
            <Label className="font-medium">Document d'identité (Recto)</Label>
            <Card className={`border-dashed transition-colors ${idPreview ? 'border-blue-500 bg-blue-50/10' : 'border-gray-300 hover:border-gray-400'}`}>
              <CardContent className="p-0">
                {idPreview ? (
                  <div className="relative w-full h-48 flex items-center justify-center p-4">
                    <img
                      src={idPreview}
                      alt="ID Preview"
                      className="max-h-full max-w-full object-contain rounded shadow-sm"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => removeFile("id_card")}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 p-6 text-center">
                    <div className="mb-3 p-3 bg-blue-50 rounded-full text-blue-600">
                      <FileText className="size-6" />
                    </div>
                    <Label
                      htmlFor="id-upload"
                      className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Télécharger la pièce d'identité
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG ou PDF jusqu'à 5 Mo
                    </p>
                    <Input
                      type="file"
                      id="id-upload"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange(e, "id_card")}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Selfie Upload Card */}
          <div className="space-y-2">
            <Label className="font-medium">Selfie avec la pièce d'identité</Label>
            <Card className={`border-dashed transition-colors ${selfiePreview ? 'border-blue-500 bg-blue-50/10' : 'border-gray-300 hover:border-gray-400'}`}>
              <CardContent className="p-0">
                {selfiePreview ? (
                  <div className="relative w-full h-48 flex items-center justify-center p-4">
                    <img
                      src={selfiePreview}
                      alt="Selfie Preview"
                      className="max-h-full max-w-full object-contain rounded shadow-sm"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full"
                      onClick={() => removeFile("selfie")}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 p-6 text-center">
                    <div className="mb-3 p-3 bg-blue-50 rounded-full text-blue-600">
                      <Camera className="size-6" />
                    </div>
                    <Label
                      htmlFor="selfie-upload"
                      className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Télécharger un selfie
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Photo claire tenant votre pièce d'identité
                    </p>
                    <Input
                      type="file"
                      id="selfie-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "selfie")}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button type="button" variant="outline" onClick={onBack}>
            Retour
          </Button>
          <Button type="submit" disabled={isUploading}>
            {isUploading ? "Téléchargement..." : "Enregistrer et continuer"}
          </Button>
        </div>
      </form>
    </div>
  );
}
