import React, {useCallback, useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import SvgIcon from '@mui/material/SvgIcon';

import {useMounted} from 'src/hooks/use-mounted';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import {FileIcon} from "../../../components/file-icon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import XIcon from "@untitled-ui/icons-react/build/esm/X";

const emailOptions = [
  'Resend last invoice',
  'Send password reset',
  'Send verification'
];

const useEmails = () => {
  const isMounted = useMounted();
  const [emails, setEmails] = useState([]);

  const handleEmailsGet = useCallback(async () => {
    try {
      const response = []

      if (isMounted()) {
        setEmails(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
      handleEmailsGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  return emails;
};

export const CustomerEmailsSummary = (props) => {
  const [emailOption, setEmailOption] = useState(emailOptions[0]);
  const emails = useEmails();

  return (
      <Card {...props}>
        <CardHeader title="ID Document"/>
        <CardContent sx={{pt: 0}}>
          <List>
            <ListItem
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  '& + &': {
                    mt: 1
                  },
                  display:"flex",
                  justifyContent:"space-between"
                }}
            >
              <ListItemIcon>
                <FileIcon extension=".pdf"/>
              </ListItemIcon>
              <ListItemText
                  primary="Property document"
                  primaryTypographyProps={{variant: 'subtitle2'}}
                  secondary="123 Kbs"
              />
              <div className="flex sm:block hidden items-end justify-end mr-10">
                <ListItemText
                    primary="Uploaded at"
                    primaryTypographyProps={{variant: 'subtitle2'}}
                    secondary="06/07/2023"
                    sx={{alignItems:"flex-end"}}
                />
              </div>

              <Tooltip title="Edit">
                <IconButton
                    edge="end"
                >
                  <SvgIcon>
                    <XIcon/>
                  </SvgIcon>
                </IconButton>
              </Tooltip>
            </ListItem>

          </List>
        </CardContent>
      </Card>
  );
};
