import React from 'react';
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const AutocompleteComponent= ({options,formik,fieldName,unlockedEdit =true,quickEdit = false, index,placeholder})=>{
        return (
            <Autocomplete
                fullWidth
                disablePortal
                label=""
                onChange={(event, newValue) => {
                    formik.setFieldValue(quickEdit ? `[${index}][${fieldName}]` : fieldName, newValue ? newValue._id : "");
                }}
                options={options || []}
                disabled={!unlockedEdit || formik.values[fieldName] === "_CENSORED_"}
                getOptionLabel={(option) => option?.data?.name || ""}
                isOptionEqualToValue={ (option, optionValue) => option?._id === optionValue?._id}
                value={options?.find((option) => option?._id === (quickEdit ? formik.values[index][fieldName] : formik.values[fieldName])) || null}
                renderOption={(props, option) => (
                    <MenuItem key={option?._id} value={option?._id} {...props}>
                        {option?.data.name}
                    </MenuItem>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        name={fieldName}
                        required
                        label={formik.values[fieldName] === "_CENSORED_" ?  "_CENSORED_": (placeholder || "Choose")}
                        error={!!formik.touched[fieldName] && !!formik.errors && !!formik.errors[fieldName]}
                        helperText={formik.touched[fieldName] && formik.errors && formik.errors[fieldName]}
                        onBlur={formik.handleBlur}
                    />
                )}
            />
        );
}

export default AutocompleteComponent;