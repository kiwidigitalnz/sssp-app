
import { useState, useEffect, useCallback, useRef } from 'react';
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
    return savedData ? JSON.parse(savedData) : options.initialData;
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const lastSavedRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchSSSP = async () => {
      if (options.key && options.key.match(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/)) {
        try {
          const { data: sssp, error } = await supabase
            .from('sssps')
            .select('*')
            .eq('id', options.key)
            .maybeSingle();

          if (error) throw error;
          
          if (sssp) {
            setData((sssp as unknown) as T);
            lastSavedRef.current = JSON.stringify(sssp);
          } else {
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
    lastSavedRef.current = null;
  }, [options.key, options.initialData]);

  useEffect(() => {
    if (data && !isLoading) {
      const currentData = JSON.stringify(data);
      if (currentData !== lastSavedRef.current) {
        localStorage.setItem(options.key, currentData);
        lastSavedRef.current = currentData;
      }
    }
  }, [data, options.key, isLoading]);

  const updateFormData = useCallback((newData: T) => {
    setData((prevData) => {
      const newDataString = JSON.stringify(newData);
      if (newDataString !== lastSavedRef.current) {
        return newData;
      }
      return prevData;
    });
  }, []);

  return {
    formData: data,
    setFormData: updateFormData,
    clearSavedData,
    isLoading
  };
}
