// assets
import { 
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  ExperimentOutlined,
  DollarOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

// types
import { MenuGroup } from '../types/menu';

// icons
const icons = {
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
  ExperimentOutlined,
  DollarOutlined,
  DatabaseOutlined
};

// ==============================|| MENU ITEMS - MEDICAL DASHBOARD ||============================== //

const dashboard: MenuGroup = {
  id: 'group-dashboard',
  title: 'Main Menu',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'patients',
      title: 'Patients',
      type: 'item',
      url: '/patients',
      icon: icons.UserOutlined,
      breadcrumbs: true
    },
    {
      id: 'appointments',
      title: 'Appointments',
      type: 'item',
      url: '/appointments',
      icon: icons.CalendarOutlined,
      breadcrumbs: true
    },
    {
      id: 'pharmacy',
      title: 'Pharmacy',
      type: 'item',
      url: '/pharmacy',
      icon: icons.MedicineBoxOutlined,
      breadcrumbs: true
    },
    {
      id: 'health-records',
      title: 'Health Records',
      type: 'item',
      url: '/health-records',
      icon: icons.HeartOutlined,
      breadcrumbs: true
    },
    {
      id: 'laboratory',
      title: 'Laboratory',
      type: 'item',
      url: '/laboratory',
      icon: icons.ExperimentOutlined,
      breadcrumbs: true
    },
    {
      id: 'billing',
      title: 'Billing',
      type: 'item',
      url: '/billing',
      icon: icons.DollarOutlined,
      breadcrumbs: true
    },
    {
      id: 'inventory',
      title: 'Inventory',
      type: 'item',
      url: '/inventory',
      icon: icons.DatabaseOutlined,
      breadcrumbs: true
    }
  ]
};

export default dashboard;
