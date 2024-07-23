import React,{useEffect} from 'react'
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import AutocompleteComponent from "src/sections/components/inputs/AutocompleteComponent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useAuth} from "src/hooks/use-auth";
import {useFormik} from "formik";
import * as Yup from "yup";
import BaseAPI from "src/api/BaseAPI";
import customerApi from "src/api/customer";
import toast from "react-hot-toast";

const REQUIRED = "This field is required"

const ModalCustomer = ({formOptions, handleClose, setResetOwner})=>{
    const { user } = useAuth();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name:"",
            title:"",
            mobile:"",
            assignee: user?._id || "",
            submit: null
        },
        validationSchema: Yup.object({
            title: Yup.string().max(255).required(REQUIRED),
            name: Yup.string().max(255).required(REQUIRED),
            mobile: Yup.string().max(20).required(REQUIRED),
            assignee: Yup.string().max(24).required(REQUIRED),
        }),

        onSubmit: async (values, helpers) => {
            values.isDraft = false;
            const authInfo = BaseAPI.authForInfo(user);
            const response = await customerApi.askById(authInfo, undefined);
            const updateResponse = await customerApi.update(authInfo,  response?.model?._id, values);

            if (updateResponse.status === "failure") {
                toast.error("Something went wrong!");
                helpers.setStatus({ success: false });
                helpers.setErrors({ submit: err.message });
                helpers.setSubmitting(false);
                return;
            }

            helpers.setStatus({ success: true });
            helpers.setSubmitting(false);
            setResetOwner(prevState=>prevState+1)
            handleClose()
            toast.success("Customer created!");
        },
    });

    return(
        <div className="p-4">
            <div className="flex flex-row justify-between mb-3">
                <Typography id="modal-modal-title" variant="h6" component="h2" >
                    Add Customer
                </Typography >
            </div>
            <Grid
                container
                spacing={3}
            >

                <Grid
                    xs={12}
                    md={12}
                >

                    <Stack spacing={3}>
                        <TextField
                            error={!!(formik?.touched.title && formik.errors?.title)}
                            fullWidth
                            helperText={formik?.touched.title && formik.errors?.title}
                            label="Title"
                            name="title"
                            required
                            onBlur={formik?.handleBlur}
                            onChange={e => {
                                const uppercaseTitle = e.target.value.toUpperCase();
                                const fakeEvent = { target: {value: uppercaseTitle, id: "title", name: "title" } };
                                return formik?.handleChange(fakeEvent);
                            }
                            }
                            value={formik?.values.title}
                        />
                        <TextField
                            error={!!(formik?.touched.name && formik.errors?.name)}
                            fullWidth
                            helperText={formik?.touched.name && formik.errors?.name}
                            label="Full Name"
                            required
                            name="name"
                            onBlur={formik?.handleBlur}
                            onChange={formik?.handleChange}
                            value={formik?.values.name}
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

                        <AutocompleteComponent
                            formik={formik}
                            options={formOptions?.assignee}
                            fieldName="assignee"
                            placeholder="Agent"
                        />
                    </Stack>
                </Grid>
            </Grid>
            <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
                sx={{mt:2}}
            >
                <Button
                    color="inherit"
                    disabled={formik?.isSubmitting}
                    onClick={handleClose}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    onClick={formik.handleSubmit}
                    disabled={formik?.isSubmitting}
                    variant="contained"
                >
                    Create
                </Button>
            </Stack>
        </div>
    )
}

export default ModalCustomer