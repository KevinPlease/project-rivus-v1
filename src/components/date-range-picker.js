import React, { useCallback, useMemo } from "react";
import { DateRangePicker } from "materialui-daterange-picker";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import SvgIcon from "@mui/material/SvgIcon";
import Box from "@mui/material/Box";
import { usePopover } from "src/hooks/use-popover";
import ChevronRightIcon from "@untitled-ui/icons-react/build/esm/ChevronRight";


export const MDateRangePicker = (props) => {
  const previousMonthDate = useMemo(() => {
    const dateNow = new Date(Date.now());
    dateNow.setMonth(dateNow.getMonth() - 1);
    return dateNow;
  }, []);
  
  const {
    label,
    onChange,
    value = {
      from: previousMonthDate.getTime(),
      to: new Date(Date.now()).getTime()
    },
    ...other } = props;
  const popover = usePopover();

  const handleRangeChange = useCallback((event) => {
    event.endDate.setHours(23, 59, 59);
    
    const range = {
      from: event.startDate,
      to: event.endDate
    };

    onChange?.(range);
  }, [value]);

  const formattedValues = useMemo(() => {
    return { startDate: new Date(value.from), endDate: new Date(value.to) };
  }, [value]);

  return (
    <>
      <Button
        color="inherit"
        endIcon={(
          <SvgIcon
            component={motion.div}
            animate={{ rotate: popover.open ? 90 : 0 }}
          >
            <ChevronRightIcon />
          </SvgIcon>
        )}
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        {...other}>
        {label}
      </Button>

      <Menu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{ style: { width: "30%", minWidth: 650 } }}
      >
        <Box textAlign="center" padding={4}>
          <DateRangePicker
            open={popover.open}
            initialDateRange={formattedValues}
            toggle={popover.handleClose}
            closeOnClickOutside
            definedRanges={[]}
            onChange={handleRangeChange}
          />
        </Box>

      </Menu>
    </>
  );
};

MDateRangePicker.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.object
};
