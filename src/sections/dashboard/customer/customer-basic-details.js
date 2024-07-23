import React from "react"
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Unstable_Grid2";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { QuillEditor } from "src/components/quill-editor";
import AutocompleteComponent from "../../components/inputs/AutocompleteComponent";

export const CustomerBasicDetails = ({ formik, formOptions, unlockedEdit, orientation }) => {
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
              md={4}
            >

              <Typography variant="h6">
                Basic Details
              </Typography>

            </Grid>
          }

          <Grid
            xs={12}
            md={orientation === "vertical" ? 12 : 8}
          >

            {orientation === "vertical" &&
              <Typography variant="h6" marginBottom={4}>
                Basic Details
              </Typography>
            }

            <Stack spacing={3}>
              <TextField
                fullWidth
                error={!!(formik.touched.title && formik.errors?.title)}
                disabled={!unlockedEdit}
                helperText={formik.touched.title && formik.errors?.title}
                label="Title"
                name="title"
                sx={{
                  "& input": {
                    textTransform: "uppercase"
                  },
                }}
                required
                onBlur={formik.handleBlur}
                onChange={e => {
                  formik.setFieldValue("title", e.target.value);
                }}
                value={formik.values.title}
              />

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

              {!orientation &&
                <AutocompleteComponent
                  formik={formik}
                  options={formOptions?.assignee}
                  fieldName="assignee"
                  unlockedEdit={unlockedEdit}
                  placeholder="Agent"
                />
              }
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )

};