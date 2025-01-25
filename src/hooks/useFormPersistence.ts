import { useState, useEffect } from 'react';

export interface FormPersistenceOptions {
  key: string;
  initialData?: any;
}

export function useFormPersistence<T>(options: FormPersistenceOptions) {
  const [data, setData] = useState<T>(() => {
    const savedData = localStorage.getItem(options.key);
    return savedData ? JSON.parse(savedData) : options.initialData;
  });

  useEffect(() => {
    if (data) {
      localStorage.setItem(options.key, JSON.stringify(data));
    }
  }, [data, options.key]);

  return [data, setData] as const;
}