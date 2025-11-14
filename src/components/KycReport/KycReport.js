import { Box, Button, Divider, TextField, Container, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, Link } from "@mui/material";
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
// import Link from "next/link";
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

const KycTransactions = ({ showServiceTrans }) => {


    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [
            ...showServiceTrans
        ];
    } else {
        rows = [];
    }

    const rowsPerPageOptions = [5, 10, 25];

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(100);


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
            color: "white", // makes text visible on gradient
            fontSize: 12,
            linHeight: 15,
            padding: 7,
            borderRight: "1px solid rgba(224, 224, 224, 1)"
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 12,
            linHeight: 15,
            padding: 7,
            borderRight: "1px solid rgba(224, 224, 224, 1)"
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));


    const [searchTerm, setSearchTerm] = useState('');

    const filteredRows = rows.filter(row => {
        return (
            (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
            (row.mobile && row.mobile.includes(searchTerm)) ||
            (row.pan_number && row.pan_number.includes(searchTerm)) ||
            // (row.aadhar_number && row.aadhar_number.includes(searchTerm)) ||
            (row.ifsc_code && row.ifsc_code.includes(searchTerm)) ||
            (row.nominee_name && row.nominee_name.includes(searchTerm)) ||
            (row.nominee_relation && row.nominee_relation.includes(searchTerm)) ||
            (row.account_number && row.account_number.includes(searchTerm))

        );
    });



    const [openModal1, setOpenModal1] = React.useState(false);
    const [openModal2, setOpenModal2] = React.useState(false);
    const [addMoneyReqId, setAddMoneyReqId] = React.useState(null);
    const [status, setStatus] = React.useState(null);
    const [rejectionReason, setRejectionReason] = useState(null);

    const handleTextareaChange = (event) => {
        setRejectionReason(event.target.value);
    };
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


    const handleLinkClick = (img) => {
        window.open(img, '_blank', 'noopener,noreferrer');
    };


    const handleOKButtonClick = async () => {
        // alert(status);
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
            note = rejectionReason; // Use the rejectionReason state
            action = 'Reject';
        } else {
            note = '';
            action = '';
        }

        const requestData = {
            status: status,
            note: note,
            id: addMoneyReqId,
            action: action
        };
        try {
            const response = await api.post("/api/users/update-kyc-status", requestData);
            if (response.data.status === 200) {
                location.reload();
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
            <Grid
                container
                spacing={4}
                sx={{ padding: '0px 16px' }}
            >
                <Grid item={true} xs={12}   >

                    <TableContainer
                        component={Paper}
                        sx={{
                            maxHeight: 400, // 👈 fixed visible area
                            overflow: "auto", // 👈 enables scrollbars
                            "&::-webkit-scrollbar": {
                                width: "8px",
                                height: "8px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#b0b0b0",
                                borderRadius: "8px",
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                                backgroundColor: "#888",
                            },
                        }}
                    >
                        <Table stickyHeader aria-label="KYC Report Table">

                            <TableHead>
                                <TableRow>

                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>Sl No.</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>Username</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>PAN Number</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>Aadhaar Number</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>Bank Name</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>IFSC Code</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>Account Number</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>Nominee Name</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>Nominee Relation</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>Address</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>PAN Image</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>Aadhaar Image</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>AadharBack Image</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>Checkbook Image</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>Created Date</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>Modified Date</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>Status</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>Action</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} nowrap>Rejection Reason</StyledTableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>


                                {showServiceTrans.length > 0 ? (rowsPerPage > 0
                                    ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : filteredRows
                                ).map((row, index) => (

                                    <StyledTableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >

                                        <StyledTableCell style={{ whiteSpace: "nowrap" }}>{index + 1 + page * rowsPerPage}</StyledTableCell>
                                        <StyledTableCell style={{ whiteSpace: "nowrap" }}>{row.name + ' | ' + row.mlm_id + ' | ' + row.mobile}</StyledTableCell>
                                        <StyledTableCell style={{ whiteSpace: "nowrap" }}>{row.pan_number}</StyledTableCell>
                                        <StyledTableCell style={{ whiteSpace: "nowrap" }}>{row.aadhar_number}</StyledTableCell>
                                        <StyledTableCell style={{ whiteSpace: "nowrap" }}>{row.bank_name}</StyledTableCell>
                                        <StyledTableCell style={{ whiteSpace: "nowrap" }}>{row.ifsc_code}</StyledTableCell>
                                        <StyledTableCell style={{ whiteSpace: "nowrap" }}>{row.account_number}</StyledTableCell>
                                        <StyledTableCell style={{ whiteSpace: "nowrap" }}>{row.nominee_name}</StyledTableCell>
                                        <StyledTableCell style={{ whiteSpace: "nowrap" }}>{row.nominee_relation}</StyledTableCell>
                                        <StyledTableCell style={{ whiteSpace: "nowrap" }}>{row.address}</StyledTableCell>
                                        <StyledTableCell style={{ whiteSpace: "nowrap" }}> {row.panImage !== '' ? (
                                            <Link href="#" onClick={() => handleLinkClick(row.panImage)}>View PAN</Link>
                                        ) : (
                                            ''
                                        )}
                                        </StyledTableCell>
                                        <StyledTableCell style={{ whiteSpace: "nowrap" }}> {row.aadharImage !== '' ? (
                                            <Link href="#" onClick={() => handleLinkClick(row.aadharImage)}>View AADHAR(Front)</Link>
                                        ) : (
                                            ''
                                        )}
                                        </StyledTableCell>
                                        <StyledTableCell style={{ whiteSpace: "nowrap" }}> {row.aadharBackImage !== '' ? (
                                            <Link href="#" onClick={() => handleLinkClick(row.aadharBackImage)}>View AADHAR(Back)</Link>
                                        ) : (
                                            ''
                                        )}
                                        </StyledTableCell>
                                        <StyledTableCell style={{ whiteSpace: "nowrap" }}> {row.checkbookImage !== '' ? (
                                            <Link href="#" onClick={() => handleLinkClick(row.checkbookImage)}>View CHECKBOOK</Link>
                                        ) : (
                                            ''
                                        )}
                                        </StyledTableCell>

                                        <StyledTableCell style={{ whiteSpace: "nowrap" }}>{row.created_on}</StyledTableCell>
                                        <StyledTableCell style={{ whiteSpace: "nowrap" }}>{row.modified_on}</StyledTableCell>

                                        <StyledTableCell style={{ color: row.status === 1 ? 'Green' : row.status === 2 ? 'Red' : 'Orange' }} > {row.status === 1 ? 'Approved' : row.status === 2 ? 'Rejected' : 'Pending'}</StyledTableCell>
                                        <StyledTableCell sx={{ '& button': { m: 1 } }}>
                                            <Link href={`/update-kyc/?id=${row.user_id}&kyc_id=${row.id}`}>
                                                <a>
                                                    <Button variant="contained" size="small" color="success" style={{ fontWeight: 'bold' }}>Update</Button>
                                                </a>
                                            </Link>
                                            {row.status === 0 && (
                                                <>
                                                    <Button variant="contained" size="small" color="success" onClick={() => handleOpenModal1(row.id, 1)}>Approve</Button>
                                                    <Button variant="contained" size="small" color="error" onClick={() => handleOpenModal2(row.id, 2)}>Reject</Button>

                                                </>
                                            )}
                                            <Modal
                                                open={openModal1}
                                                onClose={handleCloseModal1}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box sx={style} alignItems={'center'} justifyContent={'space-between'}>
                                                    <HelpOutlineOutlinedIcon sx={{ fontSize: 40, marginLeft: 20 }} color="warning" alignItems={'center'} />
                                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                                        Are you sure to approve the KYC?
                                                    </Typography>
                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }} alignItems={'center'} >
                                                        <Button variant="contained" size="large" color="success" onClick={handleOKButtonClick} sx={{ marginLeft: 12, marginLeft: 20 }}>OK</Button>

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
                                                        Are you sure to Reject the KYC?
                                                    </Typography>
                                                    <TextareaAutosize
                                                        aria-label="minimum height"
                                                        minRows={10}
                                                        placeholder="Enter Rejection Reason"
                                                        style={{ width: 400 }}
                                                        value={rejectionReason}
                                                        onChange={handleTextareaChange}

                                                    />
                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }} alignItems={'center'} >
                                                        <Button variant="contained" size="large" color="success" onClick={handleOKButtonClick} sx={{ marginLeft: 12, marginLeft: 20 }}>OK</Button>

                                                    </Typography>

                                                </Box>
                                            </Modal>



                                        </StyledTableCell>
                                        <StyledTableCell style={{ whiteSpace: "nowrap" }}>{row.rejection_reason}</StyledTableCell>





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
                        rowsPerPageOptions={{}}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Grid>

                <Grid
                    container
                // sx={{ background: "#FFF" }}
                >



                </Grid>
            </Grid>
        </main>
    )
}
export default KycTransactions;