import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { BreadcrumbsSeparator } from 'src/components/breadcrumbs-separator';
import { RouterLink } from 'src/components/router-link';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import EditCreateClient from "src/sections/dashboard/client/edit-create-client";

const Page = () => {
  return (
    <>
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
                <Link
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
                  href={paths.dashboard.clients.index}
                  variant="subtitle2"
                >
                  Management
                </Link>
                <Typography
                  color="text.secondary"
                  variant="subtitle2"
                >
                  Client
                </Typography>
              </Breadcrumbs>
              <Typography variant="h4">
                Client Details
              </Typography>
            </Stack>
            <EditCreateClient current="Create" />
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
