import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import orderApi from 'src/api/order';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { paths } from 'src/paths';
import EditCreateOrder from 'src/sections/dashboard/order/edit-create-order';
import BaseAPI from 'src/api/BaseAPI';
import { useRouter } from 'next/router';
import { BreadcrumbsSeparator } from 'src/components/breadcrumbs-separator';
import { Breadcrumbs } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { t } from 'i18next';
import { tokens } from 'src/locales/tokens';

const useOrder = () => {
  const isMounted = useMounted();
  const router = useRouter();
  const { user } = useAuth();
  const { id } = router.query;
  const [order, setOrder] = useState(null);

  const handleOrderGet = useCallback(async () => {
    try {
      const authInfo = BaseAPI.authForInfo(user);
      const response = await orderApi.getById(authInfo, id);
      if (!response) return;

      if (isMounted()) {
        setOrder(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    handleOrderGet();
  },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  return order;
};

const Page = () => {
  const order = useOrder();

  usePageView();

  if (!order) {
    return null;
  }

  return (
    <>
      <Seo title="Dashboard: Order Details" />
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
                  href={paths.dashboard.orders.index}
                  variant="subtitle2"
                >
                  {t(tokens.nav.management)}
                </Link>
                <Typography
                  color="text.secondary"
                  variant="subtitle2"
                >
                  {t(tokens.nav.order)}
                </Typography>
              </Breadcrumbs>
              <Typography variant="h4">
              {t(tokens.nav.orderDetails)}
              </Typography>
            </Stack>
            
            <EditCreateOrder current="Edit" />
            
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
