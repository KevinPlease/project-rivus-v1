import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

import { BreadcrumbsSeparator } from "src/components/breadcrumbs-separator";
import { RouterLink } from "src/components/router-link";
import { Layout as DashboardLayout } from "src/layouts/dashboard";
import { tokens } from "src/locales/tokens";
import { paths } from "src/paths";
import EditCreateUser from "src/sections/dashboard/users/edit-create-user";

const Page = () => {
  const { t } = useTranslation();

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
                  {t(tokens.nav.overview)}/
                </Link>
                <Link
                  color="text.primary"
                  component={RouterLink}
                  href={paths.dashboard.users.index}
                  variant="subtitle2"
                >
                  {t(tokens.nav.management)}
                </Link>
                <Typography
                  color="text.secondary"
                  variant="subtitle2"
                >
                  {t(tokens.nav.user)}
                </Typography>
              </Breadcrumbs>
              <Typography variant="h4">
              {t(tokens.nav.userDetails)}
              </Typography>
            </Stack>
            <EditCreateUser current="Create" />
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
