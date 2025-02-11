
import type { SSSP } from "./base";

// API-related type definitions
export interface SSSPResponse extends SSSP {
  access_level?: string;
  shared_with?: Array<{
    user_id: string;
    access_level: string;
  }>;
}

export interface SSSPVersionResponse {
  id: string;
  sssp_id: string;
  version: number;
  data: SSSP;
  created_at: string;
  created_by: string;
}

export interface SSSPActivityResponse {
  id: string;
  sssp_id: string;
  user_id: string;
  action: string;
  details?: any;
  created_at: string;
}

export interface SSSPInvitationResponse {
  id: string;
  sssp_id: string;
  email: string;
  access_level: string;
  status: string;
  expires_at: string;
  created_at: string;
  invited_by: string;
}
