import { useState, useMemo } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import Dot from 'components/@extended/Dot';
import { useGetAdminUsers, useGetAdminRoles, useGetAdminDepartments, useGetAdminStats } from 'api/admin';
import { AdminUser, AdminRole, AdminDepartment } from 'types/models';

// icons
import {
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  ApartmentOutlined,
  PlusOutlined,
  EditOutlined
} from '@ant-design/icons';

// ==============================|| ADMIN PAGE ||============================== //

// --- Tab Panel wrapper ---
function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ pt: 2 }}>
      {value === index && children}
    </Box>
  );
}

// --- Active status indicator ---
function ActiveStatus({ isActive }: { isActive: boolean }) {
  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
      <Dot color={isActive ? 'success' : 'error'} />
      <Typography>{isActive ? 'Active' : 'Inactive'}</Typography>
    </Stack>
  );
}

// --- Users table columns ---
const userHeadCells = [
  { id: 'name', align: 'left' as const, label: 'Name' },
  { id: 'email', align: 'left' as const, label: 'Email' },
  { id: 'department', align: 'left' as const, label: 'Department' },
  { id: 'roles', align: 'left' as const, label: 'Roles' },
  { id: 'jobTitle', align: 'left' as const, label: 'Job Title' },
  { id: 'status', align: 'left' as const, label: 'Status' },
  { id: 'actions', align: 'center' as const, label: 'Actions' }
];

// --- Roles table columns ---
const roleHeadCells = [
  { id: 'name', align: 'left' as const, label: 'Role Name' },
  { id: 'description', align: 'left' as const, label: 'Description' },
  { id: 'userCount', align: 'center' as const, label: 'Users Assigned' },
  { id: 'status', align: 'left' as const, label: 'Status' },
  { id: 'createdAt', align: 'left' as const, label: 'Created' },
  { id: 'actions', align: 'center' as const, label: 'Actions' }
];

// --- Departments table columns ---
const deptHeadCells = [
  { id: 'name', align: 'left' as const, label: 'Department' },
  { id: 'description', align: 'left' as const, label: 'Description' },
  { id: 'phone', align: 'left' as const, label: 'Phone' },
  { id: 'userCount', align: 'center' as const, label: 'Staff Count' },
  { id: 'status', align: 'left' as const, label: 'Status' },
  { id: 'actions', align: 'center' as const, label: 'Actions' }
];

