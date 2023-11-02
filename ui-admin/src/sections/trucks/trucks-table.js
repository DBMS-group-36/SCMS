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

export const TrucksTable = (props) => {
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
                  Truck ID
                </TableCell>
                
                <TableCell>
                  Capacity
                </TableCell>
                
                <TableCell>
                  Store ID
                </TableCell>

                <TableCell>
                  truck city
                </TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((truck) => {
                return (
                  <TableRow
                    hover
                    key={truck.Id}
                  >
                    <TableCell>
                      <Typography variant="subtitle2">
                        {truck.Id}
                      </Typography>
                    </TableCell>
                    <TableCell>                     
                        {truck.Capacity} Cubic Meters                   
                    </TableCell>
                    <TableCell>
                      {truck.StoreId}
                    </TableCell>
                    <TableCell>
                      {truck.StoreCity}
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

TrucksTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  handleDelete: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
