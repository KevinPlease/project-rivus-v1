import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FileDropzone } from "../../../components/file-dropzone";

export const ClientCreateDocuments = (
    {
        unlockedEdit,
        files,
        // handleFilesUpload,
        handleFilesDrop,
        handleFileRemove,
        handleFilesRemoveAll,
        orientation = false
    }) => {
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
                            <Stack spacing={1}>
                                <Typography variant="h6">
                                    Documents
                                </Typography>
                            </Stack>
                        </Grid>
                    }

                    <Grid
                        xs={12}
                        md={orientation === "vertical" || orientation ==="modal" ? 12 : 8 }
                    >
                        <FileDropzone
                            accept={{ "application/msword": [], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [], "application/pdf": [] }}
                            caption="(Documents: .doc, .docx, .pdf)"
                            files={files}
                            unlockedEdit={unlockedEdit}
                            onDrop={handleFilesDrop}
                            onRemove={handleFileRemove}
                            onRemoveAll={handleFilesRemoveAll}
                            // onUpload={handleFilesUpload}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
