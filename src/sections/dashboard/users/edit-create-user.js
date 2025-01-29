import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import { useMounted } from "src/hooks/use-mounted";
import { useRouter } from "next/router";
import { UserCreateEditForm } from 'src/sections/dashboard/users/user-create-edit-form';

import userAPI from "src/api/user";
import BaseAPI from "src/api/BaseAPI";
import { useAuth } from "src/hooks/use-auth";

const useStore = () => {
  const { user } = useAuth();
  const isMounted = useMounted();
  const [store, setStore] = useState({
    model: null,
    formOptions: null
  });
  const router = useRouter();
  const { id } = router.query;

  const fetchModel = useCallback(async () => {
    try {
      const authInfo = BaseAPI.authForInfo(user);
      let response = {};
      if (id) {
        response = await userAPI.getById(authInfo, id);
        if (!response) return;

      } else {
        const formDetails = await userAPI.getFormDetails(authInfo);
        response = {
          formDetails: formDetails
        };
      }

      if (isMounted()) {
        setStore({
          model: response.model,
          formOptions: response.formDetails
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted, router.query]);

  useEffect(
    () => {
      fetchModel();
    },
    [router.query]
  );

  return {
    ...store,
  };
};

const Page = ({ current }) => {
  const store = useStore();
  if (!store.formOptions) return;

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
            <UserCreateEditForm
              current={current}
              model={store.model}
              formOptions={store.formOptions}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
