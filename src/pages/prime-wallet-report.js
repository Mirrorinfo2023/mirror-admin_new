"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Dashboard/User/prime";

const StatCard = styled(Paper)(({ theme }) => ({
  height: 100,
  borderRadius: 10,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  transition: "0.3s",
  "&:hover": {
    transform: "translateY(-3px)",
  },
}));

function TransactionHistory() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setMasterReport] = useState({});
  const dispatch = useDispatch();

  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs(currentDate));

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const response = await api.post("/api/report/prime-wallet-report", reqData);

        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
          setMasterReport(response.data.report);
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

  // Filter logic
  const filteredRows = showServiceTrans.filter((row) => {
    return (
      (row.first_name &&
        row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm)) ||
      (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.sub_type &&
        row.sub_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.transaction_id && row.transaction_id == searchTerm)
    );
  });

  return (
    <Layout>
      <Box sx={{ p: { xs: 1, md: 3 } }}>
        {/* ====== Stat Cards Row ====== */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard sx={{ background: "linear-gradient(45deg, #42a5f5, #478ed1)" }}>
              <Typography variant="h6">Opening Balance</Typography>
              <Typography variant="h5" fontWeight="bold">
                ₹{masterReport.OpeningBal ?? 0}
              </Typography>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard sx={{ background: "linear-gradient(45deg, #66bb6a, #43a047)" }}>
              <Typography variant="h6">Closing Balance</Typography>
              <Typography variant="h5" fontWeight="bold">
                ₹{masterReport.ClosingBal ?? 0}
              </Typography>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard sx={{ background: "linear-gradient(45deg, #ffa726, #fb8c00)" }}>
              <Typography variant="h6">Credit</Typography>
              <Typography variant="h5" fontWeight="bold">
                ₹{masterReport.Credit ?? 0}
              </Typography>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard sx={{ background: "linear-gradient(45deg, #ef5350, #e53935)" }}>
              <Typography variant="h6">Debit</Typography>
              <Typography variant="h5" fontWeight="bold">
                ₹{masterReport.Debit ?? 0}
              </Typography>
            </StatCard>
          </Grid>
        </Grid>

        {/* ====== Filters Row ====== */}
        <Paper sx={{ p: 2, mt: 3, mb: 2 }}>
          <Box
            display="flex"
            flexWrap={{ xs: "wrap", md: "nowrap" }}
            alignItems="center"
            justifyContent="space-between"
            gap={2}
          >
            {/* Left: Title */}
            <Typography
              variant="h6"
              sx={{
                minWidth: "fit-content",
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              User Prime Wallet Report
            </Typography>

            {/* Right: Filters */}
            <Box
              display="flex"
              flexWrap={{ xs: "wrap", md: "nowrap" }}
              alignItems="center"
              gap={2}
              flex={1}
              justifyContent={{ xs: "flex-start", md: "flex-end" }}
            >
              <TextField
                size="small"
                placeholder="Search by name, mobile, or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "action.active", fontSize: 20 }} />
                  ),
                }}
                sx={{ width: { xs: "100%", sm: 200, md: 220 } }}
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
          </Box>
        </Paper>

        {/* ====== Transaction Table ====== */}
      </Box>
        <Transactions showServiceTrans={filteredRows} />
    </Layout>
  );
}

export default withAuth(TransactionHistory);
