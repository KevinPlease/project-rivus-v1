import React, { useCallback, useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useRouter } from "next/router";

import { paths } from "src/paths";
import { ClipboardChip } from "src/sections/components/buttons/clipboard_chip";
import { CustomerBasicDetails } from "src/sections/dashboard/customer/customer-basic-details";
import { CustomerPersonalDetails } from "src/sections/dashboard/customer/customer-personal-details";
import { CustomerDataManagement } from "src/sections/dashboard/customer/customer-data-management";
import { CustomerDocuments } from "src/sections/dashboard/customer/customer-documents";
import { CustomerProperties } from "src/sections/dashboard/customer/customer-properties";
import { CustomerAgentDetails } from "src/sections/dashboard/customer/customer-agent-details";
import { ConfirmationDialog } from "src/sections/confirmation-dialog";
import { FormButtons } from "src/sections/form-buttons";

import { base64ToFile } from "src/utils/file-to-base64";
import { toDocDetails } from "src/utils/files-to-docdetails";
import customerApi from "src/api/customer";
import { useAuth } from "src/hooks/use-auth";
import BaseAPI from "src/api/BaseAPI";

import ENV from "../../../../env";
const LIMITED_ROLES = ENV.LIMITED_ROLES;

const REQUIRED = "Field is required!";

