import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyHeader } from "@/components/dashboard/CompanyHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SSSPTable } from "@/components/dashboard/SSSPTable";

interface CompanyInfo {
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "Kiwi Digital Safety Solutions",
    logo: "/placeholder.svg",
    address: "123 Innovation Drive, Tech Valley",
    phone: "(555) 123-4567",
    email: "safety@kiwidigital.com",
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const savedCompanyInfo = localStorage.getItem('companyInfo');
    if (savedCompanyInfo) {
      setCompanyInfo(JSON.parse(savedCompanyInfo));
    }
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            Site-Specific Safety Plans{" "}
            <span className="relative whitespace-nowrap text-primary">
              made simple
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            Create, manage, and share your Site-Specific Safety Plans with ease. Built for construction professionals who value safety and efficiency.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="group"
            >
              Get started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Easy Creation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Intuitive interface for creating comprehensive safety plans in minutes
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Compliance Ready
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Built to meet industry standards and regulatory requirements
                </p>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Risk Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive hazard identification and control measures
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Mock data for the table and statistics
  const ssspList = [
    {
      id: 1,
      projectName: "City Center Construction",
      createdDate: "2024-03-15",
      status: "Draft",
      lastModified: "2024-03-16",
    },
    {
      id: 2,
      projectName: "Harbor Bridge Maintenance",
      createdDate: "2024-03-14",
      status: "Submitted",
      lastModified: "2024-03-14",
    },
  ];

  const stats = {
    total: ssspList.length,
    draft: ssspList.filter(s => s.status === "Draft").length,
    submitted: ssspList.filter(s => s.status === "Submitted").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader {...companyInfo} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total SSSPs"
            value={stats.total}
            icon={FileText}
          />
          <StatsCard
            title="Draft SSSPs"
            value={stats.draft}
            icon={AlertTriangle}
            iconColor="text-yellow-500"
          />
          <StatsCard
            title="Submitted SSSPs"
            value={stats.submitted}
            icon={CheckCircle}
            iconColor="text-green-500"
          />
        </div>

        <SSSPTable ssspList={ssspList} />
      </div>
    </div>
  );
};

export default Index;