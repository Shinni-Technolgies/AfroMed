import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import { LabTest, LabOrder, LabResult, LabStats, ApiListResponse } from 'types/models';
import { orgFetcher, API_BASE } from './fetcher';

// ==============================|| API - LABORATORY ||============================== //

// ---- Lab Tests (Catalog) ----

export function useGetLabTests() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<ApiListResponse<LabTest>>(
    orgId ? `${API_BASE}/laboratory/tests` : null,
    orgFetcher
  );

  return useMemo(
    () => ({
      tests: data?.data ?? [],
      testsTotal: data?.total ?? 0,
      testsLoading: isLoading,
      testsError: error
    }),
    [data, error, isLoading]
  );
}

export async function createLabTest(body: Partial<LabTest>) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/laboratory/tests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/laboratory/tests`);
  mutate(`${API_BASE}/laboratory/stats`);
  return result;
}

export async function updateLabTest(id: string, body: Partial<LabTest>) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/laboratory/tests/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/laboratory/tests`);
  return result;
}

// ---- Lab Orders ----

export function useGetLabOrders() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<ApiListResponse<LabOrder>>(
    orgId ? `${API_BASE}/laboratory/orders` : null,
    orgFetcher
  );

  return useMemo(
    () => ({
      orders: data?.data ?? [],
      ordersTotal: data?.total ?? 0,
      ordersLoading: isLoading,
      ordersError: error
    }),
    [data, error, isLoading]
  );
}

export async function createLabOrder(body: {
  patientId: string;
  orderedBy: string;
  appointmentId?: string;
  testId: string;
  priority?: string;
  notes?: string;
}) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/laboratory/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/laboratory/orders`);
  mutate(`${API_BASE}/laboratory/stats`);
  return result;
}

export async function updateLabOrderStatus(id: string, status: string) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/laboratory/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/laboratory/orders`);
  mutate(`${API_BASE}/laboratory/stats`);
  return result;
}

// ---- Lab Results ----

export function useGetLabResults() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<ApiListResponse<LabResult>>(
    orgId ? `${API_BASE}/laboratory/results` : null,
    orgFetcher
  );

  return useMemo(
    () => ({
      results: data?.data ?? [],
      resultsTotal: data?.total ?? 0,
      resultsLoading: isLoading,
      resultsError: error
    }),
    [data, error, isLoading]
  );
}

export async function createLabResult(body: {
  orderId: string;
  resultValue: string;
  unit?: string;
  referenceRange?: string;
  isAbnormal?: boolean;
  performedBy?: string;
  verifiedBy?: string;
  notes?: string;
}) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/laboratory/results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/laboratory/results`);
  mutate(`${API_BASE}/laboratory/orders`);
  mutate(`${API_BASE}/laboratory/stats`);
  return result;
}

export async function updateLabResult(id: string, body: Partial<LabResult>) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/laboratory/results/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/laboratory/results`);
  return result;
}

// ---- Stats ----

export function useGetLabStats() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<LabStats>(
    orgId ? `${API_BASE}/laboratory/stats` : null,
    orgFetcher
  );

  return useMemo(
    () => ({
      stats: data ?? null,
      statsLoading: isLoading,
      statsError: error
    }),
    [data, error, isLoading]
  );
}
