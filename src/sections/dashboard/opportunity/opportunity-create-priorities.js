import React, { useCallback } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import toast from "react-hot-toast";
import { DragDropContext } from "react-beautiful-dnd";

import { PriorityCard } from "./priority-card/priority-card";


const OpportunityCreatePriorities = ({ priorities, handlePrioritiesChanged, unlockedEdit }) => {

  const handleDragEnd = useCallback(({ source, destination, draggableId }) => {
    try {
      // Dropped outside the column
      if (!destination) return;

      // Not been moved
      if (source.droppableId === destination.droppableId && source.index === destination.index) return;

      if (source.droppableId === destination.droppableId) {
        handlePrioritiesChanged(draggableId, destination.index);
      }
      
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  }, [handlePrioritiesChanged]);

  // const handlePrioritiesReset = useCallback(() => {
  //   try {
  //     // TODO: Should somehow revert to default positions
  //     toast.success("Priorities got reset!");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Something went wrong!");
  //   }
  // }, []);

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
            <Stack spacing={2}>
              <Typography variant="h6">
                Priorities
              </Typography>
              <Typography variant="body2">
                Order the priorities using Drag and Drop
              </Typography>
            </Stack>
          </Grid>


          <Stack alignItems="center" spacing={3}>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Box
                sx={{
                  display: "flex",
                  flexGrow: 1,
                  flexShrink: 1,
                  overflowX: "auto",
                  overflowY: "hidden",
                  px: 3,
                  py: 3
                }}
              >
                <Stack
                  direction="row"
                  spacing={3}
                >
                  <PriorityCard
                    id={"1"}
                    name={""}
                    priorityOptions={priorities}
                    unlockedEdit={unlockedEdit}
                    // onClear={handlePrioritiesReset}
                  />
                </Stack>
              </Box>
            </DragDropContext>
          </Stack>
        </Grid>

      </CardContent>
    </Card>
  );
};

export default OpportunityCreatePriorities;
