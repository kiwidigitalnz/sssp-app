
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Phone, UserCircle, Briefcase } from "lucide-react";

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
        <TableRow className="bg-muted/50">
          <TableHead className="w-[30%] font-semibold">Name</TableHead>
          <TableHead className="w-[30%] font-semibold">Role</TableHead>
          <TableHead className="w-[30%] font-semibold">Phone</TableHead>
          <TableHead className="w-[10%]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact: any, index: number) => (
          <TableRow key={index} className="hover:bg-muted/30 transition-colors">
            <TableCell>
              <div className="flex items-center space-x-2">
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={contact.name}
                  onChange={(e) => onUpdate(index, "name", e.target.value)}
                  placeholder="Contact name"
                  className="w-full border-muted focus:border-primary"
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={contact.role}
                  onChange={(e) => onUpdate(index, "role", e.target.value)}
                  placeholder="Contact role"
                  className="w-full border-muted focus:border-primary"
                />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={contact.phone}
                  onChange={(e) => onUpdate(index, "phone", e.target.value)}
                  placeholder="Contact phone"
                  className="w-full border-muted focus:border-primary"
                  type="tel"
                />
              </div>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(index)}
                className="hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {contacts.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="h-32 text-center">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <div className="rounded-full bg-muted p-3">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">No emergency contacts</p>
                  <p className="text-sm">Add contacts using the buttons below</p>
                </div>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
