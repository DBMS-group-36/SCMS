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
  Tab,
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
import { getOrdersCancelled, getOrdersDelivered, getOrdersStillInWareHouse } from 'src/apis/orders';
import axios from 'axios';
import { BACKEND_URL } from 'src/apis/consts';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { getAllStores } from 'src/apis/stores';
import { useConfirm } from 'material-ui-confirm';


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

export const OrdersDeliveredPanel = () => {

  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState([]);


  const { enqueueSnackbar } = useSnackbar()

  async function retrieveAndRefreshData() {
    setLoading(true)
    try {
      const stores = (await getAllStores()) || [];
      setStores(stores)
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

  useEffect(() => {
    if (!stores?.length) return;
    setSelectedTab(`${stores?.[0]?.Id}`)
  }, [stores])

  const [selectedTab, setSelectedTab] = useState(1);
  return (
    <Card>
      <div>
        {loading && <LinearProgress />}

      </div>
      <TabContext value={`${selectedTab}`}>
        <Box sx={{ marginLeft: '40px', borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={(s, v) => setSelectedTab(v)}>
            {
              stores?.map(s => (
                <Tab key={s.Id} label={s.City} value={`${s.Id}`} />
              ))
            }
          </TabList>
        </Box>{
          stores?.map(s => (
            <TabPanel key={s.Id} value={`${s.Id}`}>
              <OrdersDeliveredForStore key={s.Id} storeId={s.Id} />
            </TabPanel>
          ))
        }
      </TabContext>
    </Card>
  );
};

export const OrdersDeliveredForStore = ({ storeId }) => {
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
      const orders = (await getOrdersDelivered(storeId)) || [];
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

  const orders = useOrders(data, page, rowsPerPage, '');
  const onPageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const onRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

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
                  sx={{backgroundColor: '#dcffe9'}}
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