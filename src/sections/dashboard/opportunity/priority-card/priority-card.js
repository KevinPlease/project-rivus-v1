import { Draggable, Droppable } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";

import { PriorityHeader } from "./priority-header";
import { PriorityFieldCard } from "./priority-field-card";

export const PriorityCard = ({ id, name, priorityOptions = [], onClear, unlockedEdit, ...props }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
        overflowX: "hidden",
        overflowY: "hidden",
        width: {
          xs: 300,
          sm: 380
        }
      }}>
      {/* <PriorityHeader
        name={name}
        onClear={onClear}
      /> */}
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.mode === "dark"
            ? "neutral.900"
            : "neutral.100",
          borderRadius: 2.5
        }}
      >
        <Droppable
          isDropDisabled={!unlockedEdit}
          droppableId={id}
          type="priority"
        >
          {(droppableProvider) => (
            <Box
              ref={droppableProvider.innerRef}
              sx={{
                flexGrow: 1,
                minHeight: 80,
                overflowY: "auto",
                px: 1,
                pt: 5
              }}
            >
              {priorityOptions?.map((priority, index) => (
                <Draggable
                isDragDisabled={!unlockedEdit}
                  key={priority._id}
                  draggableId={priority._id}
                  index={index}
                >
                  {(draggableProvided, snapshot) => (
                    <Box
                      ref={draggableProvided.innerRef}
                      style={{ ...draggableProvided.draggableProps.style }}
                      sx={{
                        outline: "none",
                        py: 1.5
                      }}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}>
                      <PriorityFieldCard
                        key={priority._id}
                        position={index + 1}
                        priorityField={priority}
                        dragging={snapshot.isDragging}
                      />
                    </Box>
                  )}
                </Draggable>
              ))}
              {droppableProvider.placeholder}
            </Box>
          )}
        </Droppable>
      </Box>
    </Box>
  );
};

PriorityCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  priorityOptions: PropTypes.array.isRequired,
  onClear: PropTypes.func
};
