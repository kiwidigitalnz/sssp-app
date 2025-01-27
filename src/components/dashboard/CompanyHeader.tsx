import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCompanyLogoUrl } from "@/lib/supabase-storage";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fetchCompanyData = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("No authenticated user found");
  }

  const { data: companyAccess, error: accessError } = await supabase
    .from('company_access')
    .select('company_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (accessError) throw accessError;

  if (!companyAccess?.company_id) {
    return null;
  }

  const { data: companyData, error: companyError } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyAccess.company_id)
    .maybeSingle();

  if (companyError) throw companyError;
  return companyData;
};

export function CompanyHeader() {
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  const { data: company, isLoading } = useQuery({
    queryKey: ['company'],
    queryFn: fetchCompanyData,
  });
  
  useEffect(() => {
    const loadLogoUrl = async () => {
      if (company?.logo_url) {
        const url = await getCompanyLogoUrl(company.logo_url);
        setLogoUrl(url);
      }
    };
    loadLogoUrl();
  }, [company?.logo_url]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <p>Loading company information...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <p>No company information found.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${company.name} logo`}
                className="object-contain w-full h-full"
              />
            ) : (
              <Building2 className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-gray-600">{company.address}</p>
            <div className="space-y-1">
              <p className="text-gray-600">{company.phone}</p>
              <p className="text-gray-600">{company.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}