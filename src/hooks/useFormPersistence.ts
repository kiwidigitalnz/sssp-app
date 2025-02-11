
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

  if (error) throw error;
  return data;
}

export function useFormPersistence<T extends Partial<SSSP>>(options: FormPersistenceOptions) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const lastSavedRef = useRef<string | null>(null);
  const storageRetryCount = useRef(0);

  // Use React Query for data fetching and caching
  const { data, isLoading, error } = useQuery({
    queryKey: ['sssp', options.key],
    queryFn: () => options.key.match(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/) 
      ? fetchSSSP(options.key)
      : Promise.resolve(options.initialData),
    staleTime: 30000, // Consider data fresh for 30 seconds
    cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const [formData, setFormData] = useState<T>(() => {
    if (data) return data as T;
    if (options.initialData) return options.initialData;
    
    try {
      const savedData = localStorage.getItem(options.key);
      return savedData ? JSON.parse(savedData) : options.initialData;
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return options.initialData;
    }
  });

  // Mutation for saving form data
  const mutation = useMutation({
    mutationFn: async (newData: T) => {
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
    onError: (error) => {
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
    setFormData((prevData) => {
      if (JSON.stringify(newData) !== JSON.stringify(prevData)) {
        // Store minimal data for draft state
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

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: error.message || "There was an error loading your data",
      });
    }
  }, [error, toast]);

  return {
    formData,
    setFormData: updateFormData,
    clearSavedData,
    isLoading,
    save: () => mutation.mutate(formData),
    error
  };
}
