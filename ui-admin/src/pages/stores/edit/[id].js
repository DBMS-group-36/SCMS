import { useCallback, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Autocomplete, Backdrop, Box, Button, Card, CardContent, CardHeader, CircularProgress, Container, FormControl, InputLabel, LinearProgress, MenuItem, Select, Snackbar, Stack, SvgIcon, TextField, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { StyledBreadCrumbs } from 'src/components/breadcrumbs';
import _cities from "src/pages/cities.json";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { LoadingButton } from '@mui/lab';

const Page = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const storeId = router.query.id
  const [loading, setLoading] = useState(true);

  const formik = useFormik({
    initialValues: {
      City: '',
      Capacity: ''
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      City: Yup
        .string()
        .required('City is required'),
      Capacity: Yup
        .number()
        .max(10000)
        .required('Capacity is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        // TODO: Connect with backend
        // Use axios Do the Post request and update the info

        enqueueSnackbar('Store was edited successfully!', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',

          },
          autoHideDuration: 2000
        })

        setTimeout(() => router.push('/stores'), 400)

      } catch (err) {
        enqueueSnackbar('Error occured!', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',

          },
          autoHideDuration: 2000
        })
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    setLoading(true)
    // TODO: Connect with backend
    // Use axios Do the get request and update the info
    // Replace below with actual data from api
    formik.setValues({
      City: 'Moratuwa',
      Capacity: 10
    })

    setLoading(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId])

  const __cities = useMemo(() => _cities.map(c => c.city),[])

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
                  },
                  {
                    text: 'Edit',
                    linkUrl: '/stores/edit/',
                    active: true
                  },
                ]} />

              </Stack>
            </Stack>

            {loading && <LinearProgress />}

            <Card sx={{ overflow: 'visible' }}>
              <CardHeader title="Edit Store" />

              <CardContent>
                <form onSubmit={formik.handleSubmit}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={5}
                    sx={{ mb: 3 }}
                  >
                    <FormControl
                      variant="filled"
                      fullWidth

                    >
                      <Autocomplete
                        disablePortal
                        disableClearable
                        options={__cities}
                        renderInput={
                          (params) =>
                            <TextField
                              {...params}
                              error={!!(formik.touched.City && formik.errors.City)}
                              helperText={formik.touched.City && formik.errors.City}
                              onBlur={(e) => { formik.handleBlur(e) }}
                              label="Select City"
                            />
                        }
                        onChange={(_, newValue) => formik.setFieldValue("City", newValue)}
                        name="City"
                        value={formik.values.City}
                      />
                    </FormControl>
                    <FormControl
                      variant="filled"
                      fullWidth
                    >
                      <TextField
                        fullWidth
                        type="number"
                        label="Capacity"
                        name="Capacity"
                        error={!!(formik.touched.Capacity && formik.errors.Capacity)}
                        helperText={formik.touched.Capacity && formik.errors.Capacity}
                        value={formik.values.Capacity}
                        onChange={formik.handleChange}
                      />
                    </FormControl>
                  </Stack>
                  <Stack
                    direction={'row'}
                    justifyContent={'flex-end'}
                  >
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Submit
                    </LoadingButton>
                  </Stack>

                </form>
              </CardContent>
            </Card>
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
