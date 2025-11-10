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

const FeedbackTransactions = ({ showServiceTrans }) => {




    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [
            ...showServiceTrans
        ];
    } else {
        rows = [];
    }

    // console.log(rows);

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
            background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
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
            (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.last_name && row.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
            (row.usermobile && row.usermobile.includes(searchTerm)) ||
            (row.category_name && row.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.reason_name && row.reason_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.mobile && row.mobile.toLowerCase().includes(searchTerm.toLowerCase()))

            // Add conditions for other relevant columns
        );
    });



    const [openModal1, setOpenModal1] = React.useState(false);
    const [openModal2, setOpenModal2] = React.useState(false);
    const [openModal3, setOpenModal3] = React.useState(false);
    const [Id, setId] = React.useState(null);
    const [status, setStatus] = React.useState(null);
    // const [rejectionReason, setRejectionReason] = useState(null);

    const handleOpenModal1 = (Id, status) => {
        setId(Id);
        setStatus(status);
        setOpenModal1(true);
    };

    const handleOpenModal3 = (Id, status) => {
        setId(Id);
        setStatus(status);
        setOpenModal3(true);
    };

    const handleCloseModal1 = () => {
        setId(null);
        setStatus(null);
        setOpenModal1(false);
    };

    const handleOpenModal2 = (Id, status) => {
        setId(Id);
        setStatus(status);
        setOpenModal2(true);
    };

    const handleCloseModal2 = () => {
        setOpenModal2(false);
    };

    const handleCloseModal3 = () => {
        setOpenModal3(false);
    };

    const handleOKButtonClick = async () => {
        // alert(status);
        if (!Id) {
            console.error('Id is missing.');
            return;
        }
        let action = '';
        if (status === 0) {
            action = 'Delete';
        } else if (status === 1) {
            action = 'Resolve';
        } else if (status === 2) {
            action = 'Hold';
        }
        else if (status === 3) {
            action = 'Pending';
        }

        const requestData = {
            status: status,
            id: Id,
            action: action
        };

        try {

            const response = await api.post("/api/feedback/update-feedback", requestData);

            if (response.data.status === 200) {
                alert('Status Update Successfully');
                location.reload();

            } else {
                console.log('Failed to update status.');

            }

        } catch (error) {
            console.error("Error:", error);

        }

        handleCloseModal1();
        handleCloseModal2();
        handleCloseModal3();
    };

    const handleLinkClick = (img) => {
        window.open(img, '_blank', 'noopener,noreferrer');
    };


    return (

        <main className="p-6 space-y-6">
            <Grid
                container
                spacing={4}
                sx={{ padding: '0px 16px' }}
            >
                <Grid item={true} xs={12}   >





                    <TableContainer component={Paper}>


                        <Table aria-label="Otp Report">

                            <TableHead>
                                <TableRow>


                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Sl No.</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>User Name</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>User.Id</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Mobile</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>category Name</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Reason Name</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>mobile</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Image</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Problem Description</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Created Date</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Status</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Action</StyledTableCell>


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

                                        <StyledTableCell>{index + 1 + page * rowsPerPage}</StyledTableCell>
                                        <StyledTableCell>{row.first_name + ' ' + row.last_name}</StyledTableCell>
                                        <StyledTableCell>{row.mlm_id}</StyledTableCell>
                                        <StyledTableCell>{row.usermobile}</StyledTableCell>
                                        <StyledTableCell>{row.category_name}</StyledTableCell>
                                        <StyledTableCell>{row.reason_name}</StyledTableCell>
                                        <StyledTableCell>{row.mobile}</StyledTableCell>

                                        <StyledTableCell> {row.img !== '' ? (
                                            <Link href="#" onClick={() => handleLinkClick(row.img)}>View Image</Link>
                                        ) : (
                                            ''
                                        )}
                                        </StyledTableCell>
                                        <StyledTableCell>{row.problem_description}</StyledTableCell>
                                        <StyledTableCell>{row.feedback_date}</StyledTableCell>


                                        <StyledTableCell style={{
                                            color: row.status === 1 ? 'Green' : row.status === 2 ? 'Orange' :
                                                row.status === 3 ? 'Blue' : 'Red'
                                        }} >
                                            {row.status === 1 ? 'Resolved' :
                                                row.status === 2 ? 'Hold' :
                                                    row.status === 3 ? 'Pending' :
                                                        'Delete'}
                                        </StyledTableCell>


                                        <StyledTableCell sx={{ '& button': { m: 1 } }}>
                                            {row.status === 0 ? null : (
                                                <>
                                                    {row.status === 3 && (
                                                        <>
                                                            <Button variant="contained" size="small" color="success" onClick={() => handleOpenModal1(row.id, 1)}>
                                                                Resolve
                                                            </Button>
                                                            <Button variant="contained" size="small" color="warning" onClick={() => handleOpenModal2(row.id, 2)}>
                                                                Hold
                                                            </Button>
                                                        </>
                                                    )}
                                                    {/* {row.status === 1 && (
                                                    <Button variant="contained" size="small" color="error" onClick={() => handleOpenModal3(row.id, 0)}>
                                                    Delete
                                                    </Button>
                                                )} */}
                                                    {row.status === 2 && (
                                                        <>
                                                            <Button variant="contained" size="small" color="success" onClick={() => handleOpenModal1(row.id, 1)}>
                                                                Resolve
                                                            </Button>
                                                            {/* <Button variant="contained" size="small" color="error" onClick={() => handleOpenModal3(row.id, 0)}>
                                                        Delete
                                                    </Button> */}
                                                        </>
                                                    )}
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
                                                        Are you sure this Ticket is resolved?
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
                                                        Are you sure you want to Hold this Ticket?
                                                    </Typography>
                                                    {/* <TextareaAutosize 
                                                            aria-label="minimum height" 
                                                            minRows={10} 
                                                            placeholder="Enter Rejection Reason" 
                                                            style={{ width: 400}} 
                                                            value={rejectionReason}
                                                          
                                                    /> */}
                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }} alignItems={'center'} >
                                                        <Button variant="contained" size="large" color="success" onClick={handleOKButtonClick} sx={{ marginLeft: 12, marginLeft: 20 }}>OK</Button>

                                                    </Typography>

                                                </Box>
                                            </Modal>


                                            <Modal
                                                open={openModal3}
                                                onClose={handleCloseModal3}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box sx={style} alignItems={'center'} justifyContent={'space-between'}>
                                                    <HelpOutlineOutlinedIcon sx={{ fontSize: 40, marginLeft: 20 }} color="warning" alignItems={'center'} />
                                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                                        Are you sure you want to delete this Ticket?
                                                    </Typography>
                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }} alignItems={'center'} >
                                                        <Button variant="contained" size="large" color="success" onClick={handleOKButtonClick} sx={{ marginLeft: 12, marginLeft: 20 }}>OK</Button>

                                                    </Typography>

                                                </Box>
                                            </Modal>



                                        </StyledTableCell>





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
export default FeedbackTransactions;