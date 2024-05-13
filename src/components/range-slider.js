import React, { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import SvgIcon from "@mui/material/SvgIcon";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { usePopover } from "src/hooks/use-popover";
import ChevronRightIcon from "@untitled-ui/icons-react/build/esm/ChevronRight";

export const RangeSlider = (props) => {
  const {
    label,
    onChange,
    value = {
      from: 0,
      to: 2000000
    },
    ...other } = props;
  const popover = usePopover();
  const timeoutIdRef = useRef(null);
  const [curValue, setCurValue] = useState(value);

  const handleInputChange = (event, targetSlider) => {
    const boundValue = Math.min(Math.max(event.target.value, 0), 10000000);
    let values, activeThumb;
    if (targetSlider === "from") {
      values = [boundValue];
      activeThumb = 0;
    } else {
      values = [value.from, boundValue];
      activeThumb = 1;
    }

    handleRangeChange(null, values, activeThumb);
  };

  const handleRangeChange = useCallback((event, newValue, activeThumb) => {
    let range = null;
    if (activeThumb === 0) {
      range = {
        from: newValue[0],
        to: value.to
      };

    } else {
      range = {
        from: value.from,
        to: newValue[1]
      };

    }

    setCurValue(range);

    if (timeoutIdRef.value) {
      clearTimeout(timeoutIdRef.value);
    }
    timeoutIdRef.value = setTimeout(() => {
      onChange?.(range);
      timeoutIdRef.value = null;
    }, 500);

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
        PaperProps={{ style: { width: "30%", minWidth: 350 } }}
      >
        <Box textAlign="center" padding={4}>
          <Grid container spacing={2} sx={{ px: 2 }} alignItems="center">
            <Grid item xs={3}>
              <Input
                value={curValue.from}
                size="small"
                onChange={e => {
                  if (!(/^[0-9,]*$/.test(e.target.value))) return;

                  const rawValue = Number.parseInt(e.target.value.replace(/,/g, ""));
                  const fakeEvent = { target: { value: rawValue } };
                  handleInputChange(fakeEvent, "from");
                }}
              />
            </Grid>
            <Grid item xs>
              <Slider
                step={300}
                min={0}
                max={2000000}
                valueLabelDisplay="auto"
                // getAriaValueText={valuetext}
                size="medium"
                defaultValue={[curValue.from, curValue.to]}
                value={[curValue.from, curValue.to]}
                onChange={handleRangeChange}
              />
            </Grid>
            <Grid item xs={3}>
              <Input
                value={curValue.to}
                size="small"
                onChange={e => {
                  if (!(/^[0-9,]*$/.test(e.target.value))) return;

                  const rawValue = Number.parseInt(e.target.value.replace(/,/g, ""));
                  const fakeEvent = { target: { value: rawValue } };
                  handleInputChange(fakeEvent, "to");
                }}
              />
            </Grid>
          </Grid>
        </Box>

      </Menu>
    </>
  );
};

RangeSlider.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.object
};
