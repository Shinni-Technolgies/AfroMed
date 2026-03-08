import useSWR from 'swr';
import { useMemo } from 'react';
import { Doctor, DoctorStats, ApiListResponse } from 'types/models';
import { orgFetcher, API_BASE } from './fetcher';

// ==============================|| API - DOCTORS ||============================== //

export function useGetDoctors() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<ApiListResponse<Doctor>>(
    orgId ? `${API_BASE}/doctors` : null,
    orgFetcher
  );

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
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<DoctorStats>(
    orgId ? `${API_BASE}/doctors/stats` : null,
    orgFetcher
  );

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
