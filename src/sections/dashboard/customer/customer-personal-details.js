import React, {useState} from "react"
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import PhoneInput from 'react-phone-input-2';

export const CustomerPersonalDetails = ({ formik, unlockedEdit, orientation = false }) => {
  const [phoneError, setPhoneError] = useState(false);

  const handlePhoneError= (e) => {
    if (typeof e === "object" && e?.target?.value?.length < 5){
      setPhoneError(true);
    }else if(e < 5){
      setPhoneError(true)
    }else{
      setPhoneError(false)
    }
  };
  return (
    <Card>
      <CardContent>
        <Grid
          container
          spacing={3}
        >
          {!orientation &&
            <Grid
              xs={12}
              md={4}>
              <Typography variant="h6" marginBottom={4}>
                Personal Details
              </Typography>
            </Grid>
          }

          <Grid
            xs={12}
            md={orientation === "vertical" || orientation ==="modal" ? 12 : 8 }
          >

            {orientation === "vertical" ?
              <Typography variant="h6" marginBottom={4}>
                Personal Details
              </Typography> : null
            }

            <Stack spacing={3}>
              <TextField
                error={!!(formik?.touched.name && formik.errors?.name)}
                fullWidth
                disabled={!unlockedEdit}
                helperText={formik?.touched.name && formik.errors?.name}
                label="Full Name"
                required
                name="name"
                onBlur={formik?.handleBlur}
                onChange={formik?.handleChange}
                value={formik?.values?.name}
              />
              <PhoneInput
                  country={"al"}
                  name="mobile"
                  regions={'europe'}
                  containerStyle={{width:"100%", border: phoneError ? "2px red solid" : "none",borderRadius:"10px"}}
                  inputStyle={{width:"95%",padding: '25px', marginLeft:"5%", background:"transparent",borderRadius:"9px", borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px"}}
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
                    name: 'phone',
                    required: true,
                  }}
                  enableClickOutside={true}
              />
              <TextField
                error={!!(formik?.touched.email && formik.errors?.email)}
                fullWidth
                disabled={!unlockedEdit}
                helperText={formik?.touched.email && formik.errors?.email}
                label="E-mail"
                name="email"
                onBlur={formik?.handleBlur}
                onChange={formik?.handleChange}
                value={formik?.values.email}
              />
              <DatePicker
                fullWidth
                disabled={!unlockedEdit}
                label="Birthday"
                name="birthdate"
                value={formik?.values.birthdate}
                onChange={date => formik?.setFieldValue("birthdate", date)}
                onBlur={formik?.handleBlur}
                error={!!(formik?.touched.birthdate && formik.errors?.birthdate)}
                helperText={formik?.touched.birthdate && formik.errors?.birthdate}
              />
              <TextField
                error={!!(formik?.touched.personalId && formik.errors?.personalId)}
                fullWidth
                disabled={!unlockedEdit}
                helperText={formik?.touched.personalId && formik.errors?.personalId}
                label="Personal ID"
                name="personalId"
                onBlur={formik?.handleBlur}
                onChange={formik?.handleChange}
                value={formik?.values.personalId}
              />
              <TextField
                sx={{ my: 1.5 }}
                error={!!(formik?.touched?.address && formik?.errors?.address)}
                fullWidth
                disabled={!unlockedEdit}
                helperText={formik?.touched?.address && formik?.errors?.address}
                label="Address"
                name="address"
                onBlur={formik?.handleBlur}
                onChange={formik?.handleChange}
                value={formik?.values.address}
              />
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

};

