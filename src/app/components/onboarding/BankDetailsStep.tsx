import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

interface BankDetailsStepProps {
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
  data: Record<string, unknown>;
}

export default function BankDetailsStep({ onNext, onBack, data }: BankDetailsStepProps) {
  const [formData, setFormData] = useState({
    bank_name: (data.bank_name as string) || "",
    account_name: (data.account_name as string) || "",
    account_number: (data.account_number as string) || "",
    account_type: (data.account_type as string) || "",
    currency: (data.currency as string) || "XOF",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="bank_name">Bank Name *</Label>
          <Select
            value={formData.bank_name}
            onValueChange={(val) => handleSelectChange("bank_name", val)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select bank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bank of Africa">Bank of Africa</SelectItem>
              <SelectItem value="Ecobank">Ecobank</SelectItem>
              <SelectItem value="UBA">UBA</SelectItem>
              <SelectItem value="SGBE">SGBE</SelectItem>
              <SelectItem value="BOA">BOA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="account_name">Account Name *</Label>
          <Input
            id="account_name"
            name="account_name"
            value={formData.account_name}
            onChange={handleChange}
            required
            placeholder="Tech Solutions Ltd"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="account_number">Account Number *</Label>
          <Input
            id="account_number"
            name="account_number"
            value={formData.account_number}
            onChange={handleChange}
            required
            placeholder="BJ06BOA01234567890123456"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="account_type">Account Type *</Label>
          <Select
            value={formData.account_type}
            onValueChange={(val) => handleSelectChange("account_type", val)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency *</Label>
          <Select
            value={formData.currency}
            onValueChange={(val) => handleSelectChange("currency", val)}
            required
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="XOF">XOF (West African CFA Franc)</SelectItem>
              <SelectItem value="USD">USD (US Dollar)</SelectItem>
              <SelectItem value="EUR">EUR (Euro)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> Please ensure the account name matches your registered business name. Settlements will be made to this account.
        </p>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Continue</Button>
      </div>
    </form>
  );
}
