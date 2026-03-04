// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function Footer() {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ gap: 1.5, alignItems: 'center', justifyContent: 'space-between', p: '24px 16px 0px', mt: 'auto' }}
    >
      <Typography variant="caption">
        &copy; {new Date().getFullYear()} AfroMed. All rights reserved.
      </Typography>
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/help" variant="caption" color="text.primary" underline="hover">
          Help Center
        </Link>
        <Link href="/settings" variant="caption" color="text.primary" underline="hover">
          Privacy
        </Link>
        <Link href="/settings" variant="caption" color="text.primary" underline="hover">
          Terms
        </Link>
      </Stack>
    </Stack>
  );
}
