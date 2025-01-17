
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import { BreadcrumbsSeparator } from "src/components/breadcrumbs-separator";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { setFilters, setPageNr, setItemsPerPage } from "src/slices/grid-filters";
import { useMounted } from "src/hooks/use-mounted";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { paths } from "src/paths";
import { UnitListSearch } from "src/sections/dashboard/unit/unit-list-search";
import { UnitListTable } from "src/sections/dashboard/unit/unit-list-table";
import { useAuth } from "src/hooks/use-auth";
import BaseAPI from "src/api/BaseAPI";
import { Fields } from "src/api/Fields";
import { useTranslation } from "react-i18next";
import { tokens } from "src/locales/tokens";
import unitApi from "src/api/unit";

const TITLE = Fields.TITLE;
const DISPLAY_ID = Fields.DISPLAY_ID;
const ZONE = Fields.ZONE;
const AVAILABILITY = Fields.AVAILABILITY;
const OFFERING_TYPE = Fields.OFFERING_TYPE;
const COUNTRY = Fields.COUNTRY;
const CITY = Fields.CITY;
const PROPERTY = Fields.PROPERTY;
const UNIT_TYPE = Fields.UNIT_TYPE;
const ASSIGNEE = Fields.ASSIGNEE;
const PRICE = Fields.PRICE;
const DATE_CREATED = Fields.DATE_CREATED;

const useSearch = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    filters: {
      [TITLE]: undefined,
      [DISPLAY_ID]: undefined,
      [ZONE]: undefined,
      [AVAILABILITY]: undefined,
      [OFFERING_TYPE]: undefined,
      [UNIT_TYPE]: undefined,
      [PRICE]: undefined,
      [DATE_CREATED]: undefined,
    },
    filterTypes: {
      or: [DISPLAY_ID, TITLE, ZONE],
      and: [UNIT_TYPE, AVAILABILITY, PRICE, DATE_CREATED]
    },
    pageNr: 0,
    itemsPerPage: 10
  });

  const handleFiltersChange = useCallback((filters) => {
    dispatch(setFilters({ current: "unit", filters }));

    setState((prevState) => ({
      ...prevState,
      filters,
      pageNr: 0,
      itemsPerPage: 10
    }));
  }, []);

  const handlePageChange = useCallback((event, pageNr) => {
    dispatch(setPageNr({ current: "unit", pageNr }));

    setState((prevState) => ({
      ...prevState,
      pageNr
    }));
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    const itemsPerPage = parseInt(event.target.value, 10);
    dispatch(setItemsPerPage({ current: "unit", itemsPerPage }));

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
    units: [],
    formDetails: {
      [AVAILABILITY]: [],
      [OFFERING_TYPE]: [],
      [ASSIGNEE]: [],
      [COUNTRY]: [],
      [CITY]: [],
      [PROPERTY]: [],
      [UNIT_TYPE]: []
    },
    count: 0
  });

  const handleGet = useCallback(async () => {
    try {
      const authInfo = BaseAPI.authForInfo(user);
      const response = await unitApi.getAll(authInfo, searchState);
      if (!response) return null;

      if (isMounted()) {
        setState({
          units: response.models,
          count: response.count,
          formDetails: response.formDetails
        });
      }

      return response;

    } catch (err) {
      console.error(err);
      return null;
    }

  }, [searchState, isMounted]);

  const handleRefresh = useCallback(() => {
    handleGet();
  }, []);

  useEffect(() => {
    handleGet();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchState]);

  return {
    ...state,
    handleRefresh
  };
};

const Page = () => {
  const searchInfo = useSearch();
  const storeInfo = useStore(searchInfo.state);
  const { t } = useTranslation();

  return (
    <>
      <Seo title="Dashboard: Unit List" />
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
                  {t(tokens.nav.units)}
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
                    {t(tokens.nav.units)}
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
                  href={paths.dashboard.units.create}
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
              <UnitListSearch formDetails={storeInfo?.formDetails} onFiltersChange={searchInfo.handleFiltersChange} />
              <UnitListTable
                onPageChange={searchInfo.handlePageChange}
                onRowsPerPageChange={searchInfo.handleRowsPerPageChange}
                refreshTable={storeInfo.handleRefresh}
                pageNr={searchInfo.state.pageNr}
                items={storeInfo.units}
                count={storeInfo.count}
                formDetails={storeInfo.formDetails}
                itemsPerPage={searchInfo.state.itemsPerPage}
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
