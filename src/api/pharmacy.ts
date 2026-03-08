import useSWR from 'swr';
import { useMemo } from 'react';
import { Medication, PharmacyStats, ApiListResponse } from 'types/models';
import { orgFetcher, API_BASE } from './fetcher';

// ==============================|| API - PHARMACY ||============================== //

export function useGetMedications() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<ApiListResponse<Medication>>(
    orgId ? `${API_BASE}/pharmacy/medications` : null,
    orgFetcher
  );

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
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<PharmacyStats>(
    orgId ? `${API_BASE}/pharmacy/stats` : null,
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
