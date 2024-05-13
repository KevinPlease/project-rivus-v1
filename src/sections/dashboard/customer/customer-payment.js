import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';

import {PropertyList} from 'src/components/property-list';
import {PropertyListItem} from 'src/components/property-list-item';
import Typography from "@mui/material/Typography";
import {QuillEditor} from "../../../components/quill-editor";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";

export const CustomerPayment = ({formik, disabled, formOptions}) => {
    const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

    const align = mdUp ? 'horizontal' : 'vertical';

    return (
        <Card>
            <CardHeader title="Description"/>
            <CardContent>
                <Grid
                    container
                    spacing={3}
                >

                </Grid>
                <Grid
                    xs={12}
                >
                    <Stack spacing={3}>

                        <div>
                            <Typography
                                color="text.secondary"
                                sx={{mb: 2}}
                                variant="subtitle2"
                            >
                                Description
                            </Typography>
                            <QuillEditor
                                onChange={(value) => {
                                    formik.setFieldValue('description', value);
                                }}
                                readOnly={disabled}
                                placeholder="Write something"
                                sx={{height: 200, resize: "vertical"}}
                                value={formik.values.description}
                            />
                            {!!(formik.touched.description && formik.errors?.description) && (
                                <Box sx={{mt: 2}}>
                                    <FormHelperText error>
                                        {formik.errors?.description}
                                    </FormHelperText>
                                </Box>
                            )}
                        </div>
                        <TextField
                            error={!!(formik.touched.assignee && formik.errors?.assignee)}
                            fullWidth
                            helperText={formik.touched.assignee && formik.errors?.assignee}
                            label="Agent"
                            name="assignee"
                            disabled={disabled}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            select
                            required
                            value={formik.values.assignee}
                        >
                            {formOptions?.assignee?.map((option) => (
                                <MenuItem key={option._id} value={option._id}>
                                    {option.data.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </Grid>
            </CardContent>
        </Card>
    );
};
