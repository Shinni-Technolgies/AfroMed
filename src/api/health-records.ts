import useSWR from 'swr';
import { useMemo } from 'react';
import { HealthRecord, HealthRecordStats, ApiListResponse } from 'types/models';

// ==============================|| API - HEALTH RECORDS ||============================== //

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetHealthRecords() {
  const { data, error, isLoading } = useSWR<ApiListResponse<HealthRecord>>(
    `${API_BASE}/health-records`,
    fetcher
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
  const { data, error, isLoading } = useSWR<HealthRecordStats>(`${API_BASE}/health-records/stats`, fetcher);

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
