import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { QuillEditor } from 'src/components/quill-editor';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
const CustomerCreatePesonalDetails = ({ formik, categoryOptions }) =>
{
    return (
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
                            Personal Details
                        </Typography>
                    </Grid>
                    <Grid
                        xs={12}
                        md={8}
                    >
                        <Stack spacing={3}>
                            <TextField
                                error={!!(formik.touched.title && formik.errors?.title)}
                                fullWidth
                                helperText={formik.touched.title && formik.errors?.title}
                                label="Title"
                                name="title"
                                required
                                onBlur={formik.handleBlur}
                                onChange={e => {
                                    const uppercaseTitle = e.target.value.toUpperCase();
                                    const fakeEvent = { target: {value: uppercaseTitle, id: "title", name: "title" } };
                                    return formik?.handleChange(fakeEvent);
                                }}
                                value={formik.values.title}
                            />
                            <TextField
                                error={!!(formik.touched.fullName && formik.errors?.fullName)}
                                fullWidth
                                helperText={formik.touched.fullName && formik.errors?.fullName}
                                label="Full Name"
                                required
                                name="fullName"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.fullName}
                            />
                            <TextField
                                sx={{my:1.5}}
                                error={!!(formik?.touched?.address && formik?.errors?.address)}
                                fullWidth
                                helperText={formik?.touched?.address && formik?.errors?.address}
                                label="Address"
                                name="address"
                                onBlur={formik?.handleBlur}
                                onChange={formik?.handleChange}
                                value={formik?.values.address}
                            />
                            <DatePicker
                                fullWidth
                                label="Birthday"
                                name="birthdate"
                                value={formik?.values?.birthdate}
                                onChange={date => formik?.setFieldValue('birthdate', date)}
                                onBlur={formik?.handleBlur}
                                error={formik?.touched?.birthdate && Boolean(formik?.errors?.birthdate)}
                                helperText={formik?.touched?.birthdate && formik?.errors?.birthdate}
                            />
                            <PhoneInput
                                country={"al"}
                                name="mobile"
                                regions={'europe'}
                                containerStyle={{width:"100%", display: 'inline-block' }}
                                inputStyle={{width:"95%",padding: '25px', marginLeft:"5%", background:"transparent"}}
                                buttonStyle={{ marginRight: "10px"}}
                                onBlur={formik?.handleBlur}
                                placeholder="Phone*"
                                onChange={(value)=>{
                                    formik.setFieldValue("mobile", value)
                                }}
                                value={formik?.values?.mobile}
                                error={!!(formik?.touched?.mobile && formik.errors?.mobile)}
                                helperText={formik?.touched?.mobile && formik.errors?.mobile}
                            />
                            <TextField
                                error={!!(formik.touched.email && formik.errors?.email)}
                                fullWidth
                                helperText={formik.touched.email && formik.errors?.email}
                                label="E-mail"
                                name="email"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.email}
                            />
                            <TextField
                                error={!!(formik.touched.personalId && formik.errors?.personalId)}
                                fullWidth
                                helperText={formik.touched.personalId && formik.errors?.personalId}
                                label="Personal ID"
                                name="personalId"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.personalId}
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )

};
export default CustomerCreatePesonalDetails;