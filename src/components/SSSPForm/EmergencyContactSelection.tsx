import React from "react";
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

interface EmergencyContact {
  name: string;
  number: string;
  type: string;
}

interface EmergencyContactSelectionProps {
  previousContacts: EmergencyContact[];
  onSelect: (selectedContacts: EmergencyContact[]) => void;
}

export const EmergencyContactSelection = ({
  previousContacts,
  onSelect,
}: EmergencyContactSelectionProps) => {
  const [selectedContacts, setSelectedContacts] = React.useState<EmergencyContact[]>([]);

  const handleSelect = (contact: EmergencyContact) => {
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
              {previousContacts.map((contact, index) => (
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
                        {contact.number} ({contact.type})
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