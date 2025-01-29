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
import DotsHorizontalIcon from "@untitled-ui/icons-react/build/esm/DotsHorizontal";
import { useRouter } from "next/router";
import { useUpdateEffect } from "src/hooks/use-update-effect";
import { paths } from "src/paths";
import { Avatar, Stack, Typography } from "@mui/material";
import Users01 from "src/icons/untitled-ui/duocolor/users-01";
import { SeverityPill } from "src/components/severity-pill";
import { useAuth } from "src/hooks/use-auth";

export const UserListTable = (props) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {
    },
    onRowsPerPageChange,
    pageNr = 0,
    itemsPerPage = 10,
    formOptions = {}
  } = props;

  const { user } = useAuth();
  const gridFilters = useSelector(state => state.gridFilters);
  const router = useRouter();
  const handledEditClick = (id) => {
    router.push(paths.dashboard.users.details.replace(":id", id));
  };

  useUpdateEffect(() => {
    onPageChange(null, gridFilters.pageNr);
    onRowsPerPageChange({ target: { value: gridFilters.itemsPerPage } });
  }, [gridFilters]);

  return (
    <TableContainer component={Paper}>
      <Scrollbar>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                FULL NAME
              </TableCell>
              <TableCell>
                ACTIVE ROLE
              </TableCell>
              <TableCell align="right">
                ACTIONS
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.map(item => (
              <TableRow key={item.id}>
                <TableCell>
                  <Stack
                    alignItems="center"
                    direction="row"
                    spacing={1}
                  >
                    <Avatar
                      src={item.data.images[0]?.url}
                      sx={{
                        height: 40,
                        width: 40
                      }}
                    >
                      <SvgIcon>
                        <Users01 />
                      </SvgIcon>
                    </Avatar>
                    <div>
                      <Typography variant="subtitle2">
                        {item.data.name}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                      >
                        {item.data.email}
                      </Typography>
                    </div>
                  </Stack>
                </TableCell>
                <TableCell>
                  {item.data.roles[user.branch] === "64b877be20a24bc2e25db5b8"
                    ? (
                      <SeverityPill>
                        {formOptions.role.find(r => r._id === item.data.roles[user.branch])?.data.name}
                      </SeverityPill>
                    )
                    : formOptions.role.find(r => r._id === item.data.roles[user.branch])?.data.name}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      handledEditClick(item?._id);
                    }}
                  >
                    <SvgIcon>
                          <DotsHorizontalIcon />
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

UserListTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  pageNr: PropTypes.number,
  itemsPerPage: PropTypes.number
};
