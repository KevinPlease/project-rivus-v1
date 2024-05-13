import React, {  } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import AutocompleteComponent from "../../components/inputs/AutocompleteComponent";



export const ClientAgentDetails = ({ formik, formOptions, unlockedEdit, orientation }) => {

  return (
    <Card >
      <CardHeader title="Agent" />
      <CardContent sx={{ pt: 0 }}>
          <AutocompleteComponent
              formik={formik}
              options={formOptions?.assignee}
              fieldName="assignee"
              placeholder="Agent"
          />
      </CardContent>
    </Card>
  );
};
