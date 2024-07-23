
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
import propertyAPI from "src/api/property";
import { BreadcrumbsSeparator } from "src/components/breadcrumbs-separator";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { setFilters, setPageNr, setItemsPerPage } from "src/slices/grid-filters";
import { useMounted } from "src/hooks/use-mounted";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { paths } from "src/paths";
import { PropertiesListSearch } from "src/sections/dashboard/properties/properties-list-search";
import { PropertiesListTable } from "src/sections/dashboard/properties/properties-list-table";
import { useAuth } from "src/hooks/use-auth";
import BaseAPI from "src/api/BaseAPI";
import { Fields } from "src/api/Fields";

const TITLE = Fields.TITLE;
const DISPLAY_ID = Fields.DISPLAY_ID;
const ZONE = Fields.ZONE;
const AVAILABILITY = Fields.AVAILABILITY;
const BUSINESS_TYPE = Fields.BUSINESS_TYPE;
const HAS_MORTGAGE = Fields.HAS_MORTGAGE;
const ASSIGNEE = Fields.ASSIGNEE;
const PRICE = Fields.PRICE;
const DATE_CREATED = Fields.DATE_CREATED;

const usePropertiesSearch = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    filters: {
      [TITLE]: undefined,
      [DISPLAY_ID]: undefined,
      [ZONE]: undefined,
      [AVAILABILITY]: undefined,
      [BUSINESS_TYPE]: undefined,
      [HAS_MORTGAGE]: undefined,
      [ASSIGNEE]: undefined,
      [PRICE]: undefined,
      [DATE_CREATED]: undefined,
    },
    filterTypes: {
      or: [DISPLAY_ID, TITLE, ZONE],
      and: [ASSIGNEE, HAS_MORTGAGE, BUSINESS_TYPE, AVAILABILITY, PRICE, DATE_CREATED]
    },
    pageNr: 0,
    itemsPerPage: 10
  });

  const handleFiltersChange = useCallback((filters) => {
    dispatch(setFilters({ current: "property", filters }));

    setState((prevState) => ({
      ...prevState,
      filters,
      pageNr: 0,
      itemsPerPage: 10
    }));
  }, []);

  const handlePageChange = useCallback((event, pageNr) => {
    dispatch(setPageNr({ current: "property", pageNr }));

    setState((prevState) => ({
      ...prevState,
      pageNr
    }));
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    const itemsPerPage = parseInt(event.target.value, 10);
    dispatch(setItemsPerPage({ current: "property", itemsPerPage }));

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

const usePropertiesStore = (searchState) => {
  const { user } = useAuth();
  const isMounted = useMounted();
  const [state, setState] = useState({
    properties: [],
    formDetails: {
      availability: [],
      businessType: [],
      source: [],
      assignee: [],
      owner: [],
      zone: [],
      propertyType: [],
      furniture: []
    },
    count: 0
  });

  const handlePropertiesGet = useCallback(async () => {
    try {
      const authInfo = BaseAPI.authForInfo(user);
      const propertyResponse = await propertyAPI.getAll(authInfo, searchState);
      if (!propertyResponse) return null;

      if (isMounted()) {
        setState({
          properties: propertyResponse.models,
          count: propertyResponse.count,
          formDetails: propertyResponse.formDetails
        });
      }

      return propertyResponse;

    } catch (err) {
      console.error(err);
      return null;
    }

  }, [searchState, isMounted]);

  const handleRefresh = useCallback(() => {
    handlePropertiesGet();
  }, []);

  useEffect(() => {
    handlePropertiesGet();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchState]);

  return {
    ...state,
    handleRefresh
  };
};

const Page = () => {
  const propertiesSearch = usePropertiesSearch();
  let propertiesStore = usePropertiesStore(propertiesSearch.state);
  return (
    <>
      <Seo title="Dashboard: Properties List" />
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
                  Properties
                </Typography>
                <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                  <Link
                    color="text.primary"
                    component={RouterLink}
                    href={paths.dashboard.index}
                    variant="subtitle2"
                  >
                    Dashboard
                  </Link>
                  <Link
                    color="text.primary"
                    component={RouterLink}
                    href={paths.dashboard.properties.index}
                    variant="subtitle2"
                  >
                    Properties
                  </Link>
                  <Typography
                    color="text.secondary"
                    variant="subtitle2"
                  >
                    List
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
                  href={paths.dashboard.properties.create}
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
              <PropertiesListSearch formDetails={propertiesStore?.formDetails} onFiltersChange={propertiesSearch.handleFiltersChange} />
              <PropertiesListTable
                onPageChange={propertiesSearch.handlePageChange}
                onRowsPerPageChange={propertiesSearch.handleRowsPerPageChange}
                refreshTable={propertiesStore.handleRefresh}
                pageNr={propertiesSearch.state.pageNr}
                items={propertiesStore?.properties}
                count={propertiesStore?.count}
                formDetails={propertiesStore?.formDetails}
                itemsPerPage={propertiesSearch.state.itemsPerPage}
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
