import { forwardRef } from "react";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const PriorityFieldCard = forwardRef(function TaskCard(props, ref) {
  const { position, priorityField, dragging = false, ...other } = props;

  const hasImage = priorityField.imageSrc !== "";

  return (
    <Card
      elevation={dragging ? 8 : 1}
      ref={ref}
      sx={{
        backgroundColor: (theme) => theme.palette.mode === "dark"
          ? "neutral.800"
          : "background.paper",
        ...(dragging && {
          backgroundColor: (theme) => theme.palette.mode === "dark"
            ? "neutral.800"
            : "background.paper"
        }),
        p: 3,
        userSelect: "none",
        "&:hover": {
          backgroundColor: (theme) => theme.palette.mode === "dark"
            ? "neutral.700"
            : "neutral.50"
        },
        "&.MuiPaper-elevation1": {
          boxShadow: 1
        },
        minHeight: 80,
        maxHeight: 120
      }}
      {...other}>
      {hasImage && (
        <CardMedia
          image={priorityField.imageSrc}
          sx={{
            borderRadius: 1.5,
            height: 120,
            mb: 1
          }}
        />
      )}
      
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
      >
        <Typography variant="h6">
          {priorityField.name}
        </Typography>
        <Avatar>{position}</Avatar>

      </Stack>
    </Card>
  );
});

PriorityFieldCard.propTypes = {
  priorityField: PropTypes.object.isRequired,
  dragging: PropTypes.bool,
  onOpen: PropTypes.func
};
