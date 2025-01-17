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
import { CustomerListSearch } from "src/sections/dashboard/customer/customer-list-search";
import { CustomerListTable } from "src/sections/dashboard/customer/customer-list-table";
import { Fields } from "../../../api/Fields";
import customerApi from "../../../api/customer";
import BaseAPI from "src/api/BaseAPI";
import { useAuth } from "src/hooks/use-auth";
import { setFilters, setItemsPerPage, setPageNr } from "src/slices/grid-filters";
import { useTranslation } from "react-i18next";
import { tokens } from "src/locales/tokens";
import { Breadcrumbs, Link } from "@mui/material";
import { BreadcrumbsSeparator } from "src/components/breadcrumbs-separator";

const DISPLAY_ID = Fields.DISPLAY_ID;
const TITLE = Fields.TITLE;
const NAME = Fields.NAME;

const useCustomerSearch = () => {
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
    dispatch(setFilters({ current: "customer", filters }));

    setState((prevState) => ({
      ...prevState,
      filters,
      pageNr: 0,
      itemsPerPage: 10
    }));
  }, []);

  const handlePageChange = useCallback((event, pageNr) => {
    dispatch(setPageNr({ current: "customer", pageNr }));

    setState((prevState) => ({
      ...prevState,
      pageNr
    }));
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    const itemsPerPage = parseInt(event.target.value, 10);
    dispatch(setItemsPerPage({ current: "customer", itemsPerPage }));

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


const useCustomerStore = (searchState) => {
  const { user } = useAuth();
  const isMounted = useMounted();
  const [state, setState] = useState({
    customers: [],
    formDetails: {
      [Fields.ASSIGNEE]: [],
      [Fields.SOURCE]: []
    },
    count: 0,
  });

  const handleCustomerGet = useCallback(async () => {
    try {
      const authInfo = BaseAPI.authForInfo(user);
      const response = await customerApi.getAll(authInfo, searchState);
      if (!response) return;

      if (isMounted()) {
        setState({
          customers: response.models,
          count: response.count,
          formDetails: response.formDetails
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [searchState, isMounted]);

  useEffect(
    () => {
      handleCustomerGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchState]
  );

  return {
    ...state,
  };
};


const Page = () => {
  const search = useCustomerSearch();
  const store = useCustomerStore(search.state);
  const { t } = useTranslation();

  return (
    <>
      <Seo title="Dashboard: Customer List" />
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
                  {t(tokens.nav.customers)}
                </Typography>
                <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                  <Link
                    color="text.primary"
                    component={RouterLink}
                    href={paths.dashboard.index}
                    variant="subtitle2"
                  >
                    {t(tokens.nav.dashboard)}
                  </Link>
                  <Typography
                    color="text.secondary"
                    variant="subtitle2"
                  >
                    {t(tokens.nav.customers)}
                  </Typography>
                </Breadcrumbs>
              </Stack>
              <Stack
                alignItems="center"
                direction="row"
                spacing={3}
              >
                <Button
                  component={RouterLink}
                  href={paths.dashboard.customers.create}
                  startIcon={(
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Shto
                </Button>
              </Stack>
            </Stack>

            <Card>
              <CustomerListSearch
                formDetails={store.formDetails}
                handleFiltersChange={search.handleFiltersChange}
              />
              <CustomerListTable
                count={store.count}
                items={store.customers}
                onPageChange={search?.handlePageChange}
                onRowsPerPageChange={search?.handleRowsPerPageChange}
                pageNr={search?.state?.pageNr}
                itemsPerPage={search?.state?.itemsPerPage}
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
