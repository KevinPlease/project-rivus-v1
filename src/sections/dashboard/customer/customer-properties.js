import { useCallback, useEffect, useState } from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import propertyAPI from 'src/api/property';
import { BreadcrumbsSeparator } from 'src/components/breadcrumbs-separator';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import { PropertiesListSearch } from 'src/sections/dashboard/properties/properties-list-search';
import { PropertiesListTable } from 'src/sections/dashboard/properties/properties-list-table';

import BaseAPI from 'src/api/BaseAPI';
import { useAuth } from 'src/hooks/use-auth';
import { Fields } from "src/api/Fields";

const TITLE = Fields.TITLE;
const ASSIGNEE = Fields.ASSIGNEE;
const DISPLAY_ID = Fields.DISPLAY_ID;
const AVAILABILITY = Fields.AVAILABILITY;
const BUSINESS_TYPE = Fields.BUSINESS_TYPE;
const HAS_MORTGAGE = Fields.HAS_MORTGAGE;
const OWNER = Fields.OWNER;


const usePropertiesSearch = (customerId) => {
    const [state, setState] = useState({
        filters: {
            [ASSIGNEE]: undefined,
            [DISPLAY_ID]: undefined,
            [TITLE]: undefined,
            [AVAILABILITY]: [],
            [BUSINESS_TYPE]: [],
            [HAS_MORTGAGE]: undefined,
            [OWNER]: customerId
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
            if (!propertyResponse) return;

            if (isMounted()) {
                setState({
                    properties: propertyResponse.models,
                    count: propertyResponse.count,
                    formDetails: propertyResponse.formDetails
                });
            }
        } catch (err) {
            console.error(err);
        }
    }, [searchState, isMounted]);

    useEffect(() => {
        handlePropertiesGet();
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [searchState]);

    return {
        ...state
    };
};

export const CustomerProperties = ({ data, id }) => {
    const propertiesSearch = usePropertiesSearch(id);
    const propertiesStore = usePropertiesStore(propertiesSearch.state);
    return (
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
                            href={paths.dashboard.properties.create}
                            startIcon={(
                                <SvgIcon>
                                    <PlusIcon />
                                </SvgIcon>
                            )}
                            variant="contained"
                        >
                            Create Property
                        </Button>
                    </Stack>
                </Stack>
                <Card>
                    <PropertiesListSearch formDetails={propertiesStore.formDetails} onFiltersChange={propertiesSearch.handleFiltersChange} />
                    <PropertiesListTable
                        onPageChange={propertiesSearch.handlePageChange}
                        onRowsPerPageChange={propertiesSearch.handleRowsPerPageChange}
                        formDetails={propertiesStore.formDetails}
                        pageNr={propertiesSearch.state.pageNr}
                        items={propertiesStore.properties}
                        count={propertiesStore.count}
                        itemsPerPage={propertiesSearch.state.itemsPerPage}
                    />
                </Card>
            </Stack>
        </Container>

    );
};

