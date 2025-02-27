
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import type { EmergencyContactFormData } from "@/types/sssp/forms";

interface EmergencyContactSelectionProps {
  previousContacts: EmergencyContactFormData[];
  onSelect: (selectedContacts: EmergencyContactFormData[]) => void;
}

export const EmergencyContactSelection = ({
  previousContacts,
  onSelect,
}: EmergencyContactSelectionProps) => {
  const [selectedContacts, setSelectedContacts] = React.useState<EmergencyContactFormData[]>([]);

  // Filter to get only unique emergency contacts based on name and phone
  const uniqueContacts = useMemo(() => {
    const contactMap = new Map<string, EmergencyContactFormData>();
    
    // Use name+phone as a unique key for emergency contacts
    previousContacts.forEach(contact => {
      const key = `${contact.name}-${contact.phone}`;
      if (!contactMap.has(key)) {
        contactMap.set(key, contact);
      }
    });
    
    return Array.from(contactMap.values());
  }, [previousContacts]);

  const handleSelect = (contact: EmergencyContactFormData) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts(selectedContacts.filter((c) => c !== contact));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleAddSelected = () => {
    onSelect(selectedContacts);
    setSelectedContacts([]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Previous Contacts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Previous Emergency Contacts</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {uniqueContacts.map((contact, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={`contact-${index}`}
                      checked={selectedContacts.includes(contact)}
                      onCheckedChange={() => handleSelect(contact)}
                    />
                    <div className="space-y-1">
                      <label
                        htmlFor={`contact-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {contact.name}
                      </label>
                      <p className="text-sm text-muted-foreground">
                        {contact.phone} ({contact.role})
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={handleAddSelected}
            disabled={selectedContacts.length === 0}
          >
            Add Selected ({selectedContacts.length})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
