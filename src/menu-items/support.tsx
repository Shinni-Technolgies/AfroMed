// assets
import { SettingOutlined, QuestionCircleOutlined, MessageOutlined, CrownOutlined } from '@ant-design/icons';

// types
import { MenuGroup } from '../types/menu';

// icons
const icons = {
  SettingOutlined,
  QuestionCircleOutlined,
  MessageOutlined,
  CrownOutlined
};

// ==============================|| MENU ITEMS - SETTINGS & SUPPORT ||============================== //

const support: MenuGroup = {
  id: 'support',
  title: 'Settings & Support',
  type: 'group',
  children: [
    {
      id: 'admin',
      title: 'Admin',
      type: 'item',
      url: '/admin',
      icon: icons.CrownOutlined,
      breadcrumbs: true
    },
    {
      id: 'settings',
      title: 'Settings',
      type: 'item',
      url: '/settings',
      icon: icons.SettingOutlined
    },
    {
      id: 'help-center',
      title: 'Help Center',
      type: 'item',
      url: '/help',
      icon: icons.QuestionCircleOutlined
    },
    {
      id: 'messages',
      title: 'Messages',
      type: 'item',
      url: '/messages',
      icon: icons.MessageOutlined
    }
  ]
};

export default support;
