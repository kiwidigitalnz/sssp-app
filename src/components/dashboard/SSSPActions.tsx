
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Share2, FileText, Trash2, MoreHorizontal } from "lucide-react";
import type { SSSPActionsProps } from "./types";

export function SSSPActions({ sssp, onShare, onClone, onPrintToPDF, onDelete }: SSSPActionsProps) {
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
        <DropdownMenuItem onClick={() => onPrintToPDF(sssp)}>
          <FileText className="mr-2 h-4 w-4" />
          Print to PDF
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
