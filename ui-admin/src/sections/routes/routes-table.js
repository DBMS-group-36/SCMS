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
                  maximum time for completion
                </TableCell>
                <TableCell>
                  store id
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((route) => {
                return (
                  <TableRow
                    hover
                    key={route.id}
                  >
                    <TableCell>
                      <Typography variant="subtitle2">
                        {route.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {route.city}
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {route.capacity} Cubic Meters
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        aria-label="edit"
                        href={`/routes/edit/${route.id}`}
                        LinkComponent={NextLink}
                      >
                        <SvgIcon>
                          <PencilIcon style={{ fontSize: 24 }} /> {/* Customize the icon */}
                        </SvgIcon>
                      </IconButton>

                      <IconButton
                        color="primary"
                        aria-label="remove"
                        onClick={() => handleDelete(route)}
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

RoutesTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  handleDelete: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
};
