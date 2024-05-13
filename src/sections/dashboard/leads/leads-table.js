import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import {useRouter} from "../../../hooks/use-router";
import Divider from "@mui/material/Divider";
import TablePagination from "@mui/material/TablePagination";
import {Scrollbar} from 'src/components/scrollbar';

import { useUpdateEffect } from 'src/hooks/use-update-effect';
import { useSelector } from 'react-redux';

function LeadsTable(props) {
  const {
    count = 0,
    items = [],
    onPageChange = () => {
    },
    onRowsPerPageChange,
    pageNr = 0,
    itemsPerPage = 10
  } = props;
    const router = useRouter();

    const gridFilters = useSelector(state => state.gridFilters);

    const handledEditClick = (id) => {
        router.push(`/dashboard/leads/${id}/edit`); // Navigates to the edit page with specific id
    };

    useUpdateEffect(() => {
        onPageChange(null, gridFilters.pageNr);
        onRowsPerPageChange({ target: { value: gridFilters.itemsPerPage }});
      }, [gridFilters]);

    return (
        <TableContainer component={Paper}>
            <Scrollbar>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{minWidth: 120}}>Title</TableCell>
                            <TableCell sx={{minWidth: 120}} align="center">Full Name</TableCell>
                            <TableCell sx={{minWidth: 120}} align="center">Address</TableCell>
                            <TableCell sx={{minWidth: 120}} align="center">Lead Source</TableCell>
                            <TableCell sx={{minWidth: 120}} align="center">Role</TableCell>
                            <TableCell sx={{minWidth: 120}} align="center">Agent</TableCell>
                            <TableCell sx={{minWidth: 120}} align="center">Description</TableCell>
                            <TableCell sx={{minWidth: 120}} align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items?.map((row) => (
                            <TableRow
                                key={row?._id}
                                sx={{"&:last-child td, &:last-child th": {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {row?.data?.title.toUpperCase()}
                                </TableCell>
                                <TableCell align="center">{row?.data?.fullName}</TableCell>
                                <TableCell align="center">{row?.data?.address}</TableCell>
                                <TableCell align="center">{row?.data?.source?.data?.name}</TableCell>
                                <TableCell align="center">{row?.data?.role}</TableCell>
                                <TableCell align="center">{row?.data?.assignee?.data?.name}</TableCell>
                                <TableCell className="align-center">
                                    <div className="line-clamp-3" dangerouslySetInnerHTML={{ __html: row?.data?.description }} />
                                </TableCell><TableCell align="center">
                                    <IconButton
                                        onClick={() => {
                                            handledEditClick(row?._id);
                                        }}
                                    >
                                        <SvgIcon>
                                            <ArrowRightIcon/>
                                        </SvgIcon>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Scrollbar>
            <Divider/>
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
}

export default LeadsTable;
