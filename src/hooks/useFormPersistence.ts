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
    if (options.initialData) return options.initialData;
    
    try {
      const savedData = localStorage.getItem(options.key);
      return savedData ? JSON.parse(savedData) : options.initialData;
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return options.initialData;
    }
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
            // Don't store the full SSSP in localStorage, just keep track of last saved state
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
    try {
      localStorage.removeItem(options.key);
      setData(options.initialData);
      lastSavedRef.current = null;
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  }, [options.key, options.initialData]);

  useEffect(() => {
    if (data && !isLoading) {
      const currentData = JSON.stringify(data);
      if (currentData !== lastSavedRef.current) {
        try {
          // Only store a minimal version of the data for draft/temporary purposes
          const minimalData = {
            id: data.id,
            title: data.title,
            lastModified: new Date().toISOString(),
            isDraft: true
          };
          localStorage.setItem(options.key, JSON.stringify(minimalData));
          lastSavedRef.current = currentData;
        } catch (error) {
          console.warn('Error writing to localStorage:', error);
          // If we hit quota, clear old data
          try {
            localStorage.clear();
            localStorage.setItem(options.key, JSON.stringify({
              id: data.id,
              title: data.title,
              lastModified: new Date().toISOString(),
              isDraft: true
            }));
          } catch (secondError) {
            console.error('Failed to write to localStorage even after clearing:', secondError);
          }
        }
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
