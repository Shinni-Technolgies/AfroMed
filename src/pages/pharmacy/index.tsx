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

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import Dot from 'components/@extended/Dot';

// assets
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

// ==============================|| PHARMACY PAGE ||============================== //

interface Medication {
  id: string;
  name: string;
  category: string;
  stockQty: number;
  unitPrice: number;
  supplier: string;
  expiryDate: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const medications: Medication[] = [
  { id: 'MED-2001', name: 'Amoxicillin 500mg', category: 'Antibiotic', stockQty: 1240, unitPrice: 3.50, supplier: 'PharmaCare Ltd', expiryDate: '2026-03-15', status: 'In Stock' },
  { id: 'MED-2002', name: 'Ibuprofen 400mg', category: 'Analgesic', stockQty: 860, unitPrice: 2.10, supplier: 'MedSource Africa', expiryDate: '2025-11-20', status: 'In Stock' },
  { id: 'MED-2003', name: 'Metformin 850mg', category: 'Antidiabetic', stockQty: 25, unitPrice: 4.75, supplier: 'GlobalMed Inc', expiryDate: '2025-08-10', status: 'Low Stock' },
  { id: 'MED-2004', name: 'Oseltamivir 75mg', category: 'Antiviral', stockQty: 0, unitPrice: 12.30, supplier: 'ViralShield Corp', expiryDate: '2025-06-01', status: 'Out of Stock' },
  { id: 'MED-2005', name: 'Paracetamol 500mg', category: 'Analgesic', stockQty: 2100, unitPrice: 1.20, supplier: 'PharmaCare Ltd', expiryDate: '2026-09-30', status: 'In Stock' },
  { id: 'MED-2006', name: 'Vitamin D3 1000IU', category: 'Supplement', stockQty: 15, unitPrice: 5.60, supplier: 'NutriHealth SA', expiryDate: '2025-12-25', status: 'Low Stock' },
  { id: 'MED-2007', name: 'Ciprofloxacin 250mg', category: 'Antibiotic', stockQty: 430, unitPrice: 4.00, supplier: 'MedSource Africa', expiryDate: '2026-01-18', status: 'In Stock' },
  { id: 'MED-2008', name: 'Acyclovir 200mg', category: 'Antiviral', stockQty: 0, unitPrice: 8.90, supplier: 'ViralShield Corp', expiryDate: '2025-04-12', status: 'Out of Stock' },
  { id: 'MED-2009', name: 'Glibenclamide 5mg', category: 'Antidiabetic', stockQty: 380, unitPrice: 3.25, supplier: 'GlobalMed Inc', expiryDate: '2026-07-08', status: 'In Stock' },
  { id: 'MED-2010', name: 'Iron Supplement 325mg', category: 'Supplement', stockQty: 18, unitPrice: 2.80, supplier: 'NutriHealth SA', expiryDate: '2025-10-05', status: 'Low Stock' },
  { id: 'MED-2011', name: 'Azithromycin 500mg', category: 'Antibiotic', stockQty: 590, unitPrice: 6.40, supplier: 'PharmaCare Ltd', expiryDate: '2026-05-22', status: 'In Stock' },
  { id: 'MED-2012', name: 'Diclofenac 50mg', category: 'Analgesic', stockQty: 0, unitPrice: 1.95, supplier: 'MedSource Africa', expiryDate: '2025-02-28', status: 'Out of Stock' }
];

const headCells = [
  { id: 'id', align: 'left' as const, label: 'Med ID' },
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

  const filteredMedications = useMemo(() => {
    return medications.filter((med) => {
      const matchesSearch =
        search === '' ||
        med.name.toLowerCase().includes(search.toLowerCase()) ||
        med.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || med.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

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
        <AnalyticEcommerce title="Total Medications" count="486" percentage={4.2} extra="18" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="In Stock" count="412" percentage={3.1} color="success" extra="10" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Low Stock" count="38" percentage={8.7} isLoss color="warning" extra="6" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce title="Out of Stock" count="12" percentage={2.4} isLoss color="error" extra="3" />
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
                {filteredMedications.map((row) => (
                  <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={row.id}>
                    <TableCell>{row.id}</TableCell>
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
                {filteredMedications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
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
