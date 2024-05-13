import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

export const CustomerDataManagement = ({changeMode, isEdit}) => (
  <Card>
    <CardHeader title="Data Management" />
    <CardContent sx={{ pt: 0 }}>
      <div className="flex flex-row justify-between">
        <Button
            color="error"
            variant="outlined"
        >
          Delete Client
        </Button>
      </div>

      <Box sx={{ mt: 1 }}>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          Remove this client’s chart if he requested that, if not
          please be aware that what has been deleted can never brought
          back
        </Typography>
      </Box>
    </CardContent>
  </Card>
);
