
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { SSSP } from '@/types/sssp';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logActivity } from "@/utils/activityLogging";

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
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (newData: T) => {
      if (options.key.match(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/)) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { error } = await supabase
          .from('sssps')
          .update(newData)
          .eq('id', options.key);
        
        if (error) throw error;

        await logActivity(options.key, 'updated', user.id, {
          updated_fields: Object.keys(newData)
        });
      }
      return newData;
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
    save: () => mutation.mutate(formData),
    error
  };
}
