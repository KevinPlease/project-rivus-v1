import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { useMounted } from "src/hooks/use-mounted";
import { CustomerCreateForm } from "src/sections/dashboard/customer/customer-create-form";
import { CustomerEditForm } from "src/sections/dashboard/customer/customer-edit-form";
import { useRouter } from "next/router";

import BaseAPI from "src/api/BaseAPI";
import { useAuth } from "src/hooks/use-auth";
import customerApi from "src/api/customer";


const useStore = () => {
  const { user } = useAuth();
  const isMounted = useMounted();
  const [customer, setCustomer] = useState({
    id: null,
    data: {},
    formOptions: {
      assignee: [],
      source: []
    }
  });
  const router = useRouter();
  const { id } = router.query;

  const handleGet = useCallback(async () => {
    try {
      const authInfo = BaseAPI.authForInfo(user);
      let response = {};
      if (id) {
        response = await customerApi.getById(authInfo, id);
        if (!response) return;

      } else {
        const formDetails = await customerApi.getFormDetails(authInfo);
        response = {
          formDetails: formDetails
        };
      }

      if (isMounted()) {
        setCustomer({
          id: response.model?._id,
          displayId: response.model?.displayId,
          data: response.model?.data,
          formOptions: response.formDetails
        });
      }

    } catch (err) {
      console.error(err);
    }
  }, [isMounted, router.query]);

  useEffect(
    () => {
      handleGet();
    },
    [router.query]
  );

  return {
    ...customer,
  };
};

const Page = ({ current }) => {
  const storeData = useStore();

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
              <CustomerCreateForm current={current} data={storeData.data} id={storeData.id} formOptions={storeData.formOptions} />
              :
              <CustomerEditForm data={storeData.data} displayId={storeData.displayId} id={storeData.id} formOptions={storeData.formOptions} />
            }
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
