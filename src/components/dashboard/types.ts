
import type { SSSP } from "@/types/sssp";

export interface ShareFormData {
  email: string;
  accessLevel: 'view' | 'edit';
}

export interface SSSPTableProps {
  sssps: SSSP[];
  onRefresh: () => void;
}

export interface SharedUser {
  email: string;
  access_level: string;
  status: string;
  is_creator?: boolean;
}

export interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSSSP: SSSP | null;
  sharedUsers: Record<string, SharedUser[]>;
  onShare: (email: string, accessLevel: 'view' | 'edit') => Promise<void>;
  onRevokeAccess: (ssspId: string, email: string) => Promise<void>;
  onResendInvite: (ssspId: string, email: string) => Promise<void>;
}

export interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSSSP: SSSP | null;
  onDelete: (sssp: SSSP) => Promise<void>;
}

export interface SSSPActionsProps {
  sssp: SSSP;
  onShare: (sssp: SSSP) => void;
  onClone: (sssp: SSSP) => Promise<void>;
  onPrintToPDF: (sssp: SSSP) => void;
  onDelete: (sssp: SSSP) => void;
}
