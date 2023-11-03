import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  FormLabel,
  IconButton,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { useSelection } from 'src/hooks/use-selection';
import { cloneElement, useCallback, useEffect, useMemo, useState } from 'react';
import { searchObjects } from 'src/utils/search-objects';
import { applyPagination } from 'src/utils/apply-pagination';
import { useSnackbar } from 'notistack';
import ArrowPathIcon from '@heroicons/react/24/solid/ArrowPathIcon';
import { getOrdersCancelled, getOrdersOnTrain, getOrdersStillInWareHouse } from 'src/apis/orders';
import { getAllTransportationTrainTrips } from 'src/apis/transportation_train_trips';
import axios from 'axios';
import { BACKEND_URL } from 'src/apis/consts';


export function getAddress(o) {
return `${o?.AddressLine1}, ${o?.AddressLine2}, ${o?.PostalCode}, ${o?.Province}`
}

const useOrders = (data, page, rowsPerPage, search) => {
  return useMemo(
    () => {
      const filtered = searchObjects(data, search)
      return applyPagination(filtered, page, rowsPerPage);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [page, rowsPerPage, data, search]
  );
};

const useOrderIds = (orders) => {
  return useMemo(
    () => {
      return orders.map((order) => order.id);
    },
    [orders]
  );
};

export const OrdersCancelledTable = ({ search }) => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const ordersIds = useOrderIds(data);
  const ordersSelection = useSelection(ordersIds);

  const { enqueueSnackbar } = useSnackbar()

  async function retrieveAndRefreshData() {
    setLoading(true)
    try {
      const orders = (await getOrdersCancelled()) || [];
      setData(orders)
    } catch (e) {
      enqueueSnackbar('Error while doing network operations...', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',

        },
        autoHideDuration: 2000
      })
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => { retrieveAndRefreshData() }, [])

  const orders = useOrders(data, page, rowsPerPage, search || '');
  const onPageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const onRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const searchOrder = (orderId) => {
    return data?.find(d => d.Id == orderId)
  }

  function getTotalCapacity() {
    if (!ordersSelection?.selected?.length) return 0;

    let c = 0;

    (ordersSelection?.selected || []).forEach((orderId) => {
      c += searchOrder(orderId)?.OrderCapacity
    })

    return c
  }

  return (
    <Card>
      <div>
        <Stack
          spacing={1}
          direction={'row'}
          sx={{ padding: '20px', justifyContent: 'space-between' }}
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
            Refresh Orders
          </Button>
        </Stack>
      </div>
      <Scrollbar>
        {loading && <LinearProgress />}
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Id
                </TableCell>
                <TableCell>
                  Order Date
                </TableCell>
                <TableCell>
                  Delivery Date
                </TableCell>
                <TableCell>
                  Store
                </TableCell>
                <TableCell>
                  Address
                </TableCell>
                <TableCell>
                  Total Price
                </TableCell>
                <TableCell>
                  Capacity
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => {
                const isSelected = ordersSelection.selected.includes(order.Id);
                return (
                  <TableRow
                    hover
                    key={order.Id}
                    selected={isSelected}
                  >
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Typography variant="subtitle2">
                          {order.Id}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.OrderDate), 'yyyy-MM-dd')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.DeliveryDate), 'yyyy-MM-dd')}
                    </TableCell>
                    <TableCell>
                      {order.StoreCity}
                    </TableCell>
                    <TableCell>
                      {getAddress(order)}
                    </TableCell>
                    <TableCell>
                      Rs. {order.price}.00
                    </TableCell>
                    <TableCell>
                      {order.OrderCapacity} m^3
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={data.length}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};