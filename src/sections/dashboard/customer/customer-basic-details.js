import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { QuillEditor } from 'src/components/quill-editor';
import AutocompleteComponent from "../../components/inputs/AutocompleteComponent";
const CustomerBasicDetails = ({ formik, formOptions=[] }) =>
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

          </Grid>
          <Grid
            xs={12}
            md={8}
          >
            <Stack spacing={3}>

              <div>
                <Typography
                  color="text.secondary"
                  sx={{ mb: 2 }}
                  variant="subtitle2"
                >
                  Description
                </Typography>
                <QuillEditor
                  onChange={(value) =>
                  {
                    formik.setFieldValue('description', value);
                  }}
                  placeholder="Write something"
                  sx={{ height: 200, resize: "vertical" }}
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
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )

};
export default CustomerBasicDetails;