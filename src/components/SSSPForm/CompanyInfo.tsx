import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuickFillButton } from "@/components/QuickFill/QuickFillButton";

export const CompanyInfo = ({ formData, setFormData }: any) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Company Information</h2>
      <div className="grid gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="companyName">Company Name</Label>
            <QuickFillButton
              fieldId="companyName"
              fieldName="Company Name"
              onSelect={(value) =>
                setFormData({ ...formData, companyName: value })
              }
            />
          </div>
          <Input
            id="companyName"
            value={formData.companyName || ""}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            placeholder="Enter company name"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="address">Address</Label>
            <QuickFillButton
              fieldId="address"
              fieldName="Address"
              onSelect={(value) =>
                setFormData({ ...formData, address: value })
              }
            />
          </div>
          <Input
            id="address"
            value={formData.address || ""}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            placeholder="Enter company address"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <QuickFillButton
                fieldId="contactPerson"
                fieldName="Contact Person"
                onSelect={(value) =>
                  setFormData({ ...formData, contactPerson: value })
                }
              />
            </div>
            <Input
              id="contactPerson"
              value={formData.contactPerson || ""}
              onChange={(e) =>
                setFormData({ ...formData, contactPerson: e.target.value })
              }
              placeholder="Enter contact person name"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <QuickFillButton
                fieldId="contactEmail"
                fieldName="Contact Email"
                onSelect={(value) =>
                  setFormData({ ...formData, contactEmail: value })
                }
              />
            </div>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail || ""}
              onChange={(e) =>
                setFormData({ ...formData, contactEmail: e.target.value })
              }
              placeholder="Enter contact email"
            />
          </div>
        </div>
      </div>
    </div>
  );
};