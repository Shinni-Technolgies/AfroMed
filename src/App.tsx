import { RouterProvider } from 'react-router-dom';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';

import ScrollTop from 'components/ScrollTop';
import { OrgProvider } from 'contexts/OrgContext';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <OrgProvider>
        <ScrollTop>
          <RouterProvider router={router} />
        </ScrollTop>
      </OrgProvider>
    </ThemeCustomization>
  );
}
