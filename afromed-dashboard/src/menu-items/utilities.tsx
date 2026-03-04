// assets
import {
  TeamOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  ScheduleOutlined,
  DollarOutlined,
  BarChartOutlined
} from '@ant-design/icons';

// types
import { MenuGroup } from '../types/menu';

// icons
const icons = {
  TeamOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  ScheduleOutlined,
  DollarOutlined,
  BarChartOutlined
};

// ==============================|| MENU ITEMS - MEDICAL SERVICES ||============================== //

const utilities: MenuGroup = {
  id: 'medical-services',
  title: 'Medical Services',
  type: 'group',
  children: [
    {
      id: 'doctors',
      title: 'Doctors',
      type: 'item',
      url: '/doctors',
      icon: icons.TeamOutlined
    },
    {
      id: 'laboratory',
      title: 'Laboratory',
      type: 'item',
      url: '/laboratory',
      icon: icons.ExperimentOutlined
    },
    {
      id: 'reports',
      title: 'Reports',
      type: 'item',
      url: '/reports',
      icon: icons.FileTextOutlined
    },
    {
      id: 'schedule',
      title: 'Schedule',
      type: 'item',
      url: '/schedule',
      icon: icons.ScheduleOutlined
    },
    {
      id: 'billing',
      title: 'Billing',
      type: 'item',
      url: '/billing',
      icon: icons.DollarOutlined
    },
    {
      id: 'analytics',
      title: 'Analytics',
      type: 'item',
      url: '/analytics',
      icon: icons.BarChartOutlined
    }
  ]
};

export default utilities;
