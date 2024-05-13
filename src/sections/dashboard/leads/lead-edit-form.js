import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import { paths } from "src/paths";
import { useRouter } from "next/router";
import leadsAPI from "src/api/leads";
import React, { useCallback, useMemo, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import { QuillEditor } from "../../../components/quill-editor";
import Typography from "@mui/material/Typography";
import { ConfirmationDialog } from "src/sections/confirmation-dialog";
import { FormButtons } from "src/sections/form-buttons";
import BaseAPI from "src/api/BaseAPI";
import { useAuth } from "src/hooks/use-auth";
import { TaskComment } from "../comment-section/task-comment";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import { ClipboardChip } from "src/sections/components/buttons/clipboard_chip";
import { useDispatch } from "src/store";
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import AutocompleteComponent from "../../components/inputs/AutocompleteComponent";

import ENV from "../../../../env";
const LIMITED_ROLES = ENV.LIMITED_ROLES;
const REQUIRED = "Field is required!";

export const LeadEditForm = ({ leadsData, displayId, leadId, formOptions }) => {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const [unlockedEdit, setUnlockedEdit] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("details");
  const [files, setFiles] = useState([]);
  const [phoneError, setPhoneError] = useState(false);

  const tabs = useMemo(() => [
    { label: !unlockedEdit ? "Details" : "Edit Details", value: "details" },
    { label: "Comments", value: "comments" },
  ], [unlockedEdit]);

  const isLimitedUser = useMemo(() => {
    return LIMITED_ROLES.includes(user?.data.role._id) && leadsData?.assignee !== user?._id;
}, [leadsData, user]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: leadsData?.title || "",
      mobile: leadsData?.mobile || "",
      address: leadsData?.address || "",
      source: leadsData?.source || "",
      role: leadsData?.role || "",
      fullName: leadsData?.fullName || "",
      assignee: leadsData?.assignee || "",
      description: leadsData?.description || "",
      submit: null
    },
    validationSchema: Yup.object({
      title: Yup.string().max(255).required(REQUIRED),
      mobile: Yup.string().max(20).required(REQUIRED),
      address: Yup.string().max(255),
      source: Yup.string().max(24),
      role: Yup.string().max(255),
      fullName: Yup.string().max(255).required(REQUIRED),
      assignee: Yup.string().max(24).required(REQUIRED),
      description: Yup.string().max(500)
    }),
    onSubmit: async (values, helpers) => {
      values.isDraft = false;
      values.title = values.title.toUpperCase();
      const authInfo = BaseAPI.authForInfo(user);
      const response = await leadsAPI.update(authInfo, leadId, values);

      if (response.status === "failure") {
        toast.error("Something went wrong!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
        return;
      }

      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
      toast.success("Lead updated!");
      router.push(paths.dashboard.leads.index);
    },
  });

  const changeMode = () => {
    setUnlockedEdit(prevState => (!prevState));
  };

  const handleDelete = useCallback(async (event) => {
    const authInfo = BaseAPI.authForInfo(user);
    const response = await leadsAPI.delete(authInfo, leadId);

    let status = "success";
    let message = "Lead Deleted!";
    if (response.status === "failure") {
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
      setPhoneError(true)
    }else{
      setPhoneError(false)
    }
  };
  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

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
                {leadsData.title?.charAt(0).toUpperCase()}
              </Avatar>
              <Stack spacing={1}>
                <Typography variant="h4">
                  {formik.values.fullName}
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

            {/*<Link*/}
            {/*  color="text.primary"*/}
            {/*  component={RouterLink}*/}
            {/*  href={paths.dashboard.customers.index}*/}
            {/*  sx={{*/}
            {/*    alignItems: 'center',*/}
            {/*    display: 'inline-flex'*/}
            {/*  }}*/}
            {/*  underline="hover"*/}
            {/*>*/}
            {/*  <SvgIcon sx={{ mr: 1 }}>*/}
            {/*    <ArrowLeftIcon />*/}
            {/*  </SvgIcon>*/}
            {/*  <Typography variant="subtitle2">*/}
            {/*    Customers*/}
            {/*  </Typography>*/}
            {/*</Link>*/}
          </div>

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

        {currentTab === "details" &&
          <>
            <Stack
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
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 5 }}>
                      Personal Details
                    </Typography>

                    <Stack spacing={3}>
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
                            formik.setFieldValue("mobile", value)
                            handlePhoneError(event)
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
                      <TextField
                        error={!!(formik.touched.source && formik.errors?.source)}
                        fullWidth
                        disabled={!unlockedEdit}
                        select
                        label="Lead Source"
                        name="source"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.source}

                      >
                        {formOptions?.source?.map((option) => (
                          <MenuItem key={option._id} value={option._id}>
                            {option.data.name}
                          </MenuItem>
                        ))}
                      </TextField>
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

                  </CardContent>
                </Card>
                <div className="hidden lg:flex">
                  <FormButtons
                    unlockedEdit={unlockedEdit}
                    formik={formik}
                    current={"Edit"}
                    handleCancel={() => changeMode()}
                    handleSubmit={() => formik.submitForm()}
                    sx={{ mt: 3, marginLeft: "auto" }}
                  />
                </div>

              </Grid>
              <Grid
                xs={12}
                lg={8}
              >
                <Card className={`mb-10 ${!unlockedEdit && "mt-12"}`}>
                  <CardContent>

                    <Typography variant="h6" sx={{ mb: 5 }}>
                      Basic Details
                    </Typography>

                    <Stack spacing={3}>
                      <TextField
                        error={!!(formik.touched.title && formik.errors?.title)}
                        fullWidth
                        disabled={!unlockedEdit}
                        helperText={formik.touched.title && formik.errors?.title}
                        label="Title"
                        name="title"
                        onBlur={formik.handleBlur}
                        sx={{
                          "& input": {
                            textTransform: "uppercase"
                          },
                        }}
                        onChange={e => {
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
                          onChange={(value) => {
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
                        options={formOptions?.assignee}
                        fieldName="assignee"
                        placeholder="Agent"
                      />
                    </Stack>

                  </CardContent>
                </Card>

                <div className="flex lg:hidden">
                  <FormButtons
                    unlockedEdit={unlockedEdit}
                    formik={formik}
                    current={"Edit"}
                    handleCancel={() => changeMode()}
                    handleSubmit={() => formik.submitForm()}
                    sx={{ mt: 3, marginLeft: "auto" }}
                  />
                </div>

              </Grid>
            </Grid>

            <ConfirmationDialog
              modelName={"Client"}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              handleDelete={handleDelete}
              isSubmitting={formik.isSubmitting}
            />
          </>
        }

      </form>
      {currentTab === "comments" && (
        <Stack spacing={2}>
          <TaskComment
            // key={comment.id}
            // comment={comment}
            pageName="Lead"
            id={leadId}
          />
        </Stack>
      )}
    </>

  );
};
