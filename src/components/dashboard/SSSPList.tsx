
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface SSSP {
  id: string;
  title: string;
  company_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  version: number;
}

interface SSSPListProps {
  sssps: SSSP[];
}

export function SSSPList({ sssps }: SSSPListProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Site-Specific Safety Plans</CardTitle>
        <Button 
          onClick={() => navigate("/create-sssp")}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Create New SSSP
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Last Updated</TableHead>
                <TableHead className="hidden sm:table-cell">Version</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sssps.map((sssp) => (
                <TableRow
                  key={sssp.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/edit-sssp/${sssp.id}`)}
                >
                  <TableCell className="font-medium">{sssp.title}</TableCell>
                  <TableCell className="hidden sm:table-cell">{sssp.company_name}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sssp.status === "draft"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {sssp.status}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {new Date(sssp.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{sssp.version}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
