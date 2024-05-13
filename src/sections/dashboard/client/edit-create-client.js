import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { useMounted } from "src/hooks/use-mounted";
import { ClientCreateForm } from "src/sections/dashboard/client/client-create-form";
import { ClientEditForm } from "src/sections/dashboard/client/client-edit-form";
import { useRouter } from "next/router";

import BaseAPI from "src/api/BaseAPI";
import { useAuth } from "src/hooks/use-auth";
import clientAPI from "src/api/client";


const useClientStore = () => {
  const { user } = useAuth();
  const isMounted = useMounted();
  const [client, setClient] = useState({
    id: null,
    data: {},
    formOptions: {
      assignee: [],
      source: []
    }
  });
  const router = useRouter();
  const { clientId } = router.query;

  const handleClientsGet = useCallback(async () => {
    try {
      const authInfo = BaseAPI.authForInfo(user);
      const response = await clientAPI.askById(authInfo, clientId);
      if (!response) return;

      if (isMounted()) {
        setClient({
          id: response.model._id,
          displayId: response.model.displayId,
          data: response.model.data,
          formOptions: response.formDetails
        });
      }

    } catch (err) {
      console.error(err);
    }
  }, [isMounted, router.query]);

  useEffect(
    () => {
      handleClientsGet();
    },
    [router.query]
  );

  return {
    ...client,
  };
};
const Page = ({ current }) => {
  const clientResponse = useClientStore();

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
              <ClientCreateForm current={current} clientData={clientResponse.data} clientId={clientResponse.id} formOptions={clientResponse.formOptions} />
              :
              <ClientEditForm clientData={clientResponse.data} displayId={clientResponse.displayId} clientId={clientResponse.id} formOptions={clientResponse.formOptions} />
            }
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
