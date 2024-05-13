import { useCallback, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Input from "@mui/material/Input";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";

import { MultiSelect } from "src/components/multi-select";
import { MDateRangePicker } from "src/components/date-range-picker";
import { useUpdateEffect } from "src/hooks/use-update-effect";
import { useOnceEffect } from "src/hooks/use-once-effect";
import { Fields } from "src/api/Fields";
import { dateStringFromTimestamp } from "src/utils/date-locale";

const TITLE = Fields.TITLE;
const DISPLAY_ID = Fields.DISPLAY_ID;
const FULL_NAME = Fields.FULL_NAME;
const SOURCE = Fields.SOURCE;
const ASSIGNEE = Fields.ASSIGNEE;
const DATE_CREATED = Fields.DATE_CREATED;


export const LeadsFilters = (props) => {
  const { formDetails, onFiltersChange, ...other } = props;
  const queryRef = useRef(null);
  const gridFilters = useSelector(state => state.gridFilters);
  const [chips, setChips] = useState([]);

  const handleChipsUpdate = useCallback(() => {
    const newFilters = {
      [DISPLAY_ID]: undefined,
      [FULL_NAME]: undefined,
      [TITLE]: "",
      [ASSIGNEE]: [],
      [SOURCE]: [],
      [DATE_CREATED]: undefined
    };

    chips.forEach((chip) => {
      switch (chip.field) {
        case TITLE:
          // There will (or should) be only one chips with field "title"
          // so we can set up it directly
          newFilters[TITLE] = chip.value;
          newFilters[DISPLAY_ID] = chip.value;
          newFilters[FULL_NAME] = chip.value;
          break;
        case SOURCE:
          newFilters[SOURCE].push(chip.value);
          break;
        case ASSIGNEE:
          newFilters[ASSIGNEE].push(chip.value);
          break;
        case DATE_CREATED:
          newFilters[DATE_CREATED] = { from: chip.value.from.getTime(), to: chip.value.to.getTime() };
          break;
        default:
          break;
      }
    });

    onFiltersChange?.(newFilters);
  }, [chips, onFiltersChange]);

  useUpdateEffect(() => {
    handleChipsUpdate();
  }, [chips]);

  const handleChipDelete = useCallback((deletedChip) => {
    setChips((prevChips) => {
      return prevChips.filter((chip) => {
        // There can exist multiple chips for the same field.
        // Filter them by value.

        return !(deletedChip.field === chip.field && deletedChip.value === chip.value);
      });
    });
  }, []);

  const prepareQueryChips = useCallback((value, prevChips) => {
    if (!prevChips) prevChips = [];

    const found = prevChips.find((chip) => chip.field === TITLE);

    if (found && value) {
      return prevChips.map((chip) => {
        if (chip.field === TITLE) {
          return {
            ...chip,
            value: queryRef.current?.value || ""
          };
        }

        return chip;
      });
    }

    if (found && !value) {
      return prevChips.filter((chip) => chip.field !== TITLE);
    }

    if (!found && value) {
      const chip = {
        label: "Title",
        field: TITLE,
        value
      };

      return [...prevChips, chip];
    }

    return prevChips;
  }, []);

  const handleQueryChange = useCallback((event) => {
    event.preventDefault();

    const value = queryRef.current?.value || "";
    setChips((prevChips) => prepareQueryChips(value, prevChips));

    if (queryRef.current) {
      queryRef.current.value = "";
    }
  }, []);

  const prepareLeadSourceChips = useCallback((values, prevChips) => {
    const valuesFound = [];

    // First cleanup the previous chips
    const newChips = prevChips?.filter((chip) => {
      if (chip.field !== SOURCE) {
        return true;
      }

      const found = values.includes(chip.value);

      if (found) {
        valuesFound.push(chip.value);
      }

      return found;
    }) || [];

    // Nothing changed
    if (values.length === valuesFound.length) {
      return newChips;
    }

    values.forEach((value) => {
      if (!valuesFound.includes(value)) {
        const option = formDetails.source.find((option) => option._id === value);

        newChips.push({
          label: "Lead Source",
          field: SOURCE,
          value,
          displayValue: option.data.name
        });
      }
    });

    return newChips;
  }, [formDetails.source]);

  const handleLeadSourceChange = useCallback((values) => {
    setChips((prevChips) => prepareLeadSourceChips(values, prevChips));
  }, [formDetails.source]);


  const prepareAssigneeChips = useCallback((values, prevChips) => {
    const valuesFound = [];

    // First cleanup the previous chips
    const newChips = prevChips?.filter((chip) => {
      if (chip.field !== ASSIGNEE) {
        return true;
      }

      const found = values.includes(chip.value);

      if (found) {
        valuesFound.push(chip.value);
      }

      return found;
    }) || [];

    // Nothing changed
    if (values.length === valuesFound.length) {
      return newChips;
    }

    values.forEach((value) => {
      if (!valuesFound.includes(value)) {
        const option = formDetails.assignee.find((option) => option._id === value);

        newChips.push({
          label: "Agent",
          field: ASSIGNEE,
          value,
          displayValue: option.data.name
        });
      }
    });

    return newChips;
  }, [formDetails.assignee]);

  const handleAssigneeChange = useCallback((values) => {
    setChips((prevChips) => prepareAssigneeChips(values, prevChips));
  }, [formDetails.assignee]);


  const prepareDateChips = useCallback((dateRange, prevChips) => {
    const newChips = prevChips?.filter((chip) => {
      if (chip.field !== DATE_CREATED) {
        return true;
      }

      return false;
    }) || [];

    const fromDateString = dateStringFromTimestamp(dateRange.from, true);
    const toDateString = dateStringFromTimestamp(dateRange.to, true);

    newChips.push({
      label: "Date",
      field: DATE_CREATED,
      value: dateRange,
      displayValue: `${fromDateString} -- ${toDateString}`
    });

    return newChips;
  }, []);

  const handleDateChange = useCallback((dateRange) => {
    setChips((prevChips) => prepareDateChips(dateRange, prevChips));
  }, []);

  const handlerPrepareChip = useMemo(() => ({
    [ASSIGNEE]: prepareAssigneeChips,
    [SOURCE]: prepareLeadSourceChips,
    [DATE_CREATED]: prepareDateChips,
  }), [formDetails]);

  useOnceEffect(() => {
    if (gridFilters.current !== "lead") return;
    
    let newChips = [];
    const filters = gridFilters.filters;
    for (const filterKey of Object.keys(filters)) {
      const filterVal = filters[filterKey];
      if (!filterVal) continue;

      const chipHandler = handlerPrepareChip[filterKey];
      if (chipHandler) {
        let curChips = chipHandler(filterVal);

        newChips = newChips.concat(curChips);
      } else {
        newChips = prepareQueryChips(filterVal);
      }
    }

    setChips(newChips);
  }, [formDetails.assignee]);


  // We memoize this part to prevent re-render issues
  const leadSourceValues = useMemo(() => chips
    .filter((chip) => chip.field === SOURCE)
    .map((chip) => chip.value), [chips]);

  const assigneeValues = useMemo(() => chips
    .filter((chip) => chip.field === ASSIGNEE)
    .map((chip) => chip.value), [chips]);

  const dateRangeValues = useMemo(() => chips
    .filter((chip) => chip.field === DATE_CREATED)
    .map((chip) => chip.value), [chips]);

  const showChips = chips.length > 0;

  return (
    <div {...other}>
      <Stack
        alignItems="center"
        component="form"
        direction="row"
        onSubmit={handleQueryChange}
        spacing={2}
        sx={{ p: 2 }}
      >
        <SvgIcon>
          <SearchMdIcon />
        </SvgIcon>
        <Input
          defaultValue=""
          disableUnderline
          fullWidth
          inputProps={{ ref: queryRef }}
          placeholder="Search by Title, Name or ID"
          sx={{ flexGrow: 1 }}
        />
      </Stack>
      <Divider />
      {showChips
        ? (
          <Stack
            alignItems="center"
            direction="row"
            flexWrap="wrap"
            gap={1}
            sx={{ p: 2 }}
          >
            {chips.map((chip, index) => (
              <Chip
                key={index}
                label={(
                  <Box
                    sx={{
                      alignItems: "center",
                      display: "flex",
                      "& span": {
                        fontWeight: 600
                      }
                    }}
                  >
                    <>
                      <span>
                        {chip.label}
                      </span>
                      :
                      {" "}
                      {chip.displayValue || chip.value}
                    </>
                  </Box>
                )}
                onDelete={() => handleChipDelete(chip)}
                variant="outlined"
              />
            ))}
          </Stack>
        )
        : (
          <Box sx={{ p: 2.5 }}>
            <Typography
              color="text.secondary"
              variant="subtitle2"
            >
              No filters applied
            </Typography>
          </Box>
        )}
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        spacing={1}
        sx={{ p: 1 }}
      >
        <MultiSelect
          label="Lead Source"
          onChange={handleLeadSourceChange}
          options={formDetails.source}
          value={leadSourceValues}
        />
        <MultiSelect
          label="Agent"
          onChange={handleAssigneeChange}
          options={formDetails.assignee}
          value={assigneeValues}
        />
        <MDateRangePicker
          label="Date"
          onChange={handleDateChange}
          value={dateRangeValues[0]}
        />
      </Stack>
    </div>
  );
};

LeadsFilters.propTypes = {
  onFiltersChange: PropTypes.func,
  formDetails: PropTypes.object
};
