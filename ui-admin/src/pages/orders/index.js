import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import { AppBar, Box, Button, Container, LinearProgress, Modal, Stack, SvgIcon, Tab, Tabs, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { applyPagination } from 'src/utils/apply-pagination';
import NextLink from 'next/link';
import { StyledBreadCrumbs } from 'src/components/breadcrumbs';
import { searchObjects } from 'src/utils/search-objects';;
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { OrdersStillInWarehouseTable } from 'src/sections/orders/stillInWarehouse';

const useCustomers = (data, page, rowsPerPage, search) => {
  return useMemo(
    () => {
      const filtered = searchObjects(data, search)
      return applyPagination(filtered, page, rowsPerPage);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, rowsPerPage, data, search]
  );
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const [selectedTab, setSelectedTab] = useState('Order Placed');

  useEffect(() => {
    setPage(0);
    setSearch('')
  }, [selectedTab])

  const [loading, setLoading] = useState(true)

  async function retrieveAndRefreshData() {
    setLoading(true)
    try {

      console.log("Customer were fetched from the database")
      // setData(customers)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    retrieveAndRefreshData()
  }, [])

  return (
    <>
      <Head>
        <title>
          Orders | A Suppilers
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h5">
                  Orders
                </Typography>

                <StyledBreadCrumbs sequence={[
                  {
                    text: 'Orders',
                    linkUrl: '/orders',
                    active: true
                  },
                ]} />

              </Stack>
            </Stack>
            {loading && <LinearProgress />}
            <TabContext value={selectedTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={(s, v) => setSelectedTab(v)} aria-label="lab API tabs example">
                  <Tab label="Still In Warehouse" value="Order Placed" />
                  <Tab label="On Train" value="On Train" />
                  <Tab label="At Store" value="At Store" />
                  <Tab label="Deliverying By Vehicle" value="Delivery" />
                  <Tab label="Successfully Delivered" value="Delivered" />
                  <Tab label="Cancelled" value="Cancelled" />
                </TabList>
              </Box>
              <TabPanel value="Order Placed">
                <OrdersStillInWarehouseTable />
              </TabPanel>
              <TabPanel value="On Train">
                On Train
              </TabPanel>
              <TabPanel value="At Store">
                At Store
              </TabPanel>
              <TabPanel value="Delivery">
                Deliverying By Vehicle
              </TabPanel>
              <TabPanel value="Delivered">
                Successfully Delivered
              </TabPanel>
              <TabPanel value="Cancelled">
                Cancelled
              </TabPanel>
            </TabContext>
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