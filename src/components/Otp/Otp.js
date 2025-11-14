import { Box, Button, Divider, TextField, Container, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import Cookies from "js-cookie";
import { ArrowBack } from "@mui/icons-material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const OtpTransactions = ({ showServiceTrans, searchTerm }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(100);


    // Filtered rows based on searchTerm from props
    const filteredRows = Array.isArray(showServiceTrans) ? showServiceTrans.filter(row => {
        const searchString = (searchTerm || "").toLowerCase();
        return (
            (row.first_name + ' ' + row.last_name).toLowerCase().includes(searchString) ||
            row.mlm_id.toLowerCase().includes(searchString) ||
            row.mobile.includes(searchString) ||
            row.otp.includes(searchString) ||
            row.category.toLowerCase().includes(searchString)
        );
    }) : [];

    const onPageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 100));
        setPage(0);
    };


    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            background: "#2198f3",
            color: "#fff",
            fontWeight: 700,
            fontSize: 12,
            textTransform: "uppercase",
            padding: "8px 8px",
            borderRight: "1px solid #e3e3e3",
            whiteSpace: "nowrap",
            letterSpacing: 1,
            "&:last-child": {
                borderRight: "1px solid #e3e3e3",
            },
        },
        "&:first-of-type": {
            borderTopLeftRadius: 6,
        },
        "&:last-of-type": {
            borderTopRightRadius: 6,
            borderRight: "1px solid #e3e3e3",
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 12,
            padding: "8px 8px",
            borderRight: "1px solid #e3e3e3",
            "&:last-child": {
                borderRight: "1px solid #e3e3e3",
            },
        },
    }));
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
    }));

    return (
        <main className="p-6 space-y-6">
            <Grid container spacing={4} sx={{ padding: '0px 16px' }}>
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Divider />
                        <Table aria-label="Otp Report">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Sl No.</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>User Name</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Mr. Id</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Mobile</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Otp</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>OTP For</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Status</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Date</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRows.length > 0 ? (rowsPerPage > 0
                                    ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : filteredRows
                                ).map((row, index) => (
                                    <StyledTableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <StyledTableCell>{index + 1 + page * rowsPerPage}</StyledTableCell>
                                        <StyledTableCell>{row.first_name + ' ' + row.last_name}</StyledTableCell>
                                        <StyledTableCell>{row.mlm_id}</StyledTableCell>
                                        <StyledTableCell>{row.mobile}</StyledTableCell>
                                        <StyledTableCell>{row.otp}</StyledTableCell>
                                        <StyledTableCell>{row.category}</StyledTableCell>
                                        <StyledTableCell style={{ color: row.status === 1 ? 'green' : 'black' }}>{row.status === 1 ? 'Active' : 'Expired'}</StyledTableCell>
                                        <StyledTableCell>{row.otp_date}</StyledTableCell>
                                    </StyledTableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={11} component="th" scope="row">
                                            <Typography color={'error'}>No Records Found.</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Grid>
            </Grid>
        </main>
    );
}

export default OtpTransactions;