import { Box, Button, Divider, TextField, Container, Grid, Paper, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
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
import Link from "next/link";
import Modal from '@mui/material/Modal';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import Alert from '@mui/material/Alert';
import { useTheme, useMediaQuery } from '@mui/material';

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
        color: "white", // makes text visible on gradient
        fontSize: 12,
        fontWeight: 'bold',
        lineHeight: 1.2,
        padding: 8,
        borderRight: "1px solid rgba(224, 224, 224, 1)",
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 12,
        lineHeight: 1.2,
        padding: 8,
        borderRight: "1px solid rgba(224, 224, 224, 1)",
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
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

const IncomeTransactions = ({ showServiceTrans }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const getDate = (timeZone) => {
        if (!timeZone) return '';
        const dateString = timeZone;
        const dateObject = new Date(dateString);

        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, "0");
        const day = String(dateObject.getDate()).padStart(2, "0");
        const hours = String(dateObject.getHours()).padStart(2, "0");
        const minutes = String(dateObject.getMinutes()).padStart(2, "0");

        const amOrPm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);

        const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;
        return formattedDateTime;
    };

    let rows = showServiceTrans && showServiceTrans.length > 0 ? [...showServiceTrans] : [];

    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openModal1, setOpenModal1] = React.useState(false);
    const [openModal2, setOpenModal2] = React.useState(false);
    const [UserId, setUserId] = React.useState(null);
    const [status, setStatus] = React.useState(null);
    const [amount, setAmount] = React.useState(null);
    const [TransNo, setTransNo] = React.useState(null);
    const [rejectionReason, setRejectionReason] = useState(null);

    const filteredRows = rows.filter(row => {
        return (
            (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.last_name && row.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
            (row.mobile && row.mobile.includes(searchTerm)) ||
            (row.category && row.category.includes(searchTerm)) ||
            (row.trans_no && row.trans_no.includes(searchTerm))
        );
    });

    const onPageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenModal1 = (status, user_id, amount, trans_no) => {
        setUserId(user_id);
        setStatus(status);
        setAmount(amount);
        setTransNo(trans_no);
        setOpenModal1(true);
    };

    const handleCloseModal1 = () => {
        setUserId(null);
        setStatus(null);
        setAmount(null);
        setTransNo(null);
        setOpenModal1(false);
    };

    const handleTextareaChange = (event) => {
        setRejectionReason(event.target.value);
    };

    const handleOpenModal2 = (status, user_id, amount, trans_no) => {
        setUserId(user_id);
        setStatus(status);
        setAmount(amount);
        setTransNo(trans_no);
        setOpenModal2(true);
    };

    const handleCloseModal2 = () => {
        setOpenModal2(false);
        setRejectionReason('');
    };

    const handleOKButtonClick = async () => {
        if (!UserId) {
            console.error('UserId is missing.');
            return;
        }

        let remark = '';
        let action = '';

        if (status === 1) {
            remark = 'Approve';
            action = 'Approve';
        } else if (status === 2) {
            remark = rejectionReason;
            action = 'Reject';
        } else {
            remark = '';
            action = 'Pending';
        }

        const requestData = {
            user_id: UserId,
            sender_user_id: 2,
            amount: amount,
            trans_no: TransNo,
            remarks: remark,
            status: status
        };

        try {
            const response = await api.post("/api/referral/plan/reject-redeem", requestData);

            if (response.data.status === 200) {
                alert(response.data.message);
                window.location.reload();
            } else {
                alert('Failed to update status.');
                console.log('Failed to update status.');
            }

        } catch (error) {
            console.error("Error:", error);
            alert('An error occurred while updating the status.');
        }

        handleCloseModal1();
        handleCloseModal2();
        setRejectionReason('');
    };

    // Define table columns based on your original implementation
    const tableColumns = [
        { key: 'srno', label: 'Sr No.', width: '60px' },
        { key: 'redeem_type', label: 'Redeem Type', width: '120px' },
        { key: 'created_date', label: 'Created Date', width: '150px' },
        { key: 'user_name', label: 'User Name', width: '150px' },
        { key: 'user_id', label: 'User Id', width: '100px' },
        { key: 'mobile', label: 'Mobile', width: '120px' },
        { key: 'amt', label: 'Amt', width: '80px' },
        { key: 'credited_amt', label: 'Credited Amt[90%]', width: '120px' },
        { key: 'deducted_amt', label: 'Deducted Amt[10%]', width: '120px' },
        { key: 'transaction_no', label: 'Transaction No', width: '120px' },
        { key: 'account_no', label: 'Account No.', width: '120px' },
        { key: 'account_holder', label: 'Account holder name', width: '150px' },
        { key: 'bank_name', label: 'Bank name', width: '120px' },
        { key: 'ifsc_code', label: 'IFSC Code', width: '100px' },
        { key: 'remarks', label: 'Remarks', width: '120px' },
        { key: 'redeem_type_category', label: 'Redeem Type', width: '120px' },
        { key: 'approval_remarks', label: 'Approval Remarks', width: '150px' },
        { key: 'created_date_full', label: 'created date', width: '150px' },
        { key: 'status', label: 'Status', width: '100px' },
        { key: 'action', label: 'Action', width: '150px' },
    ];

    return (
        <main className="p-6 space-y-6">
            <Grid container spacing={2} sx={{ padding: isMobile ? '0px 8px' : '0px 16px' }}>
                <Grid item xs={12}>
                    <TableContainer
                        component={Paper}
                        sx={{
                            maxWidth: '100%',
                            overflow: 'auto',
                            marginTop: 2
                        }}
                    >
                        <Table aria-label="Redeem Report" size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Sr No.</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Redeem Type</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Created Date</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>User Name</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>User Id</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Mobile</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Amt</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Credited Amt[90%]</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Deducted Amt[10%]</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Transaction No</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Account No.</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Account holder name</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Bank name</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>IFSC Code</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Remarks</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Redeem Type</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Approval Remarks</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Created Date</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Status</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRows.length > 0 ? (
                                    filteredRows
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>{index + 1 + page * rowsPerPage}</StyledTableCell>
                                                <StyledTableCell>{row.category || 'Redeem'}</StyledTableCell>
                                                <StyledTableCell>{getDate(row.created_at) || row.redeem_date}</StyledTableCell>
                                                <StyledTableCell>{row.first_name + ' ' + row.last_name}</StyledTableCell>
                                                <StyledTableCell>{row.mlm_id}</StyledTableCell>
                                                <StyledTableCell>{row.mobile}</StyledTableCell>
                                                <StyledTableCell>{row.amount}</StyledTableCell>
                                                <StyledTableCell>{(row.amount * 0.9).toFixed(2)}</StyledTableCell>
                                                <StyledTableCell>{(row.amount * 0.1).toFixed(2)}</StyledTableCell>
                                                <StyledTableCell>{row.trans_no}</StyledTableCell>
                                                <StyledTableCell>{row.account_number}</StyledTableCell>
                                                <StyledTableCell>{row.account_holder}</StyledTableCell>
                                                <StyledTableCell>{row.bank_name}</StyledTableCell>
                                                <StyledTableCell>{row.ifsc_code}</StyledTableCell>
                                                <StyledTableCell>{row.remarks}</StyledTableCell>
                                                <StyledTableCell>{row.category}</StyledTableCell>
                                                <StyledTableCell>{row.rejection_reason}</StyledTableCell>
                                                <StyledTableCell>{getDate(row.created_at) || row.redeem_date}</StyledTableCell>
                                                <StyledTableCell style={{
                                                    color: row.status === 1 ? 'Green' : row.status === 2 ? 'Red' : 'blue',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {row.status === 1 ? 'Approved' : row.status === 2 ? 'Rejected' : 'Pending'}
                                                </StyledTableCell>
                                                <StyledTableCell sx={{ '& button': { m: 0.5 } }}>
                                                    {row.status === 0 ? (
                                                        <>
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                color="success"
                                                                onClick={() => handleOpenModal1(1, row.user_id, row.amount, row.trans_no)}
                                                                sx={{ fontSize: '0.7rem' }}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleOpenModal2(2, row.user_id, row.amount, row.trans_no)}
                                                                sx={{ fontSize: '0.7rem' }}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <Typography variant="caption" color="textSecondary">
                                                            No actions available
                                                        </Typography>
                                                    )}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={20} align="center">
                                            <Typography color={'error'} sx={{ padding: 2 }}>
                                                No Records Found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component="div"
                        count={filteredRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                            '& .MuiTablePagination-toolbar': {
                                flexWrap: 'wrap',
                                justifyContent: 'center'
                            }
                        }}
                    />
                </Grid>
            </Grid>

            {/* Approve Confirmation Modal */}
            <Modal
                open={openModal1}
                onClose={handleCloseModal1}
                aria-labelledby="approve-modal-title"
                aria-describedby="approve-modal-description"
            >
                <Box sx={style}>
                    <Box textAlign="center">
                        <HelpOutlineOutlinedIcon sx={{ fontSize: 40 }} color="warning" />
                    </Box>
                    <Typography id="approve-modal-title" variant="h6" component="h2" textAlign="center" mt={2}>
                        Are you sure to approve the Redeem request?
                    </Typography>
                    <Box textAlign="center" mt={3}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleOKButtonClick}
                            sx={{ mr: 2 }}
                        >
                            OK
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCloseModal1}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Reject Confirmation Modal */}
            <Modal
                open={openModal2}
                onClose={handleCloseModal2}
                aria-labelledby="reject-modal-title"
                aria-describedby="reject-modal-description"
            >
                <Box sx={style}>
                    <Box textAlign="center">
                        <HelpOutlineOutlinedIcon sx={{ fontSize: 40 }} color="warning" />
                    </Box>
                    <Typography id="reject-modal-title" variant="h6" component="h2" textAlign="center" mt={2}>
                        Are you sure to Reject the Redeem Request?
                    </Typography>
                    <TextareaAutosize
                        aria-label="rejection reason"
                        minRows={3}
                        placeholder="Enter Rejection Reason"
                        style={{
                            width: '100%',
                            marginTop: '16px',
                            padding: '8px',
                            fontFamily: 'inherit',
                            fontSize: '14px'
                        }}
                        value={rejectionReason}
                        onChange={handleTextareaChange}
                    />
                    <Box textAlign="center" mt={3}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleOKButtonClick}
                            sx={{ mr: 2 }}
                            disabled={!rejectionReason}
                        >
                            OK
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCloseModal2}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </main>
    );
}

export default IncomeTransactions;