import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Previous Emergency Contacts</h3>
      <ScrollArea className="h-[200px] mb-4">
        <div className="space-y-2">
          {previousContacts.map((contact, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedContacts.includes(contact)}
                onCheckedChange={() => handleSelect(contact)}
              />
              <span>
                {contact.name} - {contact.number} ({contact.type})
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Button
        onClick={handleAddSelected}
        disabled={selectedContacts.length === 0}
        className="w-full"
      >
        Add Selected Contacts
      </Button>
    </Card>
  );
};