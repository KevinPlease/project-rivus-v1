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
import { ClientBasicDetails } from "src/sections/dashboard/client/client-basic-details";
import { ClientPersonalDetails } from "src/sections/dashboard/client/client-personal-details";
import { ClientDataManagement } from "src/sections/dashboard/client/client-data-management";
import { ClientDocuments } from "src/sections/dashboard/client/client-documents";
import { ClientAgentDetails } from "src/sections/dashboard/client/client-agent-details";
import { ClientListings } from "src/sections/dashboard/client/client-listings";
import { ClientLogs } from "src/sections/dashboard/client/client-logs";
import { ConfirmationDialog } from "src/sections/confirmation-dialog";
import { FormButtons } from "src/sections/form-buttons";
import { MatchDetails } from "src/sections/dashboard/match/match-details";

import { base64ToFile } from "src/utils/file-to-base64";
import { toDocDetails } from "src/utils/files-to-docdetails";
import clientAPI from "src/api/client";
import { useAuth } from "src/hooks/use-auth";
import BaseAPI from "src/api/BaseAPI";
import { TaskComment } from "../comment-section/task-comment";

import ENV from "../../../../env";
const LIMITED_ROLES = ENV.LIMITED_ROLES;

const REQUIRED = "Field is required!";

export const ClientEditForm = ({ clientData, clientId, displayId, formOptions }) => {
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
    { label: "Comments", value: "comments" },
  ], [unlockedEdit]);

  const isLimitedUser = useMemo(() => {
    return LIMITED_ROLES.includes(user?.data.role._id) && clientData?.assignee !== user?._id;
  }, [clientData, user]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: clientData.name || "",
      title: clientData.title || "",
      mobile: clientData.mobile || "",
      email: clientData.email || "",
      birthdate: clientData.birthdate ? new Date(clientData.birthdate) : null,
      address: clientData.address || "",
      personalId: clientData.personalId || "",
      assignee: clientData.assignee || "",
      description: clientData.description || "",
      documents: clientData.documents || [],
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
      const response = await clientAPI.update(authInfo, clientId, values);

      if (response.status === "failure") {
        toast.error("Something went wrong!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
        return;
      }

      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
      toast.success("Client updated!");
      router.push(paths.dashboard.clients.index);
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
    if (!clientData) return formik.setSubmitting(true);

    setFiles(prevFiles => [...prevFiles, ...transformData(clientData.documents, "file")]);
    formik.setSubmitting(false);
  }, [clientData]);

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
      const response = await clientAPI.uploadDocuments(authInfo, clientId, docFiles);
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
  }, [clientId]);

  const handleDelete = useCallback(async (event) => {
    const authInfo = BaseAPI.authForInfo(user);
    const response = await clientAPI.delete(authInfo, clientId);

    let status = "success";
    let message = "Client Deleted!";
    if (response.status === "failure") {
      status = "error";
      message = "Something went wrong!";
    }

    formik.setSubmitting(false);
    toast[status](message);
    router.replace(paths.dashboard.clients.index);
  }, [clientId, router]);

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
                {clientData.name?.charAt(0).toUpperCase()}
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
                <ClientPersonalDetails formik={formik} unlockedEdit={unlockedEdit} orientation="vertical" />
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
                  <ClientBasicDetails formik={formik} unlockedEdit={unlockedEdit} formOptions={formOptions} orientation="vertical" />
                  <ClientDocuments
                    files={files}
                    orientation="vertical"
                    // handleFilesUpload={handleDocumentsUpload}
                    handleFilesDrop={handleFilesDrop}
                    handleFileRemove={handleFileRemove}
                    handleFilesRemoveAll={() => setFiles([])}
                    unlockedEdit={unlockedEdit}
                  />
                  <ClientAgentDetails formik={formik} unlockedEdit={unlockedEdit} formOptions={formOptions} />
                  <ClientDataManagement formik={formik} unlockedEdit={unlockedEdit} handleDelete={() => setIsDialogOpen(true)} />
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
          modelName={"Client"}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleDelete={handleDelete}
          isSubmitting={formik.isSubmitting}
        />

      </form>

      {currentTab === "listings" && <ClientListings clientData={clientData} clientId={clientId} />}
      {currentTab === "matches" && <MatchDetails id={clientId} source="Client" />}
      {currentTab === "logs" && <ClientLogs />}
      {currentTab === 'comments' && (
        <Stack spacing={2}>
          <TaskComment
            // key={comment.id}
            // comment={comment}
            pageName="Client"
            id={clientId}
          />
        </Stack>
      )}
    </>
  );
};
