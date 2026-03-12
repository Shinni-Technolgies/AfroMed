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
import CircularProgress from '@mui/material/CircularProgress';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import Dot from 'components/@extended/Dot';
import { useGetDoctors, useGetDoctorStats } from 'api/doctors';

// types
import { Doctor, Specialty } from 'types/models';

// assets
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

// ==============================|| DOCTORS PAGE ||============================== //

const specialties: Specialty[] = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Dermatology', 'Oncology', 'Ophthalmology'];

const headCells = [
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

  const { doctors, doctorsLoading } = useGetDoctors();
  const { stats, statsLoading } = useGetDoctorStats();

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const matchesSearch =
        search === '' ||
        doctor.name.toLowerCase().includes(search.toLowerCase());
      const matchesSpecialty = specialtyFilter === 'All' || doctor.specialty === specialtyFilter;
      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, search, specialtyFilter]);

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
        <AnalyticEcommerce
          title="Total Doctors"
          count={statsLoading ? '—' : String(stats?.totalDoctors ?? 0)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="On Duty"
          count={statsLoading ? '—' : String(stats?.onDuty ?? 0)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="On Leave"
          count={statsLoading ? '—' : String(stats?.onLeave ?? 0)}
          color="warning"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Specialists"
          count={statsLoading ? '—' : String(stats?.specialists ?? 0)}
          color="success"
        />
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
                {doctorsLoading && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress size={32} sx={{ my: 2 }} />
                    </TableCell>
                  </TableRow>
                )}
                {!doctorsLoading && filteredDoctors.map((row) => (
                  <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={row.id}>
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
                {!doctorsLoading && filteredDoctors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
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
