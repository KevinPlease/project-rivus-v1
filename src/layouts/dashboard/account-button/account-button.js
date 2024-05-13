import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";

import { useAuth } from "src/hooks/use-auth";
import { usePopover } from "src/hooks/use-popover";

import { AccountPopover } from "./account-popover";

export const AccountButton = () => {
  const popover = usePopover();
  const auth = useAuth();
  const user = auth?.user;
  
  return (
    <>
      <Box
        component={ButtonBase}
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        sx={{
          alignItems: "center",
          display: "flex",
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "divider",
          height: 40,
          width: 40,
          borderRadius: "50%"
        }}
      >
        <Avatar
          sx={{
            height: 32,
            width: 32
          }}
          src={user?.data.details.image?.url}
        >
          {/* <SvgIcon>
            <User01Icon />
          </SvgIcon> */}
        </Avatar>
      </Box>
      <AccountPopover
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
      />
    </>
  );
};
