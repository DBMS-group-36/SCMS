import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Checkbox,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import NextLink from 'next/link';

export const Transportation_train_tripsTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => { },
    onRowsPerPageChange,
    handleDelete,
    page = 0,
    rowsPerPage = 0,
  } = props;

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={170}>
                  Transportation train trip ID
                </TableCell>
                <TableCell>
                  Date
                </TableCell>
                <TableCell>
                  Time of Departure
                </TableCell>
                <TableCell>
                  Time of Arrival
                </TableCell>
                <TableCell>
                  Capacity allocated
                </TableCell>
                <TableCell>
                  destination
                </TableCell>
                <TableCell>
                  Capacity available
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((transportation_train_trip) => {
                return (
                  <TableRow
                    hover
                    key={transportation_train_trip.id}
                  >
                    <TableCell>
                      <Typography variant="subtitle2">
                        {transportation_train_trip.Id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {transportation_train_trip.Date}
                    </TableCell>
                    <TableCell>
                      {transportation_train_trip.TimeOfDeparture}
                    </TableCell>
                    <TableCell>
                      {transportation_train_trip.TimeOfArrival}
                    </TableCell>
                    <TableCell>
                      {transportation_train_trip.CapacityAllocated}
                    </TableCell>
                    <TableCell>
                      {transportation_train_trip.Destination}
                    </TableCell>
                    <TableCell>
                      {transportation_train_trip.CapacityAvailable}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        aria-label="edit"
                        href={`/transportation_train_trips/edit/${transportation_train_trip.id}`}
                        LinkComponent={NextLink}
                      >
                        <SvgIcon>
                          <PencilIcon style={{ fontSize: 24 }} /> {/* Customize the icon */}
                        </SvgIcon>
                      </IconButton>

                      <IconButton
                        color="primary"
                        aria-label="remove"
                        onClick={() => handleDelete(transportation_train_trip)}
                        LinkComponent={NextLink}
                      >
                        <SvgIcon>
                          <TrashIcon style={{ fontSize: 24 }} /> {/* Customize the icon */}
                        </SvgIcon>
                      </IconButton>
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
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

Transportation_train_tripsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  handleDelete: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
