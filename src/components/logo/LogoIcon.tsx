// material-ui
import { useTheme } from '@mui/material/styles';

// ==============================|| AFROMED LOGO ICON ||============================== //

export default function LogoIcon(): JSX.Element {
  const theme = useTheme();

  return (
    <svg width="35" height="35" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Circle */}
      <circle cx="20" cy="20" r="18" fill={theme.vars.palette.primary.main} />
      {/* Medical Cross */}
      <path
        d="M16 10H24V16H30V24H24V30H16V24H10V16H16V10Z"
        fill="white"
      />
      {/* Heart accent */}
      <path
        d="M20 28C20 28 27 23 27 18.5C27 16 25 14 23 14C21.5 14 20.5 15 20 16C19.5 15 18.5 14 17 14C15 14 13 16 13 18.5C13 23 20 28 20 28Z"
        fill={theme.vars.palette.error.light}
        opacity="0.9"
      />
    </svg>
  );
}
