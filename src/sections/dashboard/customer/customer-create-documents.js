import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { QuillEditor } from 'src/components/quill-editor';
import { FileDropzone } from "../../../components/file-dropzone";
const CustomerCreateDocuments = ({ formik, categoryOptions, files, handleFilesDrop, handleFileRemove, handleFilesRemoveAll }) =>
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
                        <Stack spacing={1}>
                            <Typography variant="h6">
                                Documents
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid
                        xs={12}
                        md={8}
                    >
                        <FileDropzone
                            accept={{ 'image/*': [] }}
                            caption="(SVG, JPG, PNG, or gif maximum 900x400)"
                            files={files}
                            onDrop={handleFilesDrop}
                            onRemove={handleFileRemove}
                            onRemoveAll={handleFilesRemoveAll}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
export default CustomerCreateDocuments