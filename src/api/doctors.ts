import useSWR from 'swr';
import { useMemo } from 'react';
import { Doctor, DoctorStats, ApiListResponse } from 'types/models';

// ==============================|| API - DOCTORS ||============================== //

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetDoctors() {
  const { data, error, isLoading } = useSWR<ApiListResponse<Doctor>>(`${API_BASE}/doctors`, fetcher);

  const memoizedValue = useMemo(
    () => ({
      doctors: data?.data ?? [],
      doctorsTotal: data?.total ?? 0,
      doctorsLoading: isLoading,
      doctorsError: error
    }),
    [data, error, isLoading]
  );

  return memoizedValue;
}

export function useGetDoctorStats() {
  const { data, error, isLoading } = useSWR<DoctorStats>(`${API_BASE}/doctors/stats`, fetcher);

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
