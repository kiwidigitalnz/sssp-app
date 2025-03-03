
import { PostgrestError, PostgrestResponse, PostgrestSingleResponse } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Type guard to check if a value is a PostgrestError
export function isPostgrestError(value: any): value is PostgrestError {
  return value && typeof value === 'object' && 'code' in value && 'message' in value && 'details' in value;
}

// Helper function to check if a Supabase response is an error
export function isSupabaseError(response: any): boolean {
  if (response === null || response === undefined) return true;
  
  if (typeof response === "object") {
    // Check if it's a PostgrestError
    if (isPostgrestError(response)) return true;
    
    // Check if it has the error property set to true
    if ('error' in response && response.error === true) return true;
    
    // Check for SelectQueryError pattern
    if ('error' in response && typeof response.error === 'string') return true;
  }
  
  return false;
}

// Type guard to check if an object has a specific property
export function hasProperty<T, K extends string>(obj: T, prop: K): obj is T & Record<K, unknown> {
  return obj !== null && 
         obj !== undefined && 
         typeof obj === "object" && 
         prop in obj;
}

// Safely get a property from a Supabase response which might be an error
export function safeGet<T extends object, K extends keyof T>(obj: T | null | undefined, key: K, defaultValue: T[K]): T[K] {
  if (!obj || isSupabaseError(obj)) {
    return defaultValue;
  }
  
  return hasProperty(obj, key as string) ? obj[key] : defaultValue;
}

// Helper to safely work with Supabase response data
export function safelyExtractData<T>(
  response: PostgrestSingleResponse<T> | any, 
  defaultValue: T
): T {
  // Return default if response is null or undefined
  if (!response) {
    return defaultValue;
  }
  
  // If it's a Supabase error, return the default
  if (isSupabaseError(response)) {
    return defaultValue;
  }
  
  // For single responses
  if (hasProperty(response, 'data')) {
    // Check if data is null, and return default if so
    if (response.data === null) {
      return defaultValue;
    }
    return response.data as T;
  }
  
  // If it's already the data we want
  return response as T;
}

// Convert string IDs to UUID-typed parameters for Supabase queries
export function asUUID(id: string): any {
  // The "as any" type assertion is necessary to bypass TypeScript's strict typing
  // for Supabase UUID column filters
  return id as any;
}

// Helper for Supabase array response data
export function hasLength(arr: any[] | unknown): arr is { length: number } {
  return Array.isArray(arr) || (arr !== null && typeof arr === 'object' && 'length' in arr);
}

// Safely extract property from potentially error response
export function safelyGetProperty<T, K extends string>(
  response: any, 
  property: K, 
  defaultValue: any = null
): any {
  if (isSupabaseError(response)) {
    return defaultValue;
  }
  
  // Handle different error patterns
  if (
    response === null || 
    response === undefined || 
    (typeof response === 'object' && 'error' in response)
  ) {
    return defaultValue;
  }
  
  return response[property] !== undefined ? response[property] : defaultValue;
}

// Type-safe casting for Supabase update/insert operations
export function asDatabaseObject<T>(obj: T): any {
  return obj as any;
}

// Safely convert Supabase responses to specific types
export function asTypedData<T>(data: any): T {
  return data as unknown as T;
}
