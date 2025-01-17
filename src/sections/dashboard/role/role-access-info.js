import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { ExString } from 'server/src/shared/String';

const options = [
  { _id: 0, data: { name: "No Access" } },
  { _id: 1, data: { name: "Redacted" } },
  { _id: 4, data: { name: "Selfish" } },
  { _id: 240, data: { name: "Overseer" } }
];

export const RoleAccessInfo = (props) => {
  const { formik, accessInfo, handleAccessInfoChange, unlockedEdit } = props;
  
  const modelRoles = useMemo(() => {
    return Object.keys(accessInfo);
  }, [accessInfo]);

  return (
    <Box sx={{ minWidth: 500 }}>
      <Grid
        container
        spacing={3}
      >
        {modelRoles.map((role) => {
          return (
            <Grid
              key={role}
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
                      {ExString.capitalize(role)}
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
                      accessInfo[role].read = e.target.value;
                      handleAccessInfoChange('global', accessInfo);
                    }}
                    disabled={!unlockedEdit}
                    value={accessInfo[role].read}
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
                      accessInfo[role].write = e.target.value;
                      handleAccessInfoChange('global', accessInfo);
                    }}
                    disabled={!unlockedEdit}
                    value={accessInfo[role].write}
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
    </Box>
  );
};
