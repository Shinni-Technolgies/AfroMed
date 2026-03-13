// material-ui
import { useColorScheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

// assets
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

// ==============================|| HEADER CONTENT - THEME TOGGLE ||============================== //

export default function ThemeToggle() {
  const { mode, setMode } = useColorScheme();

  const handleToggle = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  const isDark = mode === 'dark';

  return (
    <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
      <IconButton
        disableRipple
        color="secondary"
        onClick={handleToggle}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        sx={{
          color: 'text.primary',
          bgcolor: 'grey.100',
          overflow: 'hidden',
          position: 'relative',
          width: 34,
          height: 34
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.4s ease, opacity 0.3s ease',
            transform: isDark ? 'rotate(180deg) scale(0)' : 'rotate(0deg) scale(1)',
            opacity: isDark ? 0 : 1,
            position: 'absolute'
          }}
        >
          <SunOutlined />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.4s ease, opacity 0.3s ease',
            transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(-180deg) scale(0)',
            opacity: isDark ? 1 : 0,
            position: 'absolute'
          }}
        >
          <MoonOutlined />
        </Box>
      </IconButton>
    </Tooltip>
  );
}
