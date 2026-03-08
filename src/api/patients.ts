import useSWR from 'swr';
import { useMemo } from 'react';
import { Patient, PatientStats, ApiListResponse } from 'types/models';
import { orgFetcher, API_BASE } from './fetcher';

// ==============================|| API - PATIENTS ||============================== //

export function useGetPatients() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<ApiListResponse<Patient>>(
    orgId ? `${API_BASE}/patients` : null,
    orgFetcher
  );

  const memoizedValue = useMemo(
    () => ({
      patients: data?.data ?? [],
      patientsTotal: data?.total ?? 0,
      patientsLoading: isLoading,
      patientsError: error
    }),
    [data, error, isLoading]
  );

  return memoizedValue;
}

export function useGetPatientStats() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<PatientStats>(
    orgId ? `${API_BASE}/patients/stats` : null,
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
