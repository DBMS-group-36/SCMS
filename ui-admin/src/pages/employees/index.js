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
import { DriversTable } from 'src/sections/employee/drivers-table';
import { DriverAssistantsTable } from 'src/sections/employee/driverAssistants-table';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { getAllDrivers, getAllDriverAssistants} from 'src/apis/employees';


const useDrivers = (data, page, rowsPerPage, search) => {
  return useMemo(
    () => {
      const filtered = searchObjects(data, search)
      return applyPagination(filtered || [], page, rowsPerPage);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, rowsPerPage, data, search]
  );
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const [selectedTab, setSelectedTab] = useState('drivers');

  useEffect(() => {
    setPage(0);
    setSearch('')
  }, [selectedTab])

  const [drivers, setDrivers] = useState([]);

  const [driverAssistants, setDriverAssistants] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginatedDriverAssistants = useDrivers(driverAssistants, page, rowsPerPage, search);
  const paginatedDrivers = useDrivers(drivers, page, rowsPerPage, search);


  const [loading, setLoading] = useState(true)

  async function retrieveAndRefreshData() {
    setLoading(true)
    try {
      await Promise.allSettled([
        
        getAllDrivers().then(c => setDrivers(c)),
        getAllDriverAssistants().then(c => setDriverAssistants(c))
      ])
      console.log("Driver were fetched from the database")
      // setData(drivers)
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

  const handleDelete = async (driver) => {
    confirm({ description: `This will permanently delete the record` })
      .then(async () => {
        try {
          setLoading(true)
          await deleteDriver(driver.Id)
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
          Drivers | A Suppilers
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
                  Drivers
                </Typography>

                <StyledBreadCrumbs sequence={[
                  {
                    text: 'Drivers',
                    linkUrl: '/drivers',
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
              placeholder={"Search drivers"}
            />

            {loading && <LinearProgress />}

            <TabContext value={selectedTab}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={(s, v) => setSelectedTab(v)} aria-label="lab API tabs example">
                  <Tab label="Drivers" value="drivers" />
                  <Tab label="Driver Assistants" value="driverAssistants" />
                </TabList>
              </Box>
              <TabPanel value="drivers">
                <DriversTable
                  count={drivers.length}
                  items={paginatedDrivers}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  handleDelete={handleDelete}
                />
              </TabPanel>
              <TabPanel value="driverAssistants">
                <DriverAssistantsTable
                  count={paginatedDriverAssistants.length}
                  items={driverAssistants}
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