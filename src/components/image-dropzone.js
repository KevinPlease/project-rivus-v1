import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import Upload01Icon from "@untitled-ui/icons-react/build/esm/Upload01";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import ImageListItem from "@mui/material/ImageListItem";
import { DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { SortablePhoto } from "./dndKitComponents/sortable-photo";
import { Photo } from "./dndKitComponents/photo";

ImageListItem.propTypes = { children: PropTypes.node };
export const ImageDropZone = (props) => {
  const { caption, images = [], onRemove, setImages, onRemoveAll, onUpload, unlockedEdit, ...other } = props;
  const { getRootProps, getInputProps, isDragActive } = useDropzone(other);
  const [activeImg, setActiveImg] = useState({ name: null, url: null });
  const sensors = useSensors(useSensor(MouseSensor, TouchSensor));

  const handleDragStart = useCallback((event) => {
    const img = images.find(img => img.name === event.active.name);
    setActiveImg({ name: event.active.name, url: img.url || img.src });
  }, [images]);

  const handleDeleteClick = useCallback((index) => {
    // Make sure the index is within valid bounds
    if (index < 0 || index >= images.length) return;

    onRemove?.(index);
  }, [images]);


  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (active?.name && over?.name && active.name !== over.name) {
      setImages((images) => {
        const oldIndex = images.findIndex(obj => obj.name === active.name)
        const newIndex = images.findIndex(obj => obj.name === over.name);
        return arrayMove(images, oldIndex, newIndex)
      });
    }

    setActiveImg({ name: null, url: null });
  }, []);

  // function handleDblClick(index) {
  //     if (index) {
  //         setImages((images) => {
  //             return arrayMove(images, index, 0)
  //         });
  //     }
  //
  //     setActiveId(null);
  // }
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
                {!images.length ? "No images have been uploaded..." : `${images.length} images have been uploaded`}
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

      {!!images.length && (
        <Box sx={{ mt: 2 }}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 ">
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={images} disabled={!unlockedEdit}>
                {images.map((fileDetails, index) => {
                  return <SortablePhoto
                    // handleDblClick={handleDblClick}
                    unlockedEdit={unlockedEdit}
                    handleDeleteClick={handleDeleteClick}
                    key={fileDetails.name}
                    name={fileDetails.name}
                    url={fileDetails.url || fileDetails.src}
                    index={index}
                  />
                })}
              </SortableContext>

              <DragOverlay adjustScale={true}>
                {activeImg.name ? (
                  <Photo url={activeImg.url} index={images.findIndex(img => img.name === activeImg.name)} />
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>

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
              onClick={onUpload?.bind(null, images)}
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

ImageDropZone.propTypes = {
  caption: PropTypes.string,
  images: PropTypes.array,
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