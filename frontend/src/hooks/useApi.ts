import { useState, useCallback } from 'react';
import { api, ApiError } from '@/utils/api';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'An unexpected error occurred';
      
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export function useAllocation() {
  const { data, loading, error, execute, reset } = useApi();

  const runAllocation = useCallback(() => {
    return execute(() => api.runAllocation());
  }, [execute]);

  const getAllocations = useCallback(() => {
    return execute(() => api.getAllocations());
  }, [execute]);

  const exportAllocations = useCallback(async () => {
    try {
      const blob = await api.exportAllocations();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'allocations.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    data,
    loading,
    error,
    runAllocation,
    getAllocations,
    exportAllocations,
    reset,
  };
}

export function useUpload() {
  const { data, loading, error, execute, reset } = useApi();

  const uploadStudents = useCallback((file: File) => {
    return execute(() => api.uploadStudents(file));
  }, [execute]);

  const uploadCompanies = useCallback((file: File) => {
    return execute(() => api.uploadCompanies(file));
  }, [execute]);

  return {
    data,
    loading,
    error,
    uploadStudents,
    uploadCompanies,
    reset,
  };
}
