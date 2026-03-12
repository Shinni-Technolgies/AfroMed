import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - color
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// render - patients
const Patients = Loadable(lazy(() => import('pages/patients')));

// render - appointments
const Appointments = Loadable(lazy(() => import('pages/appointments')));

// render - pharmacy
const Pharmacy = Loadable(lazy(() => import('pages/pharmacy')));

// render - doctors
const Doctors = Loadable(lazy(() => import('pages/doctors')));

// render - health records
const HealthRecords = Loadable(lazy(() => import('pages/health-records')));

// render - laboratory
const Laboratory = Loadable(lazy(() => import('pages/laboratory')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'patients',
      element: <Patients />
    },
    {
      path: 'doctors',
      element: <Doctors />
    },
    {
      path: 'appointments',
      element: <Appointments />
    },
    {
      path: 'pharmacy',
      element: <Pharmacy />
    },
    {
      path: 'health-records',
      element: <HealthRecords />
    },
    {
      path: 'laboratory',
      element: <Laboratory />
    }
  ]
};

export default MainRoutes;
