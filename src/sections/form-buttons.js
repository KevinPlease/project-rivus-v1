import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export const FormButtons = ({ unlockedEdit, current, formik, handleDelete, handleCancel, handleSubmit, className, ...props }) => {

  return (
    unlockedEdit &&
    <Stack
      direction="row"
      justifyContent="space-between"
      className={className}
      {...props}
    >

      <Stack justifyContent="flex-start">
        {
          current === "Edit" && handleDelete &&
          <Button
            color="error"
            variant="outlined"
            disabled={formik.isSubmitting || !unlockedEdit}
            onClick={handleDelete}
          >
            Delete
          </Button>
        }
      </Stack>

      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={2}
      >
        <Button
          color="inherit"
          disabled={formik.isSubmitting}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        {
          handleSubmit ? 
          <Button
          type="submit"
          disabled={formik.isSubmitting}
          variant="contained"
          onClick={handleSubmit}
        >
          {current === "Edit" ? "Update" : "Create"}
        </Button>
        
        :
        
        <Button
          type="submit"
          disabled={formik.isSubmitting}
          variant="contained"
        >
          {current === "Edit" ? "Update" : "Create"}
        </Button>
        }
        
      </Stack>
    </Stack>

  );
};