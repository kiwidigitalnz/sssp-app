
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { SSSP } from '@/types/sssp';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logActivity, getFieldDisplayName, FieldChange } from "@/utils/activityLogging";

export interface FormPersistenceOptions {
  key: string;
  initialData?: any;
}

async function fetchSSSP(id: string) {
  const { data, error } = await supabase
    .from('sssps')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching SSSP:', error);
    throw error;
  }
  
  if (!data) {
    console.warn('No SSSP found with id:', id);
    return null;
  }

  const transformedData = {
    ...data,
    hazards: Array.isArray(data.hazards) ? data.hazards : [],
    emergency_contacts: Array.isArray(data.emergency_contacts) ? data.emergency_contacts : [],
    required_training: Array.isArray(data.required_training) ? data.required_training : [],
    meetings_schedule: Array.isArray(data.meetings_schedule) ? data.meetings_schedule : [],
    monitoring_review: data.monitoring_review || {
      review_schedule: {
        frequency: '',
        last_review: null,
        next_review: null,
        responsible_person: null
      },
      kpis: [],
      corrective_actions: {
        process: '',
        tracking_method: '',
        responsible_person: null
      },
      audits: [],
      worker_consultation: {
        method: '',
        frequency: '',
        last_consultation: null
      },
      review_triggers: [],
      documentation: {
        storage_location: '',
        retention_period: '',
        access_details: ''
      }
    },
    site_address: data.site_address || '', // Added site_address with empty default
    services: data.services || '',
    locations: data.locations || '',
    considerations: data.considerations || '',
    pcbu_duties: data.pcbu_duties || '',
    site_supervisor_duties: data.site_supervisor_duties || '',
    worker_duties: data.worker_duties || '',
    contractor_duties: data.contractor_duties || '',
    emergency_plan: data.emergency_plan || '',
    assembly_points: data.assembly_points || '',
    emergency_equipment: data.emergency_equipment || '',
    incident_reporting: data.incident_reporting || '',
    competency_requirements: data.competency_requirements || '',
    training_records: data.training_records || '',
    drug_and_alcohol: data.drug_and_alcohol || '',
    fatigue_management: data.fatigue_management || '',
    ppe: data.ppe || '',
    mobile_phone: data.mobile_phone || '',
    entry_exit_procedures: data.entry_exit_procedures || '',
    speed_limits: data.speed_limits || '',
    parking_rules: data.parking_rules || '',
    site_specific_ppe: data.site_specific_ppe || '',
    communication_methods: data.communication_methods || '',
    toolbox_meetings: data.toolbox_meetings || '',
    reporting_procedures: data.reporting_procedures || '',
    communication_protocols: data.communication_protocols || '',
    visitor_rules: data.visitor_rules || ''
  };

  return transformedData;
}

