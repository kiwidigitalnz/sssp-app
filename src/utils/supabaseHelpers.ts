
import { PostgrestSingleResponse } from "@supabase/supabase-js";

// Helper function to check if a Supabase response is an error
export function isSupabaseError(response: any): boolean {
  return (
    response === null ||
    response === undefined ||
    (typeof response === "object" && "error" in response && response.error === true)
  );
}

// Type guard to check if an object has a specific property
export function hasProperty<T, K extends string>(obj: T, prop: K): obj is T & Record<K, unknown> {
  return obj !== null && 
         obj !== undefined && 
         typeof obj === "object" && 
         prop in obj;
}

// Safely get a property from a Supabase response which might be an error
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K, defaultValue: T[K]): T[K] {
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
    return response.data as T || defaultValue;
  }
  
  // If it's already the data we want
  return response as T;
}

// Convert string IDs to UUID-typed parameters for Supabase queries
export function asUUID(id: string): string {
  return id;
}

// Helper for Supabase array response data
export function hasLength(arr: any[] | unknown): arr is { length: number } {
  return Array.isArray(arr) || (arr !== null && typeof arr === 'object' && 'length' in arr);
}
