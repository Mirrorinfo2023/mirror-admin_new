"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/BillPayment/bill_payment_hold";
import {
  Grid,
  Paper,
  TableContainer,
  Typography,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";

function TransactionHistory() {
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs(new Date()));

  const getTnx = async () => {
    const reqData = {
      from_date: fromDate.toISOString().split("T")[0],
      to_date: toDate.toISOString().split("T")[0],
    };
    try {
      const response = await api.post("/api/report/bill-payment-hold-report", reqData);
      if (response.status === 200) {
        setShowServiceTrans(response.data.data);
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

  useEffect(() => {
    if (uid) getTnx();
  }, [uid, fromDate, toDate]);

  const filteredRows = showServiceTrans.filter((row) => {
    const search = searchTerm.toLowerCase();
    return (
      row.first_name?.toLowerCase().includes(search) ||
      row.last_name?.toLowerCase().includes(search) ||
      row.mlm_id?.includes(searchTerm) ||
      row.mobile?.includes(searchTerm) ||
      row.email?.toLowerCase().includes(search)
    );
  });

  return (
    <Layout>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          {/* 🔹 Filter Box */}
          <TableContainer
            component={Paper}
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
              backgroundColor: "#fafafa",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              {/* Title */}
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  flex: { xs: "1 1 100%", md: "0 0 auto" },
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Bill Payment Hold List
              </Typography>

              {/* Search */}
              <TextField
                placeholder="Search..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "gray" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: { xs: "100%", sm: 220 },
                  flex: { xs: "1 1 100%", md: "0 0 auto" },
                }}
              />

              {/* Date Pickers */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    flexWrap: "nowrap",
                    width: { xs: "100%", md: "auto" },
                    justifyContent: "flex-end",
                  }}
                >
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    format="DD-MM-YYYY"
                    onChange={(date) => setFromDate(date)}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                  <DatePicker
                    label="To Date"
                    value={toDate}
                    format="DD-MM-YYYY"
                    onChange={(date) => setToDate(date)}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </Box>
          </TableContainer>
        </Grid>

        {/* 🔹 Transactions List */}
        <Grid item xs={12}>
          <Transactions showServiceTrans={filteredRows} />
        </Grid>
      </Grid>
    </Layout>
  );
}

export default withAuth(TransactionHistory);
