import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { BreadcrumbsSeparator } from "src/components/breadcrumbs-separator";
import { RouterLink } from "src/components/router-link";
import { Seo } from "src/components/seo";
import { usePageView } from "src/hooks/use-page-view";
import { useMounted } from "src/hooks/use-mounted";
import { useRouter } from "next/router";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { paths } from "src/paths";
import { OpportunityCreateForm } from "src/sections/dashboard/opportunity/opportunity-create-form";

import opportunityAPI from "src/api/opportunity";
import BaseAPI from "src/api/BaseAPI";
import { useAuth } from "src/hooks/use-auth";


const useOpportunityStore = () => {
    const { user } = useAuth();
    const isMounted = useMounted();
    const [opportunity, setOpportunity] = useState({
        id: null,
        displayId: "",
        data: null,
        formOptions: {
            availability: [],
            businessType: [],
            source: [],
            assignee: [],
            owner: [],
            zone: [],
            propertyType: [],
            furniture: [],
            saleStage: []
        }
    });
    const router = useRouter();
    const { opportunityId } = router.query;

    const handleOpportunityGet = useCallback(async () => {
        try {
            const authInfo = BaseAPI.authForInfo(user);
            const oppResponse = await opportunityAPI.askById(authInfo, opportunityId);
            if (!oppResponse) return;

            if (isMounted()) {
                setOpportunity({
                    id: oppResponse.model._id,
                    displayId: oppResponse.model.displayId,
                    data: oppResponse.model.data,
                    formOptions: oppResponse.formDetails,
                    matchCount: oppResponse.matchCount
                });
            }

        } catch (err) {
            console.error(err);
        }
    }, [isMounted,router.query]);

    useEffect(
        () => {
            handleOpportunityGet();
        },
        [router.query]
    );

    return {
        ...opportunity,
    };
};

const Page = ({ current }) => {
    const oppResponse = useOpportunityStore();
    usePageView();

    return (
        <>
            <Seo title="Opportunity Create" />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Stack spacing={3}>
                        <Stack spacing={1}>
                            <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                                {/* <Link
                                    color="text.primary"
                                    component={RouterLink}
                                    href={paths.dashboard.index}
                                    variant="subtitle2"
                                >
                                    Dashboard/
                                </Link>
                                <Link
                                    color="text.primary"
                                    component={RouterLink}
                                    href={paths.dashboard.opportunity.index}
                                    variant="subtitle2"
                                >
                                    Management
                                </Link> */}
                                <Typography
                                    color="text.secondary"
                                    variant="subtitle2"
                                >
                                    Opportunity
                                </Typography>
                            </Breadcrumbs>
                        </Stack>
                        <OpportunityCreateForm current={current} matchCount={oppResponse.matchCount} displayId={oppResponse.displayId} opportunityData={oppResponse.data} opportunityId={oppResponse.id} formOptions={oppResponse.formOptions} />
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