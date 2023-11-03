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

export const RoutesTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => { },
    onRowsPerPageChange,
    handleDelete,
    page = 0,
    rowsPerPage = 0,
  } = props;

  console.log(items)

  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={170}>
                  Route ID
                </TableCell>
                <TableCell>
                  Maximum Time For Completion
                </TableCell>
                <TableCell>
                  Store Id
                </TableCell>
                <TableCell>
                  City
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((route) => {
                return (
                  <TableRow
                    hover
                    key={route.Id}
                  >
                    <TableCell>
                      <Typography variant="subtitle2">
                        {route.Id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {route.MaximumTimeForCompletion} Hours
                    </TableCell>
                    <TableCell>
                      {route.StoreId}
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {route.StoreCity}
                      </Typography>
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

RoutesTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  handleDelete: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
