import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import { AppBar, Box, Button, Container, LinearProgress, Stack, SvgIcon, Tab, Tabs, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { BigSearch } from 'src/sections/big-search';
import { applyPagination } from 'src/utils/apply-pagination';
import NextLink from 'next/link';
import { StyledBreadCrumbs } from 'src/components/breadcrumbs';
import { useRouter } from 'next/navigation';
import { useConfirm } from 'material-ui-confirm';
import { deleteStore, getAllStores } from 'src/apis/stores';
import { searchObjects } from 'src/utils/search-objects';
import { useSnackbar } from 'notistack';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { getAllEndCustomers, getAllRetailers, getAllWholesalers } from 'src/apis/customers';


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

  const [selectedTab, setSelectedTab] = useState('retailers');

  useEffect(() => {
    setPage(0);
    setSearch('')
  }, [selectedTab])

  const [retailers, setRetailers] = useState([]);
  const [endCustomers, setEndCustomers] = useState([]);
  const [wholesalers, setWholesalers] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginatedWholeSalers = useCustomers(wholesalers, page, rowsPerPage, search);
  const paginatedRetailers = useCustomers(retailers, page, rowsPerPage, search);
  const paginatedEndCustomers = useCustomers(endCustomers, page, rowsPerPage, search);

  const [loading, setLoading] = useState(true)

  async function retrieveAndRefreshData() {
    setLoading(true)
    try {
      await Promise.allSettled([
        getAllEndCustomers().then(c => setEndCustomers(c)),
        getAllRetailers().then(c => setRetailers(c)),
        getAllWholesalers().then(c => setWholesalers(c))
      ])
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

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  const confirm = useConfirm()

  const handleDelete = async (customer) => {
    confirm({ description: `This will permanently delete the record` })
      .then(async () => {
        try {
          setLoading(true)
          await deleteCustomer(customer.Id)
          console.log("Record was successfully deleted...")

        } catch (e) {
          console.error(e)
        }

        retrieveAndRefreshData()
      })
      .catch(() => console.log("Deletion cancelled."));
  };

  return (
    <>
      <Head>
        <title>
          Customers | A Suppilers
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
                  Customers
                </Typography>

                <StyledBreadCrumbs sequence={[
                  {
                    text: 'Customers',
                    linkUrl: '/customers',
                    active: true
                  },
                ]} />

              </Stack>
              <div>
                <Stack
                  spacing={1}
                  direction={'row'}
                >
                  <Button
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    )}
                    variant="contained"
                    href={'/customers/create'}
                    LinkComponent={NextLink}
                  >
                    Add New
                  </Button>
                  <Button
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowPathIcon />
                      </SvgIcon>
                    )}
                    onClick={() => retrieveAndRefreshData()}
                    variant="outlined"
                  >
                    Refresh
                  </Button>
                </Stack>
              </div>
            </Stack>
            <BigSearch
              search={search}
              onSearch={setSearch}
              placeholder={"Search customers"}
            />

            {loading && <LinearProgress />}

            <TabContext value={selectedTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={(s, v) => setSelectedTab(v)} aria-label="lab API tabs example">
                  <Tab label="Retailer Customers" value="retailers" />
                  <Tab label="Wholesalers" value="wholesalers" />
                  <Tab label="End Customers" value="endcustomers" />
                </TabList>
              </Box>
              <TabPanel value="retailers">
                <CustomersTable
                  count={retailers.length}
                  items={paginatedRetailers}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  handleDelete={handleDelete}
                />
              </TabPanel>
              <TabPanel value="wholesalers">
                <CustomersTable
                  count={paginatedWholeSalers.length}
                  items={wholesalers}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  handleDelete={handleDelete}
                />
              </TabPanel>
              <TabPanel value="endcustomers">
                <CustomersTable
                  count={endCustomers.length}
                  items={paginatedEndCustomers}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  handleDelete={handleDelete}
                />
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