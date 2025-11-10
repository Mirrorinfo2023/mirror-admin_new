"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import AffiliateTrackDetailsTransactions from "@/components/AffiliateLink/AffiliateTrackDetailsReport";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  TableContainer,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: "center",
  borderRadius: "10px",
  color: "#fff",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
}));

function AffiliateTrackDetailsHistory() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [masterReport, setMasterReport] = useState({}); // ✅ initialize as empty object
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs(currentDate));
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };
      try {
        const response = await api.post(
          "/api/affiliate_link/get-affiliate-user-track-report",
          reqData
        );
        if (response.status === 200) {
          setShowServiceTrans(response.data.data || []);
          setMasterReport(response.data.report || {}); // ✅ ensure object
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
      (row.first_name &&
        row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm)) ||
      (row.email &&
        row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.category_name &&
        row.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.link && row.link.includes(searchTerm)) ||
      (row.title && row.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <Layout>
      <Grid container spacing={2} sx={{ p: 2 }}>
        {/* Cards Row */}
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ mb: 2, textAlign: "center" }}
        >
          <Grid item xs={12} sm={5} md={3}>
            <Item sx={{ backgroundColor: "#FFC107", height: 90 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {masterReport?.totalAflr ?? 0}
              </Typography>
              <Typography variant="body2">Total Count</Typography>
            </Item>
          </Grid>

          <Grid item xs={12} sm={5} md={3}>
            <Item sx={{ backgroundColor: "#5C6BC0", height: 90 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {masterReport?.totalFollowUpAflr ?? 0}
              </Typography>
              <Typography variant="body2">Follow Up Done</Typography>
            </Item>
          </Grid>
        </Grid>

        {/* Filter Section */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              mb: 2,
              backgroundColor: "#f9f9f9",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Box
              display="flex"
              flexWrap={{ xs: "wrap", md: "nowrap" }}
              alignItems="center"
              justifyContent="space-between"
              gap={2}
            >
              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Affiliate User Track Details Report
              </Typography>

              {/* Search */}
              <TextField
                size="small"
                placeholder="Search by name, mobile, or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                sx={{ flex: 1, minWidth: 180 }}
              />

              {/* Dates */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="From"
                  value={fromDate}
                  format="DD-MM-YYYY"
                  onChange={(newDate) => setFromDate(newDate)}
                  slotProps={{
                    textField: { size: "small", sx: { minWidth: 130 } },
                  }}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="To"
                  value={toDate}
                  format="DD-MM-YYYY"
                  onChange={(newDate) => setToDate(newDate)}
                  slotProps={{
                    textField: { size: "small", sx: { minWidth: 130 } },
                  }}
                />
              </LocalizationProvider>
            </Box>
          </Paper>
        </Grid>

        {/* Table Section */}
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <AffiliateTrackDetailsTransactions showServiceTrans={filteredRows} />
          </TableContainer>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default withAuth(AffiliateTrackDetailsHistory);
