import * as Yup from "yup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button, SvgIcon } from "@mui/material";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";

import BaseAPI from "src/api/BaseAPI";
import { useAuth } from "src/hooks/use-auth";
import userPreferenceApi from "src/api/userPreference";
import { useMounted } from "src/hooks/use-mounted";
import { ExString } from "server/bin/shared/String";
import { FormButtons } from "src/sections/form-buttons";

const PreferenceItem = ({ enabled, content, value, handleChange }) => (
  <Stack
    alignItems="flex-start"
    direction="row"
    justifyContent="space-between"
    spacing={3}
  >
    <Stack spacing={1}>
      <Typography variant="subtitle1">
        {content.title}
      </Typography>
      <Typography
        color="text.secondary"
        variant="body2"
      >
        {content.body}
      </Typography>
    </Stack>

    <Switch
      onChange={handleChange}
      value={value}
      checked={value}
      disabled={!enabled}
    />
  </Stack>
);

const NotificationSection = ({ title, children }) => (
  <Grid
    container
    spacing={3}
  >
    <Grid
      xs={12}
      md={4}
    >
      <Typography variant="h6">
        {title}
      </Typography>
    </Grid>
    <Grid
      xs={12}
      sm={12}
      md={8}
    >
      <Stack
        divider={<Divider />}
        spacing={3}
      >
        {children}
      </Stack>
    </Grid>
  </Grid>
);

const REQUIRED = "Field is required!";
const validationSchema = Yup.object({
  title: Yup.string().max(255).required(REQUIRED),
  constructionStage: Yup.string().max(255),
  assignee: Yup.string().max(255).required(REQUIRED),
  price: Yup.number().min(0),

});

export const AccountNotificationsSettings = () => {
  const { user } = useAuth();
  const [store, setStore] = useState({});
  const [unlockedEdit, setUnlockedEdit] = useState(false);
  const isMounted = useMounted();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      user: store.user || "",
      type: store.type || 0,
      content: store.content || {},
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      const authInfo = BaseAPI.authForInfo(user);
      const response = await userPreferenceApi.update(authInfo, currentItem.propertyId, values[currentItem.index]);
      if (response.status === "failure") {
        toast.error("Something went wrong!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
        return;
      }

      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
      toast.success("Preferences updated!");

    }
  });

  useEffect(() => {
    const fetchData = async () => {
      const authInfo = BaseAPI.authForInfo(user);
      let response = await userPreferenceApi.getAll(authInfo, { filters: { user: user._id, type: 132 }, filterTypes: { and: ["user", "type"] } });
      if (!response) return toast.error("Something went wrong!");

      if (isMounted() && response.models.length > 0) {
        const preference = response.models[0];
        setStore({
          user: preference.data.user,
          type: preference.data.type,
          content: preference.data.content
        });
      }
    };

    fetchData();
  }, [user]);

  const getNotificationContent = useCallback((modelRole, type) => {
    const notificationContent = {
      101: { title: `New ${modelRole}`, body: `Get notified when a new ${modelRole} is created` },
      102: { title: `Updated ${modelRole}`, body: `Get notified when a ${modelRole} is updated` },
      103: { title: `Deleted ${modelRole}`, body: `Get notified when a ${modelRole} is deleted` },
    };
    return notificationContent[type];
  }, []);

  const modelRoles = useMemo(() => {
    return Object.entries(formik.values.content);
  }, [formik.values.content]);

  const handlePreferenceChange = useCallback((modelRole, index, newValue) => {
    formik.values.content[modelRole][index].value = newValue;
    formik.setFieldValue("content", formik.values.content);
  }, [formik.values]);

  const handleCancel = useCallback(() => {
    formik.resetForm();
    setUnlockedEdit((prevState) => !prevState);
  }, []);

  return (
    <Stack spacing={2}>
      <Stack flex="flex" flexDirection="row" justifyContent="flex-end">
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
          </Button>}
      </Stack>
      <Card>
        <CardContent>
          {modelRoles.map(([modelRole, preferences], sectionIndex) => (
            <Stack key={sectionIndex}>
              {sectionIndex > 0 && <Divider sx={{ my: 3 }} />}
              <NotificationSection title={ExString.capitalize(modelRole)}>
                {preferences.map((pref, index) => (
                  <PreferenceItem
                  enabled={unlockedEdit}
                  key={`${modelRole}-${index}`}
                    content={getNotificationContent(modelRole, pref.action)}
                    value={pref.value}
                    handleChange={(e) => {
                      handlePreferenceChange(modelRole, index, e.target.checked);
                    }}
                  />
                ))}
              </NotificationSection>
            </Stack>
          ))}
        </CardContent>
      </Card>
      
      <FormButtons
        unlockedEdit={unlockedEdit}
        formik={formik}
        current="Edit"
        handleSubmit={formik.submitForm}
        handleCancel={handleCancel}
      />
    
    </Stack>
  );
};
