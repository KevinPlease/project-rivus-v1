import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { ExString } from "server/src/shared/String";

export const UserRoles = (props) => {
  const { formOptions, formik, unlockedEdit } = props;
  
  const branchNames = useMemo(() => {
    return formOptions.branch.map(b => b.data.name);
  }, [formOptions.branch]);

  return (
    <Box sx={{ minWidth: 500 }}>
      <Grid
        container
        spacing={3}
      >
        {branchNames.map((branch) => {
          return (
            <Grid
              key={branch}
              md={4}
              xs={12}
            >
              <Card>
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <Typography variant="subtitle2">
                      {ExString.capitalize(branch)}
                    </Typography>
                  </div>
                </CardContent>
                <Divider />

                <CardActions>
                  <TextField
                    fullWidth
                    label="Role"
                    name="role"
                    select
                    onChange={(e) => {
                      formik.values.roles[branch] = e.target.value;
                      formik.setFieldValue("roles", { ...formik.values.roles });
                    }}
                    disabled={!unlockedEdit}
                    value={formik.values.roles[branch] || ""}
                  >
                    {formOptions.role.map((option) => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.data.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
