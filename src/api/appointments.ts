import useSWR from 'swr';
import { useMemo } from 'react';
import { Appointment, AppointmentStats, ApiListResponse } from 'types/models';

// ==============================|| API - APPOINTMENTS ||============================== //

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetAppointments() {
  const { data, error, isLoading } = useSWR<ApiListResponse<Appointment>>(`${API_BASE}/appointments`, fetcher);

  const memoizedValue = useMemo(
    () => ({
      appointments: data?.data ?? [],
      appointmentsTotal: data?.total ?? 0,
      appointmentsLoading: isLoading,
      appointmentsError: error
    }),
    [data, error, isLoading]
  );

  return memoizedValue;
}

export function useGetAppointmentStats() {
  const { data, error, isLoading } = useSWR<AppointmentStats>(`${API_BASE}/appointments/stats`, fetcher);

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
