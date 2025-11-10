"use client";
import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  TableContainer,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { callAlert } from "../../redux/actions/alert";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Dashboard/User/idCardDetails";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";

function TransactionHistory() {
  const dispatch = useDispatch();
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMasterReport, setShowMasterReport] = useState({});
  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());
  const [totalPageCount, setTotalPageCount] = useState(0);

  // Fetch data
  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };
      try {
        const response = await api.post("/api/report/idcard-request-report", reqData);
        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
          setShowMasterReport(response.data.report);
          setTotalPageCount(response.data.totalPageCount);
        }
      } catch (error) {
        dispatch(
          callAlert({
            message: error?.response?.data?.error || error.message,
            type: "FAILED",
          })
        );
      }
    };
    getTnx();
  }, [fromDate, toDate, dispatch]);

  const filteredRows = showServiceTrans.filter((row) => {
    return (
      (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm)) ||
      (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const cardData = [
    {
      label: "Total Requests",
      value: showMasterReport.totalRequestsCount ?? 0,
      color: "#FFC107",
    },
    {
      label: "Pending Requests",
      value: showMasterReport.totalPendingRequests ?? 0,
      color: "#5C6BC0",
    },
    {
      label: "Issue Requests",
      value: showMasterReport.totalIssueRequests ?? 0,
      color: "#26A69A",
    },
    {
      label: "Rejected Requests",
      value: showMasterReport.totalRejectedRequests_view ?? 0,
      color: "#EC407A",
    },
  ];

  return (
    <Layout>
      <Box sx={{ p: { xs: 1, md: 3 } }}>
        {/* ==== CARD SECTION ==== */}
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
          {cardData.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                sx={{
                  height: 100,
                  bgcolor: card.color,
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  boxShadow: 3,
                  width: "100%",
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  {card.value}
                </Typography>
                <Typography variant="body1">{card.label}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* ==== FILTER SECTION ==== */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            bgcolor: "#f8f9fa",
          }}
        >
          <Box
            display="flex"
            flexWrap={{ xs: "wrap", md: "nowrap" }}
            gap={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
              ID Card Request
            </Typography>

            <TextField
              size="small"
              placeholder="Search by name, mobile, or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: "action.active" }} />,
              }}
              sx={{ flex: 1, minWidth: { xs: "100%", md: 220 } }}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From Date"
                value={fromDate}
                format="DD-MM-YYYY"
                onChange={(newDate) => setFromDate(newDate)}
                slotProps={{
                  textField: { size: "small", sx: { minWidth: 150 } },
                }}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="To Date"
                value={toDate}
                format="DD-MM-YYYY"
                onChange={(newDate) => setToDate(newDate)}
                slotProps={{
                  textField: { size: "small", sx: { minWidth: 150 } },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Paper>

        {/* ==== TABLE SECTION ==== */}
        <TableContainer component={Paper}>
          <Transactions
            showServiceTrans={filteredRows}
            totalPageCount={totalPageCount}
            setTotalPageCount={setTotalPageCount}
          />
        </TableContainer>
      </Box>
    </Layout>
  );
}

export default withAuth(TransactionHistory);
