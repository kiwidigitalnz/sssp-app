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
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

interface SSSP {
  id: number;
  projectName: string;
  createdDate: string;
  status: string;
  lastModified: string;
}

interface SSSPTableProps {
  ssspList: SSSP[];
}

export function SSSPTable({ ssspList }: SSSPTableProps) {
  const navigate = useNavigate();

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Site-Specific Safety Plans</CardTitle>
        <Button 
          onClick={() => navigate("/create-sssp")}
          className="transition-all hover:scale-105"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Create New SSSP
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="min-w-[200px] font-semibold">Project Name</TableHead>
                    <TableHead className="hidden sm:table-cell font-semibold">Created Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="hidden sm:table-cell font-semibold">Last Modified</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ssspList.map((sssp) => (
                    <TableRow 
                      key={sssp.id} 
                      className="transition-colors hover:bg-muted/50 border-t"
                    >
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
  );
}