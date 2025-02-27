
import { supabase } from "@/integrations/supabase/client";

export type ActivityAction = 'created' | 'updated' | 'shared' | 'cloned' | 'deleted' | 'reviewed' | 'downloaded' | 'viewed';

export type ActivityCategory = 'content' | 'access' | 'review' | 'system' | 'document';

export interface ActivityLogDetails {
  updated_fields?: string[];
  section?: string;
  severity?: 'minor' | 'major' | 'critical';
  description?: string;
  metadata?: Record<string, any>;
}

export async function logActivity(
  sssp_id: string, 
  action: ActivityAction, 
  user_id: string,
  details?: ActivityLogDetails,
  category: ActivityCategory = 'content'
) {
  console.log(`[activityLogging] Logging activity: ${action} for SSSP ${sssp_id}`);
  
  try {
    const { data, error } = await supabase
      .from('sssp_activity')
      .insert({
        sssp_id,
        action,
        user_id,
        details: {
          ...details,
          category,
          timestamp: new Date().toISOString()
        }
      });

    if (error) {
      console.error('[activityLogging] Error logging activity:', error);
      throw error;
    }

    console.log('[activityLogging] Activity logged successfully:', data);
    return data;
  } catch (error) {
    console.error('[activityLogging] Failed to log activity:', error);
    throw error;
  }
}

export async function getActivityLogs(
  sssp_id: string,
  options?: {
    limit?: number;
    offset?: number;
    actions?: ActivityAction[];
    categories?: ActivityCategory[];
    fromDate?: string;
    toDate?: string;
    userId?: string;
  }
) {
  let query = supabase
    .from('sssp_activity')
    .select('*, profiles:user_id(first_name, last_name)')
    .eq('sssp_id', sssp_id)
    .order('created_at', { ascending: false });

  // Apply filters if provided
  if (options?.actions && options.actions.length > 0) {
    query = query.in('action', options.actions);
  }

  if (options?.categories && options.categories.length > 0) {
    // Filter by category using the contains operator
    const categoryConditions = options.categories.map(category => 
      `details->>'category' = '${category}'`
    ).join(' OR ');
    
    query = query.or(categoryConditions);
  }

  if (options?.fromDate) {
    query = query.gte('created_at', options.fromDate);
  }

  if (options?.toDate) {
    query = query.lte('created_at', options.toDate);
  }

  if (options?.userId) {
    query = query.eq('user_id', options.userId);
  }

  // Apply pagination
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, (options.offset + (options.limit || 10) - 1));
  }

  const { data, error } = await query;

  if (error) {
    console.error('[activityLogging] Error fetching activity logs:', error);
    throw error;
  }

  return data.map(log => ({
    ...log,
    user_name: log.profiles ? 
      `${log.profiles.first_name || ''} ${log.profiles.last_name || ''}`.trim() || 'Unknown user' 
      : 'Unknown user'
  }));
}
