"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import RedeemTransactions from "@/components/RedeemReport/RedeemReport";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  TableContainer,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";

const StatCard = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: "#fff",
  borderRadius: "12px",
  height: 110, // smaller height
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(2),
  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
}));

function RedeemReport() {
  const dispatch = useDispatch();
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [report, setReport] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState(
    dayjs().startOf("month")
  );
  const [toDate, setToDate] = useState(dayjs());
  const uid = Cookies.get("uid");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const reqData = {
          from_date: fromDate.format("YYYY-MM-DD"),
          to_date: toDate.format("YYYY-MM-DD"),
        };
        const res = await api.post("/api/report/get-redeem-report", reqData);
        if (res.status === 200) {
          setShowServiceTrans(res.data.data || []);
          setReport(res.data.report || {});
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

    if (uid) fetchReport();
  }, [uid, fromDate, toDate, dispatch]);

  const filteredRows = showServiceTrans.filter((row) =>
    [row.first_name, row.last_name, row.mlm_id, row.mobile, row.category]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const cards = [
    {
      label: "Total Redeem Count",
      value: report?.total_redeemcount || 0,
      bg: "#FFC107",
    },
    {
      label: "Rejected Requests",
      value: report?.total_rejectedCount || 0,
      bg: "#5C6BC0",
    },
    {
      label: "Pending Requests",
      value: report?.total_pendingCount || 0,
      bg: "#26A69A",
    },
    {
      label: "Approved Requests",
      value: report?.total_approveCount || 0,
      bg: "#EC407A",
    },
  ];

  return (
    <Layout>
      <Box sx={{ p: 2 }}>
        {/* ---- Top Cards ---- */}
        <Grid container spacing={2}>
          {cards.map((card, idx) => (
            <Grid key={idx} item xs={12} sm={6} md={3}>
              <StatCard sx={{ backgroundColor: card.bg }}>
                <Typography variant="h4" fontWeight={700}>
                  {card.value}
                </Typography>
                <Typography variant="subtitle1">{card.label}</Typography>
              </StatCard>
            </Grid>
          ))}
        </Grid>

        {/* ---- Filters ---- */}
        <Paper sx={{ p: 2, mt: 4 }}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item xs={12} md={3}>
              <Typography variant="h5" fontWeight={600}>
                Redeem Report
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                placeholder="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
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

      
            <RedeemTransactions showServiceTrans={filteredRows} />
        
      </Box>
    </Layout>
  );
}

export default withAuth(RedeemReport);
