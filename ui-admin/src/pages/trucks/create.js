import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { Autocomplete, Box, Button, Card, CardContent, CardHeader, Container, FormControl, InputLabel, MenuItem, Select, Snackbar, Stack, SvgIcon, TextField, Typography } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { StyledBreadCrumbs } from 'src/components/breadcrumbs';
import _cities from "src/pages/cities.json";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

const Page = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      Capacity: 0,
      City: '',
      submit: null
    },
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
        // TODO: use axios and Connect with backend do the post request and create

        enqueueSnackbar('Truck was added successfully!', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
            
          },
          autoHideDuration: 2000
        })

        setTimeout(() => router.push('/trucks'), 400)
        
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  return (
    <>
      <Head>
        <title>
          Strucks | A Suppilers
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
                  Strucks
                </Typography>

                <StyledBreadCrumbs sequence={[
                  {
                    text: 'Trucks',
                    linkUrl: '/trucks',
                  },
                  {
                    text: 'Add New',
                    linkUrl: '/trucks/create',
                    active: true
                  },
                ]} />

              </Stack>

            </Stack>
            <Card sx={{ overflow: 'visible' }}>
              <CardHeader title="Add New Truck" />
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
                        options={_cities.map(c => c.city)}
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
                        label="Capacity"
                        type="number"
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
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Submit
                    </Button>
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
