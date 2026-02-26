import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import AppLayout from "@/app/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { Check } from "lucide-react";
import BusinessInfoStep from "@/app/components/onboarding/BusinessInfoStep";
import OwnerInfoStep from "@/app/components/onboarding/OwnerInfoStep";
import KYCDocumentStep from "@/app/components/onboarding/KYCDocumentStep";
import BankDetailsStep from "@/app/components/onboarding/BankDetailsStep";
import ReviewSubmitStep from "@/app/components/onboarding/ReviewSubmitStep";
import { onboardingService } from "@/app/services/onboardingService";

const steps = [
  { id: 1, title: "Business Info", component: BusinessInfoStep },
  { id: 2, title: "Owner Info", component: OwnerInfoStep },
  { id: 3, title: "KYC Documents", component: KYCDocumentStep },
  { id: 4, title: "Review & Submit", component: ReviewSubmitStep },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await onboardingService.getProgress();
        if (data) {
          setFormData(data);
          // Ensure currentStep doesn't exceed the number of defined steps
          const safeStep = Math.min(data.current_step || 1, steps.length);
          setCurrentStep(safeStep);
        }
      } catch (error) {
        console.error("Failed to load onboarding progress", error);
      }
    };
    fetchProgress();
  }, []);

  const progress = (currentStep / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep - 1].component;

  const handleNext = async (data: Record<string, unknown>) => {
    const newData = { ...formData, ...data, current_step: currentStep + 1 };
    setFormData(newData);

    // Save progress to backend
    try {
      await onboardingService.updateProgress(newData);
    } catch (error) {
      console.error("Failed to save progress", error);
    }

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final submission logic could be here (e.g., status update to 'submitted')
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Merchant Onboarding</h1>
          <p className="text-gray-600 mt-1">Complete your profile to start accepting payments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Step {currentStep} of {steps.length}</CardTitle>
            <CardDescription>{steps[currentStep - 1].title}</CardDescription>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
          <CardContent>
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center size-10 rounded-full border-2 ${step.id < currentStep
                      ? "bg-blue-600 border-blue-600"
                      : step.id === currentStep
                        ? "border-blue-600 text-blue-600"
                        : "border-gray-300 text-gray-400"
                      }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="size-5 text-white" />
                    ) : (
                      <span className="font-semibold">{step.id}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-0.5 mx-2 ${step.id < currentStep ? "bg-blue-600" : "bg-gray-300"
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Current Step Content */}
            <CurrentStepComponent onNext={handleNext} onBack={handleBack} data={formData} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
