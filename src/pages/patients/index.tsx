import { useState, useMemo } from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import Dot from 'components/@extended/Dot';
import { useGetPatients, useGetPatientStats } from 'api/patients';

// types
import { Patient } from 'types/models';

// assets
import {
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  AlertOutlined,
  TeamOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons';

// ==============================|| PATIENTS PAGE ||============================== //

const headCells = [
  { id: 'expand', align: 'left' as const, label: '' },
  { id: 'name', align: 'left' as const, label: 'Name' },
  { id: 'age', align: 'right' as const, label: 'Age' },
  { id: 'gender', align: 'left' as const, label: 'Gender' },
  { id: 'contact', align: 'left' as const, label: 'Contact' },
  { id: 'status', align: 'left' as const, label: 'Status' },
  { id: 'lastVisit', align: 'left' as const, label: 'Last Visit' }
];

function PatientStatus({ status }: { status: string }) {
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

// ---- Helpers ----

function calcAge(dateOfBirth: string): number {
  const today = new Date();
  const dob = new Date(dateOfBirth);
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

function ProfileRow({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <Stack direction="row" sx={{ gap: 1.5, alignItems: 'flex-start', py: 0.75 }}>
      <Box sx={{ color: 'text.secondary', mt: 0.25, fontSize: 16 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="body2">{value}</Typography>
      </Box>
    </Stack>
  );
}

// ---- Inline expanded profile row ----

function PatientProfilePanel({ patient }: { patient: Patient }) {
  const addressParts = [patient.address, patient.city, patient.state, patient.country].filter(Boolean);

  return (
    <Box sx={{ p: 3, bgcolor: 'background.default' }}>
      <Grid container spacing={3}>
        {/* Identity card */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box
            sx={{
              p: 2.5,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: 'background.paper',
              textAlign: 'center'
            }}
          >
            <Avatar
              sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 24, mx: 'auto', mb: 1.5 }}
            >
              {patient.firstName?.[0]?.toUpperCase() ?? '?'}
            </Avatar>
            <Typography variant="h6">{patient.name}</Typography>
            {patient.medicalRecordNumber && (
              <Typography variant="caption" color="text.secondary" display="block">
                MRN: {patient.medicalRecordNumber}
              </Typography>
            )}
            <Chip
              label={patient.isActive ? 'Active' : 'Inactive'}
              color={patient.isActive ? 'success' : 'default'}
              size="small"
              sx={{ mt: 1 }}
            />
            <Divider sx={{ my: 1.5 }} />
            <ProfileRow
              icon={<UserOutlined />}
              label="Date of Birth"
              value={patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : null}
            />
            <ProfileRow
              icon={<UserOutlined />}
              label="Age"
              value={patient.dateOfBirth ? `${calcAge(patient.dateOfBirth)} years` : null}
            />
            <ProfileRow
              icon={<UserOutlined />}
              label="Gender"
              value={patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : null}
            />
          </Box>
        </Grid>

        {/* Right details */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Grid container spacing={2}>
            {/* Medical info */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', height: '100%' }}>
                <Stack direction="row" sx={{ gap: 1, alignItems: 'center', mb: 1.5 }}>
                  <MedicineBoxOutlined />
                  <Typography variant="subtitle1" fontWeight={600}>Medical Information</Typography>
                </Stack>
                <ProfileRow icon={<HeartOutlined />} label="Blood Type" value={patient.bloodType} />
                <ProfileRow
                  icon={<AlertOutlined />}
                  label="Allergies"
                  value={patient.allergies ?? 'None reported'}
                />
                {patient.notes && (
                  <ProfileRow icon={<MedicineBoxOutlined />} label="Clinical Notes" value={patient.notes} />
                )}
              </Box>
            </Grid>

            {/* Contact info */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', height: '100%' }}>
                <Stack direction="row" sx={{ gap: 1, alignItems: 'center', mb: 1.5 }}>
                  <PhoneOutlined />
                  <Typography variant="subtitle1" fontWeight={600}>Contact Information</Typography>
                </Stack>
                <ProfileRow icon={<PhoneOutlined />} label="Phone" value={patient.phone} />
                <ProfileRow icon={<MailOutlined />} label="Email" value={patient.email} />
                {addressParts.length > 0 && (
                  <ProfileRow icon={<EnvironmentOutlined />} label="Address" value={addressParts.join(', ')} />
                )}
              </Box>
            </Grid>

            {/* Emergency contact */}
            {(patient.emergencyContactName || patient.emergencyContactPhone) && (
              <Grid size={12}>
                <Box sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
                  <Stack direction="row" sx={{ gap: 1, alignItems: 'center', mb: 1.5 }}>
                    <TeamOutlined />
                    <Typography variant="subtitle1" fontWeight={600}>Emergency Contact</Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <ProfileRow icon={<UserOutlined />} label="Name" value={patient.emergencyContactName} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <ProfileRow icon={<PhoneOutlined />} label="Phone" value={patient.emergencyContactPhone} />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

// ---- Main Page ----

export default function PatientsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { patients, patientsLoading } = useGetPatients();
  const { stats, statsLoading } = useGetPatientStats();

  const filteredPatients = useMemo(() => {
    return (patients as any[]).filter((patient) => {
      const matchesSearch =
        search === '' || patient.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || patient.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [patients, search, statusFilter]);

  const toggleRow = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Page header */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">Patients</Typography>
          <Button variant="contained" startIcon={<PlusOutlined />}>
            Add Patient
          </Button>
        </Stack>
      </Grid>

      {/* Stat cards */}
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

      {/* Patient list */}
      <Grid size={12}>
        <MainCard title="Patient List" content={false}>
          {/* Search & filter */}
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
                    <TableCell key={cell.id} align={cell.align} sx={cell.id === 'expand' ? { width: 48, p: 0 } : undefined}>
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
                {!patientsLoading && filteredPatients.map((row) => {
                  const isOpen = expandedId === row.id;
                  return (
                    <>
                      <TableRow
                        hover
                        key={row.id}
                        onClick={() => toggleRow(row.id)}
                        sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell sx={{ width: 48, p: 0, textAlign: 'center' }}>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleRow(row.id); }}>
                            {isOpen ? <UpOutlined style={{ fontSize: 12 }} /> : <DownOutlined style={{ fontSize: 12 }} />}
                          </IconButton>
                        </TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell align="right">{row.age}</TableCell>
                        <TableCell>{row.gender}</TableCell>
                        <TableCell>{row.contact}</TableCell>
                        <TableCell>
                          <PatientStatus status={row.status} />
                        </TableCell>
                        <TableCell>{row.lastVisit}</TableCell>
                      </TableRow>
                      <TableRow key={`${row.id}-profile`}>
                        <TableCell colSpan={7} sx={{ p: 0, border: isOpen ? undefined : 'none' }}>
                          <Collapse in={isOpen} timeout="auto" unmountOnExit>
                            <PatientProfilePanel patient={row as Patient} />
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
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
