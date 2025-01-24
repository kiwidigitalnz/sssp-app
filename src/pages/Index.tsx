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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileText, AlertTriangle, CheckCircle } from "lucide-react";

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Company Header Card */}
      <Card className="bg-white shadow-lg transition-all hover:shadow-xl">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={companyInfo.logo}
                alt={`${companyInfo.name} logo`}
                className="object-contain w-full h-full"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{companyInfo.name}</h1>
              <p className="text-gray-600">{companyInfo.address}</p>
              <div className="mt-2 space-y-1">
                <p className="text-gray-600">{companyInfo.phone}</p>
                <p className="text-gray-600">{companyInfo.email}</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/create-sssp")}
              className="transition-all hover:scale-105"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New SSSP
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SSSPs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="bg-white transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft SSSPs</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draft}</div>
          </CardContent>
        </Card>
        <Card className="bg-white transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted SSSPs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submitted}</div>
          </CardContent>
        </Card>
      </div>

      {/* SSSP Table */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle>Recent Site-Specific Safety Plans</CardTitle>
        </CardHeader>
        <CardContent>
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
                      <TableRow key={sssp.id} className="transition-colors hover:bg-gray-50">
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
                            className="transition-all hover:bg-primary hover:text-white"
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;