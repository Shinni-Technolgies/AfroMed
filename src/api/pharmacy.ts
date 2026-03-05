import useSWR from 'swr';
import { useMemo } from 'react';
import { Medication, PharmacyStats, ApiListResponse } from 'types/models';

// ==============================|| API - PHARMACY ||============================== //

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetMedications() {
  const { data, error, isLoading } = useSWR<ApiListResponse<Medication>>(`${API_BASE}/pharmacy/medications`, fetcher);

  const memoizedValue = useMemo(
    () => ({
      medications: data?.data ?? [],
      medicationsTotal: data?.total ?? 0,
      medicationsLoading: isLoading,
      medicationsError: error
    }),
    [data, error, isLoading]
  );

  return memoizedValue;
}

export function useGetPharmacyStats() {
  const { data, error, isLoading } = useSWR<PharmacyStats>(`${API_BASE}/pharmacy/stats`, fetcher);

  const memoizedValue = useMemo(
    () => ({
      stats: data ?? null,
      statsLoading: isLoading,
      statsError: error
    }),
    [data, error, isLoading]
  );

  return memoizedValue;
}
