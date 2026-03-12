import { useState, useMemo } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
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
import {
  useGetLabTests,
  useGetLabOrders,
  useGetLabResults,
  useGetLabStats
} from 'api/laboratory';

// types
import { LabOrder, LabOrderStatus, LabOrderPriority } from 'types/models';

// assets
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

// ==============================|| HELPERS ||============================== //

function OrderStatusChip({ status }: { status: LabOrderStatus }) {
  const map: Record<LabOrderStatus, { color: 'default' | 'info' | 'primary' | 'success' | 'error'; label: string }> = {
    ordered: { color: 'info', label: 'Ordered' },
    collected: { color: 'primary', label: 'Collected' },
    in_progress: { color: 'default', label: 'In Progress' },
    completed: { color: 'success', label: 'Completed' },
    cancelled: { color: 'error', label: 'Cancelled' }
  };
  const { color, label } = map[status] ?? { color: 'default' as const, label: status };
  return <Chip size="small" color={color} label={label} />;
}

function PriorityDot({ priority }: { priority: LabOrderPriority }) {
  const colorMap: Record<LabOrderPriority, 'success' | 'warning' | 'error'> = {
    normal: 'success',
    urgent: 'warning',
    stat: 'error'
  };
  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={colorMap[priority] ?? 'success'} size={undefined} variant={undefined} sx={undefined} />
      <Typography sx={{ textTransform: 'capitalize' }}>{priority}</Typography>
    </Stack>
  );
}

function AbnormalDot({ isAbnormal }: { isAbnormal: boolean }) {
  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={isAbnormal ? 'error' : 'success'} size={undefined} variant={undefined} sx={undefined} />
      <Typography>{isAbnormal ? 'Abnormal' : 'Normal'}</Typography>
    </Stack>
  );
}

// ==============================|| HEAD CELLS ||============================== //

const orderHeadCells = [
  { id: 'testName', align: 'left' as const, label: 'Test' },
  { id: 'patientName', align: 'left' as const, label: 'Patient' },
  { id: 'orderedByName', align: 'left' as const, label: 'Ordered By' },
  { id: 'priority', align: 'left' as const, label: 'Priority' },
  { id: 'status', align: 'left' as const, label: 'Status' },
  { id: 'orderedAt', align: 'left' as const, label: 'Ordered Date' }
];

const resultHeadCells = [
  { id: 'testName', align: 'left' as const, label: 'Test' },
  { id: 'patientName', align: 'left' as const, label: 'Patient' },
  { id: 'resultValue', align: 'left' as const, label: 'Result' },
  { id: 'referenceRange', align: 'left' as const, label: 'Reference Range' },
  { id: 'isAbnormal', align: 'left' as const, label: 'Status' },
  { id: 'performedByName', align: 'left' as const, label: 'Performed By' },
  { id: 'resultedAt', align: 'left' as const, label: 'Result Date' }
];

const testHeadCells = [
  { id: 'name', align: 'left' as const, label: 'Test Name' },
  { id: 'category', align: 'left' as const, label: 'Category' },
  { id: 'normalRange', align: 'left' as const, label: 'Normal Range' },
  { id: 'unit', align: 'left' as const, label: 'Unit' },
  { id: 'cost', align: 'right' as const, label: 'Cost' },
  { id: 'isActive', align: 'left' as const, label: 'Status' }
];

// ==============================|| TAB PANEL ||============================== //

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return value === index ? <Box>{children}</Box> : null;
}

// ==============================|| LABORATORY PAGE ||============================== //

