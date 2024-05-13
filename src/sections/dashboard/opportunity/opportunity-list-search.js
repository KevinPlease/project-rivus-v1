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
import { useAuth } from "../../../hooks/use-auth";
import { MultiSelect } from "src/components/multi-select";
import { RangeSlider } from "src/components/range-slider";
import { MDateRangePicker } from "src/components/date-range-picker";
import { useUpdateEffect } from "src/hooks/use-update-effect";
import { dateStringFromTimestamp } from "src/utils/date-locale";

import { Fields, RANGED_FIELDS } from "src/api/Fields";
import { useOnceEffect } from "src/hooks/use-once-effect";

const DISPLAY_ID = Fields.DISPLAY_ID;
const TITLE = Fields.TITLE;
const ZONE = Fields.ZONE;
const AVAILABILITY = Fields.AVAILABILITY;
const BUSINESS_TYPE = Fields.BUSINESS_TYPE;
const HAS_MORTGAGE = Fields.HAS_MORTGAGE;
const NO_MORTGAGE = Fields.NO_MORTGAGE;
const ASSIGNEE = Fields.ASSIGNEE;
const PRICE = Fields.PRICE;
const DATE_CREATED = Fields.DATE_CREATED;
const RANGED_PRICE_FROM = RANGED_FIELDS.PRICE_FROM;
const RANGED_PRICE_TO = RANGED_FIELDS.PRICE_TO;

const mortgageOptions = [
  {
    _id: "1",
    data: { name: "All" },
    value: "all"
  },
  {
    _id: HAS_MORTGAGE,
    data: { name: "Has Mortgage" },
    value: "2"
  },
  {
    _id: NO_MORTGAGE,
    data: { name: "No Mortgage" },
    value: NO_MORTGAGE
  }
];

