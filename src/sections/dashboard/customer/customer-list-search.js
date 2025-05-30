import {useCallback, useEffect, useState} from "react";
import PropTypes from "prop-types";
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import { Fields } from "src/api/Fields";
import { useOnceEffect } from "src/hooks/use-once-effect";
import { useSelector } from "react-redux";
import { useUpdateEffect } from "src/hooks/use-update-effect";

const DISPLAY_ID = Fields.DISPLAY_ID;
const TITLE = Fields.TITLE;
const NAME = Fields.NAME;

// const tabs = [
//   {
//     label: 'All',
//     value: 'all'
//   },
//   {
//     label: 'Suppliers',
//     value: 'suppliers'
//   },
//   {
//     label: 'Demanders',
//     value: 'demanders'
//   }
// ];

// const sortOptions = [
//   {
//     label: 'Last update (newest)',
//     value: 'updatedAt|desc'
//   },
//   {
//     label: 'Last update (oldest)',
//     value: 'updatedAt|asc'
//   },
//   {
//     label: 'Total orders (highest)',
//     value: 'totalOrders|desc'
//   },
//   {
//     label: 'Total orders (lowest)',
//     value: 'totalOrders|asc'
//   }
// ];

export const CustomerListSearch = ({ handleFiltersChange, formDetails }) => {
  const gridFilters = useSelector(state => state.gridFilters);
  const [userInput, setUserInput] = useState("");
  // const [currentTab, setCurrentTab] = useState('all');
  // const [filters, setFilters] = useState({});

  // const handleTabsChange = useCallback((event, value) =>
  // {
  //   setCurrentTab(value);
  //   setFilters((prevState) =>
  //   {
  //     const updatedFilters = {
  //       ...prevState,
  //       hasAcceptedMarketing: undefined,
  //       isProspect: undefined,
  //       isReturning: undefined
  //     };

  //     if (value !== 'all')
  //     {
  //       updatedFilters[value] = true;
  //     }

  //     return updatedFilters;
  //   });
  // }, []);

  const handleInputChange = useCallback((event) => {
    setUserInput(event.target.value);
  }, []);

  useUpdateEffect(() => {
    const handleUserTyping = () => {
      handleFiltersChange({
        [TITLE]: userInput,
        [NAME]: userInput,
        [DISPLAY_ID]: userInput
      }, "or");
    };
    
    const typingTimer = setTimeout(handleUserTyping, 500);

    // Cleanup function to clear the timer when the component unmounts or the input changes.
    return () => {
      clearTimeout(typingTimer);
    };
  }, [userInput]);

  useOnceEffect(() => {
    if (gridFilters.current !== "customer") return;

    setUserInput(gridFilters.filters.title || "");
  }, [formDetails]);

 return (
    <>
      {/* <Tabs
        indicatorColor="primary"
        onChange={handleTabsChange}
        scrollButtons="auto"
        sx={{ px: 3 }}
        textColor="primary"
        value={currentTab}
        variant="scrollable"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            value={tab.value}
          />
        ))}
      </Tabs>
      <Divider /> */}
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        spacing={3}
        sx={{ p: 3 }}
      >
        <Box
          sx={{ flexGrow: 1 }}
        >
          <OutlinedInput
            fullWidth
            value={userInput}
            onChange={handleInputChange}
            placeholder="Search Title, Name or ID"
            startAdornment={(
              <InputAdornment position="start">
                <SvgIcon>
                  <SearchMdIcon />
                </SvgIcon>
              </InputAdornment>
            )}
          />
        </Box>
        {/* <TextField
          label="Sort By"
          name="sort"
          // onChange={handleSortChange}
          select
          SelectProps={{ native: true }}
          // value={`${sortBy}|${sortDir}`}
        >
          {sortOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </TextField> */}
      </Stack>
    </>
  );
};

CustomerListSearch.propTypes = {
  onFiltersChange: PropTypes.func,
  onSortChange: PropTypes.func,
  sortBy: PropTypes.string,
  sortDir: PropTypes.oneOf(["asc", "desc"])
};
