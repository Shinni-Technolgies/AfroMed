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
import { useGetMedications, useGetPharmacyStats } from 'api/pharmacy';

// types
import { Medication } from 'types/models';

// assets
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

// ==============================|| PHARMACY PAGE ||============================== //

const headCells = [
  { id: 'name', align: 'left' as const, label: 'Medication Name' },
  { id: 'category', align: 'left' as const, label: 'Category' },
  { id: 'stockQty', align: 'right' as const, label: 'Stock Qty' },
  { id: 'unitPrice', align: 'right' as const, label: 'Unit Price' },
  { id: 'supplier', align: 'left' as const, label: 'Supplier' },
  { id: 'expiryDate', align: 'left' as const, label: 'Expiry Date' },
  { id: 'status', align: 'left' as const, label: 'Status' }
];

function MedicationStatus({ status }: { status: Medication['status'] }) {
  let color: 'success' | 'warning' | 'error';
  switch (status) {
    case 'In Stock':
      color = 'success';
      break;
    case 'Low Stock':
      color = 'warning';
      break;
    case 'Out of Stock':
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

export default function PharmacyPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const { medications, medicationsLoading } = useGetMedications();
  const { stats, statsLoading } = useGetPharmacyStats();

  const filteredMedications = useMemo(() => {
    return medications.filter((med) => {
      const matchesSearch =
        search === '' ||
        med.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || med.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [medications, search, statusFilter]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 - header */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">Pharmacy</Typography>
          <Button variant="contained" startIcon={<PlusOutlined />}>
            Add Medication
          </Button>
        </Stack>
      </Grid>

      {/* row 2 - stat cards */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Total Medications"
          count={statsLoading ? '—' : String(stats?.totalMedications ?? 0)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="In Stock"
          count={statsLoading ? '—' : String(stats?.inStock ?? 0)}
          color="success"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Low Stock"
          count={statsLoading ? '—' : String(stats?.lowStock ?? 0)}
          color="warning"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Out of Stock"
          count={statsLoading ? '—' : String(stats?.outOfStock ?? 0)}
          color="error"
        />
      </Grid>

      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />

      {/* row 3 - medication inventory */}
      <Grid size={12}>
        <MainCard title="Medication Inventory" content={false}>
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
                  <MenuItem value="In Stock">In Stock</MenuItem>
                  <MenuItem value="Low Stock">Low Stock</MenuItem>
                  <MenuItem value="Out of Stock">Out of Stock</MenuItem>
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
            <Table aria-labelledby="medicationsTable">
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
                {medicationsLoading && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress size={32} sx={{ my: 2 }} />
                    </TableCell>
                  </TableRow>
                )}
                {!medicationsLoading && filteredMedications.map((row) => (
                  <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="right">{row.stockQty.toLocaleString()}</TableCell>
                    <TableCell align="right">${row.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>{row.supplier}</TableCell>
                    <TableCell>{row.expiryDate}</TableCell>
                    <TableCell>
                      <MedicationStatus status={row.status} />
                    </TableCell>
                  </TableRow>
                ))}
                {!medicationsLoading && filteredMedications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary" sx={{ py: 2 }}>
                        No medications found
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
