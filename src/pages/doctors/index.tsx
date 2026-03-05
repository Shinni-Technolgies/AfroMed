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
import Rating from '@mui/material/Rating';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import Dot from 'components/@extended/Dot';

// assets
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

// ==============================|| DOCTORS PAGE ||============================== //

type Specialty = 'Cardiology' | 'Neurology' | 'Orthopedics' | 'Pediatrics' | 'General Medicine' | 'Dermatology' | 'Oncology' | 'Ophthalmology';

interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  contact: string;
  experience: number;
  status: 'Available' | 'On Duty' | 'On Leave';
  rating: number;
}

const doctors: Doctor[] = [
  { id: 'DR-2001', name: 'Dr. Amara Osei', specialty: 'Cardiology', contact: '+233 244 100 2001', experience: 14, status: 'On Duty', rating: 4.8 },
  { id: 'DR-2002', name: 'Dr. Emeka Nwankwo', specialty: 'Neurology', contact: '+234 801 200 3002', experience: 20, status: 'Available', rating: 4.9 },
  { id: 'DR-2003', name: 'Dr. Fatoumata Camara', specialty: 'Pediatrics', contact: '+224 622 300 4003', experience: 9, status: 'On Duty', rating: 4.7 },
  { id: 'DR-2004', name: 'Dr. Thabo Ndlovu', specialty: 'Orthopedics', contact: '+27 82 400 5004', experience: 16, status: 'Available', rating: 4.6 },
  { id: 'DR-2005', name: 'Dr. Halima Yusuf', specialty: 'Dermatology', contact: '+254 722 500 6005', experience: 7, status: 'On Leave', rating: 4.5 },
  { id: 'DR-2006', name: 'Dr. Kwabena Adjei', specialty: 'Oncology', contact: '+233 209 600 7006', experience: 22, status: 'On Duty', rating: 4.9 },
  { id: 'DR-2007', name: 'Dr. Nneka Obiora', specialty: 'General Medicine', contact: '+234 803 700 8007', experience: 11, status: 'Available', rating: 4.4 },
  { id: 'DR-2008', name: 'Dr. Moussa Diop', specialty: 'Ophthalmology', contact: '+221 77 800 9008', experience: 18, status: 'On Duty', rating: 4.8 },
  { id: 'DR-2009', name: 'Dr. Chidinma Eke', specialty: 'Cardiology', contact: '+234 805 900 1009', experience: 13, status: 'Available', rating: 4.7 },
  { id: 'DR-2010', name: 'Dr. Sekou Touré', specialty: 'Neurology', contact: '+223 76 100 2010', experience: 25, status: 'On Leave', rating: 4.6 }
];

const specialties: Specialty[] = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Dermatology', 'Oncology', 'Ophthalmology'];

const headCells = [
  { id: 'id', align: 'left' as const, label: 'Doctor ID' },
  { id: 'name', align: 'left' as const, label: 'Name' },
  { id: 'specialty', align: 'left' as const, label: 'Specialty' },
  { id: 'contact', align: 'left' as const, label: 'Contact' },
  { id: 'experience', align: 'right' as const, label: 'Experience (yrs)' },
  { id: 'status', align: 'left' as const, label: 'Status' },
  { id: 'rating', align: 'left' as const, label: 'Rating' }
];

function DoctorStatus({ status }: { status: Doctor['status'] }) {
  let color: 'success' | 'warning' | 'error';
  switch (status) {
    case 'Available':
      color = 'success';
      break;
    case 'On Duty':
      color = 'warning';
      break;
    case 'On Leave':
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

export default function DoctorsPage() {
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        search === '' ||
        doctor.name.toLowerCase().includes(search.toLowerCase()) ||
        doctor.id.toLowerCase().includes(search.toLowerCase());
      const matchesSpecialty = specialtyFilter === 'All' || doctor.specialty === specialtyFilter;
      return matchesSearch && matchesSpecialty;
    });
  }, [search, specialtyFilter]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 - header */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">Doctors</Typography>
          <Button variant="contained" startIcon={<PlusOutlined />}>
            Add Doctor
          </Button>
        </Stack>
      </Grid>

      {/* row 2 - stat cards */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Total Doctors" count="86" percentage={4.2} extra="3" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="On Duty" count="34" percentage={6.1} extra="2" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="On Leave" count="8" percentage={2.5} isLoss color="warning" extra="1" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Specialists" count="52" percentage={3.8} color="success" extra="4" />
      </Grid>

      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />

      {/* row 3 - doctor list */}
      <Grid size={12}>
        <MainCard title="Doctor Directory" content={false}>
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
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="specialty-filter-label">Specialty</InputLabel>
                <Select
                  labelId="specialty-filter-label"
                  value={specialtyFilter}
                  label="Specialty"
                  onChange={(e) => setSpecialtyFilter(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  {specialties.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
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
            <Table aria-labelledby="doctorsTable">
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
                {filteredDoctors.map((row) => (
                  <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.specialty}</TableCell>
                    <TableCell>{row.contact}</TableCell>
                    <TableCell align="right">{row.experience}</TableCell>
                    <TableCell>
                      <DoctorStatus status={row.status} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                        <Rating value={row.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" color="text.secondary">
                          {row.rating}/5
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDoctors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary" sx={{ py: 2 }}>
                        No doctors found
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