// --- Users Tab ---
function UsersTab({ users, loading }: { users: AdminUser[]; loading: boolean }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        search === '' ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || (statusFilter === 'Active' ? u.isActive : !u.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  return (
    <MainCard title="Users" content={false} secondary={
      <Button variant="contained" size="small" startIcon={<PlusOutlined />}>Add User</Button>
    }>
      <Box sx={{ px: 3, pt: 2, pb: 1 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            placeholder="Search by name or email…"
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
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="user-status-label">Status</InputLabel>
            <Select
              labelId="user-status-label"
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <TableContainer sx={{ width: '100%', overflowX: 'auto', '& td, & th': { whiteSpace: 'nowrap' } }}>
        <Table aria-labelledby="usersTable">
          <TableHead>
            <TableRow>
              {userHeadCells.map((cell) => (
                <TableCell key={cell.id} align={cell.align}>{cell.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={32} sx={{ my: 2 }} />
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.map((row) => (
              <TableRow hover key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }} src={row.avatarUrl || undefined}>
                      {row.firstName[0]}{row.lastName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{row.name}</Typography>
                      {row.specialization && (
                        <Typography variant="caption" color="text.secondary">{row.specialization}</Typography>
                      )}
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.departmentName || '—'}</TableCell>
                <TableCell>
                  <Stack direction="row" sx={{ gap: 0.5, flexWrap: 'wrap' }}>
                    {row.roles.length > 0
                      ? row.roles.map((r) => (
                          <Chip key={r.roleId} label={r.roleName} size="small" variant="outlined" color="primary" />
                        ))
                      : <Typography variant="caption" color="text.secondary">None</Typography>}
                  </Stack>
                </TableCell>
                <TableCell>{row.jobTitle || '—'}</TableCell>
                <TableCell><ActiveStatus isActive={row.isActive} /></TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit User">
                    <IconButton size="small"><EditOutlined /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>No users found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}

// --- Roles Tab ---
function RolesTab({ roles, loading }: { roles: AdminRole[]; loading: boolean }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return roles.filter((r) => search === '' || r.name.toLowerCase().includes(search.toLowerCase()));
  }, [roles, search]);

  return (
    <MainCard title="Roles" content={false} secondary={
      <Button variant="contained" size="small" startIcon={<PlusOutlined />}>Add Role</Button>
    }>
      <Box sx={{ px: 3, pt: 2, pb: 1 }}>
        <TextField
          placeholder="Search roles…"
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
      </Box>

      <TableContainer sx={{ width: '100%', overflowX: 'auto', '& td, & th': { whiteSpace: 'nowrap' } }}>
        <Table aria-labelledby="rolesTable">
          <TableHead>
            <TableRow>
              {roleHeadCells.map((cell) => (
                <TableCell key={cell.id} align={cell.align}>{cell.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={32} sx={{ my: 2 }} />
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.map((row) => (
              <TableRow hover key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                    <SafetyCertificateOutlined style={{ fontSize: 18, color: '#1890ff' }} />
                    <Typography variant="subtitle2">{row.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{row.description || '—'}</TableCell>
                <TableCell align="center">
                  <Chip label={row.userCount} size="small" color={row.userCount > 0 ? 'primary' : 'default'} />
                </TableCell>
                <TableCell><ActiveStatus isActive={row.isActive} /></TableCell>
                <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit Role">
                    <IconButton size="small"><EditOutlined /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>No roles found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}

// --- Departments Tab ---
function DepartmentsTab({ departments, loading }: { departments: AdminDepartment[]; loading: boolean }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return departments.filter((d) => search === '' || d.name.toLowerCase().includes(search.toLowerCase()));
  }, [departments, search]);

  return (
    <MainCard title="Departments" content={false} secondary={
      <Button variant="contained" size="small" startIcon={<PlusOutlined />}>Add Department</Button>
    }>
      <Box sx={{ px: 3, pt: 2, pb: 1 }}>
        <TextField
          placeholder="Search departments…"
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
      </Box>

      <TableContainer sx={{ width: '100%', overflowX: 'auto', '& td, & th': { whiteSpace: 'nowrap' } }}>
        <Table aria-labelledby="departmentsTable">
          <TableHead>
            <TableRow>
              {deptHeadCells.map((cell) => (
                <TableCell key={cell.id} align={cell.align}>{cell.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress size={32} sx={{ my: 2 }} />
                </TableCell>
              </TableRow>
            )}
            {!loading && filtered.map((row) => (
              <TableRow hover key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                    <ApartmentOutlined style={{ fontSize: 18, color: '#52c41a' }} />
                    <Typography variant="subtitle2">{row.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{row.description || '—'}</TableCell>
                <TableCell>{row.phone || '—'}</TableCell>
                <TableCell align="center">
                  <Chip label={row.userCount} size="small" color={row.userCount > 0 ? 'success' : 'default'} />
                </TableCell>
                <TableCell><ActiveStatus isActive={row.isActive} /></TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit Department">
                    <IconButton size="small"><EditOutlined /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>No departments found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </MainCard>
  );
}

// ==============================|| ADMIN PAGE - MAIN ||============================== //

export default function AdminPage() {
  const [tabValue, setTabValue] = useState(0);

  const { users, usersLoading } = useGetAdminUsers();
  const { roles, rolesLoading } = useGetAdminRoles();
  const { departments, departmentsLoading } = useGetAdminDepartments();
  const { stats, statsLoading } = useGetAdminStats();

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Row 1: Header */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">Admin</Typography>
          <Chip icon={<TeamOutlined />} label="Organization Management" variant="outlined" color="primary" />
        </Stack>
      </Grid>

      {/* Row 2: Statistics Cards */}
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Total Users"
          count={statsLoading ? '—' : String(stats?.totalUsers ?? 0)}
          extra={statsLoading ? '' : `${stats?.newThisMonth ?? 0} new this month`}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Active Users"
          count={statsLoading ? '—' : String(stats?.activeUsers ?? 0)}
          color="success"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Roles"
          count={statsLoading ? '—' : String(stats?.totalRoles ?? 0)}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
        <AnalyticEcommerce
          title="Departments"
          count={statsLoading ? '—' : String(stats?.totalDepartments ?? 0)}
        />
      </Grid>

      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />

      {/* Row 3: Tabs & Content */}
      <Grid size={12}>
        <MainCard content={false}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
            <Tabs value={tabValue} onChange={(_e, v) => setTabValue(v)} aria-label="admin tabs">
              <Tab icon={<UserOutlined />} iconPosition="start" label="Users" />
              <Tab icon={<SafetyCertificateOutlined />} iconPosition="start" label="Roles" />
              <Tab icon={<ApartmentOutlined />} iconPosition="start" label="Departments" />
            </Tabs>
          </Box>
        </MainCard>

        <TabPanel value={tabValue} index={0}>
          <UsersTab users={users} loading={usersLoading} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <RolesTab roles={roles} loading={rolesLoading} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <DepartmentsTab departments={departments} loading={departmentsLoading} />
        </TabPanel>
      </Grid>
    </Grid>
  );
}
