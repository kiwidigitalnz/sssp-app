
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Phone } from "lucide-react";

interface EmergencyContactsTableProps {
  contacts: any[];
  onUpdate: (index: number, field: string, value: string) => void;
  onDelete: (index: number) => void;
}

export const EmergencyContactsTable = ({
  contacts,
  onUpdate,
  onDelete,
}: EmergencyContactsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[30%]">Name</TableHead>
          <TableHead className="w-[30%]">Role</TableHead>
          <TableHead className="w-[30%]">Phone</TableHead>
          <TableHead className="w-[10%]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact: any, index: number) => (
          <TableRow key={index}>
            <TableCell>
              <Input
                value={contact.name}
                onChange={(e) => onUpdate(index, "name", e.target.value)}
                placeholder="Contact name"
                className="w-full"
              />
            </TableCell>
            <TableCell>
              <Input
                value={contact.role}
                onChange={(e) => onUpdate(index, "role", e.target.value)}
                placeholder="Contact role"
                className="w-full"
              />
            </TableCell>
            <TableCell>
              <Input
                value={contact.phone}
                onChange={(e) => onUpdate(index, "phone", e.target.value)}
                placeholder="Contact phone"
                className="w-full"
              />
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(index)}
                className="hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {contacts.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Phone className="h-8 w-8" />
                <p>No emergency contacts added yet.</p>
                <p className="text-sm">Click "Add Contact" to begin.</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
