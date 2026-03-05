import { useState, useMemo } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import Dot from 'components/@extended/Dot';
import { useGetPatients, useGetPatientStats } from 'api/patients';

// types
import { Patient } from 'types/models';

// assets
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

// ==============================|| PATIENTS PAGE ||============================== //

const headCells = [
  { id: 'id', align: 'left' as const, label: 'Patient ID' },
  { id: 'name', align: 'left' as const, label: 'Name' },
  { id: 'age', align: 'right' as const, label: 'Age' },
  { id: 'gender', align: 'left' as const, label: 'Gender' },
  { id: 'contact', align: 'left' as const, label: 'Contact' },
  { id: 'status', align: 'left' as const, label: 'Status' },
  { id: 'lastVisit', align: 'left' as const, label: 'Last Visit' }
];

function PatientStatus({ status }: { status: Patient['status'] }) {
  let color: 'success' | 'warning' | 'error';
  switch (status) {
    case 'Active':
      color = 'success';
      break;
    case 'Discharged':
      color = 'warning';
      break;
    case 'Critical':
      color = 'error';
      break;
    default:
      color = 'success';
  }

  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={color} />
      <Typography>{status}</Typography>
    </Stack>
  );
}

export default function PatientsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { patients, patientsLoading } = useGetPatients();
  const { stats, statsLoading } = useGetPatientStats();

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        search === '' ||
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || patient.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [patients, search, statusFilter]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 - header */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">Patients</Typography>
          <Button variant="contained" startIcon={<PlusOutlined />}>
            Add Patient
          </Button>
        </Stack>
      </Grid>

      {/* row 2 - stat cards */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Total Patients"
          count={statsLoading ? '—' : String(stats?.totalPatients ?? 0)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="New This Month"
          count={statsLoading ? '—' : String(stats?.newThisMonth ?? 0)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Active Cases"
          count={statsLoading ? '—' : String(stats?.activeCases ?? 0)}
          color="warning"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Discharged"
          count={statsLoading ? '—' : String(stats?.discharged ?? 0)}
          color="success"
        />
      </Grid>

      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />

      {/* row 3 - patient list */}
      <Grid size={12}>
        <MainCard title="Patient List" content={false}>
          <Box sx={{ px: 3, pt: 2, pb: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
              <TextField
                placeholder="Search by name or ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                sx={{ minWidth: 260 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlined />
                      </InputAdornment>
                    )
                  }
                }}
              />
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Discharged">Discharged</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
          <TableContainer
            sx={{
              width: '100%',
              overflowX: 'auto',
              position: 'relative',
              display: 'block',
              maxWidth: '100%',
              '& td, & th': { whiteSpace: 'nowrap' }
            }}
          >
            <Table aria-labelledby="patientsTable">
              <TableHead>
                <TableRow>
                  {headCells.map((cell) => (
                    <TableCell key={cell.id} align={cell.align}>
                      {cell.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {patientsLoading && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress size={32} sx={{ my: 2 }} />
                    </TableCell>
                  </TableRow>
                )}
                {!patientsLoading && filteredPatients.map((row) => (
                  <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell align="right">{row.age}</TableCell>
                    <TableCell>{row.gender}</TableCell>
                    <TableCell>{row.contact}</TableCell>
                    <TableCell>
                      <PatientStatus status={row.status} />
                    </TableCell>
                    <TableCell>{row.lastVisit}</TableCell>
                  </TableRow>
                ))}
                {!patientsLoading && filteredPatients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary" sx={{ py: 2 }}>
                        No patients found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>
    </Grid>
  );
}
