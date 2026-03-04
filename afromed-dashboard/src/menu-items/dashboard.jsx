// assets
import { 
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  HeartOutlined
} from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  HeartOutlined
};

// ==============================|| MENU ITEMS - MEDICAL DASHBOARD ||============================== //

const dashboard = {
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
    }
  ]
};

export default dashboard;
