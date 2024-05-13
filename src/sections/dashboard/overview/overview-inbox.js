import PropTypes from 'prop-types';
import { formatDistanceStrict } from 'date-fns';
import ArrowRightIcon from '@untitled-ui/icons-react/build/esm/ArrowRight';
import RefreshCcw01Icon from '@untitled-ui/icons-react/build/esm/RefreshCcw01';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { customLocale } from 'src/utils/date-locale';

export const OverviewInbox = (props) => {
  const { messages } = props;

  return (
    <Card>
      <CardHeader
        title="Inbox"
        action={(
          <IconButton color="inherit">
            <SvgIcon fontSize="small">
              <RefreshCcw01Icon />
            </SvgIcon>
          </IconButton>
        )}
      />
      <List disablePadding>
        {messages.map((message) => {
          const ago = formatDistanceStrict(message.createdAt, new Date(), {
            addSuffix: true,
            locale: customLocale
          });

          return (
            <ListItem
              key={message.id}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                  cursor: 'pointer'
                }
              }}
            >
              <ListItemAvatar>
                {message.senderOnline
                  ? (
                    <Badge
                      anchorOrigin={{
                        horizontal: 'right',
                        vertical: 'bottom'
                      }}
                      color="success"
                      variant="dot"
                    >
                      <Avatar src={message.senderAvatar} />
                    </Badge>
                  )
                  : (
                    <Avatar src={message.senderAvatar} />
                  )}
              </ListItemAvatar>
              <ListItemText
                disableTypography
                primary={(
                  <Typography
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    variant="subtitle2"
                  >
                    {message.senderName}
                  </Typography>
                )}
                secondary={(
                  <Typography
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    variant="body2"
                  >
                    {message.content}
                  </Typography>
                )}
                sx={{ pr: 2 }}
              />
              <Typography
                color="text.secondary"
                sx={{ whiteSpace: 'nowrap' }}
                variant="caption"
              >
                {ago}
              </Typography>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <CardActions>
        <Button
          color="inherit"
          endIcon={(
            <SvgIcon>
              <ArrowRightIcon />
            </SvgIcon>
          )}
          size="small"
        >
          Go to chat
        </Button>
      </CardActions>
    </Card>
  );
};

OverviewInbox.propTypes = {
  messages: PropTypes.array.isRequired
};
