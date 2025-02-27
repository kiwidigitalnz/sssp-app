
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Share2, FileText, Trash2, MoreHorizontal, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { SSSPActionsProps } from "./types";

export function SSSPActions({ 
  sssp, 
  onShare, 
  onClone, 
  onPrintToPDF, 
  onDelete,
  isGeneratingPdf = false 
}: SSSPActionsProps) {

  const handlePrintToPDF = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-sssp-pdf', {
        body: { ssspId: sssp.id },
      });

      if (error) {
        console.error('Error generating PDF:', error);
        throw error;
      }

      if (data?.url) {
        // Open the PDF in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onClone(sssp)}>
          <Copy className="mr-2 h-4 w-4" />
          Clone
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onShare(sssp)}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handlePrintToPDF}
          disabled={isGeneratingPdf}
          className={isGeneratingPdf ? "opacity-50 cursor-not-allowed" : ""}
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Download PDF
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => onDelete(sssp)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
