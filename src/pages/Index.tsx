import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  // Mock data - this would typically come from your backend
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
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Site-Specific Safety Plans</h1>
        <Button onClick={() => navigate("/create-sssp")} className="gap-2">
          <PlusCircle className="h-5 w-5" />
          Create New SSSP
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
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
                <TableCell className="font-medium">{sssp.projectName}</TableCell>
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
  );
};

export default Index;