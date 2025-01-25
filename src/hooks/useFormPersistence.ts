import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface FormPersistenceOptions {
  key: string;
  initialData?: any;
  onLoad?: (data: any) => void;
  onSave?: (data: any) => void;
}

export function useFormPersistence({
  key,
  initialData = {},
  onLoad,
  onSave,
}: FormPersistenceOptions) {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedData = localStorage.getItem(key);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);
          onLoad?.(parsedData);
          toast({
            title: "Form data restored",
            description: "Your previous progress has been loaded",
          });
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load saved form data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedData();
  }, [key, onLoad, toast]);

  const saveFormData = (newData: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(newData));
      setFormData(newData);
      onSave?.(newData);
    } catch (error) {
      console.error('Error saving form data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save form data",
      });
    }
  };

  const clearSavedData = () => {
    try {
      localStorage.removeItem(key);
      setFormData(initialData);
      toast({
        title: "Form data cleared",
        description: "All saved progress has been cleared",
      });
    } catch (error) {
      console.error('Error clearing form data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear form data",
      });
    }
  };

  return {
    formData,
    setFormData: saveFormData,
    clearSavedData,
    isLoading
  };
}