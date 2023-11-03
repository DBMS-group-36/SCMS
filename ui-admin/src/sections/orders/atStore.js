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
    Grid,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableContainer,
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
import { getOrdersCancelled, getOrdersOnTrain, getOrdersStillInWareHouse, getOrdersAtStore } from 'src/apis/orders';
import { getAllTransportationTrainTrips } from 'src/apis/transportation_train_trips';
import axios from 'axios';
import { BACKEND_URL } from 'src/apis/consts';
import { BACKEND_URL2 } from 'src/apis/consts';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { getAllStores } from 'src/apis/stores';
import { useConfirm } from 'material-ui-confirm';
// import { json } from 'stream/consumers';


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

export const AtStorePanel = () => {

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
                            <OrdersOnTrainForStore key={s.Id} storeId={s.Id} />
                        </TabPanel>
                    ))
                }
            </TabContext>
        </Card>
    );
};

export const OrdersOnTrainForStore = ({ storeId }) => {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [open, setOpen] = useState(false);
    const ordersIds = useOrderIds(data);
    const ordersSelection = useSelection(ordersIds);

    const { enqueueSnackbar } = useSnackbar()

    async function retrieveAndRefreshData() {
        setLoading(true)
        try {
            console.log("dfe", storeId)
            const orders = (await getOrdersAtStore(storeId)) || [];

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

    const confirm = useConfirm()

    const handleUnloadFromTrain = async (orderId) => {
        confirm({ description: `Are you sure unloading the order from the train?` })
            .then(async () => {
                try {
                    setLoading(true)

                    await axios.get(`${BACKEND_URL}/api/admin/orders/${orderId}/unloadFromTrain`)

                } catch (e) {
                    console.error(e)
                }

                retrieveAndRefreshData()
            })
            .catch(() => {
                enqueueSnackbar('Error while uploading the order!', {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',

                    },
                    autoHideDuration: 2000
                })
            });
    };
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '75%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState('');
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState('');
    const [drivingAssistants, setDrivingAssistants] = useState([]);
    const [selectedDrivingAssistant, setSelectedDrivingAssistant] = useState('');
    const [trucks, setTrucks] = useState([]);
    const [availableOrders, setAvailableOrders] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [selectedTruck, setSelectedTruck] = useState('');
    async function fetchRoutes() {
        try {
            console.log(storeId)
            let routes2;
            setLoading(true);
            await fetch(`${BACKEND_URL2}/api/routes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "storeId": Number(storeId) }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('done');
                    console.log(data.routes);
                    setRoutes(data.routes)
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            await fetch(`${BACKEND_URL2}/api/drivers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "storeId": Number(storeId), "type": 1 }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('done');
                    console.log(data.drivers);
                    setDrivers(data.drivers);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            await fetch(`${BACKEND_URL2}/api/drivers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "storeId": Number(storeId), "type": 2 }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('done');
                    console.log(data.drivers);
                    setDrivingAssistants(data.drivers);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            await fetch(`${BACKEND_URL2}/api/admin/truck`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "oneOfGetTruckRequest": { "storeId": Number(storeId) } }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('done');
                    console.log(data.trucks);
                    setTrucks(data.trucks);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

            setLoading(false);
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => { fetchRoutes() }, []);


    return (
        <Card>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" sx={{ paddingBottom: '20px' }} variant="subtitle1" component="h2">
                        Please select a route
                    </Typography>

                    <Grid container spacing={3} >
                        <Grid item xs={6}>
                            <FormControl fullWidth >
                                <Select
                                    sx={{ paddingTop: '10px' }}
                                    value={selectedRoute}
                                    onChange={(e) => {
                                        setSelectedRoute(e.target.value);
                                        fetch(`${BACKEND_URL2}/api/orders`, {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ "routeId": Number(e.target.value), "storeId": Number(storeId), "status": "At Store" }),
                                        })
                                            .then(response => response.json())
                                            .then(data => {
                                                console.log('done');
                                                console.log(data.orders);
                                                setAvailableOrders(data.orders);
                                            })
                                            .catch((error) => {
                                                console.error('Error:', error);
                                            });

                                    }}
                                >
                                    {routes && routes.length > 0 && routes.map((t) => (
                                        <MenuItem key={t.Id} value={t.Id}>Route - {t.Id}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth >
                                <Select
                                    sx={{ paddingTop: '10px' }}
                                    value={selectedTruck}
                                    onChange={(e) => setSelectedTruck(e.target.value)}
                                >
                                    {trucks && trucks.length > 0 && trucks.map((t) => (
                                        <MenuItem key={t.id} value={t.id}>truck{t.id} | capacity-{t.capacity}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={3} >
                        <Grid item xs={6}>
                            <Typography id="modal-modal-title" sx={{ paddingBottom: '20px' }} variant="subtitle1" component="h2">
                                Driver
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    sx={{ paddingTop: '10px' }}
                                    value={selectedDriver}
                                    onChange={(e) => setSelectedDriver(e.target.value)}
                                >
                                    {drivers && drivers.length > 0 && drivers.map((t) => (
                                        <MenuItem key={t.EmployeeId} value={t.EmployeeId}>{t.EmployeeId} - {t.WorkHours} WH</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography id="modal-modal-title" sx={{ paddingBottom: '20px' }} variant="subtitle1" component="h2">
                                Driver Assisstant
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    sx={{ paddingTop: '10px' }}
                                    value={selectedDrivingAssistant}
                                    onChange={(e) => setSelectedDrivingAssistant(e.target.value)}
                                >
                                    {drivingAssistants && drivingAssistants.length > 0 && drivingAssistants.map((t) => (
                                        <MenuItem key={t.EmployeeId} value={t.EmployeeId}>{t.EmployeeId} - {t.WorkHours} WH</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    {selectedOrders.length > 0 && <div> <Typography id="modal-modal-title" sx={{ paddingBottom: '20px' }} variant="subtitle1" component="h2"> Selected: </Typography>
                        {selectedOrders.map((t) => {
                            return <a key={t.Id}>{t.Id}</a>
                        }
                        )
                        }
                    </div>}
                    {availableOrders.length > 0 &&

                        <TableContainer >
                            <Typography id="modal-modal-title" sx={{ paddingBottom: '20px' }} variant="subtitle1" component="h2">
                                Orders
                            </Typography>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>OrderId</TableCell>
                                        <TableCell>DeliveryDate</TableCell>
                                        <TableCell>Capacity</TableCell>
                                        <TableCell>
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {availableOrders.map((row) => (
                                        <TableRow key={row.Id}


                                        // handle row click here
                                        >
                                            <TableCell>{row.Id}</TableCell>
                                            <TableCell>{row.deliveryDate}</TableCell>
                                            <TableCell>{row.orderCapacity}</TableCell>
                                            <TableCell >
                                                <Button
                                                    onClick={() => {
                                                        setSelectedOrders([row.Id])
                                                        console.log(selectedOrders)
                                                    }}
                                                    variant="outlined"
                                                >
                                                    Send
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>}



                    <Button variant='outlined' onClick={() => {
                        // 
                        let data2 = {
                            "routeId": Number(selectedRoute),
                            "storeId": Number(storeId),
                            "driverId": Number(selectedDriver),
                            "driverAssistantId": Number(selectedDrivingAssistant),
                            "truckId": Number(selectedTruck),
                            "orders": selectedOrders
                        }
                        fetch(`${BACKEND_URL2}/api/order/update`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data2),
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log('done');
                                console.log(data.deliveryId);

                            })
                        console.log(data2)
                    }}>Proceed</Button>

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
                    <Button variant='outlined' onClick={() => {
                        setOpen(true)
                    }}>Deliver to Customers</Button>

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
                                    Arrival & Departure
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
                                            {order.DeliveryDate}
                                        </TableCell>
                                        <TableCell>
                                            {order.StoreId}
                                        </TableCell>
                                        <TableCell>
                                            {/* {order.TimeOfArrival} - {order.TimeOfDeparture} */}
                                        </TableCell>
                                        <TableCell>
                                            {order.deliveryAddressId}
                                        </TableCell>
                                        <TableCell>
                                            Rs. {order.price}.00
                                        </TableCell>
                                        <TableCell>
                                            {order.orderCapacity} m^3
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