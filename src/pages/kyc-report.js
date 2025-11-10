"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import KycTransactions from "@/components/KycReport/KycReport";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

// Styled card
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  color: "#fff",
  borderRadius: "12px",
  height: 90, // reduced height
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "0px 3px 10px rgba(0,0,0,0.2)",
}));

function KycReport() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setMasterReport] = useState({
    totalKyc: 0,
    totalPendingKyc: 0,
    totalApprovedKyc: 0,
    totalRejectedKyc: 0,
  });
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

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
        const response = await api.post("/api/users/get-kyc-report", reqData);
        if (response.status === 200) {
          setShowServiceTrans(response.data.data || []);
          setMasterReport(response.data.report || {});
        }
      } catch (error) {
        const message =
          error?.response?.data?.error || error.message || "Something went wrong";
        dispatch(callAlert({ message, type: "FAILED" }));
      }
    };
    getTnx();
  }, [fromDate, toDate, dispatch]);

  const handleChange = (event) => setSelectedValue(event.target.value);

  // Filter logic
  const filteredRows = (showServiceTrans || []).filter((row) => {
    const matchSearch =
      (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm)) ||
      (row.pan_number && row.pan_number.includes(searchTerm)) ||
      (row.ifsc_code && row.ifsc_code.includes(searchTerm)) ||
      (row.nominee_name && row.nominee_name.includes(searchTerm)) ||
      (row.nominee_relation && row.nominee_relation.includes(searchTerm)) ||
      (row.account_number && row.account_number.includes(searchTerm));

    if (selectedValue === "") return matchSearch;
    return row.status !== undefined && row.status === parseInt(selectedValue) && matchSearch;
  });

  return (
    <Layout>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {/* Summary Cards */}
        <Grid
          container
          spacing={2}
          sx={{
            px: { xs: 1, sm: 3 }, // padding left-right
          }}
        >
          <Grid item xs={12} sm={6} md={3}>
            <Item sx={{ backgroundColor: "#FFC107" }}>
              <Typography variant="h6">{masterReport.totalKyc ?? 0}</Typography>
              <Typography variant="subtitle2">Total KYC</Typography>
            </Item>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Item sx={{ backgroundColor: "#5C6BC0" }}>
              <Typography variant="h6">
                {masterReport.totalPendingKyc ?? 0}
              </Typography>
              <Typography variant="subtitle2">Pending KYC</Typography>
            </Item>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Item sx={{ backgroundColor: "#26A69A" }}>
              <Typography variant="h6">
                {masterReport.totalApprovedKyc ?? 0}
              </Typography>
              <Typography variant="subtitle2">Approved KYC</Typography>
            </Item>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Item sx={{ backgroundColor: "#EC407A" }}>
              <Typography variant="h6">
                {masterReport.totalRejectedKyc ?? 0}
              </Typography>
              <Typography variant="subtitle2">Rejected KYC</Typography>
            </Item>
          </Grid>
        </Grid>

        {/* Filters Section */}
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ p: 2, mt: 2 }}>
            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="space-between"
              alignItems="center"
              gap={2}
            >
              <Typography variant="h6">KYC Report</Typography>

              <FormControl sx={{ minWidth: 140 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedValue}
                  label="Status"
                  onChange={handleChange}
                >
                  <MenuItem value="">Default</MenuItem>
                  <MenuItem value="0">Pending</MenuItem>
                  <MenuItem value="1">Approved</MenuItem>
                  <MenuItem value="2">Rejected</MenuItem>
                </Select>
              </FormControl>

              <TextField
                variant="outlined"
                placeholder="Search"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon
                      sx={{ mr: 1, color: "action.active", fontSize: 20 }}
                    />
                  ),
                }}
                sx={{
                  minWidth: { xs: "100%", sm: 180 },
                  "& .MuiInputBase-root": {
                    height: 34, // smaller input height
                  },
                }}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box display="flex" gap={1} alignItems="center">
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    format="DD-MM-YYYY"
                    onChange={(newDate) => setFromDate(newDate)}
                    slotProps={{ textField: { size: "small" } }}
                  />
                  <DatePicker
                    label="To Date"
                    value={toDate}
                    format="DD-MM-YYYY"
                    onChange={(newDate) => setToDate(newDate)}
                    slotProps={{ textField: { size: "small" } }}
                  />
                </Box>
              </LocalizationProvider>
            </Box>
          </TableContainer>
        </Grid>



      </Grid>
      <KycTransactions showServiceTrans={filteredRows} />
    </Layout>
  );
}

export default withAuth(KycReport);
