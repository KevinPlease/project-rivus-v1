import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from "react-redux";
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import orderApi from 'src/api/order';
import { Seo } from 'src/components/seo';
import { useDialog } from 'src/hooks/use-dialog';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { OrderDrawer } from 'src/sections/dashboard/order/order-drawer';
import { OrderListContainer } from 'src/sections/dashboard/order/order-list-container';
import { OrderListSearch } from 'src/sections/dashboard/order/order-list-search';
import { OrderListTable } from 'src/sections/dashboard/order/order-list-table';
import BaseAPI from 'src/api/BaseAPI';
import { useAuth } from 'src/hooks/use-auth';
import { paths } from 'src/paths';
import { RouterLink } from 'src/components/router-link';
import { setFilters, setItemsPerPage, setPageNr } from 'src/slices/grid-filters';

const useSearch = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    filters: {
      totalAmount: undefined,
      customer: undefined,
      date: undefined,
      orderStatus: undefined
    },
    filterTypes: {
      or: ["displayId"],
      and: ["totalAmount", "customer", "date", "orderStatus"]
    },
    pageNr: 0,
    itemsPerPage: 10
  });

  const handleFiltersChange = useCallback((filters) => {
    dispatch(setFilters({ current: "order", filters }));

    setState((prevState) => ({
      ...prevState,
      filters,
      pageNr: 0,
      itemsPerPage: 10
    }));
  }, []);

  const handlePageChange = useCallback((event, pageNr) => {
    dispatch(setPageNr({ current: "order", pageNr }));

    setState((prevState) => ({
      ...prevState,
      pageNr
    }));
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    const itemsPerPage = parseInt(event.target.value, 10);
    dispatch(setItemsPerPage({ current: "order", itemsPerPage }));

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

const useStore = (searchState) => {
  const { user } = useAuth();
  const isMounted = useMounted();
  const [state, setState] = useState({
    orders: [],
    formDetails: {
      availability: [],
      availability: [],
      unit: [],
      assignee: [],
      customer: [],
      orderStatus: [],
      property: [],
      unitType: []
    },
    count: 0
  });

  const fetchModels = useCallback(async () => {
    try {
      const authInfo = BaseAPI.authForInfo(user);
      const response = await orderApi.getAll(authInfo, searchState);
      if (!response) return null;

      if (isMounted()) {
        setState({
          orders: response.models,
          count: response.count,
          formDetails: response.formDetails
        });
      }

      return response;

    } catch (err) {
      console.error(err);
      return null;
    }
  }, [searchState, isMounted]);

  useEffect(() => {
      fetchModels();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchState]);

  return {
    ...state
  };
};

const useCurrentOrder = (orders, orderId) => {
  return useMemo(() => {
    if (!orderId) {
      return undefined;
    }

    return orders.find((order) => order._id === orderId);
  }, [orders, orderId]);
};

const Page = () => {
  const rootRef = useRef(null);
  const searchInfo = useSearch();
  const storeInfo = useStore(searchInfo.state);
  const dialog = useDialog();
  const currentOrder = useCurrentOrder(storeInfo.orders, dialog.data);

  usePageView();

  const handleOrderOpen = useCallback((orderId) => {
    // Close drawer if is the same order

    if (dialog.open && dialog.data === orderId) {
      dialog.handleClose();
      return;
    }

    dialog.handleOpen(orderId);
  }, [dialog]);

  const handleOrderClose = useCallback((orderId) => {
    dialog.handleClose();
    // Trigger refresh.
    searchInfo.handlePageChange(searchInfo.state.page);
  }, [dialog]);

  return (
    <>
      <Seo title="Dashboard: Order List" />
      <Divider />
      <Box
        component="main"
        ref={rootRef}
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box
          ref={rootRef}
          sx={{
            bottom: 0,
            display: 'flex',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0
          }}
        >
          <OrderListContainer open={dialog.open}>
            <Box sx={{ p: 3 }}>
              <Stack
                alignItems="flex-start"
                direction="row"
                justifyContent="space-between"
                spacing={4}
              >
                <div>
                  <Typography variant="h4">
                    Porosite
                  </Typography>
                </div>
                <div>
                  <Button
                    component={RouterLink}
                    href={paths.dashboard.orders.create}
                    startIcon={(
                      <SvgIcon>
                        <PlusIcon />
                      </SvgIcon>
                    )}
                    variant="contained"
                  >
                    Shto
                  </Button>
                </div>
              </Stack>
            </Box>
            <Divider />
            <OrderListSearch
              onFiltersChange={searchInfo.handleFiltersChange}
              onSortChange={searchInfo.handleSortChange}
              sortBy={null}
              // sortDir={ordersSearch.state.sortDir}
            />
            <Divider />
            <OrderListTable
              count={storeInfo.count}
              items={storeInfo.orders}
              onPageChange={searchInfo.handlePageChange}
              onRowsPerPageChange={searchInfo.handleRowsPerPageChange}
              onSelect={handleOrderOpen}
              page={searchInfo.state.pageNr}
              rowsPerPage={searchInfo.state.itemsPerPage}
            />
          </OrderListContainer>
          <OrderDrawer
            container={rootRef.current}
            onClose={handleOrderClose}
            open={dialog.open}
            order={currentOrder}
            formOptions={storeInfo.formDetails}
          />
        </Box>
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
