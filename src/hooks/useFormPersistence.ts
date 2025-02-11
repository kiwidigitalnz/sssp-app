
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import type { SSSP } from '@/types/sssp';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface FormPersistenceOptions {
  key: string;
  initialData?: any;
}

async function fetchSSSP(id: string) {
  const { data, error } = await supabase
    .from('sssps')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export function useFormPersistence<T extends Partial<SSSP>>(options: FormPersistenceOptions) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const lastSavedRef = useRef<string | null>(null);
  const storageRetryCount = useRef(0);

  // Use React Query for data fetching and caching
  const { data, isLoading, error } = useQuery({
    queryKey: ['sssp', options.key],
    queryFn: () => options.key.match(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/) 
      ? fetchSSSP(options.key)
      : Promise.resolve(options.initialData),
    staleTime: 