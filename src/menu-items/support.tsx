// assets
import { SettingOutlined, QuestionCircleOutlined, MessageOutlined } from '@ant-design/icons';

// types
import { MenuGroup } from '../types/menu';

// icons
const icons = {
  SettingOutlined,
  QuestionCircleOutlined,
  MessageOutlined
};

// ==============================|| MENU ITEMS - SETTINGS & SUPPORT ||============================== //

const support: MenuGroup = {
  id: 'support',
  title: 'Settings & Support',
  type: 'group',
  children: [
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
