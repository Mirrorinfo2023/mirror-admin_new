import { Box, Button,Divider,TextField, Container, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import * as React from 'react';
import Link from "next/link";
import Cookies from "js-cookie";
import { ArrowBack } from "@mui/icons-material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';


const NotificationTransactions = ({ showServiceTrans }) => {
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

//     const filteredRows = rows.filter(row => {
// return (
//           (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//           (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
//           (row.mobile && row.mobile.includes(searchTerm)) ||
//           (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
//           (row        .sub_type && row.sub_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
//           (row.recharge_type && row.recharge_type.toLowerCase().includes(searchTerm.toLowerCase()))
//           // Add conditions for other relevant columns
//         );
//     });
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
                    <Grid>
                    {/* <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'left'}  mb={1} style={{width: '10%', float:'right'}} >
                            <Button variant="contained" href={`/add-new-notification/`}>
                               Add New
                            </Button>
                    </Box> */}
                    </Grid>
                    <TableContainer component={Paper} exportButton={true}>
                        
                        <Divider />
                        <Table aria-label="User Transaction Summary Table" exportButton={true}>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Sl No.</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>App Name</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Notification Type</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Title</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Body</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Image</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Date</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Status</StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: 'bold' }} nowrap>Action</StyledTableCell>

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
                                        <StyledTableCell>{row.app_name}</StyledTableCell> 
                                        <StyledTableCell>{row.notification_type}</StyledTableCell> 
                                        
                                        <StyledTableCell>{row.title}</StyledTableCell>
                                        <StyledTableCell>{row.body}</StyledTableCell>
                                        {/* <StyledTableCell>{row.image}</StyledTableCell> */}
                                        <StyledTableCell><Link href="#" onClick={() => handleLinkClick(row.image)}>View Image</Link></StyledTableCell>

                                        <StyledTableCell>{row.created_on}</StyledTableCell>


                                        <StyledTableCell style={{ color:row.status === 0 ? 'Blue' : 'Green' }} > {row.status === 0 ? 'Pending' : 'SUccess' }</StyledTableCell>
                                        <StyledTableCell sx={{ '& button': { m: 1 } }}>
                                    
                                        <Button variant="contained" size="small" color="success"  onClick={() => handleOpenModal1(row.id,1)}>Reshoot</Button> 
                                       
                                            

                                                


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
export default NotificationTransactions;