export function useFormPersistence<T extends Partial<SSSP>>(options: FormPersistenceOptions) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const lastSavedRef = useRef<string | null>(null);
  const storageRetryCount = useRef(0);
  const previousDataRef = useRef<T | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['sssp', options.key],
    queryFn: () => options.key.match(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/) 
      ? fetchSSSP(options.key)
      : Promise.resolve(options.initialData),
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const [formData, setFormData] = useState<T>(() => {
    if (data) {
      return data as T;
    }
    
    if (options.initialData) {
      return options.initialData;
    }
    
    try {
      const savedData = localStorage.getItem(options.key);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
    }
    
    return {} as T;
  });

  useEffect(() => {
    if (data) {
      setFormData(data as T);
      previousDataRef.current = data as T;
    }
  }, [data]);

  // Function to identify what fields have changed with old and new values
  const getFieldChanges = (oldData: any, newData: any, prefix = ''): FieldChange[] => {
    if (!oldData || typeof oldData !== 'object' || !newData || typeof newData !== 'object') {
      if (oldData !== newData) {
        return [{
          field: prefix.slice(0, -1),
          displayName: getFieldDisplayName(prefix.slice(0, -1)),
          oldValue: oldData,
          newValue: newData
        }];
      }
      return [];
    }

    // Special handling for arrays
    if (Array.isArray(newData)) {
      // For simple tracking of array changes, just note that it changed
      // For more complex tracking, we'd need to implement array diffing
      if (JSON.stringify(oldData) !== JSON.stringify(newData)) {
        return [{
          field: prefix.slice(0, -1),
          displayName: getFieldDisplayName(prefix.slice(0, -1)),
          oldValue: oldData,
          newValue: newData
        }];
      }
      return [];
    }

    // Track changes in objects by recursively checking properties
    return Object.keys(newData).reduce((changes, key) => {
      const newPath = prefix + key;
      
      // Skip arrays with special handling
      if (Array.isArray(newData[key])) {
        if (JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
          changes.push({
            field: newPath,
            displayName: getFieldDisplayName(newPath),
            oldValue: oldData[key],
            newValue: newData[key]
          });
        }
        return changes;
      }
      
      // Recursively check nested objects
      if (
        typeof newData[key] === 'object' && 
        newData[key] !== null &&
        typeof oldData?.[key] === 'object' && 
        oldData?.[key] !== null &&
        !Array.isArray(newData[key])
      ) {
        return [
          ...changes,
          ...getFieldChanges(oldData[key], newData[key], newPath + '.')
        ];
      }
      
      // Check primitive values
      if (oldData?.[key] !== newData[key]) {
        changes.push({
          field: newPath,
          displayName: getFieldDisplayName(newPath),
          oldValue: oldData?.[key],
          newValue: newData[key]
        });
      }
      
      return changes;
    }, [] as FieldChange[]);
  };

  // Identify which section a field belongs to
  const getSectionFromField = (field: string): string => {
    // Map fields to sections
    const sectionMap: Record<string, string> = {
      title: 'Project Details',
      description: 'Project Details',
      company_name: 'Company Info',
      company_address: 'Company Info',
      company_contact_name: 'Company Info',
      company_contact_email: 'Company Info',
      company_contact_phone: 'Company Info',
      services: 'Scope of Work',
      locations: 'Scope of Work',
      considerations: 'Scope of Work',
      emergency_plan: 'Emergency Procedures',
      assembly_points: 'Emergency Procedures',
      emergency_equipment: 'Emergency Procedures',
      incident_reporting: 'Emergency Procedures',
      emergency_contacts: 'Emergency Procedures',
      pcbu_duties: 'Health & Safety',
      site_supervisor_duties: 'Health & Safety',
      worker_duties: 'Health & Safety',
      contractor_duties: 'Health & Safety',
      competency_requirements: 'Training Requirements',
      training_records: 'Training Requirements',
      required_training: 'Training Requirements',
      hazards: 'Hazard Management',
      drug_and_alcohol: 'Site Safety Rules',
      fatigue_management: 'Site Safety Rules',
      ppe: 'Site Safety Rules',
      mobile_phone: 'Site Safety Rules',
      entry_exit_procedures: 'Site Safety Rules',
      speed_limits: 'Site Safety Rules',
      parking_rules: 'Site Safety Rules',
      site_specific_ppe: 'Site Safety Rules',
      communication_methods: 'Communication',
      toolbox_meetings: 'Communication',
      reporting_procedures: 'Communication',
      communication_protocols: 'Communication',
      visitor_rules: 'Communication',
      meetings_schedule: 'Communication',
      monitoring_review: 'Monitoring & Review'
    };

    // Check if the field has a direct match
    if (field in sectionMap) {
      return sectionMap[field];
    }

    // Check for partial matches (for nested fields)
    for (const key in sectionMap) {
      if (field.startsWith(key)) {
        return sectionMap[key];
      }
    }

    return 'General';
  };

  const mutation = useMutation({
    mutationFn: async (dataToSave: T = formData) => {
      if (options.key.match(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/)) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
          .from('sssps')
          .update({
            ...dataToSave,
            modified_by: user.id
          })
          .eq('id', options.key);
        
        if (error) throw error;

        // Identify field changes with old and new values
        const fieldChanges = getFieldChanges(previousDataRef.current || {}, dataToSave);
        
        // If no fields changed, don't log an activity
        if (fieldChanges.length === 0) {
          return dataToSave;
        }
        
        // Group changes by section
        const changesBySection: Record<string, FieldChange[]> = {};
        fieldChanges.forEach(change => {
          const section = getSectionFromField(change.field);
          if (!changesBySection[section]) {
            changesBySection[section] = [];
          }
          changesBySection[section].push(change);
        });
        
        // Log an activity for each section that had changes
        for (const [section, changes] of Object.entries(changesBySection)) {
          // Extract just the field names for backward compatibility
          const updatedFields = changes.map(change => change.field);
          
          await logActivity(options.key, 'updated', user.id, {
            updated_fields: updatedFields,
            field_changes: changes,
            section: section,
            severity: changes.length > 5 ? 'major' : 'minor',
            description: `Updated ${changes.length} field${changes.length === 1 ? '' : 's'} in ${section}`
          });
        }

        // Update the reference to the current data
        previousDataRef.current = JSON.parse(JSON.stringify(dataToSave));
      }
      return dataToSave;
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(['sssp', options.key], newData);
      toast({
        title: "Success",
        description: "Your changes have been saved",
      });
    },
    onError: (error: Error) => {
      console.error('Error saving form data:', error);
      toast({
        variant: "destructive",
        title: "Error saving",
        description: error.message || "There was an error saving your changes",
      });
    },
  });

  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(options.key);
      lastSavedRef.current = null;
      storageRetryCount.current = 0;
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  }, [options.key]);

  return {
    formData,
    setFormData,
    clearSavedData,
    isLoading,
    save: (dataToSave?: T) => mutation.mutate(dataToSave || formData),
    error
  };
}
