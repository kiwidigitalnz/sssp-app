
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface FormPersistenceOptions {
  key: string;
  initialData?: any;
}

export function useFormPersistence<T>(options: FormPersistenceOptions) {
  const [data, setData] = useState<T>(() => {
    const savedData = localStorage.getItem(options.key);
    console.log('Initial form data from localStorage:', savedData ? JSON.parse(savedData) : options.initialData);
    return savedData ? JSON.parse(savedData) : options.initialData;
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // If the key is a UUID, it's an existing SSSP, so fetch from Supabase
  useEffect(() => {
    const fetchSSSP = async () => {
      if (options.key && options.key.match(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/)) {
        try {
          const { data: sssp, error } = await supabase
            .from('sssps')
            .select('*')
            .eq('id', options.key)
            .single();

          if (error) throw error;
          
          console.log('Fetched SSSP data from Supabase:', sssp);
          setData(sssp);
        } catch (error) {
          console.error('Error fetching SSSP:', error);
          toast({
            variant: "destructive",
            title: "Error loading SSSP",
            description: "There was a problem loading the SSSP data."
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchSSSP();
  }, [options.key]);

  const clearSavedData = () => {
    localStorage.removeItem(options.key);
    setData(options.initialData);
  };

  useEffect(() => {
    if (data && !isLoading) {
      console.log('Saving form data to localStorage:', data);
      localStorage.setItem(options.key, JSON.stringify(data));
    }
  }, [data, options.key, isLoading]);

  return {
    formData: data,
    setFormData: setData,
    clearSavedData,
    isLoading
  };
}
