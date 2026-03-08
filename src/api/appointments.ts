import useSWR from 'swr';
import { useMemo } from 'react';
import { Appointment, AppointmentStats, ApiListResponse } from 'types/models';
import { orgFetcher, API_BASE } from './fetcher';

// ==============================|| API - APPOINTMENTS ||============================== //

export function useGetAppointments() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<ApiListResponse<Appointment>>(
    orgId ? `${API_BASE}/appointments` : null,
    orgFetcher
  );

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
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<AppointmentStats>(
    orgId ? `${API_BASE}/appointments/stats` : null,
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
