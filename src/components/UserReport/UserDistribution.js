import { Box, Button,Divider,TextField, Container, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
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

const UserDistributionTransactions = ({ showServiceTrans }) => {

    const getDate = (timeZone) => {
        const dateString = timeZone;
        const dateObject = new Date(dateString);

        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, "0");
        const day = String(dateObject.getDate()).padStart(2, "0");
        const hours = String(dateObject.getHours()).padStart(2, "0");
        const minutes = String(dateObject.getMinutes()).padStart(2, "0");

        // Determine if it's AM or PM
        const amOrPm = hours >= 12 ? "PM" : "AM";

        // Convert hours to 12-hour format
        const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);

        const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;
        const from_date=`01-${month}-${year}`;
        const to_date=`${day}-${month}-${year}`;
        return formattedDateTime;
    };


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
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
         [`&.${tableCellClasses.head}`]: {
            background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
            color: "white",
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

    const [from_date, setFromDate] = React.useState(dayjs(getDate.dateObject));
    const [to_date, setToDate] = React.useState(dayjs(getDate.dateObject));


    const [formattedDate, setFormattedDate] = useState('');

  


    return (

        <main className="p-6 space-y-6">
            <Grid
                container
                spacing={4}
                sx={{ padding: 2 }}
            >
                <Grid item={true} xs={12}   >





                    <TableContainer component={Paper}>
                        


                        <Table aria-label="Otp Report">

                            <TableHead>
                                <TableRow>

         
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Sl No.</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Registration Date</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>User Name</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Transaction Id</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Plan</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Opening Balance</StyledTableCell>
                                    
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Credit</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Debit</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Closing Balance</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Details</StyledTableCell>
                                    {/* <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Tran For</StyledTableCell> */}
                                    
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Level</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Income Date</StyledTableCell>
                                   
                                    
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                
                                {showServiceTrans.length > 0 ? (rowsPerPage > 0
                                    ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : rows
                                ).map((row, index) => (

                                    <StyledTableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >


                                        <StyledTableCell>{index + 1 + page * rowsPerPage}</StyledTableCell>
                                        <StyledTableCell>{row.registration_date}</StyledTableCell>
                                        <StyledTableCell>{row.name+' | '+ row.mlm_id +' | '+ row.mobile}</StyledTableCell> 
                                        <StyledTableCell>{row.transaction_id}</StyledTableCell>
                                        <StyledTableCell>{row.plan_name}</StyledTableCell>
                                        <StyledTableCell>{row.opening_balance}</StyledTableCell>
                                        <StyledTableCell>{row.credit}</StyledTableCell>
                                        <StyledTableCell>{row.debit}</StyledTableCell>
                                        <StyledTableCell>{row.closing_balance}</StyledTableCell>
                                        <StyledTableCell>{row.details}</StyledTableCell>
                                        {/* <StyledTableCell>{row.tran_for}</StyledTableCell> */}
                                        <StyledTableCell>{row.level}</StyledTableCell>
                                        
                                        <StyledTableCell>{row.income_date}</StyledTableCell>
                                            
                                            
                                        

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
export default UserDistributionTransactions;