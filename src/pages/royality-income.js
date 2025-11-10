"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";

import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/IncomeReport/royality_income";

import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";

// ----------------------------------------------------------------------
// ✅ Reusable Stat Card Component
// ----------------------------------------------------------------------

const StatCard = styled(Paper)(({ theme }) => ({
  padding: "20px",
  borderRadius: "12px",
  height: 120,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.3s ease",
  cursor: "pointer",

  "&:hover": {
    transform: "translateY(-6px)",
  },
}));

const StatContent = styled("div")({
  textAlign: "center",
});

const StatValue = styled(Typography)({
  fontSize: "1.6rem",
  fontWeight: "bold",
});

const StatLabel = styled(Typography)({
  fontSize: "1rem",
  fontWeight: 500,
  marginTop: 6,
});

// ✅ Reusable Component
const StatCardItem = ({ value, label, color }) => (
  <StatCard
    sx={{
      backgroundColor: "#f5f5f5",
      borderLeft: `4px solid ${color}`,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",

      "&:hover": {
        backgroundColor: color,
        boxShadow: `0 8px 25px ${color}55`,
        "& .MuiTypography-root": {
          color: "white",
        },
      },
    }}
  >
    <StatContent>
      <StatValue>{value ?? 0}</StatValue>
      <StatLabel>{label}</StatLabel>
    </StatContent>
  </StatCard>
);

// ----------------------------------------------------------------------
// ✅ MAIN PAGE
// ----------------------------------------------------------------------

function TransactionHistory() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [report, setReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs(new Date()));

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const response = await api.post(
          "/api/report/royality-income-report",
          reqData
        );

        if (response.status === 200) {
          setShowServiceTrans(response.data.data || []);
          setReport(response.data.report || {});
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

    if (uid) getTnx();
  }, [uid, fromDate, toDate, dispatch]);

  const filteredRows = showServiceTrans.filter((row) =>
    row.royality_name
      ? row.royality_name.toLowerCase().includes(searchTerm.toLowerCase())
      : false
  );

  return (
    <Layout>
      <Box sx={{ p: 2 }}>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={3}>
            <StatCardItem
              value={report?.total_royalitygenerate}
              label="Total Royality Generate"
              color="#667eea"
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <StatCardItem
              value={report?.todays_royalityIncome}
              label="Today's Royality Income"
              color="#11998e"
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <StatCardItem
              value={report?.month_royalityIncome}
              label="Month Royality Income"
              color="#ff6b6b"
            />
          </Grid>
        </Grid>

        <Paper
          sx={{
            p: 2,
            mt: 4,
            backgroundColor: "#F3F6FB",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item xs={12} md={3}>
              <Typography variant="h5" fontWeight={600}>
                Royality Income
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                placeholder="Search by Name"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="From Date"
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue)}
                  format="DD-MM-YYYY"
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="To Date"
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                  format="DD-MM-YYYY"
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Paper>

      </Box>

      <Transactions showServiceTrans={filteredRows} />
    </Layout>
  );
}

export default withAuth(TransactionHistory);
