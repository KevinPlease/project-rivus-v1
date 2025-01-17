import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import { Breadcrumbs, Link } from "@mui/material";

import { RouterLink } from "src/components/router-link";
import { paths } from "src/paths";
import { Seo } from "src/components/seo";
import { useMounted } from "src/hooks/use-mounted";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import BaseAPI from "src/api/BaseAPI";
import { useAuth } from "src/hooks/use-auth";
import { setFilters, setItemsPerPage, setPageNr } from "src/slices/grid-filters";
import { tokens } from "src/locales/tokens";
import { BreadcrumbsSeparator } from "src/components/breadcrumbs-separator";
import userAPI from "src/api/user";
import { UserListSearch } from "src/sections/dashboard/users/user-list-search";
import { UserListTable } from "src/sections/dashboard/users/user-list-table";

const useSearch = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    filters: {
      email: "",
      name: ""
    },
    filterTypes: {
      or: ["email", "name"],
      and: []
    },
    pageNr: 0,
    itemsPerPage: 10
  });

  const handleFiltersChange = useCallback((filters) => {
    dispatch(setFilters({ current: "user", filters }));

    setState((prevState) => ({
      ...prevState,
      filters,
      pageNr: 0,
      itemsPerPage: 10
    }));
  }, []);

  const handlePageChange = useCallback((event, pageNr) => {
    dispatch(setPageNr({ current: "user", pageNr }));

    setState((prevState) => ({
      ...prevState,
      pageNr
    }));
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    const itemsPerPage = parseInt(event.target.value, 10);
    dispatch(setItemsPerPage({ current: "user", itemsPerPage }));

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


const useStore = (searchState) => {
  const { user } = useAuth();
  const isMounted = useMounted();
  const [state, setState] = useState({
    models: [],
    formDetails: {
      role: []
    },
    count: 0,
  });

  const fetchModels = useCallback(async () => {
    try {
      const authInfo = BaseAPI.authForInfo(user);
      const response = await userAPI.getAll(authInfo, searchState);
      if (!response) return;

      if (isMounted()) {
        setState({
          models: response.models,
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
      fetchModels();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchState]
  );

  return {
    ...state,
  };
};


const Page = () => {
  const search = useSearch();
  const store = useStore(search.state);
  const { t } = useTranslation();

  return (
    <>
      <Seo title="Dashboard: User List" />
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
                  {t(tokens.nav.users)}
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
                    {t(tokens.nav.users)}
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
                  href={paths.dashboard.users.create}
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
              <UserListSearch
                formDetails={store.formDetails}
                handleFiltersChange={search.handleFiltersChange}
              />
              <UserListTable
                count={store.count}
                items={store.models}
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
