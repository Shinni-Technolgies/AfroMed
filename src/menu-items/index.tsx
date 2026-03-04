// project import
import dashboard from './dashboard';
import pages from './page';
import utilities from './utilities';
import support from './support';

// types
import { MenuItems } from '../types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: MenuItems = {
  items: [dashboard, pages, utilities, support]
};

export default menuItems;
