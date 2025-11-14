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
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Link from "next/link";
import Modal from '@mui/material/Modal';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import Alert from '@mui/material/Alert';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const AddMoneyRequestTransactions = ({ showServiceTrans }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [openModal1, setOpenModal1] = React.useState(false);
    const [openModal2, setOpenModal2] = React.useState(false);
    const [addMoneyReqId, setAddMoneyReqId] = React.useState(null);
    const [status, setStatus] = React.useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    // Filter rows based on search term
    const filteredRows = (showServiceTrans || []).filter(row => {
        const term = searchTerm.toLowerCase();
        return (
            (row.user_name && row.user_name.toLowerCase().includes(term)) ||
            // (row.user_id && row.user_id.toLowerCase().includes(term)) ||
            (row.mobile && row.mobile.includes(term)) ||
            (row.transaction_id && row.transaction_id.toLowerCase().includes(term)) ||
            (row.amount && row.amount.toString().includes(term))
        );
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            background: "#2198f3",
            color: "white", // makes text visible on gradient
            fontSize: 14,
            fontWeight: 600,
            padding: '6px 8px',
            borderRight: "1px solid #bdbdbd",
            borderBottom: '2px solid #bdbdbd',
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 13,
            padding: '6px 8px',
            borderRight: "1px solid #e0e0e0",
            borderBottom: '1px solid #e0e0e0',
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const handleOpenModal1 = (addMoneyReqId, status) => {
        setAddMoneyReqId(addMoneyReqId);
        setStatus(status);
        setOpenModal1(true);
    };

    const handleCloseModal1 = () => {
        setAddMoneyReqId(null);
        setStatus(null);
        setOpenModal1(false);
    };

    const handleOpenModal2 = (addMoneyReqId, status) => {
        setAddMoneyReqId(addMoneyReqId);
        setStatus(status);
        setOpenModal2(true);
    };

    const handleCloseModal2 = () => {
        setOpenModal2(false);
    };

    const handleTextareaChange = (event) => {
        setRejectionReason(event.target.value);
    };

    const handleOKButtonClick = async () => {
        if (!addMoneyReqId) {
            console.error('addMoneyReqId is missing.');
            return;
        }

        let note = '';
        let action = '';
        if (status === 1) {
            note = 'Approve';
            action = 'Approve';
        } else if (status === 2) {
            note = rejectionReason;
            action = 'Reject';
        }

        const requestData = {
            status: status,
            note: note,
            add_money_req_id: addMoneyReqId,
            action: action
        };

        try {
            const response = await api.post("/api/add_money/update-add-money", requestData);
            if (response.data.status === 200) {
                window.location.reload();
            } else {
                console.log('Failed to update status.');
            }
        } catch (error) {
            console.error("Error:", error);
        }

        handleCloseModal1();
        handleCloseModal2();
    };

    return (
        <main className="p-6 space-y-6">
            <Grid container spacing={2} sx={{ padding: '0px 8px' }}>
                <Grid item xs={12}>
                    {/* Search Box */}
                    <Box display="flex" justifyContent="flex-end" alignItems="center" mb={1}>
                        <TextField
                            size="small"
                            placeholder="Search by name, ID, mobile, txn, amount..."
                            value={searchTerm}
                            onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
                            sx={{ width: 320 }}
                        />
                    </Box>
                    <TableContainer component={Paper} sx={{ border: '1px solid #bdbdbd', borderRadius: 2 }}>
                        <Table aria-label="Add Money Request Report" size="small">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Sl No.</StyledTableCell>
                                    <StyledTableCell>User Name</StyledTableCell>
                                    <StyledTableCell>User ID</StyledTableCell>
                                    <StyledTableCell>Mobile</StyledTableCell>
                                    <StyledTableCell>Payment Mode</StyledTableCell>
                                    <StyledTableCell>Amount</StyledTableCell>
                                    <StyledTableCell>Transaction ID</StyledTableCell>
                                    <StyledTableCell>UPI ID</StyledTableCell>
                                    <StyledTableCell>Date</StyledTableCell>
                                    <StyledTableCell>Remarks</StyledTableCell>
                                    <StyledTableCell>Status</StyledTableCell>
                                    <StyledTableCell>Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRows.length > 0 ? (
                                    filteredRows
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <StyledTableRow key={row.id || index}>
                                                <StyledTableCell>{index + 1 + page * rowsPerPage}</StyledTableCell>
                                                <StyledTableCell>{row.user_name}</StyledTableCell>
                                                <StyledTableCell>{row.user_id}</StyledTableCell>
                                                <StyledTableCell>{row.mobile}</StyledTableCell>
                                                <StyledTableCell>{row.payment_mode}</StyledTableCell>
                                                <StyledTableCell>{row.amount}</StyledTableCell>
                                                <StyledTableCell>{row.transaction_id}</StyledTableCell>
                                                <StyledTableCell>{row.upi_id || '-'}</StyledTableCell>
                                                <StyledTableCell>{row.created_at}</StyledTableCell>
                                                <StyledTableCell>{row.remarks || '-'}</StyledTableCell>
                                                <StyledTableCell style={{ color: row.status === 1 ? 'green' : row.status === 2 ? 'red' : 'blue', fontWeight: 600 }}>
                                                    {row.status === 1 ? 'Approved' : row.status === 2 ? 'Rejected' : 'Pending'}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    <Box display="flex" gap={1} alignItems="center" justifyContent="center">
                                                        {row.status === 0 && (
                                                            <>
                                                                <Button variant="contained" size="small" color="success" style={{ minWidth: 80, fontWeight: 600 }} onClick={() => handleOpenModal1(row.id, 1)}>
                                                                    APPROVE
                                                                </Button>
                                                                <Button variant="contained" size="small" color="error" style={{ minWidth: 80, fontWeight: 600 }} onClick={() => handleOpenModal2(row.id, 2)}>
                                                                    REJECT
                                                                </Button>
                                                            </>
                                                        )}
                                                    </Box>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={12} align="center">
                                            <Typography color="error">No Records Found.</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredRows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </Grid>
            </Grid>

            <Modal
                open={openModal1}
                onClose={handleCloseModal1}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} alignItems={'center'} justifyContent={'space-between'}>
                    <HelpOutlineOutlinedIcon sx={{ fontSize: 40, marginLeft: 20 }} color="warning" alignItems={'center'} />
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Are you sure to approve the money request?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} alignItems={'center'}>
                        <Button variant="contained" size="large" color="success" onClick={handleOKButtonClick} sx={{ marginLeft: 20 }}>OK</Button>
                    </Typography>
                </Box>
            </Modal>

            <Modal
                open={openModal2}
                onClose={handleCloseModal2}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} alignItems={'center'} justifyContent={'space-between'}>
                    <HelpOutlineOutlinedIcon sx={{ fontSize: 40, marginLeft: 20 }} color="warning" alignItems={'center'} />
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Are you sure to Reject the money request?
                    </Typography>
                    <TextareaAutosize
                        aria-label="minimum height"
                        minRows={10}
                        placeholder="Enter Rejection Reason"
                        style={{ width: 400 }}
                        value={rejectionReason}
                        onChange={handleTextareaChange}
                    />
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} alignItems={'center'}>
                        <Button variant="contained" size="large" color="success" onClick={handleOKButtonClick} sx={{ marginLeft: 20 }}>OK</Button>
                    </Typography>
                </Box>
            </Modal>
        </main>
    );
};

export default AddMoneyRequestTransactions;