
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { SSSP } from '@/types/sssp';

export interface FormPersistenceOptions {
  key: string;
  initialData?: any;
}

export function useFormPersistence<T extends Partial<SSSP>>(options: FormPersistenceOptions) {
  const [data, setData] = useState<T>(() => {
    const savedData = localStorage.getItem(options.key);
    console.log('Initial form data from localStorage:', savedData ? JSON.parse(savedData) : options.initialData);
    return savedData ? JSON.parse(savedData) : options.initialData;
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // If the key is a UUID, it's an existing SSSP, so fetch from Supabase
  useEffect(() => {
    const fetchSSSP = async () => {
      if (options.key && options.key.match(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/)) {
        try {
          console.log('Fetching SSSP with ID:', options.key);
          const { data: sssp, error } = await supabase
            .from('sssps')
            .select('*')
            .eq('id', options.key)
            .maybeSingle();

          if (error) throw error;
          
          if (sssp) {
            console.log('Fetched SSSP data from Supabase:', sssp);
            setData(sssp as Partial<SSSP> as T);
          } else {
            console.log('No SSSP found with ID:', options.key);
            toast({
              variant: "destructive",
              title: "SSSP not found",
              description: "The requested SSSP could not be found."
            });
          }
        } catch (error: any) {
          console.error('Error fetching SSSP:', error);
          toast({
            variant: "destructive",
            title: "Error loading SSSP",
            description: error.message || "There was a problem loading the SSSP data."
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchSSSP();
  }, [options.key, toast]);

  const clearSavedData = useCallback(() => {
    localStorage.removeItem(options.key);
    setData(options.initialData);
    setLastSaved(null);
  }, [options.key, options.initialData]);

  useEffect(() => {
    if (data && !isLoading) {
      const currentData = JSON.stringify(data);
      if (currentData !== lastSaved) {
        console.log('Saving form data to localStorage:', data);
        localStorage.setItem(options.key, currentData);
        setLastSaved(currentData);
      }
    }
  }, [data, options.key, isLoading, lastSaved]);

  const updateFormData = useCallback((newData: T) => {
    setData(newData);
  }, []);

  return {
    formData: data,
    setFormData: updateFormData,
    clearSavedData,
    isLoading
  };
}
