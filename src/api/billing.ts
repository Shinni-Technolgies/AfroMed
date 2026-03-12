import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import { Invoice, Payment, InvoiceItem, BillingStats, ApiListResponse } from 'types/models';
import { orgFetcher, API_BASE } from './fetcher';

// ==============================|| API - BILLING ||============================== //

// ---- Invoices ----

export function useGetInvoices() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<ApiListResponse<Invoice>>(
    orgId ? `${API_BASE}/billing/invoices` : null,
    orgFetcher
  );

  return useMemo(
    () => ({
      invoices: data?.data ?? [],
      invoicesTotal: data?.total ?? 0,
      invoicesLoading: isLoading,
      invoicesError: error
    }),
    [data, error, isLoading]
  );
}

export async function createInvoice(body: {
  patientId: string;
  departmentId?: string;
  appointmentId?: string;
  invoiceNumber: string;
  status?: string;
  subtotal: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  currency?: string;
  dueDate?: string;
  notes?: string;
  items?: Partial<InvoiceItem>[];
}) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/billing/invoices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/billing/invoices`);
  mutate(`${API_BASE}/billing/stats`);
  return result;
}

export async function updateInvoice(id: string, body: Partial<Invoice>) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/billing/invoices/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/billing/invoices`);
  mutate(`${API_BASE}/billing/stats`);
  return result;
}

export async function updateInvoiceStatus(id: string, status: string) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/billing/invoices/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/billing/invoices`);
  mutate(`${API_BASE}/billing/stats`);
  return result;
}

// ---- Invoice Items ----

export function useGetInvoiceItems(invoiceId: string | null) {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<ApiListResponse<InvoiceItem>>(
    orgId && invoiceId ? `${API_BASE}/billing/invoices/${invoiceId}/items` : null,
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

// ---- Payments ----

export function useGetPayments() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<ApiListResponse<Payment>>(
    orgId ? `${API_BASE}/billing/payments` : null,
    orgFetcher
  );

  return useMemo(
    () => ({
      payments: data?.data ?? [],
      paymentsTotal: data?.total ?? 0,
      paymentsLoading: isLoading,
      paymentsError: error
    }),
    [data, error, isLoading]
  );
}

export async function createPayment(body: {
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  referenceNumber?: string;
  status?: string;
  notes?: string;
}) {
  const orgId = sessionStorage.getItem('org_id');
  const res = await fetch(`${API_BASE}/billing/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-org-id': orgId || '' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  const result = await res.json();
  mutate(`${API_BASE}/billing/payments`);
  mutate(`${API_BASE}/billing/invoices`);
  mutate(`${API_BASE}/billing/stats`);
  return result;
}

// ---- Stats ----

export function useGetBillingStats() {
  const orgId = sessionStorage.getItem('org_id');
  const { data, error, isLoading } = useSWR<BillingStats>(
    orgId ? `${API_BASE}/billing/stats` : null,
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
