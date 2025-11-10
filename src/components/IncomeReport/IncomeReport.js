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

const IncomeTransactions = ({ showServiceTrans }) => {

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
    const from_date = `01-${month}-${year}`;
    const to_date = `${day}-${month}-${year}`;
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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = rows.filter(row => {
    return (
      (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm)) ||
      (row.transaction_id && row.transaction_id.includes(searchTerm)) ||
      (row.type && row.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.tran_for && row.tran_for.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.details && row.details.toLowerCase().includes(searchTerm.toLowerCase()))

    );
  });


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
        border: "1px solid #000000",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      linHeight: 15,
      padding: 7,
      border: "1px solid #000000"
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
    let note = '';
    let action = '';
    if (status === 0) {
      // note = 'Approve';
      action = 'Delete';
    } else if (status === 1) {
      // note = rejectionReason; 
      action = 'Resolve';
    }
    else if (status === 3) {
      // note = rejectionReason; 
      action = 'Hold';
    }
    else {
      // note='';
      action = 'Pending';
    }

    const requestData = {
      status: status,
      //   note: note,
      id: Id,
      action: action
    };


    try {

      const response = await api.post("/api/feedback/update-feedback", requestData);

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
    handleCloseModal3();
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
              maxHeight: 320, // 👈 sets max visible height for the table
              overflowY: 'auto', // enables vertical scrolling
              overflowX: 'auto', // enables horizontal scrolling if needed
              borderRadius: 2,
            }}
          >
            <Table stickyHeader aria-label="Income Report Table">

              <TableHead>
                <TableRow>

                  <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} >Sl No.</StyledTableCell>
                  <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} >Registration Date</StyledTableCell>
                  <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} >User Name</StyledTableCell>
                  <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} >User. Id</StyledTableCell>
                  <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} >Mobile</StyledTableCell>
                  <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} >Transaction Id</StyledTableCell>
                  <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} >Type</StyledTableCell>
                  <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} >Income Type</StyledTableCell>
                  <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} >Transaction For</StyledTableCell>
                  <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} >Plan Name</StyledTableCell>
                  <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} >Details</StyledTableCell>
                  <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} >Level</StyledTableCell>
                  <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} >Opening Balance</StyledTableCell>
                  <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} >Credit</StyledTableCell>
                  <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} >Debit</StyledTableCell>
                  <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} >Closing Balance</StyledTableCell>
                  <StyledTableCell style={{ fontWeight: 'bold', whiteSpace: "nowrap" }} >Income Date</StyledTableCell>


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

                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>{index + 1 + page * rowsPerPage}</StyledTableCell>
                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>{row.registration_date}</StyledTableCell>
                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>{row.name}</StyledTableCell>
                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>{row.mlm_id}</StyledTableCell>
                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>{row.mobile}</StyledTableCell>
                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>{row.transaction_id}</StyledTableCell>
                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>{row.type}</StyledTableCell>
                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>{row.sub_type}</StyledTableCell>
                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>{row.tran_for}</StyledTableCell>
                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>{row.plan_name}</StyledTableCell>
                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>{row.details}</StyledTableCell>
                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>{row.level}</StyledTableCell>
                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>{row.opening_balance}</StyledTableCell>
                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>{row.credit}</StyledTableCell>
                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>{row.debit}</StyledTableCell>
                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>{row.closing_balance}</StyledTableCell>
                    <StyledTableCell sx={{ whiteSpace: "nowrap" }}>{row.income_date}</StyledTableCell>




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
export default IncomeTransactions;