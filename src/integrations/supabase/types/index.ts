export type { Database } from './database';
export type { Json } from './database';
export type { ProfilesTable, TeamMembersTable } from './tables';

// Helper types for easier table access
export type Tables = Database['public']['Tables'];
export type TablesInsert = {
  [K in keyof Tables]: Tables[K]['Insert']
};
export type TablesUpdate = {
  [K in keyof Tables]: Tables[K]['Update']
};
export type Enums = Database['public']['Enums'];