import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCompanyLogoUrl } from "@/lib/supabase-storage";

interface CompanyHeaderProps {
  name: string;
  logo: string | null;
  address: string;
  phone: string;
  email: string;
}

export function CompanyHeader({ name, logo, address, phone, email }: CompanyHeaderProps) {
  const navigate = useNavigate();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const loadLogoUrl = async () => {
      if (logo) {
        const url = await getCompanyLogoUrl(logo);
        setLogoUrl(url);
      }
    };
    loadLogoUrl();
  }, [logo]);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${name} logo`}
                className="object-contain w-full h-full"
              />
            ) : (
              <Building2 className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <p className="text-gray-600">{address}</p>
            <div className="space-y-1">
              <p className="text-gray-600">{phone}</p>
              <p className="text-gray-600">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}