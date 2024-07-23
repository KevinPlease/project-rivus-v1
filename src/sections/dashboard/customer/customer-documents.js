import React, {useCallback, useEffect, useState} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';

import {useMounted} from 'src/hooks/use-mounted';

import { CustomerCreateDocuments } from "src/sections/dashboard/customer/customer-create-documents";

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
      const response = [];

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

export const CustomerDocuments = ({ unlockedEdit, files, handleFilesUpload, handleFilesDrop, handleFileRemove, handleFilesRemoveAll, orientation }) => {

  return (
    <Card >
      <CardHeader title="ID Document" />
      <CardContent sx={{ pt: 0 }}>
        <CustomerCreateDocuments
          files={files}
          orientation="vertical"
          handleFilesUpload={handleFilesUpload}
          handleFilesDrop={handleFilesDrop}
          handleFileRemove={handleFileRemove}
          handleFilesRemoveAll={handleFilesRemoveAll}
          unlockedEdit={unlockedEdit}
        />
      </CardContent>
    </Card>
  );
};
