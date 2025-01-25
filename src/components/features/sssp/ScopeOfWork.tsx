import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, AlertCircle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const scopeOfWorkSchema = z.object({
  services: z.string().min(1, "Services description is required"),
  locations: z.string().min(1, "Key locations and routes are required"),
  considerations: z.string().min(1, "Special considerations are required")
});

type ScopeOfWorkFormData = z.infer<typeof scopeOfWorkSchema>;

export const ScopeOfWork = ({ formData, setFormData }: any) => {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    trigger
  } = useForm<ScopeOfWorkFormData>({
    resolver: zodResolver(scopeOfWorkSchema),
    defaultValues: {
      services: formData.services || "",
      locations: formData.locations || "",
      considerations: formData.considerations || ""
    }
  });

  useEffect(() => {
    setValue("services", formData.services || "");
    setValue("locations", formData.locations || "");
    setValue("considerations", formData.considerations || "");
  }, [formData, setValue]);

  const handleFieldChange = async (field: keyof ScopeOfWorkFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setValue(field, value);
    const result = await trigger(field);
    if (!result && errors[field]) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: errors[field]?.message
      });
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold flex items-center gap-3">
          <Briefcase className="h-6 w-6 text-primary" />
          Scope of Work
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="services" className="text-base font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Services Provided
              </Label>
              <QuickFillButton
                fieldId="services"
                fieldName="Services Provided"
                onSelect={(value) => handleFieldChange("services", value)}
              />
            </div>
            <Textarea
              id="services"
              {...register("services")}
              className={`min-h-[100px] resize-none ${errors.services ? "border-destructive" : ""}`}
              placeholder="Describe the trucking services provided"
              onChange={(e) => handleFieldChange("services", e.target.value)}
            />
            {errors.services && (
              <p className="text-sm text-destructive mt-1">{errors.services.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="locations" className="text-base font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Key Locations and Routes
              </Label>
              <QuickFillButton
                fieldId="locations"
                fieldName="Key Locations and Routes"
                onSelect={(value) => handleFieldChange("locations", value)}
              />
            </div>
            <Textarea
              id="locations"
              {...register("locations")}
              className={`min-h-[100px] resize-none ${errors.locations ? "border-destructive" : ""}`}
              placeholder="List key locations and routes covered"
              onChange={(e) => handleFieldChange("locations", e.target.value)}
            />
            {errors.locations && (
              <p className="text-sm text-destructive mt-1">{errors.locations.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="considerations" className="text-base font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Special Considerations
              </Label>
              <QuickFillButton
                fieldId="considerations"
                fieldName="Special Considerations"
                onSelect={(value) => handleFieldChange("considerations", value)}
              />
            </div>
            <Textarea
              id="considerations"
              {...register("considerations")}
              className={`min-h-[100px] resize-none ${errors.considerations ? "border-destructive" : ""}`}
              placeholder="Note any special considerations (e.g., hazardous goods transport)"
              onChange={(e) => handleFieldChange("considerations", e.target.value)}
            />
            {errors.considerations && (
              <p className="text-sm text-destructive mt-1">{errors.considerations.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
