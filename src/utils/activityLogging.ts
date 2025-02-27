
import { supabase } from "@/integrations/supabase/client";

export type ActivityAction = 'created' | 'updated' | 'shared' | 'cloned' | 'deleted' | 'reviewed' | 'downloaded' | 'viewed';

export type ActivityCategory = 'content' | 'access' | 'review' | 'system' | 'document';

export interface FieldChange {
  field: string; // Database field name
  displayName: string; // User-friendly name
  oldValue?: any;
  newValue?: any;
}

export interface ActivityLogDetails {
  updated_fields?: string[];
  field_changes?: FieldChange[];
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

// Map database field names to user-friendly display names
export const fieldDisplayNames: Record<string, string> = {
  // Project Details
  title: "SSSP Title",
  description: "Description",
  start_date: "Start Date",
  end_date: "End Date",
  site_address: "Site Address",
  status: "Status",
  
  // Company Info
  company_name: "Company Name",
  company_address: "Company Address",
  company_contact_name: "Contact Name",
  company_contact_email: "Contact Email",
  company_contact_phone: "Contact Phone",
  
  // Scope of Work
  services: "Services Provided",
  locations: "Work Locations",
  considerations: "Special Considerations",
  
  // Health & Safety
  pcbu_duties: "PCBU Duties",
  site_supervisor_duties: "Site Supervisor Duties",
  worker_duties: "Worker Duties",
  contractor_duties: "Contractor Duties",
  
  // Emergency Procedures
  emergency_plan: "Emergency Plan",
  assembly_points: "Assembly Points",
  emergency_equipment: "Emergency Equipment",
  incident_reporting: "Incident Reporting",
  
  // Training
  competency_requirements: "Competency Requirements",
  training_records: "Training Records",
  
  // Site Safety Rules
  drug_and_alcohol: "Drug & Alcohol Policy",
  fatigue_management: "Fatigue Management",
  ppe: "PPE Requirements",
  mobile_phone: "Mobile Phone Policy",
  entry_exit_procedures: "Entry/Exit Procedures",
  speed_limits: "Speed Limits",
  parking_rules: "Parking Rules",
  site_specific_ppe: "Site-Specific PPE",
  visitor_rules: "Visitor Rules",
  
  // Communication
  communication_methods: "Communication Methods",
  toolbox_meetings: "Toolbox Meetings",
  reporting_procedures: "Reporting Procedures",
  communication_protocols: "Communication Protocols",
  
  // Monitoring & Review
  "monitoring_review.review_schedule.frequency": "Review Frequency",
  "monitoring_review.review_schedule.last_review": "Last Review Date",
  "monitoring_review.review_schedule.next_review": "Next Review Date",
  "monitoring_review.review_schedule.responsible_person": "Responsible Person",
};

// Helper function to get a user-friendly name for a field
export function getFieldDisplayName(fieldName: string): string {
  // Check if we have a direct mapping
  if (fieldDisplayNames[fieldName]) {
    return fieldDisplayNames[fieldName];
  }
  
  // Check for nested fields with dots
  if (fieldName.includes('.')) {
    const parts = fieldName.split('.');
    const lastPart = parts[parts.length - 1];
    
    // Try to get a friendly name for the last part
    if (fieldDisplayNames[lastPart]) {
      return fieldDisplayNames[lastPart];
    }
    
    // If we have a nested field without a mapping, format it nicely
    return lastPart
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }
  
  // Format unknown fields nicely
  return fieldName
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Helper function to format values for display
export function formatValueForDisplay(value: any, fieldName: string): string {
  if (value === null || value === undefined) {
    return 'None';
  }
  
  if (value === '') {
    return 'Empty';
  }
  
  // Date formatting
  if (fieldName.includes('date') || fieldName.includes('review')) {
    const dateValue = new Date(value);
    if (!isNaN(dateValue.getTime())) {
      return dateValue.toLocaleDateString();
    }
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'None';
    }
    
    if (typeof value[0] === 'object') {
      return `${value.length} items`;
    }
    
    return value.join(', ');
  }
  
  // Handle objects
  if (typeof value === 'object') {
    return 'Complex data';
  }
  
  // Handle booleans
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  // Default string representation
  return String(value);
}
