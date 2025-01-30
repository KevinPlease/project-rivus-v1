import React, { useEffect } from 'react'
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import AutocompleteComponent from "src/sections/components/inputs/AutocompleteComponent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useAuth } from "src/hooks/use-auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import BaseAPI from "src/api/BaseAPI";
import customerApi from "src/api/customer";
import toast from "react-hot-toast";

const REQUIRED = "This field is required"

const ModalCustomer = ({ formOptions, handleClose, handleSuccess }) => {
  const { user } = useAuth();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      mobile: "",
      email: "",
      address: "",
      referralSource: "",
      assignee: ""
    },
    validationSchema: Yup.object({
      name: Yup.string().max(255).required(REQUIRED),
      mobile: Yup.string().max(20).required(REQUIRED),
      email: Yup.string().max(255).required(REQUIRED),
      address: Yup.string().max(255).required(REQUIRED),
      referralSource: Yup.string().max(255).required(REQUIRED),
      assignee: Yup.string().max(24).required(REQUIRED)
    }),

    onSubmit: async (values, helpers) => {
      const authInfo = BaseAPI.authForInfo(user);
      const response = await customerApi.create(authInfo, values);

      if (response.status === "failure") {
        toast.error("Something went wrong!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: response.data });
        helpers.setSubmitting(false);
        return;
      }

      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
      handleSuccess(response._id);
      toast.success("Customer created!");
    },
  });

  return (
    <div className="p-4">
      <div className="flex flex-row justify-between mb-3">
        <Typography id="modal-modal-title" variant="h6" component="h2" >
          Add Customer
        </Typography >
      </div>
      <Grid
        container
        spacing={3}
      >

        <Grid
          xs={12}
          md={12}
        >

          <Stack spacing={3}>
            <TextField
              error={!!(formik?.touched.name && formik.errors?.name)}
              fullWidth
              helperText={formik?.touched.name && formik.errors?.name}
              label="Full Name"
              name="name"
              required
              onBlur={formik?.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            <PhoneInput
              country={"al"}
              name="mobile"
              regions={'europe'}
              containerStyle={{ width: "100%", display: 'inline-block' }}
              inputStyle={{ width: "95%", padding: '25px', marginLeft: "5%", background: "transparent" }}
              buttonStyle={{ marginRight: "10px" }}
              onBlur={formik?.handleBlur}
              placeholder="Phone*"
              onChange={(value) => {
                formik.setFieldValue("mobile", value)
              }}
              value={formik?.values?.mobile}
              error={!!(formik?.touched?.mobile && formik.errors?.mobile)}
              helperText={formik?.touched?.mobile && formik.errors?.mobile}
            />
            <TextField
              error={!!(formik?.touched.email && formik.errors?.email)}
              fullWidth
              helperText={formik?.touched.email && formik.errors?.email}
              label="Email"
              required
              name="email"
              onBlur={formik?.handleBlur}
              onChange={formik?.handleChange}
              value={formik?.values.email}
            />
            <TextField
              error={!!(formik?.touched.address && formik.errors?.address)}
              fullWidth
              helperText={formik?.touched.address && formik.errors?.address}
              label="Address"
              name="address"
              required
              onBlur={formik?.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.address}
            />
            <TextField
              error={!!(formik.touched.referralSource && formik.errors?.referralSource)}
              fullWidth
              label="Source"
              name="referralSource"
              select
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              required
              value={formik.values.referralSource}
            >
              {formOptions.referralSource.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.data.name}
                </MenuItem>
              ))}
            </TextField>
            <AutocompleteComponent
              formik={formik}
              options={formOptions?.assignee}
              fieldName="assignee"
              placeholder="Assignee"
            />
          </Stack>
        </Grid>
      </Grid>
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={2}
        sx={{ mt: 2 }}
      >
        <Button
          color="inherit"
          disabled={formik?.isSubmitting}
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={formik.handleSubmit}
          disabled={formik?.isSubmitting}
          variant="contained"
        >
          Create
        </Button>
      </Stack>
    </div>
  )
}

export default ModalCustomer