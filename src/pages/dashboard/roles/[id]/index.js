import { Breadcrumbs, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { t } from "i18next";
import Link from "next/link";
import { BreadcrumbsSeparator } from "src/components/breadcrumbs-separator";
import { RouterLink } from "src/components/router-link";

import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { tokens } from "src/locales/tokens";
import { paths } from "src/paths";
import EditCreateRole from "src/sections/dashboard/role/edit-create-role";

const Page = () => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Stack>
          <Stack spacing={1}>
            <Breadcrumbs separator={<BreadcrumbsSeparator />}>
              <Link
                color="text.primary"
                component={RouterLink}
                href={paths.dashboard.index}
                variant="subtitle2"
              >
                {t(tokens.nav.overview)}/
              </Link>
              <Link
                color="text.primary"
                component={RouterLink}
                href={paths.dashboard.roles.index}
                variant="subtitle2"
              >
                {t(tokens.nav.management)}
              </Link>
              <Typography
                color="text.secondary"
                variant="subtitle2"
              >
                {t(tokens.nav.role)}
              </Typography>
            </Breadcrumbs>
            <Typography variant="h4">
              {t(tokens.nav.roleDetails)}
            </Typography>
          </Stack>

          <EditCreateRole current="Edit" />
        </Stack>
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
