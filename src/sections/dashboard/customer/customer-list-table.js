import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import { Scrollbar } from "src/components/scrollbar";
import Paper from "@mui/material/Paper";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import { useRouter } from "next/router";
import { useUpdateEffect } from "src/hooks/use-update-effect";
import { paths } from "src/paths";

export const CustomerListTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {
    },
    onRowsPerPageChange,
    pageNr = 0,
    itemsPerPage = 10
  } = props;

  const gridFilters = useSelector(state => state.gridFilters);
  const router = useRouter();
  const handledEditClick = (id) => {
    router.push(paths.dashboard.customers.details.replace(":id", id));
  };

  useUpdateEffect(() => {
    onPageChange(null, gridFilters.pageNr);
    onRowsPerPageChange({ target: { value: gridFilters.itemsPerPage }});
  }, [gridFilters]);

  return (
    <TableContainer component={Paper}>
      <Scrollbar>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Full Name</TableCell>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">Assignee</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.map((customer) => (
              <TableRow
                key={customer?._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{customer?.displayId}</TableCell>
                <TableCell align="center">
                  {customer?.data?.title?.toUpperCase()}
                </TableCell>
                <TableCell align="center">{customer?.data?.name}</TableCell>
                <TableCell align="center">{customer?.data?.mobile}</TableCell>
                <TableCell align="center">{customer?.data?.assignee?.data?.name}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      handledEditClick(customer?._id);
                    }}
                  >
                    <SvgIcon>
                      <ArrowRightIcon />
                    </SvgIcon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={pageNr}
        rowsPerPage={itemsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </TableContainer>
  );
};

CustomerListTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  pageNr: PropTypes.number,
  itemsPerPage: PropTypes.number
};
