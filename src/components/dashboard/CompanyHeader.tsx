import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CompanyHeaderProps {
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
}

export function CompanyHeader({ name, logo, address, phone, email }: CompanyHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={logo}
              alt={`${name} logo`}
              className="object-contain w-full h-full"
            />
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