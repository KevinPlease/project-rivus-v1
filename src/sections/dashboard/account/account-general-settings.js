import { useState, useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import PropTypes from "prop-types";
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
import { Modal, Slider } from "@mui/material";
import AvatarEditor from "react-avatar-editor";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { FormButtons } from "src/sections/form-buttons";
import { toImageDetails } from "src/utils/files-to-imagedetails";
import BaseAPI from "src/api/BaseAPI";
import userAPI from "src/api/user";

// const REQUIRED = "Field is required!";
// const validationSchema = Yup.object({
//   name: Yup.string().max(255).required(REQUIRED),
//   email: Yup.string().max(255).required(REQUIRED),
//   phone: Yup.string().max(255).required(REQUIRED)
// });

const boxStyle = {
  width: "300px",
  height: "300px",
  display: "flex",
  flexFlow: "column",
  justifyContent: "center",
  alignItems: "center"
};
const modalStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};
export const AccountGeneralSettings = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  // ref to control input element
  // handle Click

  const handleImageDrop = useCallback((newImages) => {
    const imgDetails = toImageDetails(newImages);
    setImage(imgDetails[0]);
    setModalOpen(true);
  }, []);

  useEffect(() => {
    if (!user?.data.details.image) return;

    setImage(user.data.details.image);
  }, [user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleImageDrop });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.data.name || "",
      details: {
        email: user?.data.details.email || "",
        phone: user?.data.details.phone || "",
      },
      submit: null
    },
    // validationSchema,
    onSubmit: async (values, helpers) => {
      const authInfo = BaseAPI.authForInfo(user);
      const imageResponse = await handleImagesUpload([image]);
      if (imageResponse === "failure") {
        toast.error("Probleming uploading image!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "Probleming uploading image!" });
        helpers.setSubmitting(false);
        return;

      }
      const response = await userAPI.updateSelf(authInfo, values);
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
      setIsEditing((prevState) => !prevState);
    }
  });

  const handleImagesUpload = useCallback(async (allImages) => {
    try {
      const imageFiles = allImages.map(imgDetail => imgDetail.file).filter(imgFile => imgFile !== undefined);
      const authInfo = BaseAPI.authForInfo(user);
      const response = await userAPI.uploadImages(authInfo, user._id, imageFiles);
      if (response.status === "success") return response.status;

      toast("There was a problem uploading images!");
      return "failure";
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  const handleEdit = useCallback(() => {
    setIsEditing((prevState) => !prevState);
  }, []);

  const handleCancel = useCallback(() => {
    formik.resetForm();
    setIsEditing((prevState) => !prevState);
  }, []);

  return (
    <Stack spacing={4}>
      <div className={`ml-auto mr-2 ${isEditing ? "hidden" : ""}`}>
        <Button onClick={handleEdit}>
          Edit
        </Button>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
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
                              ...(isEditing && {
                                cursor: "pointer"
                              }),
                              ...(isEditing && {
                                "&:hover": {
                                  opacity: 1
                                }
                              })
                            }}
                            {...(isEditing ? getRootProps() : {})}>
                            {isEditing &&
                              <input
                                {...getInputProps()}
                                multiple={false}
                                accept={{ "image/*": [] }}
                                // onChange={handleImageDrop}
                              />
                            }
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
                      <TextField
                        disabled
                        defaultValue={user?.data.details.username}
                        label="Username"
                        sx={{ flexGrow: 1 }}
                      />

                    </Stack>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={2}
                    >
                      <TextField
                        disabled
                        defaultValue={user?.branch}
                        label="Branch"
                        sx={{ flexGrow: 1 }}
                      />

                    </Stack>

                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={2}
                    >
                      <TextField
                        disabled={!isEditing}
                        error={!!(formik.touched.details?.phone && formik.errors?.phone)}
                        name="details.phone"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.details.phone}
                        required
                        label="Phone Number"
                        sx={{ flexGrow: 1 }}
                      />
                    </Stack>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={2}
                    >
                      <TextField
                        disabled={!isEditing}
                        error={!!(formik.touched.name && formik.errors?.name)}
                        name="name"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        required
                        label="Full Name"
                        sx={{ flexGrow: 1 }}
                      />

                    </Stack>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={2}
                    >
                      <TextField
                        error={!!(formik.touched.details?.email && formik.errors?.email)}
                        name="details.email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.details.email}
                        disabled={!isEditing}
                        label="Email Address"
                        required
                        sx={{
                          flexGrow: 1,
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderStyle: "dashed"
                          }
                        }}
                      />
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <FormButtons
            unlockedEdit={isEditing}
            formik={formik}
            current="Edit"
            handleSubmit={formik.submitForm}
            handleCancel={handleCancel}
          />
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
      <Card>
        {/* <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              md={4}
            >
              <Typography variant="h6">
                Delete Account
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
                  Delete your account and all of your source data. This is irreversible.
                </Typography>
                <Button
                  color="error"
                  variant="outlined"
                >
                  Delete account
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent> */}
      </Card>
      <CropperModal
        modalOpen={modalOpen}
        src={image?.src}
        setImage={setImage}
        setModalOpen={setModalOpen}
      />
    </Stack>
  );
};
const CropperModal = ({ src, modalOpen, setModalOpen, setImage }) => {
  const [slideValue, setSlideValue] = useState(10);
  const cropRef = useRef(null);

  //handle save
  const handleSave = async () => {
    if (cropRef) {
      const dataUrl = cropRef.current.getImage().toDataURL();
      const result = await fetch(dataUrl);
      const blob = await result.blob();
      const file = new File([blob], 'cropped_image.png', { type: blob.type });
      setImage({ file, src: URL.createObjectURL(blob), isImg: true });
      setModalOpen(false);
    }
  };

  return (
    <Modal sx={modalStyle} open={modalOpen}>
      <Box sx={boxStyle}>
        <AvatarEditor
          ref={cropRef}
          image={src}
          style={{ width: "100%", height: "100%" }}
          border={50}
          borderRadius={150}
          color={[0, 0, 0, 0.72]}
          scale={slideValue / 10}
          rotate={0}
        />

        {/* MUI Slider */}
        <Slider
          min={10}
          max={50}
          sx={{
            margin: "0 auto",
            width: "80%",
            color: "cyan"
          }}
          size="medium"
          defaultValue={slideValue}
          value={slideValue}
          onChange={(e) => setSlideValue(e.target.value)}
        />
        <Box
          sx={{
            display: "flex",
            padding: "10px",
            border: "3px solid white",
            background: "black"
          }}
        >
          <Button
            size="small"
            sx={{ marginRight: "10px", color: "white", borderColor: "white" }}
            variant="outlined"
            onClick={(e) => setModalOpen(false)}
          >
            cancel
          </Button>
          <Button
            sx={{ background: "#5596e6" }}
            size="small"
            variant="contained"
            onClick={handleSave}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
AccountGeneralSettings.propTypes = {
  avatar: PropTypes.string,
  email: PropTypes.string,
  name: PropTypes.string
};
