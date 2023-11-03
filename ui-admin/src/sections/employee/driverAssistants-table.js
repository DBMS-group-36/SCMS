import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';

const avatars = [
  '/assets/avatars/avatar-carson-darrin.png',
  '/assets/avatars/avatar-fran-perez.png',
  '/assets/avatars/avatar-jie-yan-song.png',
 '/assets/avatars/avatar-miron-vitold.png',
 '/assets/avatars/avatar-nasimiyu-danai.png',
 '/assets/avatars/avatar-iulia-albu.png',
 '/assets/avatars/avatar-penjani-inyene.png',
]


export const DriverAssistantsTable = (props) => {
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
                <TableCell>
                  Id
                </TableCell>
                <TableCell>
                  user name
                </TableCell>
                <TableCell>
                  email
                </TableCell>
                <TableCell>
                  phone number
                </TableCell>
                <TableCell>
                  gender
                </TableCell>
                <TableCell>
                  address
                </TableCell>
                <TableCell>
                  job title
                </TableCell>
                <TableCell>
                  manager id
                </TableCell>
                <TableCell>
                  work hours
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((employee) => {
                return (
                  <TableRow
                    hover
                    key={employee.Id}
                  >
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Avatar src={avatars[employee.Id % avatars.length]}>
                          {/* {getInitials(driver.name)} */}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {employee.Id}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {employee.Username}
                    </TableCell>
                    <TableCell>
                      {employee.Email}
                    </TableCell>
                    <TableCell>
                      {employee.PhoneNumber}
                    </TableCell>
                    <TableCell>
                      {employee.Gender}
                    </TableCell>
                    <TableCell>
                      {employee.Address}
                    </TableCell>
                    <TableCell>
                      {employee.JobTitle}
                    </TableCell>
                    <TableCell>
                      {employee.ManagerId}
                    </TableCell>
                    <TableCell>
                      {employee.WorkHours}
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

DriverAssistantsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};
