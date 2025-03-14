import { useState, useCallback } from 'react';

import { ApiOptions, ApiState } from '@/types/hook';
/**
 * Custom hook for handling API requests
 * 
 * @param initialData Initial data state
 * @param options API options including success and error callbacks
 * @returns API state and request handlers
 */
export function useApi<T>(initialData: T | null = null, options: ApiOptions = {}) {
  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
  });

  const { onSuccess, onError } = options;

  const request = useCallback(
    async <R = T>(
      apiCall: () => Promise<R>,
      transformResponse?: (data: R) => T
    ): Promise<R | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const response = await apiCall();
        
        // Transform response if needed
        const transformedData = transformResponse
          ? transformResponse(response)
          : (response as unknown as T);
        
        setState({
          data: transformedData,
          isLoading: false,
          error: null,
        });
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(transformedData);
        }
        
        return response;
      } catch (error) {
        const errorObject = error instanceof Error ? error : new Error(String(error));
        
        setState({
          data: state.data,
          isLoading: false,
          error: errorObject,
        });
        
        // Call onError callback if provided
        if (onError) {
          onError(errorObject);
        }
        
        return null;
      }
    },
    [onSuccess, onError, state.data]
  );

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      isLoading: false,
      error: null,
    });
  }, [initialData]);

  return {
    ...state,
    request,
    setData,
    reset,
  };
} 