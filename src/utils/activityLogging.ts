
import { supabase } from "@/integrations/supabase/client";

export type ActivityAction = 'created' | 'updated' | 'shared' | 'cloned' | 'deleted';

export async function logActivity(
  sssp_id: string, 
  action: ActivityAction, 
  user_id: string,
  details?: any
) {
  console.log(`[activityLogging] Logging activity: ${action} for SSSP ${sssp_id}`);
  
  try {
    const { data, error } = await supabase
      .from('sssp_activity')
      .insert({
        sssp_id,
        action,
        user_id,
        details
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
