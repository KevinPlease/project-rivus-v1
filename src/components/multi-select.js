import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SvgIcon from '@mui/material/SvgIcon';
import { usePopover } from 'src/hooks/use-popover';
import ChevronRightIcon from "@untitled-ui/icons-react/build/esm/ChevronRight";
import {motion} from 'framer-motion'
export const MultiSelect = (props) => {
  const { label, onChange, options, value = [], ...other } = props;
  const popover = usePopover();

  const handleValueChange = useCallback((event) => {
    let newValue = [...value];

    if (event.target.checked) {
      newValue.push(event.target.value);
    } else {
      newValue = newValue.filter((item) => item !== event.target.value);
    }

    onChange?.(newValue);
  }, [onChange, value]);

  return (
    <>
      <Button
        color="inherit"
        endIcon={(
            <SvgIcon
                component={motion.div}
                animate={{rotate: popover.open ? 90 : 0}}
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
        PaperProps={{ style: { width: 250 } }}
      >
        {options.map((option) => (
          <MenuItem key={option._id}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={value.includes(option._id)}
                  onChange={handleValueChange}
                  value={option._id}
                />
              )}
              label={option.data.name || option.data.title}
              sx={{
                flexGrow: 1,
                mr: 0
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

MultiSelect.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired
};
