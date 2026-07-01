"use client";

import * as React from "react";

export interface AsyncDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Repository çağrılarını client component'lerde yüklemek için ortak hook.
 * Sunucuda seed, tarayıcıda localStorage verisi gelir (bkz. repository katmanı).
 */
export function useAsyncData<T>(
  loader: () => Promise<T>,
  deps: React.DependencyList,
): AsyncDataState<T> {
  const [state, setState] = React.useState<AsyncDataState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  React.useEffect(() => {
    let active = true;
    loader()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            data: null,
            loading: false,
            error:
              error instanceof Error ? error.message : "Bir hata oluştu.",
          });
        }
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
