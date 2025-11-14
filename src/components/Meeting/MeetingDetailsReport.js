import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { useState } from "react";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import * as React from "react";
import dayjs from "dayjs";
import Link from "next/link";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// Dummy data for copy-paste

const MeetingDetailsTransactions = ({ showServiceTrans }) => {
  const [searchTerm, setSearchTerm] = useState("");


  const data = Array.isArray(showServiceTrans) && showServiceTrans.length > 0
    ? showServiceTrans
    : [];

  // Filter rows by search term (name or description)
  const filteredRows = data.filter(row =>
    row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rowsPerPageOptions = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const onPageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleGenerateReport = () => {
    alert('Report generation will be implemented here');
  };

  const handleLinkClick = (img) => {
    window.open(img, "_blank", "noopener,noreferrer");
  };

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

  const [formattedDate, setFormattedDate] = useState("");

  const [from_date, setFromDate] = React.useState(dayjs(getDate.dateObject));
  const [to_date, setToDate] = React.useState(dayjs(getDate.dateObject));

  const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
    background: "#fff",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderTop: "1px solid #e0e0e0",
    marginTop: 0,
    ".MuiTablePagination-select": {
      color: "#2196f3",
      fontWeight: 600,
      paddingRight: "24px",
    },
    ".MuiTablePagination-selectLabel": {
      color: "#666",
      fontWeight: 500,
    },
    ".MuiTablePagination-displayedRows": {
      color: "#666",
      fontWeight: 500,
    },
    ".MuiTablePagination-actions": {
      ".MuiIconButton-root": {
        color: "#2196f3",
        "&:hover": {
          backgroundColor: "rgba(33, 150, 243, 0.08)",
        },
        "&.Mui-disabled": {
          color: "#ccc",
        },
      },
    },
    ".MuiTablePagination-selectIcon": {
      color: "#2196f3",
    },
    ".MuiTablePagination-menuItem": {
      padding: "4px 16px",
    },
    ".MuiTablePagination-selectRoot": {
      marginRight: "32px",
    },
    ".MuiTablePagination-toolbar": {
      minHeight: "52px",
      padding: "0 16px",
      flexWrap: "wrap",
      gap: "4px",
    },
    ".MuiTablePagination-spacer": {
      flex: "none",
    },
  }));
 const GradientTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    background: "#2198f3",
    color: "#fff",
    fontWeight: 700,
    fontSize: 11,
    whiteSpace: "nowrap",
    padding: 8,
    borderRight: "1px solid rgba(255,255,255,0.3)",
    borderBottom: "2px solid rgba(255,255,255,0.4)",
    borderTop: "1px solid rgba(255,255,255,0.2)",
    borderLeft: "1px solid rgba(255,255,255,0.2)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  "&:first-of-type": {
    borderTopLeftRadius: 14,
    borderLeft: "1px solid rgba(255,255,255,0.2)",
  },
  "&:last-of-type": {
    borderTopRightRadius: 14,
    borderRight: "1px solid rgba(255,255,255,0.2)",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    padding: 10,
    borderRight: "1px solid #e0e0e0",
    borderBottom: "1px solid #e0e0e0",
    borderLeft: "1px solid #e0e0e0",
    "&:first-of-type": {
      borderLeft: "1px solid #e0e0e0",
    },
    "&:last-of-type": {
      borderRight: "1px solid #e0e0e0",
    },
  },
}));
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#ccc",
      color: theme.palette.common.black,
      fontSize: 12,
      linHeight: 15,
      padding: 7,
      borderRight: "1px solid rgba(224, 224, 224, 1)",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      linHeight: 15,
      padding: 7,
      borderRight: "1px solid rgba(224, 224, 224, 1)",
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={4} sx={{ padding: "0px 16px" }}>
        <Grid item={true} xs={12}>
          {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <TextField
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              size="small"
              sx={{ width: '250px' }}
            />
            <Button variant="contained" color="primary" onClick={handleGenerateReport}>
              Generate Report
            </Button>
          </Box> */}
          <TableContainer component={Paper} sx={{ borderRadius: 3, mb: 0, marginBottom: 4 }}>
            <Table aria-label="Meeting Report">
              <TableHead>
                <TableRow>
                  <GradientTableCell nowrap>Sl No.</GradientTableCell>
                  <GradientTableCell nowrap>Name</GradientTableCell>
                  <GradientTableCell nowrap>Description</GradientTableCell>
                  <GradientTableCell nowrap>Meeting Date</GradientTableCell>
                  <GradientTableCell nowrap>Meeting Time</GradientTableCell>
                  <GradientTableCell nowrap>Meeting Link</GradientTableCell>
                  <GradientTableCell nowrap>Image</GradientTableCell>
                  <GradientTableCell nowrap>User Name</GradientTableCell>
                  <GradientTableCell nowrap>User Id</GradientTableCell>
                  <GradientTableCell nowrap>Mobile</GradientTableCell>
                  <GradientTableCell nowrap>Email</GradientTableCell>
                  <GradientTableCell nowrap>Is Enroll</GradientTableCell>
                  <GradientTableCell nowrap>Is Invite</GradientTableCell>
                  <GradientTableCell nowrap>Is Join</GradientTableCell>
                  <GradientTableCell nowrap>
                    Meeting Created Date
                  </GradientTableCell>
                  <GradientTableCell nowrap>
                    Meeting Enroll Date
                  </GradientTableCell>
                  <GradientTableCell nowrap>Status</GradientTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.length > 0 ? (
                  (rowsPerPage > 0
                    ? filteredRows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    : filteredRows
                  ).map((row, index) => (
                    <StyledTableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <GradientTableCell>
                        {index + 1 + page * rowsPerPage}
                      </GradientTableCell>
                      <GradientTableCell>{row.name}</GradientTableCell>
                      <GradientTableCell>{row.description}</GradientTableCell>
                      <GradientTableCell>{row.meeting_date}</GradientTableCell>
                      <GradientTableCell>{row.meeting_time}</GradientTableCell>
                      <GradientTableCell>
                        <Link
                          href="#"
                          onClick={() => handleLinkClick(row.meeting_link)}
                        >
                          View Link
                        </Link>
                      </GradientTableCell>
                      <GradientTableCell>
                        <Link
                          href="#"
                          onClick={() => handleLinkClick(row.image)}
                        >
                          View Image
                        </Link>
                      </GradientTableCell>
                      <GradientTableCell>
                        {row.first_name + " " + row.last_name}
                      </GradientTableCell>
                      <GradientTableCell>{row.mlm_id}</GradientTableCell>
                      <GradientTableCell>{row.mobile}</GradientTableCell>
                      <GradientTableCell>{row.email}</GradientTableCell>
                      <GradientTableCell
                        style={{ color: row.is_enroll === 1 ? "Green" : "Red" }}
                      >
                        {row.is_enroll === 1 ? "Enroll" : "Not Enroll"}
                      </GradientTableCell>
                      <GradientTableCell
                        style={{ color: row.is_invite === 1 ? "Green" : "Red" }}
                      >
                        {row.is_invite === 1 ? "Invite" : "Not Invite"}
                      </GradientTableCell>
                      <GradientTableCell
                        style={{ color: row.is_join === 1 ? "Green" : "Red" }}
                      >
                        {row.is_join === 1 ? "Join" : "Not Join"}
                      </GradientTableCell>
                      <GradientTableCell>
                        {row.meeting_created_date}
                      </GradientTableCell>
                      <GradientTableCell>
                        {row.meeting_enroll_date}
                      </GradientTableCell>
                      <GradientTableCell
                        style={{
                          color: row.meeting_status === 1 ? "Green" : "Red",
                        }}
                      >
                        {row.meeting_status === 1 ? "Active" : "Inactive"}
                      </GradientTableCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={17}
                      align="center"
                      style={{
                        background: "#fff",
                        borderBottomLeftRadius: 18,
                        borderBottomRightRadius: 18,
                        height: 120,
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                      >
                        <InfoOutlinedIcon
                          sx={{ color: "red", fontSize: 28, mr: 1 }}
                        />
                        <Typography
                          color="error"
                          fontWeight="bold"
                          fontSize={18}
                        >
                          No Records Found.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <StyledTablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
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
};
export default MeetingDetailsTransactions;
