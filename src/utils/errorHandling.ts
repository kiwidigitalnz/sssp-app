import { toast } from '@/hooks/use-toast';

interface ErrorOptions {
  title?: string;
  context?: string;
}

export function handleError(error: unknown, options: ErrorOptions = {}) {
  console.error(`Error in ${options.context || 'application'}:`, error);

  const errorMessage = error instanceof Error 
    ? error.message 
    : 'An unexpected error occurred';

  toast({
    variant: "destructive",
    title: options.title || "Error",
    description: errorMessage,
  });

  return errorMessage;
}

export function isApiError(error: unknown): error is { message: string; status: number } {
  return typeof error === 'object' && 
         error !== null && 
         'message' in error && 
         'status' in error;
}