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
import { useGetHealthRecords, useGetHealthRecordStats } from 'api/health-records';

// types
import { RecordStatus } from 'types/models';

// assets
import { CloudUploadOutlined, SearchOutlined } from '@ant-design/icons';

// ==============================|| HEALTH RECORDS PAGE ||============================== //

const headCells = [
  { id: 'id', align: 'left' as const, label: 'Record ID' },
  { id: 'patientName', align: 'left' as const, label: 'Patient Name' },
  { id: 'recordType', align: 'left' as const, label: 'Record Type' },
  { id: 'doctor', align: 'left' as const, label: 'Doctor' },
  { id: 'dateCreated', align: 'left' as const, label: 'Date Created' },
  { id: 'status', align: 'left' as const, label: 'Status' }
];

function RecordStatusDot({ status }: { status: RecordStatus }) {
  const color: 'success' | 'warning' = status === 'Active' ? 'success' : 'warning';

  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={color} />
      <Typography>{status}</Typography>
    </Stack>
  );
}

export default function HealthRecordsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const { records, recordsLoading } = useGetHealthRecords();
  const { stats, statsLoading } = useGetHealthRecordStats();

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        search === '' ||
        record.patientName.toLowerCase().includes(search.toLowerCase()) ||
        record.id.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'All' || record.recordType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [records, search, typeFilter]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 - header */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">Health Records</Typography>
          <Button variant="contained" startIcon={<CloudUploadOutlined />}>
            Upload Record
          </Button>
        </Stack>
      </Grid>

      {/* row 2 - stat cards */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Total Records"
          count={statsLoading ? '—' : String(stats?.totalRecords ?? 0)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Lab Results"
          count={statsLoading ? '—' : String(stats?.labResults ?? 0)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Prescriptions"
          count={statsLoading ? '—' : String(stats?.prescriptions ?? 0)}
          color="warning"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Medical Reports"
          count={statsLoading ? '—' : String(stats?.medicalReports ?? 0)}
          color="success"
        />
      </Grid>

      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />

      {/* row 3 - records table */}
      <Grid size={12}>
        <MainCard title="Records List" content={false}>
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
                <InputLabel id="type-filter-label">Record Type</InputLabel>
                <Select
                  labelId="type-filter-label"
                  value={typeFilter}
                  label="Record Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Lab Result">Lab Result</MenuItem>
                  <MenuItem value="Prescription">Prescription</MenuItem>
                  <MenuItem value="Medical Report">Medical Report</MenuItem>
                  <MenuItem value="Imaging">Imaging</MenuItem>
                  <MenuItem value="Discharge Summary">Discharge Summary</MenuItem>
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
            <Table aria-labelledby="healthRecordsTable">
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
                {recordsLoading && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress size={32} sx={{ my: 2 }} />
                    </TableCell>
                  </TableRow>
                )}
                {!recordsLoading && filteredRecords.map((row) => (
                  <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.patientName}</TableCell>
                    <TableCell>{row.recordType}</TableCell>
                    <TableCell>{row.doctor}</TableCell>
                    <TableCell>{row.dateCreated}</TableCell>
                    <TableCell>
                      <RecordStatusDot status={row.status} />
                    </TableCell>
                  </TableRow>
                ))}
                {!recordsLoading && filteredRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary" sx={{ py: 2 }}>
                        No records found
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
