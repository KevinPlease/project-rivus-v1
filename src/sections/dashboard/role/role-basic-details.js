import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { QuillEditor } from "src/components/quill-editor";
import AutocompleteComponent from "../../components/inputs/AutocompleteComponent";


const RoleBasicDetails = ({ formik, formOptions, unlockedEdit }) => {

  return (
    <>
      <Card>
        <CardContent className="flex flex-col">
          <div className="grid grid-cols-12">
            <div className="flex flex-row items-center md:items-start justify-between col-span-12 md:col-span-4">
              <Typography variant="h6">
                Detajet baze
              </Typography>
            </div>
            <div className="col-span-12 md:col-span-8">

              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.name && formik.errors?.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors?.name}
                  label="Name"
                  name="name"
                  // sx={{
                  //   '& input': {
                  //     textTransform: 'uppercase'
                  //   },
                  // }}
                  required
                  disabled={!unlockedEdit}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
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
                      formik.setFieldValue("description", value);

                    }}
                    readOnly={!unlockedEdit}
                    placeholder="Write something"
                    sx={{ height: 500, resize: unlockedEdit ? "vertical" : "" }}
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
                {/* <AutocompleteComponent
                  formik={formik}
                  options={formOptions?.assignee}
                  fieldName="assignee"
                  placeholder="Agent"
                  unlockedEdit={unlockedEdit} // Pass the unlockedEdit prop to your custom component
                /> */}
              </Stack>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default RoleBasicDetails;
