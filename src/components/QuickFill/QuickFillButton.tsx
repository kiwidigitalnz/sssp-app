import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { History, Building2, Lightbulb } from "lucide-react";
import { useQuickFill } from "@/hooks/useQuickFill";

interface QuickFillButtonProps {
  fieldId: string;
  fieldName: string;
  onSelect: (value: string) => void;
}

export const QuickFillButton = ({
  fieldId,
  fieldName,
  onSelect,
}: QuickFillButtonProps) => {
  const { 
    companyInfo, 
    previousEntries, 
    getSuggestion 
  } = useQuickFill(fieldId);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <History className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          {companyInfo && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Company Information
              </h4>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => onSelect(companyInfo)}
              >
                {companyInfo}
              </Button>
            </div>
          )}

          {previousEntries.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <History className="h-4 w-4" />
                Previous Entries
              </h4>
              <div className="space-y-2">
                {previousEntries.map((entry, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => onSelect(entry)}
                  >
                    {entry}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              AI Suggestion
            </h4>
            <Button
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => getSuggestion().then(onSelect)}
            >
              Get AI Suggestion
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};