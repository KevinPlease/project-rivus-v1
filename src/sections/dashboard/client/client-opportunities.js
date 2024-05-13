import { useCallback, useEffect, useState } from "react";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";

import { RouterLink } from "src/components/router-link";
import { useMounted } from "src/hooks/use-mounted";
import { paths } from "src/paths";
import { OpportunityListSearch } from "src/sections/dashboard/opportunity/opportunity-list-search";
import { OpportunityListTable } from "src/sections/dashboard/opportunity/opportunity-list-table";

import opportunityAPI from "src/api/opportunity";
import BaseAPI from "src/api/BaseAPI";
import { Fields } from "src/api/Fields";
import { useAuth } from "src/hooks/use-auth";

const TITLE = Fields.TITLE;
const ASSIGNEE = Fields.ASSIGNEE;
const DISPLAY_ID = Fields.DISPLAY_ID;
const AVAILABILITY = Fields.AVAILABILITY;
const BUSINESS_TYPE = Fields.BUSINESS_TYPE;
const HAS_MORTGAGE = Fields.HAS_MORTGAGE;
const OWNER = Fields.OWNER;


const useOpportunitySearch = (clientId) => {
  const [state, setState] = useState({
    filters: {
      [ASSIGNEE]: undefined,
      [DISPLAY_ID]: undefined,
      [TITLE]: undefined,
      [AVAILABILITY]: [],
      [BUSINESS_TYPE]: [],
      [HAS_MORTGAGE]: undefined,
      [OWNER]: clientId
    },
    filterTypes: {
      or: [DISPLAY_ID, TITLE],
      and: [ASSIGNEE, OWNER, HAS_MORTGAGE, BUSINESS_TYPE, AVAILABILITY]
    },
    pageNr: 0,
    itemsPerPage: 10
  });

  const handleFiltersChange = useCallback((filters) => {
    setState((prevState) => ({
      ...prevState,
      filters
    }));
  }, []);

  const handlePageChange = useCallback((event, page) => {
    setState((prevState) => ({
      ...prevState,
      pageNr: page
    }));
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setState((prevState) => ({
      ...prevState,
      itemsPerPage: parseInt(event.target.value, 10)
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

  useEffect(() => {
    handleOpportunityGet();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchState]);

  return {
    ...state
  };
};

export const ClientOpportunities = ({ clientData, clientId }) => {
  const opportunitySearch = useOpportunitySearch(clientId);
  const opportunityStore = useOpportunityStore(opportunitySearch.state);
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={4}
            >

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
                  Create Opportunity
                </Button>
              </Stack>
            </Stack>
            <Card>
              <OpportunityListSearch formDetails={opportunityStore.formDetails} onFiltersChange={opportunitySearch.handleFiltersChange} />
              <OpportunityListTable
                onPageChange={opportunitySearch.handlePageChange}
                onRowsPerPageChange={opportunitySearch.handleRowsPerPageChange}
                formDetails={opportunityStore.formDetails}
                pageNr={opportunitySearch.state.pageNr}
                items={opportunityStore.opportunities}
                count={opportunityStore.count}
                itemsPerPage={opportunitySearch.state.itemsPerPage}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

