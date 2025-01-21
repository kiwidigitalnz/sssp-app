import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";

interface CompanyInfo {
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "Demo Company",
    logo: "/placeholder.svg",
    address: "123 Business Street",
    phone: "(555) 123-4567",
    email: "contact@democompany.com",
  });

  useEffect(() => {
    const savedCompanyInfo = localStorage.getItem('companyInfo');
    if (savedCompanyInfo) {
      setCompanyInfo(JSON.parse(savedCompanyInfo));
    }
  }, []);

  // Mock data for the table
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

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Company Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <img
            src={companyInfo.logo}
            alt={`${companyInfo.name} logo`}
            className="h-16 w-16 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold">{companyInfo.name}</h1>
            <p className="text-gray-600">{companyInfo.address}</p>
          </div>
        </div>
        <div className="text-right">
          <Button
            variant="outline"
            onClick={() => navigate("/company-settings")}
          >
            Edit Company Settings
          </Button>
        </div>
      </div>

      {/* SSSP Table Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Site-Specific Safety Plans</h2>
          <Button onClick={() => navigate("/create-sssp")} className="gap-2">
            <PlusCircle className="h-5 w-5" />
            Create New SSSP
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ssspList.map((sssp) => (
                <TableRow key={sssp.id}>
                  <TableCell className="font-medium">
                    {sssp.projectName}
                  </TableCell>
                  <TableCell>{sssp.createdDate}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        sssp.status === "Draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {sssp.status}
                    </span>
                  </TableCell>
                  <TableCell>{sssp.lastModified}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/edit-sssp/${sssp.id}`)}
                    >
                      View/Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Index;