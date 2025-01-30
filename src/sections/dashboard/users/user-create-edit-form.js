import { useState, useCallback, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";
import Camera01Icon from "@untitled-ui/icons-react/build/esm/Camera01";
import User01Icon from "@untitled-ui/icons-react/build/esm/User01";
import { alpha } from "@mui/system/colorManipulator";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";

import { FormButtons } from "src/sections/form-buttons";
import { toImageDetails } from "src/utils/files-to-imagedetails";
import BaseAPI from "src/api/BaseAPI";
import userAPI from "src/api/user";
import { CropperModal } from "src/components/modals/CroppedModal";
import { useAuth } from "src/hooks/use-auth";
import { ClipboardChip } from "src/sections/components/buttons/clipboard_chip";
import { Divider, MenuItem, Tab, Tabs } from "@mui/material";
import { UserRoles } from "./user-roles";
import PhoneInput from "react-phone-input-2";
import { ExString } from "server/src/shared/String";

const REQUIRED = "Field is required!";
const validationSchema = Yup.object({
  name: Yup.string().max(255).required(REQUIRED),
  username: Yup.string().max(255).required(REQUIRED),
  branch: Yup.string().max(255).required(REQUIRED),
  email: Yup.string().max(255).required(REQUIRED),
  phone: Yup.string().max(255).required(REQUIRED),
  roles: Yup.object().required(REQUIRED),
  images: Yup.array()
});

export const UserCreateEditForm = ({ current, model, formOptions }) => {
  const { user } = useAuth();
  const [unlockedEdit, setUnlockedEdit] = useState(current === "Create");
  const [image, setImage] = useState(null);
  const [phoneError, setPhoneError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("details");

  const tabs = useMemo(() => [
    { label: "Details", value: "details" },
    { label: "Roles", value: "roles" }
  ], [unlockedEdit]);

  const data = useMemo(() => current === "Edit" ? model.data : {}, [model, current]);
  const id = current === "Edit" && model._id;
  const displayId = current === "Edit" && model.displayId;

  const curUserBranchName = ExString.betweenFirstTwo(model.repository, "/", "@");
  const branch = formOptions.branch.find(b => b.data.name === curUserBranchName)?._id || formOptions.branch.find(b => b.data.name === user.branch)?._id;
  const formik = useFormik({
    enableReinitialize: false,
    initialValues: {
      name: data.name || "",
      username: data.username || "",
      branch: branch,
      email: data.email || "",
      phone: data.phone || "",
      password: data.password || "",
      roles: data.roles || {},
      images: []
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      const authInfo = BaseAPI.authForInfo(user);

      if (image) values.images = await handleImagesUpload([image]);

      let response = null;
      if (id) {
        response = await userAPI.update(authInfo, id, values);
      } else {
        response = await userAPI.create(authInfo, values);
      }

      if (response.status === "failure") {
        toast.error("Something went wrong!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: response.data });
        helpers.setSubmitting(false);
        return;
      }

      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
      toast.success("User updated!");
      setUnlockedEdit((prevState) => !prevState);
    }
  });

  useEffect(() => {
    if (!data.images || data.images?.length === 0) return;

    setImage(data.images[0]);
  }, [data]);

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

  const handleImageDrop = useCallback((newImages) => {
    const imgDetails = toImageDetails(newImages);
    setImage(imgDetails[0]);
    setModalOpen(true);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleImageDrop });

  const handleImagesUpload = useCallback(async (allImages) => {
    try {
      const imageFiles = allImages.map(imgDetail => imgDetail.file).filter(imgFile => imgFile !== undefined);
      const authInfo = BaseAPI.authForInfo(user);
      const response = await userAPI.uploadImages(authInfo, id, imageFiles);
      if (response.status === "success") return response.data;

      toast.error("There was a problem uploading images!");
      return [];

    } catch (err) {
      console.error(err);
      return [];
    }
  }, [id, user]);

  const handleCancel = useCallback(() => {
    formik.resetForm();
    setUnlockedEdit((prevState) => !prevState);
  }, []);

  return (
    <Stack>
      {current === "Edit" &&
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
      }

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
      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          {currentTab === "details" &&
            (<Card>
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
                      Basic details
                    </Typography>
                  </Grid>
                  <Grid
                    xs={12}
                    md={8}
                  >
                    <Stack spacing={3}>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Box
                          sx={{
                            borderColor: "neutral.300",
                            borderRadius: "50%",
                            borderStyle: "dashed",
                            borderWidth: 1,
                            p: "4px"
                          }}
                        >
                          <Box
                            sx={{
                              borderRadius: "50%",
                              height: "100%",
                              width: "100%",
                              position: "relative"
                            }}
                          >
                            <Box
                              sx={{
                                alignItems: "center",
                                backgroundColor: (theme) => alpha(theme.palette.neutral[700], 0.5),
                                borderRadius: "50%",
                                color: "common.white",
                                display: "flex",
                                height: "100%",
                                justifyContent: "center",
                                left: 0,
                                opacity: 0,
                                position: "absolute",
                                top: 0,
                                width: "100%",
                                zIndex: 1,
                                ...(isDragActive && {
                                  backgroundColor: "action.active",
                                  opacity: 0.5
                                }),
                                ...(unlockedEdit && {
                                  cursor: "pointer"
                                }),
                                ...(unlockedEdit && {
                                  "&:hover": {
                                    opacity: 1
                                  }
                                })
                              }}
                              {...(unlockedEdit ? getRootProps() : {})}>
                              {unlockedEdit &&
                                <input
                                  {...getInputProps()}
                                  multiple={false}
                                  accept={{ "image/*": [] }} />}
                              <Stack
                                alignItems="center"
                                direction="row"
                                spacing={1}
                              >
                                <SvgIcon color="inherit">
                                  <Camera01Icon />
                                </SvgIcon>
                                <Typography
                                  color="inherit"
                                  variant="subtitle2"
                                  sx={{ fontWeight: 700 }}
                                >
                                  Select
                                </Typography>
                              </Stack>
                            </Box>
                            <Avatar
                              src={image?.url || image?.src}
                              sx={{
                                height: 150,
                                width: 150
                              }}
                            >
                              <SvgIcon>
                                <User01Icon />
                              </SvgIcon>
                            </Avatar>
                          </Box>
                        </Box>

                      </Stack>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        {
                          current === "Edit" ?
                            (<TextField
                              fullWidth
                              disabled={true}
                              defaultValue={data.username}
                              label="Username" />)
                            :
                            (<TextField
                              fullWidth
                              error={!!(formik.touched.username && formik.errors?.username)}
                              disabled={!unlockedEdit}
                              value={formik.values.username}
                              label="Username"
                              name="username"
                              required
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange} />)
                        }


                      </Stack>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <TextField
                          error={!!(formik.touched.branch && formik.errors?.branch)}
                          fullWidth
                          label="Branch"
                          name="branch"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          select
                          required
                          disabled={true}
                          value={formik.values.branch}
                        >
                          {formOptions.branch.map((option) => (
                            <MenuItem key={option._id} value={option._id}>
                              {option.data.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Stack>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <TextField
                          disabled={!unlockedEdit}
                          error={!!(formik.touched.name && formik.errors?.name)}
                          name="name"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.name}
                          required
                          label="Full Name"
                          sx={{ flexGrow: 1 }} />

                      </Stack>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <TextField
                          error={!!(formik.touched?.email && formik.errors?.email)}
                          name="email"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.email}
                          disabled={!unlockedEdit}
                          label="Email Address"
                          required
                          sx={{
                            flexGrow: 1,
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderStyle: "dashed"
                            }
                          }} />
                      </Stack>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                          <PhoneInput
                            country={"al"}
                            name="phone"
                            disabled={!unlockedEdit}
                            regions={"europe"}
                            containerStyle={{width:"100%", border: phoneError ? "2px red solid" : "none",borderRadius:"10px"}}
                            inputStyle={{width:"95%",padding: "25px", marginLeft:"5%", background:"transparent",borderRadius:"9px", borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px"}}
                            buttonStyle={{ marginRight: "10px", borderRadius:"8px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px"}}
                            onBlur={(event, data) => handlePhoneError(event)}
                            placeholder="Phone*"
                            onChange={(value,event)=>{
                              formik.setFieldValue("phone", value)
                              handlePhoneError(event)
                            }}
                            defaultErrorMessage="Field required"
                            value={formik.values.phone}
                            helperText={formik?.touched?.phone && formik.errors?.phone}
                            inputProps={{
                              name: "phone",
                              required: true,
                            }}
                            enableClickOutside={true}
                        />
                      </Stack>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <TextField
                          disabled={!unlockedEdit}
                          error={!!(formik.touched?.password && formik.errors?.password)}
                          name="password"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.password}
                          required={current !== "Edit"}
                          type="password"
                          label="Password"
                          sx={{ flexGrow: 1 }} />
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>)
          }

          {currentTab === "roles" &&
            (<UserRoles
              formik={formik}
              formOptions={formOptions}
              unlockedEdit={unlockedEdit} />)
          }

          {current === "Edit" && (
            <Card>
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
                      Fshi Perdoruesin
                    </Typography>
                  </Grid>
                  <Grid
                    xs={12}
                    md={8}
                  >
                    <Stack
                      alignItems="flex-start"
                      spacing={3}
                    >
                      <Typography variant="subtitle1">
                        Fshi perdoruesin me gjithe informacionet. Kjo nuk kthehet mbrapsht!
                      </Typography>
                      <Button
                        disabled={!unlockedEdit}
                        color="error"
                        variant="outlined"
                      >
                        FSHI
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          <FormButtons
            unlockedEdit={unlockedEdit}
            formik={formik}
            current="Edit"
            handleSubmit={formik.submitForm}
            handleCancel={handleCancel} />
        </Stack>
      </form>
      {/*<Card>*/}
      {/*  <CardContent>*/}
      {/*    <Grid*/}
      {/*      container*/}
      {/*      spacing={3}*/}
      {/*    >*/}
      {/*      <Grid*/}
      {/*        xs={12}*/}
      {/*        md={4}*/}
      {/*      >*/}
      {/*        <Typography variant="h6">*/}
      {/*          Public profile*/}
      {/*        </Typography>*/}
      {/*      </Grid>*/}
      {/*      <Grid*/}
      {/*        xs={12}*/}
      {/*        sm={12}*/}
      {/*        md={8}*/}
      {/*      >*/}
      {/*        <Stack*/}
      {/*          divider={<Divider />}*/}
      {/*          spacing={3}*/}
      {/*        >*/}
      {/*          <Stack*/}
      {/*            alignItems="flex-start"*/}
      {/*            direction="row"*/}
      {/*            justifyContent="space-between"*/}
      {/*            spacing={3}*/}
      {/*          >*/}
      {/*            <Stack spacing={1}>*/}
      {/*              <Typography variant="subtitle1">*/}
      {/*                Make Contact Info Public*/}
      {/*              </Typography>*/}
      {/*              <Typography*/}
      {/*                color="text.secondary"*/}
      {/*                variant="body2"*/}
      {/*              >*/}
      {/*                Means that anyone viewing your profile will be able to see your contacts*/}
      {/*                details.*/}
      {/*              </Typography>*/}
      {/*            </Stack>*/}
      {/*            <Switch />*/}
      {/*          </Stack>*/}
      {/*          <Stack*/}
      {/*            alignItems="flex-start"*/}
      {/*            direction="row"*/}
      {/*            justifyContent="space-between"*/}
      {/*            spacing={3}*/}
      {/*          >*/}
      {/*            <Stack spacing={1}>*/}
      {/*              <Typography variant="subtitle1">*/}
      {/*                Available to hire*/}
      {/*              </Typography>*/}
      {/*              <Typography*/}
      {/*                color="text.secondary"*/}
      {/*                variant="body2"*/}
      {/*              >*/}
      {/*                Toggling this will let your teammates know that you are available for*/}
      {/*                acquiring new projects.*/}
      {/*              </Typography>*/}
      {/*            </Stack>*/}
      {/*            <Switch />*/}
      {/*          </Stack>*/}
      {/*        </Stack>*/}
      {/*      </Grid>*/}
      {/*    </Grid>*/}
      {/*  </CardContent>*/}
      {/*</Card>*/}
      <CropperModal
        modalOpen={modalOpen}
        src={image?.src}
        setImage={setImage}
        setModalOpen={setModalOpen}
      />
    </Stack>
  );
};

