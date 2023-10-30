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
      capacity: 0,
      city: '',
      submit: null
    },
    validationSchema: Yup.object({
      city: Yup
        .string()
        .required('City is required'),
      capacity: Yup
        .number()
        .max(10000)
        .required('Capacity is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        // TODO: use axios and Connect with backend do the post request and create

        enqueueSnackbar('Store was added successfully!', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
            
          },
          autoHideDuration: 2000
        })

        setTimeout(() => router.push('/stores'), 400)
        
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
                    text: 'Add New',
                    linkUrl: '/stores/create',
                    active: true
                  },
                ]} />

              </Stack>

            </Stack>
            <Card sx={{ overflow: 'visible' }}>
              <CardHeader title="Add New Store" />
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
                              error={!!(formik.touched.city && formik.errors.city)}
                              helperText={formik.touched.city && formik.errors.city}
                              onBlur={(e) => { formik.handleBlur(e) }}
                              label="Select City"
                            />
                        }
                        onChange={(_, newValue) => formik.setFieldValue("city", newValue)}
                        name="city"
                        value={formik.values.city}
                      />
                    </FormControl>
                    <FormControl
                      variant="filled"
                      fullWidth
                    >
                      <TextField
                        fullWidth
                        label="capacity"
                        type="number"
                        name="capacity"
                        error={!!(formik.touched.capacity && formik.errors.capacity)}
                        helperText={formik.touched.capacity && formik.errors.capacity}
                        value={formik.values.capacity}
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
