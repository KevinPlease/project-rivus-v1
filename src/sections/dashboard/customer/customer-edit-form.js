import PropTypes from "prop-types";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMounted } from "src/hooks/use-mounted";
import { RouterLink } from "src/components/router-link";
import { paths } from "src/paths";
import { wait } from "src/utils/wait";
import { TextareaAutosize } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";



export const CustomerEditForm = ({current,leadsData}) => {

  const formik = useFormik({
    initialValues: {
      title: leadsData.title || "",
      phone: leadsData.phone || "",
      address: leadsData.address || "",
      source: leadsData.source || "",
      role: leadsData.role || "",
      name: leadsData.fullName || "",
      assignee: leadsData.assignee || "",
      description: leadsData.description || "",
      submit: null
    },
    validationSchema: Yup.object({
      title: Yup.string().max(255),
      address: Yup.string().max(255),
      source: Yup.string().max(255),
      assignee: Yup.string().max(255),
      role: Yup.string().max(255),
      description: Yup.string().max(500),
      name: Yup.string().max(255).required("Full Name is required"),
      phone: Yup.string().max(15),
    }),

    onSubmit: async (values, helpers) => {
      try {
        // NOTE: Make API request
        await wait(500);
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        toast.success("Lead updated");
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader title={`${current} Lead`} />
        <CardContent sx={{ pt: 0 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.title && formik.errors?.title)}
                fullWidth
                helperText={formik.touched.title && formik.errors?.title}
                label="Title"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.title}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.name && formik.errors?.name)}
                fullWidth
                helperText={formik.touched.name && formik.errors?.name}
                label="Full name"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                required
                value={formik.values.name}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.phone && formik.errors?.phone)}
                fullWidth
                helperText={formik.touched.phone && formik.errors?.phone}
                label="Phone"
                name="country"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.phone}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.address && formik.errors?.address)}
                fullWidth
                helperText={formik.touched.address && formik.errors?.address}
                label="Address"
                name="state"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.state}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.role && formik.errors?.role)}
                fullWidth
                helperText={formik.touched.role && formik.errors?.role}
                label="Role"
                name="role"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.role}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                error={!!(formik.touched.assignee && formik.errors?.assignee)}
                fullWidth
                helperText={formik.touched.assignee && formik.errors?.assignee}
                label="Assignee"
                name="assignee"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.assignee}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                error={
                  !!(formik.touched.description && formik.errors?.description)
                }
                fullWidth
                helperText={
                  formik.touched.description && formik.errors?.description
                }
                label="Description"
                name="description"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.description}
                multiline
              />
            </Grid>
          </Grid>
          {/* <Stack divider={<Divider />} spacing={3} sx={{ mt: 3 }}>
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={3}
            >
              <Stack spacing={1}>
                <Typography gutterBottom variant="subtitle1">
                  Make Contact Info Public
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Means that anyone viewing your profile will be able to see
                  your contacts details
                </Typography>
              </Stack>
              <Switch
                checked={formik.values.isVerified}
                color="primary"
                edge="start"
                name="isVerified"
                onChange={formik.handleChange}
                value={formik.values.isVerified}
              />
            </Stack>
            <Stack
              alignItems="center"
              direction="row"
              justifyContent="space-between"
              spacing={3}
            >
              <Stack spacing={1}>
                <Typography gutterBottom variant="subtitle1">
                  Available to hire
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Toggling this will let your teammates know that you are
                  available for acquiring new projects
                </Typography>
              </Stack>
              <Switch
                checked={formik.values.hasDiscount}
                color="primary"
                edge="start"
                name="hasDiscount"
                onChange={formik.handleChange}
                value={formik.values.hasDiscount}
              />
            </Stack>
          </Stack> */}
        </CardContent>
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          flexWrap="wrap"
          spacing={3}
          sx={{ p: 3 }}
        >
          <Button
            disabled={formik.isSubmitting}
            type={current === "Edit" ? "Update" : "Create"}
            variant="contained"
          >
            Update
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            disabled={formik.isSubmitting}
            href={paths.dashboard.customers.details}
          >
            Cancel
          </Button>
        </Stack>
      </Card>
    </form>
  );
};
