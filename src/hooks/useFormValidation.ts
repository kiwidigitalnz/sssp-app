import { useState } from 'react';
import { ZodSchema, z } from 'zod';

export function useFormValidation<T>(schema: ZodSchema) {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validate = (data: unknown): data is T => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.reduce((acc, curr) => {
          const path = curr.path[0] as keyof T;
          acc[path] = curr.message;
          return acc;
        }, {} as Partial<Record<keyof T, string>>);
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  return { errors, validate };
}