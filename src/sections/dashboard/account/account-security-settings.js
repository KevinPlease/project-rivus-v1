import { useCallback, useState, useMemo } from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";
import { SvgIcon } from "@mui/material";
import Edit02Icon from "@untitled-ui/icons-react/build/esm/Edit02";

import userAPI from "src/api/user";
import BaseAPI from "src/api/BaseAPI";


export const AccountSecuritySettings = (props) => {
  const { user } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [passwords, setPasswords] = useState({
    old: "",
    new: "",
    repeat: ""
  });

  const mismatchingPasswords = useMemo(() => passwords.new !== passwords.repeat, [passwords]);

  const handleSave = useCallback(async () => {
    if (mismatchingPasswords) return;

    const authInfo = BaseAPI.authForInfo(user);
    const response = await userAPI.changePassword(authInfo, passwords.old, passwords.new);
    if (response) {
      toast.success("Password changed successfully!");
      setPasswords({ old: "", new: "", repeat: "" });
    } else {
      toast.error("Problem chaning passwords. Check if your current password is correct.");
    }

    setIsEditing((prevState) => !prevState);
  }, [passwords, user, mismatchingPasswords]);

  const handleCancel = useCallback(() => {
    setIsEditing((prevState) => !prevState);
  }, []);

  const handleEdit = useCallback(() => {
    setIsEditing((prevState) => !prevState);
  }, []);

  const handlePasswordInput = useCallback((fieldName, value) => {
    setPasswords(prevState => ({
      ...prevState,
      [fieldName]: value
    }));
  }, []);

  return (
    <Stack spacing={4}>
      <Stack flex="flex" flexDirection="row" justifyContent="flex-end">
        {!isEditing &&
          <Button
            size="large"
            variant="text"
            startIcon={(
              <SvgIcon>
                <Edit02Icon />
              </SvgIcon>
            )}
            onClick={handleEdit}>
            Ndrysho
          </Button>}
      </Stack>

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
                Change password
              </Typography>
            </Grid>
            <Grid
              xs={12}
              sm={12}
              md={8}
            >
              <Stack
                alignItems="center"
                direction="row"
                spacing={3}
              >
                <TextField
                  disabled={!isEditing}
                  label="Current Password"
                  type="password"
                  value={passwords.old}
                  onChange={(e) => handlePasswordInput("old", e.target.value)}
                  sx={{
                    flexGrow: 1,
                    mb: 2,
                    ...(!isEditing && {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderStyle: "dotted"
                      }
                    })
                  }}
                />
              </Stack>
              <Stack
                alignItems="center"
                direction="row"
                spacing={3}
              >
                <TextField
                  disabled={!isEditing}
                  error={mismatchingPasswords}
                  label="New Password"
                  type="password"
                  value={passwords.new}
                  onChange={(e) => handlePasswordInput("new", e.target.value)}
                  sx={{
                    flexGrow: 1,
                    mb: 2,
                    ...(!isEditing && {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderStyle: "dotted"
                      }
                    })
                  }}
                />

              </Stack>
              <Stack
                alignItems="center"
                direction="row"
                spacing={3}
              >
                <TextField
                  disabled={!isEditing}
                  error={mismatchingPasswords}
                  helperText={mismatchingPasswords ? "Passwords do not match!" : undefined}
                  label="Confirm Password"
                  type="password"
                  value={passwords.repeat}
                  onChange={(e) => handlePasswordInput("repeat", e.target.value)}
                  sx={{
                    flexGrow: 1,
                    ...(!isEditing && {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderStyle: "dotted"
                      }
                    })
                  }}
                />

              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <div className={`ml-auto mr-2 w-fit self-end ${!isEditing ? "hidden" : ""}`}>
        <Button onClick={handleCancel} sx={{ mr: 2 }}>
          Cancel
        </Button>
        <Button disabled={mismatchingPasswords} onClick={handleSave} variant="contained">
          Save
        </Button>
      </div>

      {/*<Card>*/}
      {/*  <CardHeader title="Multi Factor Authentication" />*/}
      {/*  <CardContent sx={{ pt: 0 }}>*/}
      {/*    <Grid*/}
      {/*      container*/}
      {/*      spacing={4}*/}
      {/*    >*/}
      {/*      <Grid*/}
      {/*        xs={12}*/}
      {/*        sm={6}*/}
      {/*      >*/}
      {/*        <Card*/}
      {/*          sx={{ height: '100%' }}*/}
      {/*          variant="outlined"*/}
      {/*        >*/}
      {/*          <CardContent>*/}
      {/*            <Box*/}
      {/*              sx={{*/}
      {/*                display: 'block',*/}
      {/*                position: 'relative'*/}
      {/*              }}*/}
      {/*            >*/}
      {/*              <Box*/}
      {/*                sx={{*/}
      {/*                  '&::before': {*/}
      {/*                    backgroundColor: 'error.main',*/}
      {/*                    borderRadius: '50%',*/}
      {/*                    content: '""',*/}
      {/*                    display: 'block',*/}
      {/*                    height: 8,*/}
      {/*                    left: 4,*/}
      {/*                    position: 'absolute',*/}
      {/*                    top: 7,*/}
      {/*                    width: 8,*/}
      {/*                    zIndex: 1*/}
      {/*                  }*/}
      {/*                }}*/}
      {/*              >*/}
      {/*                <Typography*/}
      {/*                  color="error"*/}
      {/*                  sx={{ pl: 3 }}*/}
      {/*                  variant="body2"*/}
      {/*                >*/}
      {/*                  Off*/}
      {/*                </Typography>*/}
      {/*              </Box>*/}
      {/*            </Box>*/}
      {/*            <Typography*/}
      {/*              sx={{ mt: 1 }}*/}
      {/*              variant="subtitle2"*/}
      {/*            >*/}
      {/*              Authenticator App*/}
      {/*            </Typography>*/}
      {/*            <Typography*/}
      {/*              color="text.secondary"*/}
      {/*              sx={{ mt: 1 }}*/}
      {/*              variant="body2"*/}
      {/*            >*/}
      {/*              Use an authenticator app to generate one time security codes.*/}
      {/*            </Typography>*/}
      {/*            <Box sx={{ mt: 4 }}>*/}
      {/*              <Button*/}
      {/*                endIcon={(*/}
      {/*                  <SvgIcon>*/}
      {/*                    <ArrowRightIcon />*/}
      {/*                  </SvgIcon>*/}
      {/*                )}*/}
      {/*                variant="outlined"*/}
      {/*              >*/}
      {/*                Set Up*/}
      {/*              </Button>*/}
      {/*            </Box>*/}
      {/*          </CardContent>*/}
      {/*        </Card>*/}
      {/*      </Grid>*/}
      {/*      <Grid*/}
      {/*        sm={6}*/}
      {/*        xs={12}*/}
      {/*      >*/}
      {/*        <Card*/}
      {/*          sx={{ height: '100%' }}*/}
      {/*          variant="outlined"*/}
      {/*        >*/}
      {/*          <CardContent>*/}
      {/*            <Box sx={{ position: 'relative' }}>*/}
      {/*              <Box*/}
      {/*                sx={{*/}
      {/*                  '&::before': {*/}
      {/*                    backgroundColor: 'error.main',*/}
      {/*                    borderRadius: '50%',*/}
      {/*                    content: '""',*/}
      {/*                    display: 'block',*/}
      {/*                    height: 8,*/}
      {/*                    left: 4,*/}
      {/*                    position: 'absolute',*/}
      {/*                    top: 7,*/}
      {/*                    width: 8,*/}
      {/*                    zIndex: 1*/}
      {/*                  }*/}
      {/*                }}*/}
      {/*              >*/}
      {/*                <Typography*/}
      {/*                  color="error"*/}
      {/*                  sx={{ pl: 3 }}*/}
      {/*                  variant="body2"*/}
      {/*                >*/}
      {/*                  Off*/}
      {/*                </Typography>*/}
      {/*              </Box>*/}
      {/*            </Box>*/}
      {/*            <Typography*/}
      {/*              sx={{ mt: 1 }}*/}
      {/*              variant="subtitle2"*/}
      {/*            >*/}
      {/*              Text Message*/}
      {/*            </Typography>*/}
      {/*            <Typography*/}
      {/*              color="text.secondary"*/}
      {/*              sx={{ mt: 1 }}*/}
      {/*              variant="body2"*/}
      {/*            >*/}
      {/*              Use your mobile phone to receive security codes via SMS.*/}
      {/*            </Typography>*/}
      {/*            <Box sx={{ mt: 4 }}>*/}
      {/*              <Button*/}
      {/*                endIcon={(*/}
      {/*                  <SvgIcon>*/}
      {/*                    <ArrowRightIcon />*/}
      {/*                  </SvgIcon>*/}
      {/*                )}*/}
      {/*                variant="outlined"*/}
      {/*              >*/}
      {/*                Set Up*/}
      {/*              </Button>*/}
      {/*            </Box>*/}
      {/*          </CardContent>*/}
      {/*        </Card>*/}
      {/*      </Grid>*/}
      {/*    </Grid>*/}
      {/*  </CardContent>*/}
      {/*</Card>*/}
      {/*<Card>*/}
      {/*  <CardHeader*/}
      {/*    title="Login history"*/}
      {/*    subheader="Your recent login activity"*/}
      {/*  />*/}
      {/*  <Scrollbar>*/}
      {/*    <Table sx={{ minWidth: 500 }}>*/}
      {/*      <TableHead>*/}
      {/*        <TableRow>*/}
      {/*          <TableCell>*/}
      {/*            Login type*/}
      {/*          </TableCell>*/}
      {/*          <TableCell>*/}
      {/*            IP Address*/}
      {/*          </TableCell>*/}
      {/*          <TableCell>*/}
      {/*            Customer*/}
      {/*          </TableCell>*/}
      {/*        </TableRow>*/}
      {/*      </TableHead>*/}
      {/*      <TableBody>*/}
      {/*        {loginEvents.map((event) => {*/}
      {/*          const createdAt = format(event.createdAt, 'HH:mm a MM/dd/yyyy');*/}

      {/*          return (*/}
      {/*            <TableRow*/}
      {/*              key={event.id}*/}
      {/*              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}*/}
      {/*            >*/}
      {/*              <TableCell>*/}
      {/*                <Typography variant="subtitle2">*/}
      {/*                  {event.type}*/}
      {/*                </Typography>*/}
      {/*                <Typography*/}
      {/*                  variant="body2"*/}
      {/*                  color="body2"*/}
      {/*                >*/}
      {/*                  on {createdAt}*/}
      {/*                </Typography>*/}
      {/*              </TableCell>*/}
      {/*              <TableCell>*/}
      {/*                {event.ip}*/}
      {/*              </TableCell>*/}
      {/*              <TableCell>*/}
      {/*                {event.userAgent}*/}
      {/*              </TableCell>*/}
      {/*            </TableRow>*/}
      {/*          );*/}
      {/*        })}*/}
      {/*      </TableBody>*/}
      {/*    </Table>*/}
      {/*  </Scrollbar>*/}
      {/*</Card>*/}
    </Stack>
  );
};

AccountSecuritySettings.propTypes = {
  // loginEvents: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired
};
