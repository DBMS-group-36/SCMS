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
import InboxStackIcon from '@heroicons/react/24/solid/InboxStackIcon';
import PaperAirplaneIcon from '@heroicons/react/24/solid/PaperAirplaneIcon';
import NextLink from 'next/link';
import { getOrdersStillInWareHouse } from 'src/apis/orders';
import { getAllTransportationTrainTrips } from 'src/apis/transportation_train_trips';
import axios from 'axios';
import { BACKEND_URL } from 'src/apis/consts';

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

export const OrdersStillInWarehouseTable = ({ search }) => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const ordersIds = useOrderIds(data);
  const ordersSelection = useSelection(ordersIds);

  const [transportationTrainTrips, setTransportationTrainTrip] = useState([]);

  const { enqueueSnackbar } = useSnackbar()

  async function retrieveAndRefreshData() {
    setLoading(true)
    try {
      const orders = (await getOrdersStillInWareHouse()) || [];
      setData(orders)
      console.log("Orders were fetched from the database", orders)
      const ts = (await getAllTransportationTrainTrips()) || [];
      setTransportationTrainTrip(ts)
      console.log("Transportation Train Trips were fetched from the database", ts)
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

  const selectedSome = (ordersSelection?.selected?.length > 0)
    && (ordersSelection?.selected?.length < orders.length);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const searchOrder = (orderId) => {
    return data?.find(d => d.Id == orderId)
  }

  const [open, setOpen] = useState(false);
  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  function getTotalCapacity() {
    if (!ordersSelection?.selected?.length) return 0;

    let c = 0;

    (ordersSelection?.selected || []).forEach((orderId) => {
      c += searchOrder(orderId)?.OrderCapacity
    })

    return c
  }

  const ordersCapacity = getTotalCapacity()
  const filteredTrainsTrips = (transportationTrainTrips || [])?.filter(t => t.CapacityAllocated >= ordersCapacity)
  const [selectedTrainTrip, setSelectedTrainTrip] = useState('');

  return (
    <Card>
      <Modal
        open={open}
        onClose={handleCloseDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" sx={{ paddingBottom: '20px' }} variant="subtitle1" component="h2">
            Please select a train to distribute orders to store
          </Typography>

          <FormControl fullWidth >
            <Select
              sx={{ paddingTop: '10px' }}
              value={selectedTrainTrip}
              onChange={(e) => setSelectedTrainTrip(e.target.value)}
            >
              {filteredTrainsTrips.map((t) => (
                <MenuItem key={t.Id} value={t.Id}>Train trip {t.Id} : {t.TimeOfArrival} - {t.TimeOfDeparture}</MenuItem>
              ))}

            </Select>
          </FormControl>

          <Typography id="modal-modal-title" variant="body2" component="h2" sx={{ marginTop: '10px' }}>
            These orders will be distributed
          </Typography>
          <List dense={true}>
            {
              ordersSelection?.selected.map(oId => {
                const o = searchOrder(oId);

                if (!o) return <></>
                return (
                  <ListItem key={oId}>
                    <ListItemAvatar>
                      <Avatar sx={{ padding: '10px' }}>
                        <InboxStackIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant='subtitle1'>Order {o?.Id} {'->'} {o.StoreCity}</Typography>}
                      secondary={`Delivery Date: ${o?.DeliveryDate}`}
                    />
                  </ListItem>
                )
              })
            }
          </List>

          <Typography id="modal-modal-title" sx={{ paddingTop: '15px', paddingBottom: '30px', }} variant="h6" component="h2">
            Total Capacity : {ordersCapacity}
          </Typography>

          <Stack>
            <Button
              fullWidth
              variant="outlined"
              onClick={async () => {
                setLoading(true);
                await axios.post(`${BACKEND_URL}/api/admin/orders/distributeOrdersByTrain`, {
                  orderDistributions: (ordersSelection?.selected || []).map((oId) => {
                    let so = searchOrder(oId)
                    return {
                      orderId: so.Id,
                      storeId: so.StoreId
                    }
                  }),
                  tripId: selectedTrainTrip,
                })
                retrieveAndRefreshData()
                setOpen(false)
              }}
            >
              Distribute
            </Button>
          </Stack>
        </Box>
      </Modal>

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
          {
            ordersSelection.selected?.length > 0 && (
              <Button
                startIcon={(
                  <SvgIcon fontSize="small">
                    <PaperAirplaneIcon />
                  </SvgIcon>
                )}
                variant="contained"
                onClick={() => {
                  handleOpenDialog()
                }}
                LinkComponent={NextLink}
              >
                Distribute Orders By Train
              </Button>
            )
          }
        </Stack>
      </div>
      <Scrollbar>
        {loading && <LinearProgress />}
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  {selectedSome && <Checkbox
                    checked={false}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      ordersSelection.handleDeselectAll?.();
                    }}
                  />}
                </TableCell>
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
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            ordersSelection.handleSelectOne?.(order.Id);
                          } else {
                            ordersSelection.handleDeselectOne?.(order.Id);
                          }
                        }}
                      />
                    </TableCell>
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
                      {order.OrderDate}
                    </TableCell>
                    <TableCell>
                      {order.DeliveryDate}
                    </TableCell>
                    <TableCell>
                      {order.StoreCity}
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