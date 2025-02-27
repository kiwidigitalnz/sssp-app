
import type { SSSP } from "@/types/sssp";

export interface SSSPTableProps {
  sssps: SSSP[];
  onRefresh: () => void;
}

export interface SSSPActionsProps {
  sssp: SSSP;
  onShare: (sssp: SSSP) => void;
  onClone: (sssp: SSSP) => void;
  onPrintToPDF: (sssp: SSSP) => void;
  onDelete: (sssp: SSSP) => void;
  isGeneratingPdf?: boolean;
}

export interface SharedUser {
  email: string;
  access_level: string;
  status: string;
  is_creator: boolean;
}
