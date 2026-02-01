"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";

interface UseApiOptions {
  immediate?: boolean;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setData: (data: T) => void;
}

export function useApi<T>(url: string | null, options: UseApiOptions = {}): UseApiResult<T> {
  const { fetchWithAuth } = useAuth();
  const { immediate = true } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchWithAuth(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result.data || result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, fetchWithAuth]);

  useEffect(() => {
    if (immediate && url) {
      fetchData();
    }
  }, [url, immediate, fetchData]);

  return { data, loading, error, refetch: fetchData, setData };
}

export function useApiMutation<T, R = T>() {
  const { fetchWithAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (url: string, method: string, body?: unknown): Promise<R | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchWithAuth(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${method.toLowerCase()}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data || result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchWithAuth]);

  return { mutate, loading, error };
}
