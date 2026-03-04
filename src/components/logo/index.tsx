import { Link } from 'react-router-dom';

// material-ui
import ButtonBase from '@mui/material/ButtonBase';
import { SxProps, Theme } from '@mui/material/styles';

// project imports
import Logo from './LogoMain';
import LogoIcon from './LogoIcon';
import { APP_DEFAULT_PATH } from 'config';

// ==============================|| MAIN LOGO ||============================== //

interface LogoSectionProps {
  reverse?: boolean;
  isIcon?: boolean;
  sx?: SxProps<Theme>;
  to?: string;
}

export default function LogoSection({ reverse, isIcon, sx, to }: LogoSectionProps) {
  return (
    <ButtonBase disableRipple component={Link} to={to || APP_DEFAULT_PATH} sx={sx} aria-label="Logo">
      {isIcon ? <LogoIcon /> : <Logo reverse={reverse} />}
    </ButtonBase>
  );
}
