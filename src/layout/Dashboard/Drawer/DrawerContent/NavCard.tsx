// material-ui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// project import
import MainCard from 'components/MainCard';
import AnimateButton from 'components/@extended/AnimateButton';

// icons
import { MedicineBoxOutlined, StarFilled } from '@ant-design/icons';

// ==============================|| DRAWER CONTENT - AFROMED PRO CARD ||============================== //

export default function NavCard(): JSX.Element {
  const theme = useTheme();

  return (
    <MainCard
      sx={{
        m: 3,
        background: `linear-gradient(135deg, ${theme.vars.palette.primary.main} 0%, ${theme.vars.palette.primary.dark} 100%)`,
        color: 'white',
        border: 'none'
      }}
    >
      <Stack alignItems="center" spacing={1.5}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            color: 'white'
          }}
        >
          <MedicineBoxOutlined />
        </Box>
        <Stack alignItems="center" spacing={0.5}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
            AfroMed Pro
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
            Unlock advanced clinical features
          </Typography>
        </Stack>
        <AnimateButton>
          <Button
            variant="contained"
            size="small"
            startIcon={<StarFilled style={{ fontSize: 12 }} />}
            sx={{
              bgcolor: 'white',
              color: theme.vars.palette.primary.main,
              fontWeight: 700,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
            }}
          >
            Upgrade to Pro
          </Button>
        </AnimateButton>
      </Stack>
    </MainCard>
  );
}
