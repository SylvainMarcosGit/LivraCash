import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

interface BusinessInfoStepProps {
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
  data: Record<string, unknown>;
}

export default function BusinessInfoStep({ onNext, data }: BusinessInfoStepProps) {
  const [formData, setFormData] = useState({
    business_name: (data.business_name as string) || "",
    business_type: (data.business_type as string) || "",
    business_category: (data.business_category as string) || "",
    description: (data.description as string) || "",
    facebook_url: (data.facebook_url as string) || "",
    youtube_url: (data.youtube_url as string) || "",
    tiktok_url: (data.tiktok_url as string) || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          <Label htmlFor="business_name">Business Name *</Label>
          <Input
            id="business_name"
            name="business_name"
            value={formData.business_name}
            onChange={handleChange}
            required
            placeholder="Tech Solutions Ltd"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_type">Business Type *</Label>
          <Select
            value={formData.business_type}
            onValueChange={(val) => handleSelectChange("business_type", val)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="limited_company">Limited Company</SelectItem>
              <SelectItem value="sole_proprietor">Sole Proprietor</SelectItem>
              <SelectItem value="partnership">Partnership</SelectItem>
              <SelectItem value="ngo">NGO</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_category">Business Category *</Label>
          <Select
            value={formData.business_category}
            onValueChange={(val) => handleSelectChange("business_category", val)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="food">Food & Beverage</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
            </SelectContent>
          </Select>
        </div>


      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="facebook_url">Facebook URL</Label>
          <Input
            id="facebook_url"
            name="facebook_url"
            type="url"
            value={formData.facebook_url}
            onChange={handleChange}
            placeholder="https://facebook.com/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="youtube_url">YouTube URL</Label>
          <Input
            id="youtube_url"
            name="youtube_url"
            type="url"
            value={formData.youtube_url}
            onChange={handleChange}
            placeholder="https://youtube.com/..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tiktok_url">TikTok URL</Label>
          <Input
            id="tiktok_url"
            name="tiktok_url"
            type="url"
            value={formData.tiktok_url}
            onChange={handleChange}
            placeholder="https://tiktok.com/@..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Business Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Tell us about your business..."
          rows={4}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">Continue</Button>
      </div>
    </form >
  );
}
