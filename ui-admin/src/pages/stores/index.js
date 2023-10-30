import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import { Box, Button, Container, LinearProgress, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { StoresTable } from 'src/sections/stores/stores-table';
import { StoresSearch } from 'src/sections/stores/stores-search';
import { applyPagination } from 'src/utils/apply-pagination';
import NextLink from 'next/link';
import { StyledBreadCrumbs } from 'src/components/breadcrumbs';
import { useRouter } from 'next/navigation';
import { useConfirm } from 'material-ui-confirm';

const mockData = [
  {
    Id: 1,
    City: 'Gampaha',
    Capacity: 900,
  },
  {
    Id: 2,
    City: 'Rathmalana',
    Capacity: 400,
  },
  {
    Id: 3,
    City: 'Katubadda',
    Capacity: 60,
  },
  {
    Id: 4,
    City: 'Anuradhapura',
    Capacity: 20,
  },
  {
    Id: 5,
    City: 'Gampola',
    Capacity: 90,
  },
  {
    Id: 6,
    City: 'Kurunegala',
    Capacity: 28,
  },
  {
    Id: 7,
    City: 'Rathnapura',
    Capacity: 232,
  },
];

const useStores = (data, page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, rowsPerPage, data]
  );
};

const Page = () => {
  const [page, setPage] = useState(0);

  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const stores = useStores(data, page, rowsPerPage);

  const [loading, setLoading] = useState(true)

  function retrieveAndRefreshData() {
    setLoading(true)
    // TODO: Fetch data from api and  refresh data
    setData(mockData)
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

  const handleDelete = (store) => {
    confirm({ description: `This will permanently delete the record`})
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
          Stores | A Suppilers
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
                  Stores
                </Typography>

                <StyledBreadCrumbs sequence={[
                  {
                    text: 'Stores',
                    linkUrl: '/stores',
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
                    href={'/stores/create'}
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
                    onClick={() => setRefreshCount(s => s + 1)}
                    variant="outlined"
                  >
                    Refresh
                  </Button>
                </Stack>
              </div>
            </Stack>
            <StoresSearch />

            {loading && <LinearProgress />}

            <StoresTable
              count={mockData.length}
              items={stores}
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
