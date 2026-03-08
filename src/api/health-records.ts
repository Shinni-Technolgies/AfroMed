import useSWR from 'swr';
import { useMemo } from 'react';
import { HealthRecord, HealthRecordStats, ApiListResponse } from 'types/models';
import { orgFetcher, API_BASE } from './fetcher';

// ==============================|| API - HEALTH RECORDS ||============================== //

export function useGetHealthRecords() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<ApiListResponse<HealthRecord>>(
    orgId ? `${API_BASE}/health-records` : null,
    orgFetcher
  );

  const memoizedValue = useMemo(
    () => ({
      records: data?.data ?? [],
      recordsTotal: data?.total ?? 0,
      recordsLoading: isLoading,
      recordsError: error
    }),
    [data, error, isLoading]
  );

  return memoizedValue;
}

export function useGetHealthRecordStats() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<HealthRecordStats>(
    orgId ? `${API_BASE}/health-records/stats` : null,
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
