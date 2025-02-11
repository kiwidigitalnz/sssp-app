
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { SSSP } from '@/types/sssp';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

  // Transform empty strings to undefined for better form handling
  const transformedData = Object.entries(data).reduce((acc, [key, value]) => {
    acc[key] = value === '' ? undefined : value;
    return acc;
  }, {} as Record<string, any>);

  // Ensure arrays are properly initialized
  const arrayFields = ['hazards', 'emergency_contacts', 'required_training', 'meetings_schedule'];
  arrayFields.forEach(field => {
    if (!transformedData[field]) {
      transformedData[field] = [];
    }
  });

  // Ensure monitoring_review object is properly structured
  if (!transformedData.monitoring_review) {
    transformedData.monitoring_review = {
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
    };
  }

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
      console.log('Initializing form data from query:', data);
      return data as T;
    }
    
    if (options.initialData) {
      console.log('Initializing form data from initialData:', options.initialData);
      return options.initialData;
    }
    
    try {
      const savedData = localStorage.getItem(options.key);
      if (savedData) {
        console.log('Initializing form data from localStorage:', JSON.parse(savedData));
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
    }
    
    console.log('Initializing empty form data');
    return {} as T;
  });

  // Update form data when query data changes
  useEffect(() => {
    if (data) {
      console.log('Updating form data from query:', data);
      setFormData(data as T);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (newData: T) => {
      console.log('Saving form data:', newData);
      if (options.key.match(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/)) {
        const { error } = await supabase
          .from('sssps')
          .update(newData)
          .eq('id', options.key);
        
        if (error) throw error;
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

  const updateFormData = useCallback((newData: T) => {
    console.log('Updating form data:', newData);
    setFormData((prevData) => {
      if (JSON.stringify(newData) !== JSON.stringify(prevData)) {
        try {
          const minimalData = {
            id: newData.id,
            title: newData.title,
            lastModified: new Date().toISOString(),
            isDraft: true
          };
          
          localStorage.setItem(options.key, JSON.stringify(minimalData));
        } catch (error) {
          console.warn('Storage error:', error);
        }
        return newData;
      }
      return prevData;
    });
  }, [options.key]);

  return {
    formData,
    setFormData: updateFormData,
    clearSavedData,
    isLoading,
    save: () => mutation.mutate(formData),
    error
  };
}
