import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { QuillEditor } from "src/components/quill-editor";
import MenuItem from "@mui/material/MenuItem";
import {useFormikContext, FastField} from "formik";

const OpportunityCreateStages = ({ formOptions, unlockedEdit }) => {
    const formik = useFormikContext()
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
                            Sales Stage
                        </Typography>
                    </Grid>
                    <Grid
                        xs={12}
                        md={8}
                    >
                        <Stack spacing={3}>
                            <FastField name="saleStage">
                                {({ field, form }) => (
                                    <TextField
                                        error={!!(form.touched.saleStage && form.errors?.saleStage)}
                                        fullWidth
                                        select
                                        helperText={form.touched.saleStage && form.errors?.saleStage}
                                        label="Stage"
                                        name={field.name}
                                        required
                                        disabled={!unlockedEdit}
                                        onBlur={field.onBlur}
                                        onChange={field.onChange}
                                        value={field.value}
                                    >
                                        {formOptions.saleStage.map((option) => (
                                            <MenuItem key={option._id} value={option._id}>
                                                {option.data.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            </FastField>
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
                                        formik.setFieldValue("details.description", value);
                                    }}
                                    readOnly={!unlockedEdit}
                                    placeholder="Write something"
                                    sx={{ height: 200, resize: unlockedEdit ? "vertical" : "" }}
                                    value={formik.values.details.description}
                                />
                                {!!(formik.touched.description && formik.errors?.description) && (
                                    <Box sx={{ mt: 2 }}>
                                        <FormHelperText error>
                                            {formik.errors?.description}
                                        </FormHelperText>
                                    </Box>
                                )}
                            </div>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
export default OpportunityCreateStages;
