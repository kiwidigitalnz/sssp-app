
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
    // First check if the user has access to the SSSP
    const { data: accessCheck, error: accessError } = await supabase
      .from('sssps')
      .select('id')
      .eq('id', sssp_id)
      .single();

    if (accessError || !accessCheck) {
      console.error('[activityLogging] User does not have access to this SSSP:', accessError);
      throw new Error('User does not have access to this SSSP');
    }

    const { data, error } = await supabase
      .from('sssp_activity')
      .insert({
        sssp_id,
        action,
        user_id,
        details
      })
      .select(`
        *,
        sssps!sssp_activity_sssp_id_fkey (title),
        profiles!sssp_activity_user_id_fkey (first_name, last_name)
      `)
      .single();

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
