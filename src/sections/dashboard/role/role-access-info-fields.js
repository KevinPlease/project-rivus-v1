import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { ExString } from 'server/src/shared/String';
import { Stack } from '@mui/material';

const options = [
  { _id: 0, data: { name: "No Access" } },
  { _id: 1, data: { name: "Redacted" } },
  { _id: 4, data: { name: "Selfish" } },
  { _id: 240, data: { name: "Overseer" } }
];

export const RoleAccessInfoFields = (props) => {
  const { accessInfo, formik, handleAccessInfoChange, unlockedEdit } = props;
  const [selectedRole, setSelectedRole] = useState("user");

  const modelRoles = useMemo(() => {
    return Object.keys(accessInfo);
  }, [accessInfo]);

  const modelFields = useMemo(() => {
    return Object.keys(accessInfo[selectedRole]);
  }, [accessInfo, selectedRole]);

  return (
    <Box sx={{ minWidth: 500 }}>
      <Stack spacing={2}>
        <TextField
          fullWidth
          label="Model"
          name="modelRole"
          select
          onChange={(e) => setSelectedRole(e.target.value)}
          disabled={!unlockedEdit}
          value={selectedRole}
        >
          {modelRoles.map((role) => (
            <MenuItem key={role} value={role}>
              {ExString.capitalize(role)}
            </MenuItem>
          ))}
        </TextField>
        <Grid
          container
          spacing={3}
        >
          {modelFields.map((fieldName) => {
            return (
              <Grid
                key={fieldName}
                md={4}
                xs={12}
              >
                <Card>
                  <CardContent
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <Typography variant="subtitle2">
                        {ExString.capitalize(fieldName)}
                      </Typography>
                    </div>
                  </CardContent>
                  <Divider />

                  <CardActions>
                    <TextField
                      fullWidth
                      label="Read"
                      name="read"
                      select
                      onChange={(e) => {
                        accessInfo[selectedRole][fieldName].read = e.target.value;
                        handleAccessInfoChange('fieldAccess', accessInfo);
                      }}
                      disabled={!unlockedEdit}
                      value={accessInfo[selectedRole][fieldName].read}
                    >
                      {options.map((option) => (
                        <MenuItem key={option._id} value={option._id}>
                          {option.data.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth
                      label="Write"
                      name="write"
                      select
                      onChange={(e) => {
                        accessInfo[selectedRole][fieldName].write = e.target.value;
                        handleAccessInfoChange('fieldAccess', accessInfo);
                      }}
                      disabled={!unlockedEdit}
                      value={accessInfo[selectedRole][fieldName].write}
                    >
                      {options.map((option) => (
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
      </Stack>

    </Box>
  );
};
