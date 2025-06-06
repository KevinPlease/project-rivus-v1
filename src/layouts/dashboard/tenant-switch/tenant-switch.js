import PropTypes from 'prop-types';
// import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import Box from '@mui/material/Box';
// import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
// import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { useAuth } from "../../../hooks/use-auth";
import { ExString } from 'server/src/shared/String';
// import { usePopover } from 'src/hooks/use-popover';

// import { TenantPopover } from './tenant-popover';

// const tenants = ['The Best Branch', 'That Other Branch'];

export const TenantSwitch = (props) => {
  // const popover = usePopover();
  const { user } = useAuth();
  if (!user) return;

  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
        {...props}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            color="inherit"
            variant="h6"
          >
            { user.domain }
          </Typography>
          <Typography
            color="neutral.400"
            variant="body2"
          >
            { ExString.capitalize(user.branch) }
          </Typography>
        </Box>
        {/* <IconButton
          onClick={popover.handleOpen}
          ref={popover.anchorRef}
        >
          <SvgIcon sx={{ fontSize: 16 }}>
            <ChevronDownIcon />
          </SvgIcon>
        </IconButton> */}
      </Stack>
      {/* <TenantPopover
        anchorEl={popover.anchorRef.current}
        onChange={popover.handleClose}
        onClose={popover.handleClose}
        open={popover.open}
        tenants={tenants}
      /> */}
    </>
  );
};

TenantSwitch.propTypes = {
  sx: PropTypes.object
};