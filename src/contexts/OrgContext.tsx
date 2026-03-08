import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

// ==============================|| ORG CONTEXT - MULTI-TENANT ||============================== //

interface OrgContextType {
  orgId: string | null;
  orgName: string | null;
  setOrg: (orgId: string, orgName: string) => void;
  clearOrg: () => void;
}

const OrgContext = createContext<OrgContextType>({
  orgId: null,
  orgName: null,
  setOrg: () => {},
  clearOrg: () => {}
});

export function OrgProvider({ children }: { children: ReactNode }) {
  const [orgId, setOrgId] = useState<string | null>(() => sessionStorage.getItem('org_id'));
  const [orgName, setOrgName] = useState<string | null>(() => sessionStorage.getItem('org_name'));

  const setOrg = useCallback((id: string, name: string) => {
    sessionStorage.setItem('org_id', id);
    sessionStorage.setItem('org_name', name);
    setOrgId(id);
    setOrgName(name);
  }, []);

  const clearOrg = useCallback(() => {
    sessionStorage.removeItem('org_id');
    sessionStorage.removeItem('org_name');
    setOrgId(null);
    setOrgName(null);
  }, []);

  const value = useMemo(() => ({ orgId, orgName, setOrg, clearOrg }), [orgId, orgName, setOrg, clearOrg]);

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
}

export function useOrg() {
  return useContext(OrgContext);
}

export default OrgContext;
