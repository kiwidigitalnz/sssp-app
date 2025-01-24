import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Settings, Plug, CreditCard, Users } from "lucide-react";
import { CompanyInfo } from "@/components/SSSPForm/CompanyInfo";
import { Card } from "@/components/ui/card";
import { TeamMembersList } from "@/components/Team/TeamMembersList";
import { useState } from "react";

const CompanySettings = () => {
  const [formData, setFormData] = useState({
    companyName: "Demo Company",
    address: "123 Business Street",
    contactPerson: "John Doe",
    contactEmail: "contact@democompany.com"
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Company Info</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Team</span>
          </TabsTrigger>
          <TabsTrigger value="app" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">App Settings</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <CompanyInfo formData={formData} setFormData={setFormData} />
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card className="p-6">
            <TeamMembersList />
          </Card>
        </TabsContent>

        <TabsContent value="app" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">App Settings</h2>
            <p className="text-muted-foreground">
              App settings and preferences will be configured here.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Integrations</h2>
            <p className="text-muted-foreground">
              Connect and manage your third-party integrations here.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Billing</h2>
            <p className="text-muted-foreground">
              Manage your subscription and billing information here.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanySettings;