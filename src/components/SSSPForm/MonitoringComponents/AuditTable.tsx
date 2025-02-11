
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface AuditTableProps {
  audits: any[];
  updateAudit: (index: number, field: string, value: string) => void;
  removeAudit: (index: number) => void;
}

export const AuditTable = ({ audits, updateAudit, removeAudit }: AuditTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Frequency</TableHead>
          <TableHead>Responsible Person</TableHead>
          <TableHead>Last Done</TableHead>
          <TableHead>Next Due</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {audits.map((audit: any, index: number) => (
          <TableRow key={index}>
            <TableCell>
              <Input
                value={audit.type}
                onChange={(e) => updateAudit(index, "type", e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Input
                value={audit.frequency}
                onChange={(e) => updateAudit(index, "frequency", e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Input
                value={audit.responsible}
                onChange={(e) => updateAudit(index, "responsible", e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Input
                type="date"
                value={audit.lastDate}
                onChange={(e) => updateAudit(index, "lastDate", e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Input
                type="date"
                value={audit.nextDate}
                onChange={(e) => updateAudit(index, "nextDate", e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeAudit(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
