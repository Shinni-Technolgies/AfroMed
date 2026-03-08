import useSWR from 'swr';
import { useMemo } from 'react';
import { Organization, ApiListResponse } from 'types/models';

// ==============================|| API - ORGANIZATIONS ||============================== //

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Organizations endpoint is public — no x-org-id header needed
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetOrganizations() {
  const { data, error, isLoading } = useSWR<ApiListResponse<Organization>>(`${API_BASE}/organizations`, fetcher);

  const memoizedValue = useMemo(
    () => ({
      organizations: data?.data ?? [],
      organizationsTotal: data?.total ?? 0,
      organizationsLoading: isLoading,
      organizationsError: error
    }),
    [data, error, isLoading]
  );

  return memoizedValue;
}
