import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export const ConfirmationDialog = ({ modelName, handleDelete, isDialogOpen, setIsDialogOpen, isSubmitting }) => {
	return (
		<Dialog
        fullWidth
        maxWidth="sm"
        open={isDialogOpen}
      >
        <Box sx={{ p: 3 }}>
          <Typography
            align="center"
            gutterBottom
            variant="h6"
          >
            Are you sure you want to delete this {modelName}?
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            p: 3
          }}
        >
          <Stack
            alignItems="center"
            justifyContent="space-between"
            direction="row"
            spacing={2}
          >
            <Button
              color="inherit"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              color="error"
              variant="contained"
              disabled={isSubmitting}
              onClick={handleDelete}
            >
              DELETE
            </Button>
          </Stack>
        </Box>
      </Dialog>
	);
};