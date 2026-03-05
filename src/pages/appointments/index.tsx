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
import Chip from '@mui/material/Chip';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import Dot from 'components/@extended/Dot';

// assets
import { CalendarOutlined, SearchOutlined } from '@ant-design/icons';

// ==============================|| APPOINTMENTS PAGE ||============================== //

type AppointmentType = 'Checkup' | 'Follow-up' | 'Emergency' | 'Consultation';
type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress';

interface Appointment {
  id: string;
  patientName: string;
  doctor: string;
  department: string;
  dateTime: string;
  type: AppointmentType;
  status: AppointmentStatus;
}

const appointments: Appointment[] = [
  { id: 'APT-2001', patientName: 'Amina Okafor', doctor: 'Dr. Emeka Obi', department: 'Cardiology', dateTime: '2024-12-20 09:00', type: 'Checkup', status: 'Scheduled' },
  { id: 'APT-2002', patientName: 'Kwame Mensah', doctor: 'Dr. Ama Serwaa', department: 'Neurology', dateTime: '2024-12-20 09:30', type: 'Follow-up', status: 'In Progress' },
  { id: 'APT-2003', patientName: 'Fatima Diallo', doctor: 'Dr. Ibrahima Ndiaye', department: 'Obstetrics', dateTime: '2024-12-20 10:00', type: 'Consultation', status: 'Scheduled' },
  { id: 'APT-2004', patientName: 'Tendai Moyo', doctor: 'Dr. Chipo Nyathi', department: 'Orthopedics', dateTime: '2024-12-19 14:00', type: 'Follow-up', status: 'Completed' },
  { id: 'APT-2005', patientName: 'Ngozi Eze', doctor: 'Dr. Emeka Obi', department: 'Cardiology', dateTime: '2024-12-20 11:00', type: 'Emergency', status: 'Scheduled' },
  { id: 'APT-2006', patientName: 'Ousmane Ba', doctor: 'Dr. Mariama Camara', department: 'Dermatology', dateTime: '2024-12-18 15:30', type: 'Checkup', status: 'Completed' },
  { id: 'APT-2007', patientName: 'Aisha Mohammed', doctor: 'Dr. Yusuf Abdullahi', department: 'Pediatrics', dateTime: '2024-12-20 13:00', type: 'Consultation', status: 'Scheduled' },
  { id: 'APT-2008', patientName: 'Kofi Asante', doctor: 'Dr. Ama Serwaa', department: 'Neurology', dateTime: '2024-12-17 10:30', type: 'Follow-up', status: 'Cancelled' },
  { id: 'APT-2009', patientName: 'Zainab Traore', doctor: 'Dr. Ibrahima Ndiaye', department: 'Obstetrics', dateTime: '2024-12-20 14:30', type: 'Checkup', status: 'Scheduled' },
  { id: 'APT-2010', patientName: 'Chinedu Nwosu', doctor: 'Dr. Chipo Nyathi', department: 'Orthopedics', dateTime: '2024-12-19 09:00', type: 'Emergency', status: 'Completed' },
  { id: 'APT-2011', patientName: 'Halima Bello', doctor: 'Dr. Yusuf Abdullahi', department: 'Pediatrics', dateTime: '2024-12-16 11:00', type: 'Checkup', status: 'Cancelled' },
  { id: 'APT-2012', patientName: 'Sekou Konate', doctor: 'Dr. Mariama Camara', department: 'Dermatology', dateTime: '2024-12-20 15:00', type: 'Consultation', status: 'In Progress' }
];

const headCells = [
  { id: 'id', align: 'left' as const, label: 'Appointment ID' },
  { id: 'patientName', align: 'left' as const, label: 'Patient Name' },
  { id: 'doctor', align: 'left' as const, label: 'Doctor' },
  { id: 'department', align: 'left' as const, label: 'Department' },
  { id: 'dateTime', align: 'left' as const, label: 'Date & Time' },
  { id: 'type', align: 'left' as const, label: 'Type' },
  { id: 'status', align: 'left' as const, label: 'Status' }
];

const typeColorMap: Record<AppointmentType, 'default' | 'primary' | 'error' | 'info'> = {
  Checkup: 'default',
  'Follow-up': 'primary',
  Emergency: 'error',
  Consultation: 'info'
};

function AppointmentStatus({ status }: { status: Appointment['status'] }) {
  let color: 'success' | 'warning' | 'error' | 'primary';
  switch (status) {
    case 'Scheduled':
      color = 'primary';
      break;
    case 'Completed':
      color = 'success';
      break;
    case 'Cancelled':
      color = 'error';
      break;
    case 'In Progress':
      color = 'warning';
      break;
    default:
      color = 'primary';
  }

  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={color} />
      <Typography>{status}</Typography>
    </Stack>
  );
}

export default function AppointmentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const matchesSearch =
        search === '' ||
        appt.patientName.toLowerCase().includes(search.toLowerCase()) ||
        appt.id.toLowerCase().includes(search.toLowerCase()) ||
        appt.doctor.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || appt.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 - header */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">Appointments</Typography>
          <Button variant="contained" startIcon={<CalendarOutlined />}>
            Book Appointment
          </Button>
        </Stack>
      </Grid>

      {/* row 2 - stat cards */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Today's Appointments" count="24" percentage={4.2} extra="3" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Upcoming" count="156" percentage={10.8} extra="12" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Completed" count="1,843" percentage={6.3} color="success" extra="42" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Cancelled" count="32" percentage={2.1} isLoss color="error" extra="4" />
      </Grid>

      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />

      {/* row 3 - appointment list */}
      <Grid size={12}>
        <MainCard title="Appointment List" content={false}>
          <Box sx={{ px: 3, pt: 2, pb: 1 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
              <TextField
                placeholder="Search by patient, doctor, or ID…"
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
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
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
            <Table aria-labelledby="appointmentsTable">
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
                {filteredAppointments.map((row) => (
                  <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.patientName}</TableCell>
                    <TableCell>{row.doctor}</TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>{row.dateTime}</TableCell>
                    <TableCell>
                      <Chip label={row.type} color={typeColorMap[row.type]} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <AppointmentStatus status={row.status} />
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAppointments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary" sx={{ py: 2 }}>
                        No appointments found
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
