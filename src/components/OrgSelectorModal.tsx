import { useState } from 'react';

// material-ui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// project imports
import { useGetOrganizations } from 'api/organizations';
import { useOrg } from 'contexts/OrgContext';

// ==============================|| ORG SELECTOR MODAL ||============================== //

export default function OrgSelectorModal() {
  const { orgId, setOrg } = useOrg();
  const { organizations, organizationsLoading } = useGetOrganizations();
  const [selected, setSelected] = useState('');

  const open = !orgId;

  const handleConfirm = () => {
    const org = organizations.find((o) => o.org_id === selected);
    if (org) {
      setOrg(org.org_id, org.name);
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      disableEscapeKeyDown
      slotProps={{ backdrop: { sx: { backdropFilter: 'blur(4px)' } } }}
    >
      <DialogTitle>
        <Typography variant="h5" component="span">
          Select Organization
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Choose the organization you want to access. All data will be scoped to this selection.
        </Typography>
        {organizationsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TextField
            select
            fullWidth
            label="Organization"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            sx={{ mt: 1 }}
          >
            {organizations.map((org) => (
              <MenuItem key={org.org_id} value={org.org_id}>
                {org.name} {org.city ? `— ${org.city}` : ''}
              </MenuItem>
            ))}
          </TextField>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="contained" disabled={!selected} onClick={handleConfirm} fullWidth>
          Continue to Dashboard
        </Button>
      </DialogActions>
    </Dialog>
  );
}
