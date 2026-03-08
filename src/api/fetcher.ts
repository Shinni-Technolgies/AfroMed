// ==============================|| API - ORG-SCOPED FETCHER ||============================== //

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * SWR-compatible fetcher that automatically attaches the x-org-id header
 * from sessionStorage for multi-tenant RLS filtering.
 */
export function orgFetcher(url: string) {
  const orgId = sessionStorage.getItem('org_id');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (orgId) {
    headers['x-org-id'] = orgId;
  }
  return fetch(url, { headers }).then((res) => {
    if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
    return res.json();
  });
}

export { API_BASE };
