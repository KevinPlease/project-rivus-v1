import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";

import { RouterLink } from "src/components/router-link";
import { paths } from "src/paths";
import { Seo } from "src/components/seo";
import { useMounted } from "src/hooks/use-mounted";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { ClientListSearch } from "src/sections/dashboard/client/client-list-search";
import { ClientListTable } from "src/sections/dashboard/client/client-list-table";
import { Fields } from "../../../api/Fields";
import clientAPI from "../../../api/client";
import BaseAPI from "src/api/BaseAPI";
import { useAuth } from "src/hooks/use-auth";
import { setFilters, setItemsPerPage, setPageNr } from "src/slices/grid-filters";

const DISPLAY_ID = Fields.DISPLAY_ID;
const TITLE = Fields.TITLE;
const NAME = Fields.NAME;

const useClientsSearch = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    filters: {
      [DISPLAY_ID]: "",
      [TITLE]: "",
      [NAME]: ""
    },
    filterTypes: {
      or: [DISPLAY_ID, TITLE, NAME],
      and: []
    },
    pageNr: 0,
    itemsPerPage: 10
  });

  const handleFiltersChange = useCallback((filters) => {
    dispatch(setFilters({ current: "client", filters }));

    setState((prevState) => ({
      ...prevState,
      filters,
      pageNr: 0,
      itemsPerPage: 10
    }));
  }, []);

  const handlePageChange = useCallback((event, pageNr) => {
    dispatch(setPageNr({ current: "client", pageNr }));

    setState((prevState) => ({
      ...prevState,
      pageNr
    }));
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    const itemsPerPage = parseInt(event.target.value, 10);
    dispatch(setItemsPerPage({ current: "client", itemsPerPage }));

    setState((prevState) => ({
      ...prevState,
      itemsPerPage
    }));
  }, []);

  return {
    handleFiltersChange,
    handlePageChange,
    handleRowsPerPageChange,
    state
  };
};


const useClientStore = (searchState) => {
  const { user } = useAuth();
  const isMounted = useMounted();
  const [state, setState] = useState({
    client: [],
    formDetails: {
      [Fields.ASSIGNEE]: [],
      [Fields.SOURCE]: []
    },
    count: 0,
  });

  const handleClientGet = useCallback(async () => {
    try {
      const authInfo = BaseAPI.authForInfo(user);
      const clientResponse = await clientAPI.getAll(authInfo, searchState);
      if (!clientResponse) return;

      if (isMounted()) {
        setState({
          client: clientResponse.models,
          count: clientResponse.count,
          formDetails: clientResponse.formDetails
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [searchState, isMounted]);
  const handlePageChange = useCallback((event, page) => {
    setState((prevState) => ({
      ...prevState,
      page
    }));
  }, []);

  useEffect(
    () => {
      handleClientGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchState]
  );

  return {
    ...state,
  };
};


// const useClientsIds = (client = []) =>
// {
//   return useMemo(() =>
//   {
//     return client.map((customer) => customer.id);
//   }, [client]);
// };

const Page = () => {
  const clientSearch = useClientsSearch();
  const clientStore = useClientStore(clientSearch.state);
  // const clientIds = useClientsIds(clientStore.client);
  // const clientSelection = useSelection(clientIds);


  return (
    <>
      <Seo title="Dashboard: Client List" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Clients
                </Typography>
              </Stack>
              <Stack
                alignItems="center"
                direction="row"
                spacing={3}
              >
                <Button
                  component={RouterLink}
                  href={paths.dashboard.clients.create}
                  startIcon={(
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add
                </Button>
              </Stack>
            </Stack>
            <Card>
              <ClientListSearch
                formDetails={clientStore.formDetails}
                handleFiltersChange={clientSearch.handleFiltersChange}
              />
              <ClientListTable
                count={clientStore.count}
                items={clientStore.client}
                onPageChange={clientSearch?.handlePageChange}
                onRowsPerPageChange={clientSearch?.handleRowsPerPageChange}
                pageNr={clientSearch?.state?.pageNr}
                itemsPerPage={clientSearch?.state?.itemsPerPage}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
