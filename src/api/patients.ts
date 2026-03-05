import useSWR from 'swr';
import { useMemo } from 'react';
import { Patient, PatientStats, ApiListResponse } from 'types/models';

// ==============================|| API - PATIENTS ||============================== //

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetPatients() {
  const { data, error, isLoading } = useSWR<ApiListResponse<Patient>>(`${API_BASE}/patients`, fetcher);

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
  const { data, error, isLoading } = useSWR<PatientStats>(`${API_BASE}/patients/stats`, fetcher);

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
