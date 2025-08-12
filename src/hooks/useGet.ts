"use client";

import { useCallback, useEffect, useState } from "react";

export function useGet<T>(endpoint: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!endpoint) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.statusText}`);
      }

      const result = await res.json();
      setData(result as T);
    } catch (error) {
      setError(
        error instanceof Error
          ? error
          : new Error("Ocorreu um erro desconhecido")
      );
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData, setData };
}