export const OpportunityListSearch = (props) => {
  const { formDetails, onFiltersChange, ...other } = props;
  const queryRef = useRef(null);
  const gridFilters = useSelector(state => state.gridFilters);
  const [chips, setChips] = useState([]);
  const { user } = useAuth();

  const handleChipsUpdate = useCallback(() => {
    const newFilters = {
      [DISPLAY_ID]: undefined,
      [TITLE]: undefined,
      [ZONE]: undefined,
      [AVAILABILITY]: [],
      [BUSINESS_TYPE]: [],
      [ASSIGNEE]: [],
      [RANGED_PRICE_FROM]: undefined,
      [RANGED_PRICE_TO]: undefined,
      [DATE_CREATED]: undefined,
      [HAS_MORTGAGE]: undefined
    };

    chips.forEach((chip) => {
      switch (chip.field) {
        case TITLE:
          // There will (or should) be only one chips with field "name"
          // so we can set up it directly
          newFilters[TITLE] = chip.value;
          newFilters[DISPLAY_ID] = chip.value;
          newFilters[ZONE] = chip.value;
          break;
        case AVAILABILITY:
          newFilters[AVAILABILITY].push(chip.value);
          break;
        case BUSINESS_TYPE:
          newFilters[BUSINESS_TYPE].push(chip.value);
          break;
        case PRICE:
          newFilters[RANGED_PRICE_FROM] = { from: chip.value.from };
          newFilters[RANGED_PRICE_TO] = { to: chip.value.to };
          break;
        case DATE_CREATED:
          newFilters[DATE_CREATED] = { from: chip.value.from.getTime(), to: chip.value.to.getTime() };
          break;
        case HAS_MORTGAGE:
          // The value can be "available" or "outOfStock" and we transform it to a boolean
          newFilters[HAS_MORTGAGE] = chip.value === HAS_MORTGAGE;
          break;
        case ASSIGNEE:
          newFilters[ASSIGNEE].push(chip.value);
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

  const prepareAvailabilityChips = useCallback((values, prevChips) => {
    const valuesFound = [];

    // First cleanup the previous chips
    const newChips = prevChips?.filter((chip) => {
      if (chip.field !== AVAILABILITY) {
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
        const option = formDetails.availability.find((option) => option._id === value);

        newChips.push({
          label: "Availability",
          field: AVAILABILITY,
          value,
          displayValue: option.data.name
        });
      }
    });

    return newChips;
  }, [formDetails.availability]);

  const handleAvailabilityChange = useCallback((values) => {
    setChips((prevChips) => prepareAvailabilityChips(values, prevChips));
  }, [formDetails.availability]);

  const prepareBusinessTypeChips = useCallback((values, prevChips) => {
    const valuesFound = [];

    // First cleanup the previous chips
    const newChips = prevChips?.filter((chip) => {
      if (chip.field !== BUSINESS_TYPE) {
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
        const option = formDetails.businessType.find((option) => option._id === value);

        newChips.push({
          label: "Offering Type",
          field: BUSINESS_TYPE,
          value,
          displayValue: option.data.name
        });
      }
    });

    return newChips;
  }, [formDetails.businessType]);

  const handleBusinessTypeChange = useCallback((values) => {
    setChips((prevChips) => prepareBusinessTypeChips(values, prevChips));
  }, [formDetails.businessType]);

  const preparePriceChips = useCallback((priceRange, prevChips) => {
    const newChips = prevChips?.filter((chip) => {
      if (chip.field !== PRICE) {
        return true;
      }

      return false;
    }) || [];

    newChips.push({
      label: "Price",
      field: PRICE,
      value: priceRange,
      displayValue: `${priceRange.from} -- ${priceRange.to}`
    });

    return newChips;
  }, []);

  const handlePriceChange = useCallback((priceRange) => {
    setChips((prevChips) => preparePriceChips(priceRange, prevCH));
  }, []);

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

  const prepareMortgageChips = useCallback((values, prevChips) => {
    // Stock can only have one value, even if displayed as multi-select, so we select the first one.
    // This example allows you to select one value or "All", which is not included in the
    // rest of multi-selects.
    // First cleanup the previous chips
    const newChips = prevChips?.filter((chip) => chip.field !== HAS_MORTGAGE) || [];
    const latestValue = values[values.length - 1];

    switch (latestValue) {
      case HAS_MORTGAGE:
        newChips.push({
          label: "Has Mortgage",
          field: HAS_MORTGAGE,
          value: HAS_MORTGAGE,
          displayValue: "Has Mortgage"
        });
        break;
      case NO_MORTGAGE:
        newChips.push({
          label: "Has Mortgage",
          field: HAS_MORTGAGE,
          value: NO_MORTGAGE,
          displayValue: "No Mortgage"
        });
        break;
      default:
        // Should be "all", so we do not add this filter
        break;
    }

    return newChips;
  }, []);

  const handleMortgageChange = useCallback((values) => {
    setChips((prevChips) => prepareMortgageChips(values, prevChips));
  }, []);

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

  const handlerPrepareChip = useMemo(() => ({
    [ASSIGNEE]: prepareAssigneeChips,
    [AVAILABILITY]: prepareAvailabilityChips,
    [BUSINESS_TYPE]: prepareBusinessTypeChips,
    [PRICE]: preparePriceChips,
    [DATE_CREATED]: prepareDateChips,
    [HAS_MORTGAGE]: prepareMortgageChips
  }), [formDetails]);

  useOnceEffect(() => {
    let newChips = [];
    const filters = gridFilters.filters;
    if (user?._id && !filters[ASSIGNEE]?.includes(user?._id)) {
      newChips.push({
        displayValue: user.data.name,
        field: "assignee",
        label: "Agent",
        value: user._id,
      });
    }

    if (gridFilters.current !== "opportunity") return setChips(newChips);;
    
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
  }, [formDetails.availability]);


  // We memoize this part to prevent re-render issues
  const availabilityValues = useMemo(() => chips
    .filter((chip) => chip.field === AVAILABILITY)
    .map((chip) => chip.value), [chips]);

  const businessTypeValues = useMemo(() => chips
    .filter((chip) => chip.field === BUSINESS_TYPE)
    .map((chip) => chip.value), [chips]);

  const priceRangeValues = useMemo(() => chips
    .filter((chip) => chip.field === PRICE)
    .map((chip) => chip.value), [chips]);

  const dateRangeValues = useMemo(() => chips
    .filter((chip) => chip.field === DATE_CREATED)
    .map((chip) => chip.value), [chips]);

  const mortgageValues = useMemo(() => {
    const values = chips
      .filter((chip) => chip.field === HAS_MORTGAGE)
      .map((chip) => chip.value);
    // Since we do not display the "all" as chip, we add it to the multi-select as a selected value
    if (values.length === 0) {
      values.unshift("all");
    }

    return values;
  }, [chips]);

  const assigneeValues = useMemo(() => chips
    .filter((chip) => chip.field === ASSIGNEE)
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
          placeholder="Search by Title, Zone or ID"
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
          label="Availability"
          onChange={handleAvailabilityChange}
          options={formDetails.availability}
          value={availabilityValues}
        />
        <MultiSelect
          label="Offering Type"
          onChange={handleBusinessTypeChange}
          options={formDetails.businessType}
          value={businessTypeValues}
        />
        <MultiSelect
          label="Mortgage"
          onChange={handleMortgageChange}
          options={mortgageOptions}
          value={mortgageValues}
        />
        <MultiSelect
          label="Agent"
          onChange={handleAssigneeChange}
          options={formDetails.assignee}
          value={assigneeValues}
        />
        <RangeSlider
          label="Price"
          onChange={handlePriceChange}
          value={priceRangeValues[0]}
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

OpportunityListSearch.propTypes = {
  onFiltersChange: PropTypes.func,
  formDetails: PropTypes.object
};