export const CustomerEditForm = ({ data, id, displayId, formOptions }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("details");
  const [unlockedEdit, setUnlockedEdit] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [files, setFiles] = useState([]);

  const tabs = useMemo(() => [
    { label: !unlockedEdit ? "Details" : "Edit Details", value: "details" },
    { label: "Listings", value: "listings" },
    { label: "Matches", value: "matches" },
    // { label: "Comments", value: "comments" },
  ], [unlockedEdit]);

  const isLimitedUser = useMemo(() => {
    return LIMITED_ROLES.includes(user?.data.role._id) && data?.assignee !== user?._id;
  }, [data, user]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: data.name || "",
      title: data.title || "",
      mobile: data.mobile || "",
      email: data.email || "",
      birthdate: data.birthdate ? new Date(data.birthdate) : null,
      address: data.address || "",
      personalId: data.personalId || "",
      assignee: data.assignee || "",
      description: data.description || "",
      documents: data.documents || [],
      submit: null
    },
    validationSchema: Yup.object({
      title: Yup.string().max(255).required(REQUIRED),
      name: Yup.string().max(255).required(REQUIRED),
      mobile: Yup.string().max(20).required(REQUIRED),
      personalId: Yup.string().max(255),
      email: Yup.string().max(255),
      birthdate: Yup.date(),
      source: Yup.string().max(24),
      role: Yup.string().max(255),
      assignee: Yup.string().max(24).required(REQUIRED),
      description: Yup.string().max(500)
    }),

    onSubmit: async (values, helpers) => {
      values.isDraft = false;
      await handleDocumentsUpload(files);
      const authInfo = BaseAPI.authForInfo(user);
      const response = await customerApi.update(authInfo, id, values);

      if (response.status === "failure") {
        toast.error("Something went wrong!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
        return;
      }

      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
      toast.success("Customer updated!");
      router.push(paths.dashboard.customers.index);
    },
  });

  const changeMode = () => {
    setUnlockedEdit(prevState => (!prevState));
  };

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const transformData = useCallback((data, type) => {
    if (!data) return [];

    return data.map(item => {
      const file = base64ToFile(item.src, item.id);
      return { ...item, file };
    });
  }, []);

  useEffect(() => {
    if (!data) return formik.setSubmitting(true);

    setFiles(prevFiles => [...prevFiles, ...transformData(data.documents, "file")]);
    formik.setSubmitting(false);
  }, [data]);

  const handleFilesDrop = useCallback((newFiles) => {
    setFiles((prevFiles) => {
      const documents = toDocDetails(newFiles);
      return [...prevFiles, ...documents];
    });
  }, []);

  const handleFileRemove = useCallback((index) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles]; // Create a copy of the array
      newFiles.splice(index, 1); // Remove the element at the specified index
      return newFiles;
    });
  }, []);

  const handleDocumentsUpload = useCallback(async (allDocuments) => {
    try {
      formik.setSubmitting(true);
      const docFiles = allDocuments.map(docDetail => docDetail.file).filter(docFile => docFile !== undefined);
      const authInfo = BaseAPI.authForInfo(user);
      const response = await customerApi.uploadDocuments(authInfo, id, docFiles);
      if (response.status === "success") {
        formik.setErrors(null);
        formik.setSubmitting(false);
        return
      }

      const errMsg = "There was a problem uploading documents!";
      formik.setErrors({ documents: errMsg });
      formik.setSubmitting(false);
      toast(errMsg);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  const handleDelete = useCallback(async (event) => {
    const authInfo = BaseAPI.authForInfo(user);
    const response = await customerApi.delete(authInfo, id);

    let status = "success";
    let message = "Customer Deleted!";
    if (response.status === "failure") {
      status = "error";
      message = "Something went wrong!";
    }

    formik.setSubmitting(false);
    toast[status](message);
    router.replace(paths.dashboard.customers.index);
  }, [id, router]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={4}>
          <Stack
            alignItems="flex-start"
            direction={{
              xs: "column",
              md: "row"
            }}
            justifyContent="space-between"
            spacing={4}
          >
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
            >
              <Avatar
                sx={{
                  height: 64,
                  width: 64
                }}
              >
                {data.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Stack spacing={1}>
                <Typography variant="h4">
                  {formik.values.name}
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Typography variant="subtitle2">
                    ID:
                  </Typography>
                  <ClipboardChip
                    label={displayId}
                    size="small"
                  />
                </Stack>
              </Stack>
            </Stack>

          </Stack>
          <div>
            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
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
            <Divider />
          </div>
        </Stack>

        {currentTab === "details" && (
          <div>
            <Stack
              sx={{ my: 2 }}
              justifyContent="flex-end"
              direction="row"
            >
              {!unlockedEdit && !isLimitedUser &&
                <Button
                  size="large"
                  variant="text"
                  onClick={changeMode}
                >
                  Edit Details
                </Button>
              }
            </Stack>
            <Grid
              container
              spacing={4}
            >
              <Grid
                xs={12}
                lg={4}
              >
                <CustomerPersonalDetails formik={formik} unlockedEdit={unlockedEdit} orientation="vertical" />
                <div className="hidden lg:block">
                  <FormButtons
                    unlockedEdit={unlockedEdit}
                    formik={formik}
                    current={"Edit"}
                    handleCancel={() => changeMode()}
                    handleSubmit={() => formik.submitForm()}
                    sx={{ mt: 3 }}
                  />
                </div>

              </Grid>
              <Grid
                xs={12}
                lg={8}
              >
                <Stack spacing={4}>
                  <CustomerBasicDetails formik={formik} unlockedEdit={unlockedEdit} formOptions={formOptions} orientation="vertical" />
                  <CustomerDocuments
                    files={files}
                    orientation="vertical"
                    // handleFilesUpload={handleDocumentsUpload}
                    handleFilesDrop={handleFilesDrop}
                    handleFileRemove={handleFileRemove}
                    handleFilesRemoveAll={() => setFiles([])}
                    unlockedEdit={unlockedEdit}
                  />
                  <CustomerAgentDetails formik={formik} unlockedEdit={unlockedEdit} formOptions={formOptions} />
                  <CustomerDataManagement formik={formik} unlockedEdit={unlockedEdit} handleDelete={() => setIsDialogOpen(true)} />
                  <div className="block lg:hidden">
                    <FormButtons
                      unlockedEdit={unlockedEdit}
                      formik={formik}
                      current={"Edit"}
                      handleCancel={() => changeMode()}
                      handleSubmit={() => formik.submitForm()}
                      sx={{ mt: 3 }}
                    />
                  </div>
                </Stack>
              </Grid>
            </Grid>
          </div>
        )}

        <ConfirmationDialog
          modelName={"Customer"}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleDelete={handleDelete}
          isSubmitting={formik.isSubmitting}
        />

      </form>

      {currentTab === "properties" && <CustomerProperties data={data} id={id} />}
      {/* {currentTab === 'comments' && (
        <Stack spacing={2}>
          <TaskComment
            // key={comment.id}
            // comment={comment}
            pageName="Customer"
            id={id}
          />
        </Stack>
      )} */}
    </>
  );
};
