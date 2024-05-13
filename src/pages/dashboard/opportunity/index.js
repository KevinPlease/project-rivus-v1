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
import opportunityAPI from "src/api/opportunity";
import { BreadcrumbsSeparator } from "src/components/breadcrumbs-separator";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { useMounted } from "src/hooks/use-mounted";
import { usePageView } from "src/hooks/use-page-view";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { paths } from "src/paths";
import { OpportunityListSearch } from "src/sections/dashboard/opportunity/opportunity-list-search";
import { OpportunityListTable } from "src/sections/dashboard/opportunity/opportunity-list-table";
import { useAuth } from "src/hooks/use-auth";
import { Fields, RANGED_FIELDS } from "src/api/Fields";
import BaseAPI from "src/api/BaseAPI";
import { setFilters, setItemsPerPage, setPageNr } from "src/slices/grid-filters";

const DISPLAY_ID = Fields.DISPLAY_ID;
const TITLE = Fields.TITLE;
const ZONE = Fields.ZONE;
const AVAILABILITY = Fields.AVAILABILITY;
const BUSINESS_TYPE = Fields.BUSINESS_TYPE;
const HAS_MORTGAGE = Fields.HAS_MORTGAGE;
const ASSIGNEE = Fields.ASSIGNEE;
const DATE_CREATED = Fields.DATE_CREATED;
const RANGED_PRICE_FROM = RANGED_FIELDS.PRICE_FROM;
const RANGED_PRICE_TO = RANGED_FIELDS.PRICE_TO;


const useOpportunitySearch = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    filters: {
      [TITLE]: undefined,
      [ZONE]: undefined,
      [DISPLAY_ID]: undefined,
      [AVAILABILITY]: undefined,
      [BUSINESS_TYPE]: undefined,
      [HAS_MORTGAGE]: undefined,
      [ASSIGNEE]: undefined,
      [DATE_CREATED]: undefined,
      [RANGED_PRICE_FROM]: undefined,
      [RANGED_PRICE_TO]: undefined
    },
    filterTypes: {
      or: [DISPLAY_ID, TITLE, ZONE],
      and: [ASSIGNEE, HAS_MORTGAGE, BUSINESS_TYPE, AVAILABILITY, RANGED_PRICE_FROM, RANGED_PRICE_TO, DATE_CREATED]
    },
    pageNr: 0,
    itemsPerPage: 10
  });

  const handleFiltersChange = useCallback((filters) => {
    dispatch(setFilters({ current: "opportunity", filters }));

    setState((prevState) => ({
      ...prevState,
      filters,
      pageNr: 0,
      itemsPerPage: 10
    }));
  }, []);

  const handlePageChange = useCallback((event, pageNr) => {
    dispatch(setPageNr({ current: "opportunity", pageNr }));
    
    setState((prevState) => ({
      ...prevState,
      pageNr
    }));
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    const itemsPerPage = parseInt(event.target.value, 10);
    dispatch(setItemsPerPage({ current: "opportunity", itemsPerPage }));

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

const useOpportunityStore = (searchState) => {
  const { user } = useAuth();
  const isMounted = useMounted();
  const [state, setState] = useState({
    opportunities: [],
    formDetails: {
      availability: [],
      businessType: [],
      source: [],
      assignee: [],
      owner: [],
      zone: [],
      propertyType: [],
      furniture: [],
      saleStage: []
    },
    count: 0
  });

  const handleOpportunityGet = useCallback(async () => {
    try {
      const authInfo = BaseAPI.authForInfo(user);
      const oppResponse = await opportunityAPI.getAll(authInfo, searchState);
      if (!oppResponse) return;

      if (isMounted()) {
        setState({
          opportunities: oppResponse.models,
          count: oppResponse.count,
          formDetails: oppResponse.formDetails
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [searchState, isMounted]);

  const handleRefresh = useCallback(() => {
    handleOpportunityGet();
  }, [searchState]);

  useEffect(() => {
    handleOpportunityGet();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchState]);

  return {
    ...state,
    handleRefresh
  };
};

const Page = () => {
  const opportunitySearch = useOpportunitySearch();
  const opportunityStore = useOpportunityStore(opportunitySearch.state);

  usePageView();

  return (
    <>
      <Seo title="Dashboard: Opportunity List" />
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
                  Opportunity
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
                    href={paths.dashboard.opportunity.index}
                    variant="subtitle2"
                  >
                    Opportunity
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
                  href={paths.dashboard.opportunity.create}
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
              <OpportunityListSearch formDetails={opportunityStore.formDetails} onFiltersChange={opportunitySearch.handleFiltersChange} />
              <OpportunityListTable
                onPageChange={opportunitySearch.handlePageChange}
                onRowsPerPageChange={opportunitySearch.handleRowsPerPageChange}
                refreshTable={opportunityStore.handleRefresh}
                pageNr={opportunitySearch.state.pageNr}
                items={opportunityStore.opportunities}
                count={opportunityStore.count}
                itemsPerPage={opportunitySearch.state.itemsPerPage}
                formDetails={opportunityStore.formDetails}
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

export default Page