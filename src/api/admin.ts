import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import { AdminUser, AdminRole, AdminDepartment, AdminStats, ApiListResponse } from 'types/models';
import { orgFetcher, API_BASE } from './fetcher';

// ==============================|| API - ADMIN ||============================== //

// ---- Users ----

export function useGetAdminUsers() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<ApiListResponse<AdminUser>>(
    orgId ? `${API_BASE}/admin/users` : null,
    orgFetcher
  );

  return useMemo(
    () => ({
      users: data?.data ?? [],
      usersTotal: data?.total ?? 0,
      usersLoading: isLoading,
      usersError: error
    }),
    [data, error, isLoading]
  );
}

export async function createAdminUser(body: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  jobTitle?: string;
  licenseNumber?: string;
  specialization?: string;
  departmentId?: string;
  roleIds?: string[];
}) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/admin/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/admin/users`);
  mutate(`${API_BASE}/admin/stats`);
  return result;
}

export async function updateAdminUser(
  id: string,
  body: {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    jobTitle?: string;
    licenseNumber?: string;
    specialization?: string;
    departmentId?: string;
    isActive?: boolean;
    roleIds?: string[];
  }
) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/admin/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/admin/users`);
  mutate(`${API_BASE}/admin/stats`);
  return result;
}

// ---- Roles ----

export function useGetAdminRoles() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<ApiListResponse<AdminRole>>(
    orgId ? `${API_BASE}/admin/roles` : null,
    orgFetcher
  );

  return useMemo(
    () => ({
      roles: data?.data ?? [],
      rolesTotal: data?.total ?? 0,
      rolesLoading: isLoading,
      rolesError: error
    }),
    [data, error, isLoading]
  );
}

export async function createAdminRole(body: { name: string; description?: string }) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/admin/roles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/admin/roles`);
  mutate(`${API_BASE}/admin/stats`);
  return result;
}

export async function updateAdminRole(id: string, body: { name?: string; description?: string; isActive?: boolean }) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/admin/roles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/admin/roles`);
  return result;
}

// ---- Departments ----

export function useGetAdminDepartments() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<ApiListResponse<AdminDepartment>>(
    orgId ? `${API_BASE}/admin/departments` : null,
    orgFetcher
  );

  return useMemo(
    () => ({
      departments: data?.data ?? [],
      departmentsTotal: data?.total ?? 0,
      departmentsLoading: isLoading,
      departmentsError: error
    }),
    [data, error, isLoading]
  );
}

export async function createAdminDepartment(body: { name: string; description?: string; phone?: string }) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/admin/departments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/admin/departments`);
  mutate(`${API_BASE}/admin/stats`);
  return result;
}

export async function updateAdminDepartment(id: string, body: { name?: string; description?: string; phone?: string; isActive?: boolean }) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/admin/departments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/admin/departments`);
  return result;
}

// ---- Stats ----

export function useGetAdminStats() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<AdminStats>(
    orgId ? `${API_BASE}/admin/stats` : null,
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
