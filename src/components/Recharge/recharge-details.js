"use client";
import React from "react";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Divider,
  Grid,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import TableCellClasses from "@mui/material/TableCell"; 
import { tableCellClasses } from "@mui/material/TableCell";

const Transactions = ({ showServiceTrans }) => {
  const rows = showServiceTrans || [];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  // FIXED StyledTableCell
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      background: "#2198f3",
      color: "white",
      fontSize: 12,
      padding: 7,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      padding: 7,
    },
  }));

  // FIXED StyledTableRow
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  }));

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Divider />

            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Sl No.</StyledTableCell>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>User ID</StyledTableCell>
                  <StyledTableCell>Consumer Number</StyledTableCell>
                  <StyledTableCell>Operator</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Reference No.</StyledTableCell>
                  <StyledTableCell>Tranx Id</StyledTableCell>
                  <StyledTableCell>Transaction No.</StyledTableCell>
                  <StyledTableCell>Amount</StyledTableCell>
                  <StyledTableCell>Debit</StyledTableCell>
                  <StyledTableCell>Cashback</StyledTableCell>
                  <StyledTableCell>Prime Cashback</StyledTableCell>
                  <StyledTableCell>IP</StyledTableCell>
                  <StyledTableCell>API</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.length > 0 ? (
                  (rowsPerPage > 0
                    ? rows.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : rows
                  ).map((row, index) => (
                    <StyledTableRow key={index}>
                      {/* Sl No */}
                      <StyledTableCell>{index + 1 + page * rowsPerPage}</StyledTableCell>

                      {/* Date */}
                      <StyledTableCell>
                        {new Date(row.created_on).toLocaleString()}
                      </StyledTableCell>

                      {/* User ID */}
                      <StyledTableCell>{row.user_id}</StyledTableCell>

                      {/* Consumer Number */}
                      <StyledTableCell>{row.ConsumerNumber}</StyledTableCell>

                      {/* Operator (API me nahi hai) */}
                      <StyledTableCell>-</StyledTableCell>

                      {/* Recharge Status */}
                      <StyledTableCell
                        style={{
                          color:
                            row.recharge_status === "SUCCESS"
                              ? "green"
                              : row.recharge_status === "FAILURE"
                              ? "red"
                              : "orange",
                        }}
                      >
                        {row.recharge_status}
                      </StyledTableCell>

                      {/* Reference No (no API) */}
                      <StyledTableCell>-</StyledTableCell>

                      {/* Tranx Id */}
                      <StyledTableCell>{row.transaction_id}</StyledTableCell>

                      {/* Transaction No */}
                      <StyledTableCell>{row.trax_id || "-"}</StyledTableCell>

                      {/* Amount */}
                      <StyledTableCell>{row.amount}</StyledTableCell>

                      {/* Debit */}
                      <StyledTableCell>{row.main_amount}</StyledTableCell>

                      {/* Cashback */}
                      <StyledTableCell>{row.cashback_amount}</StyledTableCell>

                      {/* Prime Cashback */}
                      <StyledTableCell>{row.service_amount}</StyledTableCell>

                      {/* IP (no API) */}
                      <StyledTableCell>-</StyledTableCell>

                      <StyledTableCell>-</StyledTableCell>

                      {/* Description */}
                      <StyledTableCell>{row.description}</StyledTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={16}>
                      <Typography
                        color="error"
                        textAlign="center"
                        sx={{ padding: 2 }}
                      >
                        No Records Found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Grid>
      </Grid>
    </main>
  );
};
export default Transactions;