export default function LaboratoryPage() {
  const [tabValue, setTabValue] = useState(0);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [resultSearch, setResultSearch] = useState('');
  const [testSearch, setTestSearch] = useState('');

  const { orders, ordersLoading } = useGetLabOrders();
  const { results, resultsLoading } = useGetLabResults();
  const { tests, testsLoading } = useGetLabTests();
  const { stats, statsLoading } = useGetLabStats();

  // Filtered data
  const filteredOrders = useMemo(() => {
    return orders.filter((o: LabOrder) => {
      const matchesSearch =
        orderSearch === '' ||
        (o.testName ?? '').toLowerCase().includes(orderSearch.toLowerCase()) ||
        (o.patientName ?? '').toLowerCase().includes(orderSearch.toLowerCase());
      const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      return (
        resultSearch === '' ||
        (r.testName ?? '').toLowerCase().includes(resultSearch.toLowerCase()) ||
        (r.patientName ?? '').toLowerCase().includes(resultSearch.toLowerCase())
      );
    });
  }, [results, resultSearch]);

  const filteredTests = useMemo(() => {
    return tests.filter((t) => {
      return (
        testSearch === '' ||
        t.name.toLowerCase().includes(testSearch.toLowerCase()) ||
        (t.category ?? '').toLowerCase().includes(testSearch.toLowerCase())
      );
    });
  }, [tests, testSearch]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Header */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">Laboratory</Typography>
          <Button variant="contained" startIcon={<PlusOutlined />}>
            {tabValue === 0 ? 'New Lab Order' : tabValue === 1 ? 'Add Result' : 'Add Test'}
          </Button>
        </Stack>
      </Grid>

      {/* Stat Cards */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Available Tests"
          count={statsLoading ? '—' : String(stats?.totalTests ?? 0)}
          percentage={undefined}
          isLoss={undefined}
          extra={undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Total Orders"
          count={statsLoading ? '—' : String(stats?.totalOrders ?? 0)}
          percentage={undefined}
          isLoss={undefined}
          extra={undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Pending"
          count={statsLoading ? '—' : String(stats?.pending ?? 0)}
          color="warning"
          percentage={undefined}
          isLoss={undefined}
          extra={undefined}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Completed"
          count={statsLoading ? '—' : String(stats?.completed ?? 0)}
          color="success"
          percentage={undefined}
          isLoss={undefined}
          extra={undefined}
        />
      </Grid>

      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />

      {/* Tabs + Tables */}
      <Grid size={12}>
        <MainCard content={false} boxShadow={undefined} subheader={undefined} darkTitle={undefined} elevation={undefined} secondary={undefined} shadow={undefined} title={undefined} codeHighlight={undefined} codeString={undefined} ref={undefined}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
              <Tab label="Lab Orders" />
              <Tab label="Results" />
              <Tab label="Test Catalog" />
            </Tabs>
          </Box>

          {/* ============ TAB 0: Lab Orders ============ */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: 3, pt: 2, pb: 1 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
                <TextField
                  placeholder="Search by test or patient…"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
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
                  <InputLabel id="order-status-filter-label">Status</InputLabel>
                  <Select
                    labelId="order-status-filter-label"
                    value={orderStatusFilter}
                    label="Status"
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="ordered">Ordered</MenuItem>
                    <MenuItem value="collected">Collected</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
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
              <Table aria-labelledby="labOrdersTable">
                <TableHead>
                  <TableRow>
                    {orderHeadCells.map((cell) => (
                      <TableCell key={cell.id} align={cell.align}>
                        {cell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ordersLoading && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress size={32} sx={{ my: 2 }} />
                      </TableCell>
                    </TableRow>
                  )}
                  {!ordersLoading &&
                    filteredOrders.map((row) => (
                      <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={row.id}>
                        <TableCell>{row.testName}</TableCell>
                        <TableCell>{row.patientName}</TableCell>
                        <TableCell>{row.orderedByName}</TableCell>
                        <TableCell>
                          <PriorityDot priority={row.priority} />
                        </TableCell>
                        <TableCell>
                          <OrderStatusChip status={row.status} />
                        </TableCell>
                        <TableCell>{formatDate(row.orderedAt)}</TableCell>
                      </TableRow>
                    ))}
                  {!ordersLoading && filteredOrders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary" sx={{ py: 2 }}>
                          No lab orders found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* ============ TAB 1: Lab Results ============ */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ px: 3, pt: 2, pb: 1 }}>
              <TextField
                placeholder="Search by test or patient…"
                value={resultSearch}
                onChange={(e) => setResultSearch(e.target.value)}
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
              <Table aria-labelledby="labResultsTable">
                <TableHead>
                  <TableRow>
                    {resultHeadCells.map((cell) => (
                      <TableCell key={cell.id} align={cell.align}>
                        {cell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resultsLoading && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <CircularProgress size={32} sx={{ my: 2 }} />
                      </TableCell>
                    </TableRow>
                  )}
                  {!resultsLoading &&
                    filteredResults.map((row) => (
                      <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={row.id}>
                        <TableCell>{row.testName}</TableCell>
                        <TableCell>{row.patientName}</TableCell>
                        <TableCell>
                          {row.resultValue}
                          {row.unit ? ` ${row.unit}` : ''}
                        </TableCell>
                        <TableCell>{row.referenceRange ?? '—'}</TableCell>
                        <TableCell>
                          <AbnormalDot isAbnormal={row.isAbnormal} />
                        </TableCell>
                        <TableCell>{row.performedByName ?? '—'}</TableCell>
                        <TableCell>{formatDate(row.resultedAt)}</TableCell>
                      </TableRow>
                    ))}
                  {!resultsLoading && filteredResults.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography color="text.secondary" sx={{ py: 2 }}>
                          No lab results found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* ============ TAB 2: Test Catalog ============ */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ px: 3, pt: 2, pb: 1 }}>
              <TextField
                placeholder="Search by name or category…"
                value={testSearch}
                onChange={(e) => setTestSearch(e.target.value)}
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
              <Table aria-labelledby="labTestsTable">
                <TableHead>
                  <TableRow>
                    {testHeadCells.map((cell) => (
                      <TableCell key={cell.id} align={cell.align}>
                        {cell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {testsLoading && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress size={32} sx={{ my: 2 }} />
                      </TableCell>
                    </TableRow>
                  )}
                  {!testsLoading &&
                    filteredTests.map((row) => (
                      <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={row.id}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.category ?? '—'}</TableCell>
                        <TableCell>{row.normalRange ?? '—'}</TableCell>
                        <TableCell>{row.unit ?? '—'}</TableCell>
                        <TableCell align="right">{row.cost != null ? `$${row.cost.toFixed(2)}` : '—'}</TableCell>
                        <TableCell>
                          <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                            <Dot color={row.isActive ? 'success' : 'error'} size={undefined} variant={undefined} sx={undefined} />
                            <Typography>{row.isActive ? 'Active' : 'Inactive'}</Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  {!testsLoading && filteredTests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary" sx={{ py: 2 }}>
                          No lab tests found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </MainCard>
      </Grid>
    </Grid>
  );
}
