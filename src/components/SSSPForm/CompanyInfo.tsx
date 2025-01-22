import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Mail, MapPin, User } from "lucide-react";

export const CompanyInfo = ({ formData, setFormData }: any) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold flex items-center gap-3">
          <Building2 className="h-6 w-6 text-primary" />
          Company Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="companyName" className="text-base font-medium">Company Name</Label>
              <QuickFillButton
                fieldId="companyName"
                fieldName="Company Name"
                onSelect={(value) =>
                  setFormData({ ...formData, companyName: value })
                }
              />
            </div>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="companyName"
                value={formData.companyName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                placeholder="Enter company name"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="address" className="text-base font-medium">Address</Label>
              <QuickFillButton
                fieldId="address"
                fieldName="Address"
                onSelect={(value) =>
                  setFormData({ ...formData, address: value })
                }
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Enter company address"
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="contactPerson" className="text-base font-medium">Contact Person</Label>
                <QuickFillButton
                  fieldId="contactPerson"
                  fieldName="Contact Person"
                  onSelect={(value) =>
                    setFormData({ ...formData, contactPerson: value })
                  }
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactPerson"
                  value={formData.contactPerson || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contactPerson: e.target.value })
                  }
                  placeholder="Enter contact person name"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="contactEmail" className="text-base font-medium">Contact Email</Label>
                <QuickFillButton
                  fieldId="contactEmail"
                  fieldName="Contact Email"
                  onSelect={(value) =>
                    setFormData({ ...formData, contactEmail: value })
                  }
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                  placeholder="Enter contact email"
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};