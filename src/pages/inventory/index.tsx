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
  useGetInventoryItems,
  useGetInventoryRooms,
  useGetMaintenanceLogs,
  useGetInventoryStats
} from 'api/inventory';

// types
import {
  InventoryItem,
  InventoryItemStatus,
  InventoryCondition,
  InventoryRoom,
  RoomStatus,
  MaintenanceLog,
  MaintenanceStatus,
  MaintenancePriority
} from 'types/models';

// assets
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

// ==============================|| HELPERS ||============================== //

function ItemStatusChip({ status }: { status: InventoryItemStatus }) {
  const map: Record<InventoryItemStatus, { color: 'success' | 'warning' | 'error' | 'default'; label: string }> = {
    active: { color: 'success', label: 'Active' },
    in_repair: { color: 'warning', label: 'In Repair' },
    retired: { color: 'default', label: 'Retired' },
    disposed: { color: 'error', label: 'Disposed' }
  };
  const { color, label } = map[status] ?? { color: 'default' as const, label: status };
  return <Chip size="small" color={color} label={label} />;
}

function ConditionDot({ condition }: { condition: InventoryCondition }) {
  const colorMap: Record<InventoryCondition, 'success' | 'primary' | 'warning' | 'error'> = {
    excellent: 'success',
    good: 'primary',
    fair: 'warning',
    poor: 'error'
  };
  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={colorMap[condition] ?? 'success'} />
      <Typography sx={{ textTransform: 'capitalize' }}>{condition}</Typography>
    </Stack>
  );
}

function RoomStatusChip({ status }: { status: RoomStatus }) {
  const map: Record<RoomStatus, { color: 'success' | 'primary' | 'warning' | 'error'; label: string }> = {
    available: { color: 'success', label: 'Available' },
    occupied: { color: 'primary', label: 'Occupied' },
    maintenance: { color: 'warning', label: 'Maintenance' },
    decommissioned: { color: 'error', label: 'Decommissioned' }
  };
  const { color, label } = map[status] ?? { color: 'default' as const, label: status };
  return <Chip size="small" color={color} label={label} />;
}

function MaintenanceStatusChip({ status }: { status: MaintenanceStatus }) {
  const map: Record<MaintenanceStatus, { color: 'info' | 'primary' | 'success' | 'error'; label: string }> = {
    open: { color: 'info', label: 'Open' },
    in_progress: { color: 'primary', label: 'In Progress' },
    completed: { color: 'success', label: 'Completed' },
    cancelled: { color: 'error', label: 'Cancelled' }
  };
  const { color, label } = map[status] ?? { color: 'default' as const, label: status };
  return <Chip size="small" color={color} label={label} />;
}

function PriorityDot({ priority }: { priority: MaintenancePriority }) {
  const colorMap: Record<MaintenancePriority, 'success' | 'primary' | 'warning' | 'error'> = {
    low: 'success',
    medium: 'primary',
    high: 'warning',
    critical: 'error'
  };
  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={colorMap[priority] ?? 'success'} />
      <Typography sx={{ textTransform: 'capitalize' }}>{priority}</Typography>
    </Stack>
  );
}

// ==============================|| HEAD CELLS ||============================== //

const assetHeadCells = [
  { id: 'name', align: 'left' as const, label: 'Asset Name' },
  { id: 'category', align: 'left' as const, label: 'Category' },
  { id: 'assetTag', align: 'left' as const, label: 'Asset Tag' },
  { id: 'location', align: 'left' as const, label: 'Location' },
  { id: 'condition', align: 'left' as const, label: 'Condition' },
  { id: 'assignedDepartment', align: 'left' as const, label: 'Department' },
  { id: 'status', align: 'left' as const, label: 'Status' }
];

const roomHeadCells = [
  { id: 'roomNumber', align: 'left' as const, label: 'Room #' },
  { id: 'name', align: 'left' as const, label: 'Room Name' },
  { id: 'building', align: 'left' as const, label: 'Building' },
  { id: 'floor', align: 'left' as const, label: 'Floor' },
  { id: 'roomType', align: 'left' as const, label: 'Type' },
  { id: 'capacity', align: 'right' as const, label: 'Capacity' },
  { id: 'department', align: 'left' as const, label: 'Department' },
  { id: 'status', align: 'left' as const, label: 'Status' }
];

const maintenanceHeadCells = [
  { id: 'assetName', align: 'left' as const, label: 'Asset' },
  { id: 'type', align: 'left' as const, label: 'Type' },
  { id: 'priority', align: 'left' as const, label: 'Priority' },
  { id: 'assignedTo', align: 'left' as const, label: 'Assigned To' },
  { id: 'scheduledDate', align: 'left' as const, label: 'Scheduled' },
  { id: 'cost', align: 'right' as const, label: 'Cost' },
  { id: 'status', align: 'left' as const, label: 'Status' }
];

