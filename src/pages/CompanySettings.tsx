import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const CompanySettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companyInfo, setCompanyInfo] = useState({
    name: "Demo Company",
    logo: "/placeholder.svg",
    address: "123 Business Street",
    phone: "(555) 123-4567",
    email: "contact@democompany.com",
  });

  const handleSave = () => {
    localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
    toast({
      title: "Settings saved",
      description: "Company information has been updated successfully",
    });
    navigate('/'); // Navigate back to the dashboard
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Company Settings</h1>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={companyInfo.name}
              onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              value={companyInfo.logo}
              onChange={(e) => setCompanyInfo({ ...companyInfo, logo: e.target.value })}
            />
            <div className="mt-2">
              <img
                src={companyInfo.logo}
                alt="Company Logo"
                className="h-16 object-contain"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={companyInfo.address}
              onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={companyInfo.phone}
                onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={companyInfo.email}
                onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;