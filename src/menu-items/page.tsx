// assets
import { LoginOutlined, ProfileOutlined, UserAddOutlined } from '@ant-design/icons';

// types
import { MenuGroup } from '../types/menu';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  UserAddOutlined
};

// ==============================|| MENU ITEMS - AUTHENTICATION ||============================== //

const pages: MenuGroup = {
  id: 'authentication',
  title: 'Account',
  type: 'group',
  children: [
    {
      id: 'profile',
      title: 'My Profile',
      type: 'item',
      url: '/profile',
      icon: icons.ProfileOutlined
    },
    {
      id: 'login1',
      title: 'Login',
      type: 'item',
      url: '/login',
      icon: icons.LoginOutlined,
      target: true
    },
    {
      id: 'register1',
      title: 'Register',
      type: 'item',
      url: '/register',
      icon: icons.UserAddOutlined,
      target: true
    }
  ]
};

export default pages;
