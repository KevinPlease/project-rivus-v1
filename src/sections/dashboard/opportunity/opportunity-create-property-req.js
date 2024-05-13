import React, { useCallback, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ModalPopUp from "../../components/modals/ModalPopUp.jsx";
import BaseAPI from "../../../api/BaseAPI";
import opportunityAPI from "../../../api/opportunity";
import AutocompleteComponent from "../../components/inputs/AutocompleteComponent";
import { useAuth } from "../../../hooks/use-auth";
import { FastField, useFormikContext } from "formik";
import { AnimatePresence } from "framer-motion";
import ModalClient from "../client/modal-client";

const OpportunityCreatePropertyReq = ({ formOptions, unlockedEdit }) => {
  const formik = useFormikContext();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [resetOwner, setResetOwner] = useState(0);
  const [ownerOptions, setOwnerOptions] = useState([]);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const updateFormDetails = useCallback(async () => {
    const authInfo = BaseAPI.authForInfo(user);
    const formDetails = await opportunityAPI.getFormDetails(authInfo);
    setOwnerOptions(formDetails.owner);
      if (resetOwner) formik.setFieldValue("owner", formDetails.owner[formDetails.owner.length - 1]._id);
  }, [resetOwner]);

  useEffect(() => {
    updateFormDetails();
  }, [updateFormDetails]);

  const formOptionsDynamic = (form) => {
    return formOptions[form]?.map((option) => (
      <MenuItem key={option._id} value={option._id}>
        {option.data.name}
      </MenuItem>
    ));
  };


  return (
    <>
      <Card>
        <CardContent>
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-4 mb-6">
              <Typography variant="h6">
                Property Request
              </Typography>
            </div>
            <div className="col-span-12 md:col-span-8 grid md:grid-cols-2 gap-6">
              <TextField
                error={!!(formik.touched.title && formik.errors?.title)}
                fullWidth
                helperText={formik.touched.title && formik.errors?.title}
                label="Title"
                name="title"
                required
                disabled={!unlockedEdit}
                onBlur={formik.handleBlur}
                onChange={e => {
                  formik.setFieldValue("title", e.target.value);
                }}
                value={formik.values.title}
                className="md:col-span-2"
                sx={{
                  "& input": {
                    textTransform: "uppercase"
                  },
                }}
              />
              <FastField name="propertyType">
                {({ field, form }) => (
                  <TextField
                    error={!!(form.touched.propertyType && form.errors?.propertyType)}
                    fullWidth
                    label="Property Type"
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    select
                    required
                    disabled={!unlockedEdit}
                    value={field.value}
                  >
                    {formOptionsDynamic("propertyType")}
                  </TextField>
                )}
              </FastField>
              <FastField name="availability">
                {({ field, form }) => (
                  <TextField
                    error={!!(form.touched.availability && form.errors?.availability)}
                    fullWidth
                    label="Availability"
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    select
                    disabled={!unlockedEdit}
                    value={field.value}
                  >
                    {formOptionsDynamic("availability")}
                  </TextField>
                )}
              </FastField>
              <FastField name="businessType">
                {({ field, form }) => (
                  <TextField
                    error={!!(form.touched.businessType && form.errors?.businessType)}
                    fullWidth
                    label="Business Type"
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    select
                    disabled={!unlockedEdit}
                    value={field.value}
                  >
                    {formOptionsDynamic("businessType")}
                  </TextField>
                )}
              </FastField>
              <AutocompleteComponent
                formik={formik}
                options={formOptions?.assignee}
                fieldName="assignee"
                placeholder="Agent"
                unlockedEdit={unlockedEdit}
              />
              <AutocompleteComponent
                formik={formik}
                options={ownerOptions}
                fieldName="owner"
                unlockedEdit={unlockedEdit}
                placeholder="Owner"
              />
              <FastField name="source">
                {({ field, form }) => (
                  <TextField
                    error={!!(form.touched.source && form.errors?.source)}
                    fullWidth
                    label="Opportunity Source"
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    select
                    disabled={!unlockedEdit}
                    value={field.value}
                  >
                    {formOptionsDynamic("source")}
                  </TextField>
                )}
              </FastField>
              <Stack direction="row" justifyContent="flex-start">
                <Button
                  size="large"
                  color="inherit"
                  variant="outlined"
                  onClick={handleOpen}
                  disabled={!unlockedEdit} >
                  Add Client
                </Button>
              </Stack>
            </div>
          </div>
        </CardContent>
      </Card>
      <AnimatePresence>
        {open && <ModalPopUp open={open} handleClose={handleClose} setResetOwner={setResetOwner}>
          <ModalClient formOptions={formOptions} handleClose={handleClose} setResetOwner={setResetOwner} />
        </ModalPopUp>}
      </AnimatePresence>
    </>
  );
};

export default OpportunityCreatePropertyReq;
