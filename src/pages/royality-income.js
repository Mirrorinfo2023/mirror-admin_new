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
  TableContainer,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const Item = styled(Paper)(({ theme }) => ({
  background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)", // ✅ card background
  border: "1px solid #90CAF9",
  borderRadius: "12px",
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.primary,
  height: 120,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 4px 20px rgba(33,150,243,0.25)",
  },
}));

const getDate = (timeZone) => {
  const dateObject = new Date(timeZone);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");
  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);
  return `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;
};

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
          setShowServiceTrans(response.data.data);
          setReport(response.data.report);
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
        {/* --- Report Cards Section --- */}
        <Grid container spacing={2}>
          {[
            {
              label: "Total Royality Generate",
              value: report?.total_royalitygenerate || 0,
            },
            {
              label: "Today's Royality Income",
              value: report?.todays_royalityIncome || 0,
            },
            {
              label: "Month Royality Income",
              value: report?.Month_royalityIncome || 0,
            },
          ].map((item, index) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <Item>
                <Typography
                  variant="h5"
                  sx={{ color: "#1565C0", fontWeight: 700 }}
                >
                  ₹{item.value}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 1, fontSize: 16, color: "#0D47A1" }}
                >
                  {item.label}
                </Typography>
              </Item>
            </Grid>
          ))}
        </Grid>

        {/* --- Filters Section --- */}
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

        {/* --- Table Section --- */}



      </Box>
      <Transactions showServiceTrans={filteredRows} />
    </Layout>
  );
}

export default withAuth(TransactionHistory);