// ==============================|| TAB PANEL ||============================== //

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return value === index ? <Box>{children}</Box> : null;
}

// ==============================|| FORMAT HELPERS ||============================== //

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatRoomType(type: string) {
  return type
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ==============================|| INVENTORY PAGE ||============================== //

export default function InventoryPage() {
  const [tabValue, setTabValue] = useState(0);
  const [assetSearch, setAssetSearch] = useState('');
  const [assetStatusFilter, setAssetStatusFilter] = useState('All');
  const [assetCategoryFilter, setAssetCategoryFilter] = useState('All');
  const [roomSearch, setRoomSearch] = useState('');
  const [roomStatusFilter, setRoomStatusFilter] = useState('All');
  const [maintenanceSearch, setMaintenanceSearch] = useState('');
  const [maintenanceStatusFilter, setMaintenanceStatusFilter] = useState('All');

  const { items, itemsLoading } = useGetInventoryItems();
  const { rooms, roomsLoading } = useGetInventoryRooms();
  const { logs, logsLoading } = useGetMaintenanceLogs();
  const { stats, statsLoading } = useGetInventoryStats();

  // Filtered data
  const filteredItems = useMemo(() => {
    return items.filter((item: InventoryItem) => {
      const matchesSearch =
        assetSearch === '' ||
        item.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
        (item.assetTag ?? '').toLowerCase().includes(assetSearch.toLowerCase());
      const matchesStatus = assetStatusFilter === 'All' || item.status === assetStatusFilter;
      const matchesCategory = assetCategoryFilter === 'All' || item.category === assetCategoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [items, assetSearch, assetStatusFilter, assetCategoryFilter]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room: InventoryRoom) => {
      const matchesSearch =
        roomSearch === '' ||
        room.name.toLowerCase().includes(roomSearch.toLowerCase()) ||
        room.roomNumber.toLowerCase().includes(roomSearch.toLowerCase()) ||
        room.building.toLowerCase().includes(roomSearch.toLowerCase());
      const matchesStatus = roomStatusFilter === 'All' || room.status === roomStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rooms, roomSearch, roomStatusFilter]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log: MaintenanceLog) => {
      const matchesSearch =
        maintenanceSearch === '' ||
        (log.assetName ?? '').toLowerCase().includes(maintenanceSearch.toLowerCase()) ||
        (log.assignedTo ?? '').toLowerCase().includes(maintenanceSearch.toLowerCase());
      const matchesStatus = maintenanceStatusFilter === 'All' || log.status === maintenanceStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [logs, maintenanceSearch, maintenanceStatusFilter]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Header */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">Inventory</Typography>
          <Button variant="contained" startIcon={<PlusOutlined />}>
            {tabValue === 0 ? 'Add Asset' : tabValue === 1 ? 'Add Room' : 'New Work Order'}
          </Button>
        </Stack>
      </Grid>

      {/* Stat Cards */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Total Assets"
          count={statsLoading ? '—' : String(stats?.totalAssets ?? 0)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Active Assets"
          count={statsLoading ? '—' : String(stats?.activeAssets ?? 0)}
          color="success"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Available Rooms"
          count={statsLoading ? '—' : String(stats?.availableRooms ?? 0)}
          color="primary"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Open Work Orders"
          count={statsLoading ? '—' : String(stats?.openWorkOrders ?? 0)}
          color="warning"
        />
      </Grid>

      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />

      {/* Tabs + Tables */}
      <Grid size={12}>
        <MainCard content={false}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
              <Tab label="Assets" />
              <Tab label="Rooms" />
              <Tab label="Maintenance Log" />
            </Tabs>
          </Box>

          {/* ============ TAB 0: Assets ============ */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: 3, pt: 2, pb: 1 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
                <TextField
                  placeholder="Search by name or asset tag…"
                  value={assetSearch}
                  onChange={(e) => setAssetSearch(e.target.value)}
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
                  <InputLabel id="asset-category-filter-label">Category</InputLabel>
                  <Select
                    labelId="asset-category-filter-label"
                    value={assetCategoryFilter}
                    label="Category"
                    onChange={(e) => setAssetCategoryFilter(e.target.value)}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="IT">IT</MenuItem>
                    <MenuItem value="Furniture">Furniture</MenuItem>
                    <MenuItem value="Kitchen">Kitchen</MenuItem>
                    <MenuItem value="Cleaning">Cleaning</MenuItem>
                    <MenuItem value="HVAC">HVAC</MenuItem>
                    <MenuItem value="Security">Security</MenuItem>
                    <MenuItem value="Office Supplies">Office Supplies</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id="asset-status-filter-label">Status</InputLabel>
                  <Select
                    labelId="asset-status-filter-label"
                    value={assetStatusFilter}
                    label="Status"
                    onChange={(e) => setAssetStatusFilter(e.target.value)}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="in_repair">In Repair</MenuItem>
                    <MenuItem value="retired">Retired</MenuItem>
                    <MenuItem value="disposed">Disposed</MenuItem>
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
              <Table aria-labelledby="inventoryAssetsTable">
                <TableHead>
                  <TableRow>
                    {assetHeadCells.map((cell) => (
                      <TableCell key={cell.id} align={cell.align}>
                        {cell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itemsLoading && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <CircularProgress size={32} sx={{ my: 2 }} />
                      </TableCell>
                    </TableRow>
                  )}
                  {!itemsLoading &&
                    filteredItems.map((row) => (
                      <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={row.id}>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.category}</TableCell>
                        <TableCell>{row.assetTag ?? '—'}</TableCell>
                        <TableCell>
                          {[row.building, row.floor, row.roomNumber].filter(Boolean).join(' / ') || '—'}
                        </TableCell>
                        <TableCell>
                          <ConditionDot condition={row.condition} />
                        </TableCell>
                        <TableCell>{row.assignedDepartment ?? '—'}</TableCell>
                        <TableCell>
                          <ItemStatusChip status={row.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  {!itemsLoading && filteredItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography color="text.secondary" sx={{ py: 2 }}>
                          No assets found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* ============ TAB 1: Rooms ============ */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ px: 3, pt: 2, pb: 1 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
                <TextField
                  placeholder="Search by room, name, or building…"
                  value={roomSearch}
                  onChange={(e) => setRoomSearch(e.target.value)}
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
                  <InputLabel id="room-status-filter-label">Status</InputLabel>
                  <Select
                    labelId="room-status-filter-label"
                    value={roomStatusFilter}
                    label="Status"
                    onChange={(e) => setRoomStatusFilter(e.target.value)}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="occupied">Occupied</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="decommissioned">Decommissioned</MenuItem>
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
              <Table aria-labelledby="inventoryRoomsTable">
                <TableHead>
                  <TableRow>
                    {roomHeadCells.map((cell) => (
                      <TableCell key={cell.id} align={cell.align}>
                        {cell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roomsLoading && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <CircularProgress size={32} sx={{ my: 2 }} />
                      </TableCell>
                    </TableRow>
                  )}
                  {!roomsLoading &&
                    filteredRooms.map((row) => (
                      <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={row.id}>
                        <TableCell>{row.roomNumber}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.building}</TableCell>
                        <TableCell>{row.floor}</TableCell>
                        <TableCell>{formatRoomType(row.roomType)}</TableCell>
                        <TableCell align="right">{row.capacity ?? '—'}</TableCell>
                        <TableCell>{row.department ?? '—'}</TableCell>
                        <TableCell>
                          <RoomStatusChip status={row.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  {!roomsLoading && filteredRooms.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography color="text.secondary" sx={{ py: 2 }}>
                          No rooms found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          {/* ============ TAB 2: Maintenance Log ============ */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ px: 3, pt: 2, pb: 1 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
                <TextField
                  placeholder="Search by asset or technician…"
                  value={maintenanceSearch}
                  onChange={(e) => setMaintenanceSearch(e.target.value)}
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
                  <InputLabel id="maintenance-status-filter-label">Status</InputLabel>
                  <Select
                    labelId="maintenance-status-filter-label"
                    value={maintenanceStatusFilter}
                    label="Status"
                    onChange={(e) => setMaintenanceStatusFilter(e.target.value)}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="open">Open</MenuItem>
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
              <Table aria-labelledby="maintenanceLogTable">
                <TableHead>
                  <TableRow>
                    {maintenanceHeadCells.map((cell) => (
                      <TableCell key={cell.id} align={cell.align}>
                        {cell.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logsLoading && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <CircularProgress size={32} sx={{ my: 2 }} />
                      </TableCell>
                    </TableRow>
                  )}
                  {!logsLoading &&
                    filteredLogs.map((row) => (
                      <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }} key={row.id}>
                        <TableCell>{row.assetName ?? '—'}</TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>{row.type}</TableCell>
                        <TableCell>
                          <PriorityDot priority={row.priority} />
                        </TableCell>
                        <TableCell>{row.assignedTo ?? '—'}</TableCell>
                        <TableCell>{row.scheduledDate ? formatDate(row.scheduledDate) : '—'}</TableCell>
                        <TableCell align="right">{row.cost != null ? formatCurrency(row.cost) : '—'}</TableCell>
                        <TableCell>
                          <MaintenanceStatusChip status={row.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  {!logsLoading && filteredLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography color="text.secondary" sx={{ py: 2 }}>
                          No maintenance records found
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
