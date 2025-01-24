import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useFormPersistence = (formId: string, initialData: any = {}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved form data on mount
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedData = localStorage.getItem(`sssp-form-${formId}`);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setFormData(parsedData);
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
  }, [formId, toast]);

  // Autosave form data
  const saveFormData = (newData: any) => {
    try {
      localStorage.setItem(`sssp-form-${formId}`, JSON.stringify(newData));
      setFormData(newData);
    } catch (error) {
      console.error('Error saving form data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save form data",
      });
    }
  };

  // Clear saved form data
  const clearSavedData = () => {
    try {
      localStorage.removeItem(`sssp-form-${formId}`);
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
};