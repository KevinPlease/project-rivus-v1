import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { BreadcrumbsSeparator } from "src/components/breadcrumbs-separator";
import { RouterLink } from "src/components/router-link";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { paths } from "src/paths";
import EditCreateUnit from "src/sections/dashboard/unit/edit-create-unit";

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
                  Kryefaqja/
                </Link>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.dashboard.units.index}
                  variant="subtitle2"
                >
                  Menaxho
                </Link>
                <Typography
                  color="text.secondary"
                  variant="subtitle2"
                >
                  Njesia
                </Typography>
              </Breadcrumbs>
              <Typography variant="h4">
              Detajet e Njesise
              </Typography>
            </Stack>
            <EditCreateUnit current="Create" />
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
