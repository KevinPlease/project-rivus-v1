import { useCallback } from "react";
import PropTypes from "prop-types";
import DotsHorizontalIcon from "@untitled-ui/icons-react/build/esm/DotsHorizontal";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SvgIcon from "@mui/material/SvgIcon";

import { usePopover } from "src/hooks/use-popover";

export const PriorityHeader = (props) => {
  const { name, onClear } = props;
  const popover = usePopover();


  const handleClear = useCallback(() => {
    popover.handleClose();
    onClear?.();
  }, [popover, onClear]);

  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{
          pr: 2,
          py: 1
        }}
      >
        <Typography variant="b1">
          {name}
        </Typography>
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <IconButton
            edge="end"
            onClick={popover.handleOpen}
            ref={popover.anchorRef}
          >
            <SvgIcon>
              <DotsHorizontalIcon />
            </SvgIcon>
          </IconButton>
        </Stack>
      </Stack>
      <Menu
        anchorEl={popover.anchorRef.current}
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom"
        }}
        keepMounted
        onClose={popover.handleClose}
        open={popover.open}
      >
        <MenuItem onClick={handleClear}>
          Clear
        </MenuItem>
      </Menu>
    </>
  );
};

PriorityHeader.propTypes = {
  name: PropTypes.string.isRequired,
  onClear: PropTypes.func
};
