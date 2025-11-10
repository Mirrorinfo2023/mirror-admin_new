"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/BillPayment/billPayment";
import {
  Grid,
  Paper,
  TableContainer,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";

function TransactionHistory() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs(new Date()));
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const response = await api.post("api/report/bill-payment-report", reqData);
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

    if (uid) getTnx();
  }, [uid, fromDate, toDate, dispatch]);

  const filteredRows = showServiceTrans.filter((row) => {
    const search = searchTerm.toLowerCase();
    if (selectedValue) {
      return row.operator_name?.toLowerCase().includes(selectedValue.toLowerCase());
    }
    return (
      row.first_name?.toLowerCase().includes(search) ||
      row.mlm_id?.includes(searchTerm) ||
      row.mobile?.includes(searchTerm) ||
      row.consumer_name?.toLowerCase().includes(search) ||
      row.operator_name?.toLowerCase().includes(search) ||
      row.reference_no?.includes(searchTerm) ||
      row.trax_id?.toLowerCase().includes(search) ||
      row.transaction_id?.includes(searchTerm) ||
      row.biller_id?.includes(searchTerm)
    );
  });

  return (
    <Layout>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#fafafa",
              boxShadow: "0px 1px 4px rgba(0,0,0,0.1)",
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
                Bill Payment Report
              </Typography>

              {/* Operator Dropdown */}
              <FormControl
                sx={{
                  minWidth: { xs: "100%", sm: 180 },
                  flex: { xs: "1 1 100%", md: "0 0 auto" },
                }}
                size="small"
              >
                <InputLabel>Operator</InputLabel>
                <Select
                  value={selectedValue}
                  label="Operator"
                  onChange={(e) => setSelectedValue(e.target.value)}
                >
                  <MenuItem value="">All Operators</MenuItem>
                  <MenuItem value="Airtel">Airtel</MenuItem>
                  <MenuItem value="Bsnl">BSNL</MenuItem>
                  <MenuItem value="Jio">Jio</MenuItem>
                  <MenuItem value="Vodafone Idea">Vodafone Idea</MenuItem>
                  <MenuItem value="Tata Play">Tata Play</MenuItem>
                </Select>
              </FormControl>

              {/* Search Box */}
              <TextField
                placeholder="Search..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
                }}
                sx={{
                  width: { xs: "100%", sm: 200 },
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
                    flex: { xs: "1 1 100%", md: "0 0 auto" },
                    width: { xs: "100%", md: "auto" },
                  }}
                >
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    format="DD-MM-YYYY"
                    onChange={(date) => setFromDate(date)}
                    slotProps={{ textField: { size: "small", fullWidth: true } }}
                  />
                  <DatePicker
                    label="To Date"
                    value={toDate}
                    format="DD-MM-YYYY"
                    onChange={(date) => setToDate(date)}
                    slotProps={{ textField: { size: "small", fullWidth: true } }}
                  />
                </Box>
              </LocalizationProvider>
            </Box>
          </TableContainer>
        </Grid>
      </Grid>

      <Transactions showServiceTrans={filteredRows} />
    </Layout>
  );
}

export default withAuth(TransactionHistory);
