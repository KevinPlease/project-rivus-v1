import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { useMounted } from "src/hooks/use-mounted";
import { LeadCreateForm } from "src/sections/dashboard/leads/lead-create-form";
import { LeadEditForm } from "src/sections/dashboard/leads/lead-edit-form";
import { useRouter } from "next/router";

import leadsAPI from "src/api/leads";
import BaseAPI from "src/api/BaseAPI";
import { useAuth } from "src/hooks/use-auth";


const useLeadStore = () => {
  const { user } = useAuth();
  const isMounted = useMounted();
  const [lead, setLead] = useState({
    id: null,
    displayId: "",
    data: {},
    formOptions: {
      assignee: [],
      source: []
    }
  });
  const router = useRouter();
  const { leadId } = router.query;

  const handleLeadsGet = useCallback(async () => {
    try {
      const authInfo = BaseAPI.authForInfo(user);
      const leadResponse = await leadsAPI.askById(authInfo, leadId);
      if (!leadResponse) return;

      if (isMounted()) {
        setLead({
          id: leadResponse.model._id,
          displayId: leadResponse.model.displayId,
          data: leadResponse.model.data,
          formOptions: leadResponse.formDetails
        });
      }

    } catch (err) {
      console.error(err);
    }
  }, [isMounted, router.query]);

  useEffect(
    () => {
      handleLeadsGet();
    },
    [router.query]
  );

  return {
    ...lead,
  };
};
const Page = ({ current }) => {
  const leadResponse = useLeadStore();
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={4}>
            {current === "Create" ?
                <LeadCreateForm current={current} leadsData={leadResponse.data} leadId={leadResponse.id} formOptions={leadResponse.formOptions} />
                :
                <LeadEditForm leadsData={leadResponse.data} displayId={leadResponse.displayId} leadId={leadResponse.id} formOptions={leadResponse.formOptions} />
            }
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
