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
import { TopNav } from "@/components/TopNav";

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
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Company Header */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <img
              src={companyInfo.logo}
              alt={`${companyInfo.name} logo`}
              className="h-20 w-20 object-contain"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{companyInfo.name}</h1>
              <p className="text-gray-600 mt-1">{companyInfo.address}</p>
              <div className="mt-2 space-y-1">
                <p className="text-gray-600">{companyInfo.phone}</p>
                <p className="text-gray-600">{companyInfo.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* SSSP Table Section */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-xl font-semibold text-gray-900">Site-Specific Safety Plans</h2>
            <Button onClick={() => navigate("/create-sssp")} className="w-full sm:w-auto">
              <PlusCircle className="h-5 w-5 mr-2" />
              Create New SSSP
            </Button>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Project Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Created Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Last Modified</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ssspList.map((sssp) => (
                      <TableRow key={sssp.id}>
                        <TableCell className="font-medium">
                          {sssp.projectName}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{sssp.createdDate}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              sssp.status === "Draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {sssp.status}
                          </span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{sssp.lastModified}</TableCell>
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
        </div>
      </div>
    </div>
  );
};

export default Index;