// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { Theme } from '@mui/material/styles';

// project imports
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';

// icons
import { CalendarOutlined } from '@ant-design/icons';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent(): JSX.Element {
  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  return (
    <>
      {!downLG && <Search />}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      <Tooltip title="Appointments">
        <IconButton
          disableRipple
          color="secondary"
          sx={{ color: 'text.primary', bgcolor: 'grey.100' }}
        >
          <CalendarOutlined />
        </IconButton>
      </Tooltip>

      <Notification />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
}
