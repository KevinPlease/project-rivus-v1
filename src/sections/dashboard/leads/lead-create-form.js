import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import Typography from "@mui/material/Typography";

import AutocompleteComponent from "src/sections/components/inputs/AutocompleteComponent";
import { paths } from "src/paths";
import leadsAPI from "src/api/leads";
import { QuillEditor } from "../../../components/quill-editor";
import { ConfirmationDialog } from "src/sections/confirmation-dialog";
import { FormButtons } from "src/sections/form-buttons";
import BaseAPI from "src/api/BaseAPI";
import { useAuth } from "src/hooks/use-auth";


const REQUIRED = "Field is required!";

export const LeadCreateForm = ({ current, leadsData, leadId, formOptions }) =>
{
  const { user } = useAuth();
  const router = useRouter();
  const [unlockedEdit, setUnlockedEdit] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [phoneError, setPhoneError] = useState(false);


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: "",
      mobile: "",
      address: "",
      source: "",
      role: "",
      fullName: "",
      assignee:  user?._id || "",
      description: "",
      submit: null
    },
    validationSchema: Yup.object({
      title: Yup.string().max(255).required(REQUIRED),
      mobile: Yup.string().min(5).required(REQUIRED),
      address: Yup.string().max(255),
      source: Yup.string().max(24),
      role: Yup.string().max(255),
      fullName: Yup.string().max(255).required(REQUIRED),
      assignee: Yup.string().max(24).required(REQUIRED),
      description: Yup.string().max(500)
    }),
    onSubmit: async (values, helpers) =>
    {
      values.isDraft = false;
      values.title = values.title.toUpperCase();
      const authInfo = BaseAPI.authForInfo(user);
      const response = await leadsAPI.update(authInfo, leadId, values);

      if (response.status === "failure")
      {
        toast.error("Something went wrong!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
        return;
      }

      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
      const message = current === "Edit" ? "Lead updated!" : "Lead created!";
      toast.success(message);
      router.push(paths.dashboard.leads.index);
    },
  });

  useEffect(() =>
  {
    setUnlockedEdit(current === "Create");
  }, [current]);


  const handleCancel = useCallback((event) =>
  {
    if (current === "Create") return router.push(paths.dashboard.leads.index);

    setUnlockedEdit(prevState => !prevState);
  }, [current]);

  const handleDelete = useCallback(async (event) =>
  {
    const authInfo = BaseAPI.authForInfo(user);
    const response = await leadsAPI.delete(authInfo, leadId);

    let status = "success";
    let message = "Lead Deleted!";
    if (response.status === "failure")
    {
      status = "error";
      message = "Something went wrong!";
    }

    formik.setSubmitting(false);
    toast[status](message);
    router.replace(paths.dashboard.leads.index);
  }, [leadId, router]);

  const handlePhoneError= (e) => {
    if (typeof e === "object" && e?.target?.value?.length < 5){
      setPhoneError(true);
    }else if(e < 5){
      setPhoneError(true);
    }else{
      setPhoneError(false);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>

      <Stack flex="flex" flexDirection="row" justifyContent="flex-end" sx={{ mb: 2 }}>
        {!unlockedEdit &&
          <Button
            size="large"
            variant="text"
            onClick={() => setUnlockedEdit(prevState => !prevState)}>
            Edit Details
          </Button>
        }
      </Stack>
      <div class="border border-1 border-gray-50 rounded-3xl p-4 shadow-sm mb-5">
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={4}
            >
              <Typography variant="h6">
                Personal Details
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={8}
            >
              <Stack spacing={3} className="p-3">
                <TextField
                  error={!!(formik.touched.fullName && formik.errors?.fullName)}
                  fullWidth
                  disabled={!unlockedEdit}
                  helperText={formik.touched.fullName && formik.errors?.fullName}
                  label="Full name"
                  name="fullName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  required
                  value={formik.values.fullName}
                />
                <PhoneInput
                    country={"al"}
                    name="mobile"
                    regions={"europe"}
                    containerStyle={{width:"100%", border: phoneError ? "2px red solid" : "none",borderRadius:"10px"}}
                    inputStyle={{width:"95%",padding: "25px", marginLeft:"5%", background:"transparent",borderRadius:"9px", borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px"}}
                    buttonStyle={{ marginRight: "10px", borderRadius:"8px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px"}}
                    onBlur={(event, data) => handlePhoneError(event)}
                    placeholder="Phone*"
                    onChange={(value,event)=>{
                      formik.setFieldValue("mobile", value);
                      handlePhoneError(event);
                    }}
                    defaultErrorMessage="Field required"
                    value={formik?.values?.mobile}
                    helperText={formik?.touched?.mobile && formik.errors?.mobile}
                    inputProps={{
                      name: "phone",
                      required: true,
                    }}
                    enableClickOutside={true}
                />
                <TextField
                  error={!!(formik.touched.address && formik.errors?.address)}
                  fullWidth
                  disabled={!unlockedEdit}
                  helperText={formik.touched.address && formik.errors?.address}
                  label="Address"
                  name="address"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.address}
                />
              </Stack>
            </Grid>
          </Grid>
      </div>
      <Card className="mb-10">
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={4}
            >
              <Typography variant="h6">
                Other Details
              </Typography>
            </Grid>
            <Grid
              xs={12}
              md={8}
            >
              <Stack spacing={3}>
                <AutocompleteComponent
                  formik={formik}
                  options={formOptions.source}
                  fieldName="source"
                  unlockedEdit={unlockedEdit}
                  placeholder="Lead Source"
                />

                <TextField
                  error={!!(formik.touched.role && formik.errors?.role)}
                  fullWidth
                  disabled={!unlockedEdit}
                  helperText={formik.touched.role && formik.errors?.role}
                  label="Role"
                  name="role"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.role}
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card className="mb-10">
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={4}
            >
              <Typography variant="h6">
                Basic Details
              </Typography>

            </Grid>
            <Grid
              xs={12}
              md={8}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.title && formik.errors?.title)}
                  fullWidth
                  disabled={!unlockedEdit}
                  helperText={formik.touched.title && formik.errors?.title}
                  label="Title"
                  name="title"
                  sx={{
                    "& input": {
                      textTransform: "uppercase"
                    },
                  }}
                  onBlur={formik.handleBlur}
                  onChange={e =>
                  {
                      formik.setFieldValue("title", e.target.value);
                  }
                  }
                  required
                  value={formik.values.title}
                />
                <div>
                  <Typography
                    color="text.secondary"
                    sx={{ mb: 2 }}
                    variant="subtitle2"
                  >
                    Description
                  </Typography>
                  <QuillEditor
                    onChange={(value) =>
                    {
                      formik.setFieldValue("description", value);
                    }}
                    readOnly={!unlockedEdit}
                    placeholder="Write something"
                    sx={{ height: 200, resize: unlockedEdit ? "vertical" : "" }}
                    value={formik.values.description}
                  />
                  {!!(formik.touched.description && formik.errors?.description) && (
                    <Box sx={{ mt: 2 }}>
                      <FormHelperText error>
                        {formik.errors?.description}
                      </FormHelperText>
                    </Box>
                  )}
                </div>
                <AutocompleteComponent
                  formik={formik}
                  options={formOptions.assignee}
                  fieldName="assignee"
                  unlockedEdit={unlockedEdit}
                  placeholder="Agent"
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <FormButtons
        unlockedEdit={unlockedEdit}
        formik={formik}
        current={current}
        handleDelete={() => setIsDialogOpen(true)}
        handleCancel={handleCancel}
      />

      <ConfirmationDialog
        modelName={"Lead"}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        handleDelete={handleDelete}
        isSubmitting={formik.isSubmitting}
      />

    </form >

  );
};
