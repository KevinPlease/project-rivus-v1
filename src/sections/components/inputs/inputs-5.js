import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const categoryOptions = [
  {
    label: 'Healthcare',
    value: 'healthcare'
  },
  {
    label: 'Makeup',
    value: 'makeup'
  },
  {
    label: 'Dress',
    value: 'dress'
  },
  {
    label: 'Skincare',
    value: 'skincare'
  },
  {
    label: 'Jewelry',
    value: 'jewelry'
  },
  {
    label: 'Blouse',
    value: 'blouse'
  }
];

const now = new Date();

export const Inputs5 = () => (
  <Box sx={{ p: 3 }}>
    <Stack spacing={3}>
      <div>
        <FormControlLabel
          control={<Switch color="primary" />}
          label="Schedule Publish"
        />
      </div>
      <DateTimePicker
        label="Start date"
        onChange={() => { }}
        value={now}
      />
      <TextField
        defaultValue={categoryOptions[0].value}
        fullWidth
        label="Category"
        name="category"
        select
      >
        {categoryOptions.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <div>
        <div>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Published Globally"
          />
        </div>
        <div>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Enable Contents"
          />
        </div>
      </div>
    </Stack>
  </Box>
);
