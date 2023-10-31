import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import { Box, Button, Container, LinearProgress, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Transportation_train_tripsTable } from 'src/sections/transportation_train_trips/transportation_train_trips-table';
import { BigSearch } from 'src/sections/big-search';
import { applyPagination } from 'src/utils/apply-pagination';
import NextLink from 'next/link';
import { StyledBreadCrumbs } from 'src/components/breadcrumbs';
import { useRouter } from 'next/navigation';
import { useConfirm } from 'material-ui-confirm';
import { getAllTransportation_train_trips } from 'src/apis/transportation_train_trips';
import { searchObjects } from 'src/utils/search-objects';


const useTransportation_train_trips = (data, page, rowsPerPage, search) => {
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
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const transportation_train_trips = useTransportation_train_trips(data, page, rowsPerPage, search);

  const [loading, setLoading] = useState(true)

  async function retrieveAndRefreshData() {
    setLoading(true)
    try {
      const transportation_train_trips = (await getAllTransportation_train_trips()) || [];
      console.log("Transportation_train_trips were fetched from the database", transportation_train_trips)
      
      setData(transportation_train_trips)
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

  const handleDelete = (product) => {
    confirm({ description: `This will permanently delete the record` })
      .then(() => {
        // TODO: Delete the data, api call

        retrieveAndRefreshData()
      })
      .catch(() => console.log("Deletion cancelled."));
  };

  return (

    <>
      <Head>
        <title>
          Transportation_train_trips | A Suppilers
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
                  Transportation train trips
                </Typography>

                <StyledBreadCrumbs sequence={[
                  {
                    text: 'transportation train trips',
                    linkUrl: '/transportation_train_trips',
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
              placeholder={"Search transportation train trips"}
            />

            {loading && <LinearProgress />} 

             <Transportation_train_tripsTable
              count={data.length}
              items={transportation_train_trips}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              handleDelete={handleDelete}
            /> 
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
