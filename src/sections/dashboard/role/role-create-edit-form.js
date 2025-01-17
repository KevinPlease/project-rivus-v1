import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Card, Divider, SvgIcon, Tab, Tabs, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Edit02Icon from '@untitled-ui/icons-react/build/esm/Edit02';
import Download01Icon from '@untitled-ui/icons-react/build/esm/Download01';

import { paths } from "src/paths";
import BaseAPI from "src/api/BaseAPI";

import { ConfirmationDialog } from "src/sections/confirmation-dialog";
import { useAuth } from "src/hooks/use-auth";
import roleApi from "src/api/role";
import RoleBasicDetails from "src/sections/dashboard/role/role-basic-details";
import { RoleActions } from "src/sections/dashboard/role/role-actions";
import { ClipboardChip } from "src/sections/components/buttons/clipboard_chip";
import { FormButtons } from "src/sections/form-buttons";
import { RoleAccessInfo } from "src/sections/dashboard/role/role-access-info";
import { RoleAccessInfoFields } from "src/sections/dashboard/role/role-access-info-fields";


const REQUIRED = "Field is required";
const validationSchema = Yup.object({
  name: Yup.string().max(255).required(REQUIRED),
  actions: Yup.array(),
  accessInfo: Yup.object(),
  description: Yup.string().max(500)
});

export const RoleCreateForm = ({ current, model, formOptions }) => {
  const { user } = useAuth();
  const { _id: id, data, displayId } = model;
  const router = useRouter();
  const [unlockedEdit, setUnlockedEdit] = useState(current === "Create");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("details");

  const tabs = useMemo(() => [
    { label: "Details", value: "details" },
    { label: "Actions", value: "role_actions" },
    { label: "Access Info(global)", value: "role_access_info_global" },
    { label: "Access Info(fields)", value: "role_access_info_fieldAccess" }
  ], [unlockedEdit]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: data.name || "",
      actions: data.actions || [],
      accessInfo: data.accessInfo || [],
      assignee: data.assignee || user?._id || "",
      description: data.description || ""
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      const authInfo = BaseAPI.authForInfo(user);
      const response = await roleApi.update(authInfo, id, values);
      if (response.status === "failure") {
        toast.error("Something went wrong!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: response.data });
        helpers.setSubmitting(false);
        return;
      }

      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
      toast.success("Role created!");
      router.push(paths.dashboard.roles.index);
    },
  });

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const handleActionSelect = useCallback((id) => {
    if (id) {
      formik.values.actions.push(id);
      formik.setFieldValue('actions', formik.values.actions);
    } else { // select all
      formik.setFieldValue('actions', formOptions.action.map(i => i._id));
    }

  }, [formik.values, formOptions]);

  const handleActionDeselect = useCallback((id) => {
    if (id) {
      formik.values.actions.splice(formik.values.actions.indexOf(id), 1);
      formik.setFieldValue('actions', formik.values.actions);
    } else { // deselect all
      formik.setFieldValue('actions', []);
    }
  }, [formik.values]);

  const handleAccessInfoChange = useCallback((type, globalAccessInfo) => {
    formik.values.accessInfo[type] = globalAccessInfo;
    formik.setFieldValue('accessInfo', formik.values.accessInfo);
  }, [formik.values]);

  const handleCancel = useCallback((event) => {
    if (current === "Create") return router.push(paths.dashboard.roles.index);

    formik.setSubmitting(false);
    setUnlockedEdit(prevState => !prevState);
  }, [current]);

  const handleDelete = useCallback(async (event) => {
    const authInfo = BaseAPI.authForInfo(user);
    const response = await roleApi.delete(authInfo, id);

    let status = "success";
    let message = "Role Deleted!";
    if (response.status === "failure") {
      status = "error";
      message = "Something went wrong!";
    }

    formik.setSubmitting(false);
    toast[status](message);
    router.replace(paths.dashboard.roles.index);
  }, [id, router]);

  return (
    <Stack>
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
          size="small" />
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

      <Stack flex="flex" flexDirection="row" justifyContent="flex-end" >
        {!unlockedEdit &&
          <Button
            size="large"
            variant="text"
            disabled={formik.isSubmitting}
            startIcon={(
              <SvgIcon>
                <Edit02Icon />
              </SvgIcon>
            )}
            onClick={() => {
              setUnlockedEdit(prevState => !prevState);
              formik.setSubmitting("");
            }}>
            Ndrysho
          </Button>
        }
      </Stack>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={4}>
          {currentTab === 'details' && (
            <RoleBasicDetails formik={formik} formOptions={formOptions} unlockedEdit={unlockedEdit} />
          )}

          {currentTab === 'role_actions' && (
            <RoleActions
              items={formOptions.action || []}
              selected={formik.values.actions}
              onDeselectAll={handleActionDeselect}
              onDeselectOne={handleActionDeselect}
              onSelectAll={handleActionSelect}
              onSelectOne={handleActionSelect}
              unlockedEdit={unlockedEdit}
            />
          )}

          {currentTab === 'role_access_info_global' && (
            <RoleAccessInfo
              formik={formik}  
              accessInfo={formik.values.accessInfo.global || {}}
              handleAccessInfoChange={handleAccessInfoChange}
              unlockedEdit={unlockedEdit}
            />
          )}

          {currentTab === 'role_access_info_fieldAccess' && (
            <RoleAccessInfoFields
              formik={formik}  
              accessInfo={formik.values.accessInfo.fieldAccess || {}}
              handleAccessInfoChange={handleAccessInfoChange}
              unlockedEdit={unlockedEdit}
            />
          )}

          <FormButtons
            unlockedEdit={unlockedEdit}
            formik={formik}
            current={current}
            handleDelete={() => setIsDialogOpen(true)}
            handleCancel={handleCancel}
          />

        </Stack>

        <ConfirmationDialog
          modelName={"Role"}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleDelete={handleDelete}
          isSubmitting={formik.isSubmitting} />

      </form>
    </Stack>
  );
};
