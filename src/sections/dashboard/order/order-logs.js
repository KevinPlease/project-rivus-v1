import PropTypes from 'prop-types';
import { format } from 'date-fns';
import ShoppingCart03Icon from '@untitled-ui/icons-react/build/esm/ShoppingCart03';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';

export const OrderLogs = (props) => {
  const { logs, ...other } = props;

  return (
    <Card {...other}>
      <CardHeader title="Logs" />
      <CardContent sx={{ pt: 0 }}>
        <Timeline
          sx={{
            m: 0,
            p: 0
          }}
        >
          {logs.map((log, index) => {
            const showConnector = logs.length - 1 > index;
            const createdAt = format(log.createdAt, 'MMM dd, h:mm a');

            return (
              <TimelineItem
                key={log.id}
                sx={{
                  '&::before': {
                    display: 'none'
                  }
                }}
              >
                <TimelineSeparator>
                  <TimelineDot
                    sx={{
                      border: 0,
                      p: 0
                    }}
                  >
                    <Avatar>
                      <SvgIcon>
                        <ShoppingCart03Icon />
                      </SvgIcon>
                    </Avatar>
                  </TimelineDot>
                  {showConnector && (
                    <TimelineConnector sx={{ minHeight: 30 }} />
                  )}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="body2">
                    {log.message}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                    variant="caption"
                  >
                    {createdAt}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 2
          }}
        >
          <Button color="inherit">
            Load more
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

OrderLogs.propTypes = {
  logs: PropTypes.array.isRequired
};
