import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { toast } from "sonner";
import { Building, User, FileText, CreditCard, Check } from "lucide-react";

interface ReviewSubmitStepProps {
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
  data: Record<string, unknown>;
}

export default function ReviewSubmitStep({ onNext, onBack, data }: ReviewSubmitStepProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted || !privacyAccepted) {
      toast.error("Please accept all terms and conditions");
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Application submitted successfully!");
      onNext({ terms_accepted: true, privacy_policy_accepted: true });
    } catch (error) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ReviewSection = ({
    icon: Icon,
    title,
    items,
  }: {
    icon: React.ElementType;
    title: string;
    items: Array<{ label: string; value: unknown }>;
  }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Icon className="size-5 text-blue-600" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
              <dt className="text-sm text-gray-600">{item.label}</dt>
              <dd className="text-sm font-medium text-gray-900">{String(item.value || "N/A")}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <ReviewSection
          icon={Building}
          title="Business Information"
          items={[
            { label: "Business Name", value: data.business_name },
            { label: "Business Type", value: data.business_type },
            { label: "Category", value: data.business_category },
          ]}
        />

        <ReviewSection
          icon={User}
          title="Owner Information"
          items={[
            { label: "Date of Birth", value: data.date_of_birth },
            { label: "Nationality", value: data.nationality },
            { label: "ID Type", value: data.id_type },
            { label: "Address", value: data.address },
            { label: "City", value: data.city },
          ]}
        />

        <ReviewSection
          icon={FileText}
          title="KYC Documents"
          items={[
            { label: "ID Document (Front)", value: (data.id_card_url || data.id_card_path) ? "Uploaded" : "Missing" },
          ]}
        />


      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg">Terms & Conditions</CardTitle>
          <CardDescription>Please review and accept our terms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
            />
            <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
              I agree to the <span className="text-blue-600 underline">Terms of Service</span> and acknowledge that my information will be used in accordance with KKiaPay's policies.
            </Label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="privacy"
              checked={privacyAccepted}
              onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
            />
            <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
              I have read and accept the <span className="text-blue-600 underline">Privacy Policy</span> and consent to the processing of my personal data for KYC verification.
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Check className="size-5 text-green-600 mt-0.5" />
          <p className="text-sm text-green-800">
            Your application will be reviewed within 2-3 business days. You will receive a notification once your account is approved.
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting || !termsAccepted || !privacyAccepted}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
}
