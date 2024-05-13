import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import Upload01Icon from "@untitled-ui/icons-react/build/esm/Upload01";
import XIcon from "@untitled-ui/icons-react/build/esm/X";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import ImageListItem from "@mui/material/ImageListItem";
import ImageList from "@mui/material/ImageList";
import { FileIcon } from "./file-icon";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import React, { useCallback, useMemo } from "react";
import Tooltip from "@mui/material/Tooltip";
import { bytesToSize } from "../utils/bytes-to-size";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import { saveAs } from "file-saver";
import DownloadIcon from "@mui/icons-material/Download";
import BaseAPI from "src/api/BaseAPI";
import { useAuth } from "src/hooks/use-auth";

ImageListItem.propTypes = { children: PropTypes.node };
export const FileDropzone = (props) => {
  const { caption, files = [], onRemove, onRemoveAll, onUpload, unlockedEdit, ...other } = props;
  const { getRootProps, getInputProps, isDragActive } = useDropzone(other);
  const hasAnyFiles = files.length > 0;
  const { user } = useAuth();
  const baseAPI = useMemo(() => BaseAPI.emptyAPI(), []);

  const downloadDoc = useCallback(async (url, name, fileExtension) => {
    const authInfo = BaseAPI.authForInfo(user);
    const response = await baseAPI.downloadDocument(authInfo, url);
    if (response.status === "failure") return null;

    saveAs(response.data, `${name}.${fileExtension}`);
  }, []);

  const handleDownload = useCallback((url, name, extension) => {
    downloadDoc(url, name, extension);
  }, []);

  return (
    <div>
      {unlockedEdit ?
        <Box
          sx={{
            alignItems: "center",
            border: 1,
            borderRadius: 1,
            borderStyle: "dashed",
            borderColor: "divider",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            outline: "none",
            p: 6,
            ...(isDragActive && {
              backgroundColor: "action.active",
              opacity: 0.5
            }),
            "&:hover": {
              backgroundColor: "action.hover",
              cursor: "pointer",
              opacity: 0.5
            }
          }}
          {...getRootProps()}>
          <input {...getInputProps()} />
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <Avatar
              sx={{
                height: 64,
                width: 64
              }}
            >
              <SvgIcon>
                <Upload01Icon />
              </SvgIcon>
            </Avatar>
            <Stack spacing={1}>
              <Typography
                sx={{
                  "& span": {
                    textDecoration: "underline"
                  }
                }}
                variant="h6"
              >
                <span>Click to upload</span> or drag and drop
              </Typography>
              {caption && (
                <Typography
                  color="text.secondary"
                  variant="body2"
                >
                  {caption}
                </Typography>
              )}
            </Stack>
          </Stack>
        </Box>

        :

        <Box
          sx={{
            alignItems: "center",
            border: 1,
            borderRadius: 1,
            borderStyle: "dashed",
            borderColor: "divider",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            outline: "none",
            p: 6
          }}>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <Avatar
              sx={{
                height: 64,
                width: 64
              }}
            >
              <SvgIcon>
                <Upload01Icon />
              </SvgIcon>
            </Avatar>
            <Stack spacing={1}>
              <Typography variant="h6">
              {!hasAnyFiles ? "No documents have been uploaded..." : `${files.length} documents have been uploaded`}
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Activate Edit mode to upload files
              </Typography>
            </Stack>
          </Stack>
        </Box>

      }

      {hasAnyFiles && (
        <Box sx={{ mt: 2 }}>
          <ImageList sx={{ width: "100%", minHeight: 200, maxHeight: 450 }} cols={files[0]?.isImg ? 2 : 1}
            rowHeight={200}>

            {files.map((fileDetails, index) => {
              const id = fileDetails.id || fileDetails.file?.name;
              const extension = id.split('.').pop();
              return (
                <div key={index}>
                  {
                    <List>
                      <ListItem
                        sx={{
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                          '& + &': {
                            mt: 1
                          }
                        }}>
                        <ListItemIcon>
                          <FileIcon extension={extension} />
                        </ListItemIcon>
                        <ListItemText
                          primary={fileDetails.file.name}
                          primaryTypographyProps={{ variant: 'subtitle2' }}
                          secondary={fileDetails.size ? bytesToSize(fileDetails.size) : ""}
                        />
                        <Tooltip title="Download">
                          <span className="mr-2">
                            <IconButton
                              edge="end"
                              onClick={() => handleDownload(fileDetails.url || fileDetails.src, fileDetails.file.name, extension )}
                              disabled={!unlockedEdit}
                            >
                              <SvgIcon>
                                <DownloadIcon />
                              </SvgIcon>
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Remove">
                          <span>
                            <IconButton
                              edge="end"
                              onClick={() => onRemove?.(index)}
                              disabled={!unlockedEdit}
                            >
                              <SvgIcon>
                                <XIcon />
                              </SvgIcon>
                            </IconButton>
                          </span>
                        </Tooltip>

                      </ListItem>
                    </List>

                  }
                </div>
              )
            })}
          </ImageList>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            sx={{ mt: 2 }}
          >
            {unlockedEdit && <Button
              color="inherit"
              onClick={onRemoveAll}
              size="small"
              type="button"
            >
              Remove All
            </Button>}
            {onUpload && <Button
              onClick={onUpload?.bind(null, files)}
              size="small"
              type="button"
              variant="contained"
            >
              Upload
            </Button>}
          </Stack>
        </Box>
      )}
    </div>
  );
};

FileDropzone.propTypes = {
  caption: PropTypes.string,
  files: PropTypes.array,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  onUpload: PropTypes.func,
  // From Dropzone
  accept: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string.isRequired).isRequired),
  disabled: PropTypes.bool,
  getFilesFromEvent: PropTypes.func,
  maxFiles: PropTypes.number,
  maxSize: PropTypes.number,
  minSize: PropTypes.number,
  noClick: PropTypes.bool,
  noDrag: PropTypes.bool,
  noDragEventsBubbling: PropTypes.bool,
  noKeyboard: PropTypes.bool,
  onDrop: PropTypes.func,
  onDropAccepted: PropTypes.func,
  onDropRejected: PropTypes.func,
  onFileDialogCancel: PropTypes.func,
  preventDropOnDocument: PropTypes.bool,
  onChange: PropTypes.func
};