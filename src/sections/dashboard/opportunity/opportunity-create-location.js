import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";

import { MultiSelect } from "src/components/multi-select";
import { COUNTRIES, CITIES, ZONES } from "src/data/countries";
import Image from "next/image";
import { useFormikContext } from "formik";

const OpportunityCreateLocation = ({ formOptions, unlockedEdit, handleZonesChanged, selectedZones }) => {
  const formik = useFormikContext()
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);
  useEffect(() => {
    if (formik?.values?.country === "Albania" && !cities.length) {
      setCities(CITIES["AL"])
    }
    if (cities?.length && formik?.values?.country === "Albania" && !zones?.length) {
      setZones(ZONES[formik.values.city])
    }
  }, [formik?.values?.city, cities?.length, formik?.values?.country]);

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-4 mb-6">
            <Typography variant="h6">
              Location
            </Typography>
          </div>
          <div className="col-span-12 md:col-span-8 grid md:grid-cols-2 gap-6">
            <Autocomplete
              id="country-select-demo"
              fullWidth
              options={COUNTRIES}
              autoHighlight
              onChange={(event, newValue) => {
                formik.setFieldValue("country", newValue ? newValue.label : "");
              }}
              disabled={!unlockedEdit}
              required
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, optionValue) => option?.label === optionValue?.label}
              value={COUNTRIES?.find((option) => option?.label === formik.values.country) || null}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  <img
                    loading="lazy"
                    width="20"
                    height="20"
                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                    alt=""
                  />
                  {option.label} ({option.code}) +{option.phone}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose a country"
                  required
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              )}
            />
            <TextField
              error={!!(formik.touched.city && formik.errors?.city)}
              fullWidth
              label="City"
              name="city"
              select
              onBlur={formik.handleBlur}
              onChange={(event, newValue) => {
                if (!newValue) {
                  setZones([])
                } else {
                  setZones(ZONES[newValue?.props?.value])
                }
                formik.setFieldValue("city", newValue?.props?.value);
              }}
              required
              disabled={!unlockedEdit || !formik.values.country}
              value={!!cities?.length ? formik.values.city : ""}
            >
              {cities?.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                >
                  {option}
                </MenuItem>
              ))}
            </TextField>

            <Autocomplete
              multiple
              id="checkboxes-tags-demo"
              options={zones || []}
              disableCloseOnSelect
              disabled={!unlockedEdit || !formik.values.city}
              onChange={(event, selectedValues) => {
                handleZonesChanged(selectedValues);
              }}
              value={selectedZones}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props}>
                  <Checkbox
                    style={{ marginRight: 8 }}
                    checked={selectedZones?.includes(option)}
                  />
                  {option}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  style={{ padding: 4 }}
                  label="Zones"
                />
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpportunityCreateLocation;
