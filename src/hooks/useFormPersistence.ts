
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
  const storageRetryCount = useRef(0);

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
            // Only store the lastSavedRef for comparison
            lastSavedRef.current = JSON.stringify({
              id: sssp.id,
              version: sssp.version,
              updated_at: sssp.updated_at
            });
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
      storageRetryCount.current = 0;
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  }, [options.key, options.initialData]);

  const clearOldData = useCallback(() => {
    const keys = Object.keys(localStorage);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    keys.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const data = JSON.parse(item);
          if (data.lastModified && new Date(data.lastModified) < oneWeekAgo) {
            localStorage.removeItem(key);
          }
        }
      } catch (e) {
        // If we can't parse the item, it's probably safe to remove it
        localStorage.removeItem(key);
      }
    });
  }, []);

  useEffect(() => {
    if (data && !isLoading) {
      const updateStorage = () => {
        try {
          // Store minimal data for draft state
          const minimalData = {
            id: data.id,
            title: data.title,
            lastModified: new Date().toISOString(),
            isDraft: true
          };
          
          const storageStr = JSON.stringify(minimalData);
          
          // Check if the data is actually different before storing
          const currentStored = localStorage.getItem(options.key);
          if (currentStored !== storageStr) {
            localStorage.setItem(options.key, storageStr);
            lastSavedRef.current = JSON.stringify(data);
            storageRetryCount.current = 0;
          }
        } catch (error) {
          console.warn('Storage error:', error);
          
          // If we hit quota, try to clear space and retry once
          if (error instanceof Error && error.name === 'QuotaExceededError' && storageRetryCount.current < 1) {
            clearOldData();
            storageRetryCount.current++;
            updateStorage(); // Retry storage operation
          } else {
            console.error('Failed to save to localStorage after cleanup:', error);
            // Notify user that their progress might not be saved locally
            toast({
              variant: "destructive",
              title: "Storage Warning",
              description: "Unable to save progress locally. Your changes will only be saved when you submit the form."
            });
          }
        }
      };

      updateStorage();
    }
  }, [data, options.key, isLoading, toast, clearOldData]);

  const updateFormData = useCallback((newData: T) => {
    setData((prevData) => {
      // Only update if data has actually changed
      if (JSON.stringify(newData) !== JSON.stringify(prevData)) {
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
