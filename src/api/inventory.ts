import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import { InventoryItem, InventoryRoom, MaintenanceLog, InventoryStats, ApiListResponse } from 'types/models';
import { orgFetcher, API_BASE } from './fetcher';

// ==============================|| API - INVENTORY ||============================== //

// ---- Inventory Items (Assets) ----

export function useGetInventoryItems() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<ApiListResponse<InventoryItem>>(
    orgId ? `${API_BASE}/inventory/items` : null,
    orgFetcher
  );

  return useMemo(
    () => ({
      items: data?.data ?? [],
      itemsTotal: data?.total ?? 0,
      itemsLoading: isLoading,
      itemsError: error
    }),
    [data, error, isLoading]
  );
}

export async function createInventoryItem(body: Partial<InventoryItem>) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/inventory/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/inventory/items`);
  mutate(`${API_BASE}/inventory/stats`);
  return result;
}

export async function updateInventoryItem(id: string, body: Partial<InventoryItem>) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/inventory/items/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/inventory/items`);
  mutate(`${API_BASE}/inventory/stats`);
  return result;
}

// ---- Inventory Rooms ----

export function useGetInventoryRooms() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<ApiListResponse<InventoryRoom>>(
    orgId ? `${API_BASE}/inventory/rooms` : null,
    orgFetcher
  );

  return useMemo(
    () => ({
      rooms: data?.data ?? [],
      roomsTotal: data?.total ?? 0,
      roomsLoading: isLoading,
      roomsError: error
    }),
    [data, error, isLoading]
  );
}

export async function createInventoryRoom(body: Partial<InventoryRoom>) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/inventory/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/inventory/rooms`);
  mutate(`${API_BASE}/inventory/stats`);
  return result;
}

export async function updateInventoryRoom(id: string, body: Partial<InventoryRoom>) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/inventory/rooms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/inventory/rooms`);
  mutate(`${API_BASE}/inventory/stats`);
  return result;
}

// ---- Maintenance Logs ----

export function useGetMaintenanceLogs() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<ApiListResponse<MaintenanceLog>>(
    orgId ? `${API_BASE}/inventory/maintenance` : null,
    orgFetcher
  );

  return useMemo(
    () => ({
      logs: data?.data ?? [],
      logsTotal: data?.total ?? 0,
      logsLoading: isLoading,
      logsError: error
    }),
    [data, error, isLoading]
  );
}

export async function createMaintenanceLog(body: Partial<MaintenanceLog>) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/inventory/maintenance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/inventory/maintenance`);
  mutate(`${API_BASE}/inventory/stats`);
  return result;
}

export async function updateMaintenanceLog(id: string, body: Partial<MaintenanceLog>) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/inventory/maintenance/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/inventory/maintenance`);
  mutate(`${API_BASE}/inventory/stats`);
  return result;
}

// ---- Stats ----

export function useGetInventoryStats() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<InventoryStats>(
    orgId ? `${API_BASE}/inventory/stats` : null,
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
