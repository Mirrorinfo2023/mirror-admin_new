"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import FeedbackTransactions from "@/components/Feedback/FeedbackReport";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import FeedbackIcon from "@mui/icons-material/Feedback";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { styled } from "@mui/material/styles";
import { DataDecrypt, DataEncrypt } from "../../utils/encryption";
const StatCard = styled(Paper)(({ bgcolor }) => ({
  background: bgcolor,
  color: "#fff",
  borderRadius: 12,
  padding: "28px 36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minWidth: 280,
  minHeight: 100,
  position: "relative",
  overflow: "hidden",
  marginRight: 24,
}));
const StatContent = styled("div")({
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});
const StatValue = styled("div")({
  fontSize: 32,
  fontWeight: 700,
  lineHeight: 1.1,
  marginBottom: 4,
});
const StatLabel = styled("div")({
  fontSize: 12,
  fontWeight: 500,
  opacity: 0.85,
  letterSpacing: 1,
  textTransform: "uppercase",
});
const StatIcon = styled("div")({
  position: "absolute",
  right: 24,
  top: "50%",
  transform: "translateY(-50%)",
  opacity: 0.18,
  fontSize: 64,
  zIndex: 1,
});
const FilterRow = styled(Box)(() => ({
  background: "#f5faff",
  borderRadius: 12,
  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  gap: 20,
  marginBottom: 10,
  flexWrap: "nowrap",
  justifyContent: "space-between",
}));

const getDate = (timeZone) => {
  const dateString = timeZone;
  const dateObject = new Date(dateString);

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");

  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);

  return `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;
};

function FeedbackReport() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setMasterReport] = useState({});
  const dispatch = useDispatch();

  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs()); // default to current date

  useEffect(() => {
    const getTnx = async () => {

      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      // 🔹 Encrypt request payload
      try {
        // 🔹 Encrypt request payload
        const encryptedPayload = DataEncrypt(JSON.stringify(reqData));

        const response = await api.post("/api/feedback/get-feedback-report", { data: encryptedPayload });

        if (response.status === 200 && response.data?.data) {
          // 🔹 Decrypt response
          const decryptedResp = DataDecrypt(response.data.data);

          if (decryptedResp.status === 200) {
            setShowServiceTrans(decryptedResp.data || []);
            setMasterReport(decryptedResp.report || {});
          } else {
            console.log(decryptedResp.message || "Failed to fetch feedback report");
          }
        }
      } catch (error) {
        console.log(error?.response?.data?.error || error.message);
      }
    };

    if (fromDate || toDate) getTnx();
  }, [fromDate, toDate, dispatch]);

  const [selectedValue, setSelectedValue] = useState("");

  const filteredRows = showServiceTrans.filter((row) => {
    const matchesStatus =
      selectedValue !== "" ? row.status === parseInt(selectedValue) : true;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (row.first_name && row.first_name.toLowerCase().includes(term)) ||
      (row.last_name && row.last_name.toLowerCase().includes(term)) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.usermobile && row.usermobile.includes(searchTerm)) ||
      (row.category_name &&
        row.category_name.toLowerCase().includes(term)) ||
      (row.reason_name && row.reason_name.toLowerCase().includes(term)) ||
      (row.mobile && row.mobile.toLowerCase().includes(term));

    return matchesStatus && matchesSearch;
  });

  return (
    <Layout>
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "center",
              mb: 1,
            }}
          >
            <StatCard bgcolor="#FFC107">
              <StatContent>
                <StatValue>{masterReport.totalFeedbackCount ?? 0}</StatValue>
                <StatLabel>Total Feedback</StatLabel>
              </StatContent>
              <StatIcon>
                <FeedbackIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#5C6BC0">
              <StatContent>
                <StatValue>{masterReport.totalResolveFeedback ?? 0}</StatValue>
                <StatLabel>Resolved</StatLabel>
              </StatContent>
              <StatIcon>
                <CheckCircleIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#26A69A">
              <StatContent>
                <StatValue>{masterReport.totalHoldFeedback ?? 0}</StatValue>
                <StatLabel>Hold</StatLabel>
              </StatContent>
              <StatIcon>
                <HourglassEmptyIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
            <StatCard bgcolor="#EC407A">
              <StatContent>
                <StatValue>{masterReport.totalPendingFeedback ?? 0}</StatValue>
                <StatLabel>Pending</StatLabel>
              </StatContent>
              <StatIcon>
                <PendingIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
          </Box>
        </Grid>

        <Grid item xs={12}>
          {/* FIXED: removed component={theme} */}
          <FilterRow>
            <Typography variant="h5" sx={{ padding: 2 }}>
              Feedback Report
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box
                display="inline-block"
                sx={{
                  marginTop: "25px",
                  width: "200px",
                  verticalAlign: "top",
                  marginRight: "12px",
                }}
              >
                <TextField
                  placeholder="Search"
                  variant="standard"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon />,
                  }}
                  sx={{ width: "100%" }}
                />
              </Box>
              <Box
                display="inline-block"
                mt={2}
                sx={{
                  width: "170px",
                  verticalAlign: "center",
                }}
              >
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                    sx={{
                      minWidth: 140,
                      maxWidth: 170,
                      fontSize: "13px",
                    }}
                  >
                    <MenuItem value="">Default</MenuItem>
                    <MenuItem value="2">Pending</MenuItem>
                    <MenuItem value="1">Resolved</MenuItem>
                    <MenuItem value="3">Hold</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box
                display="inline-block"
                mt={1}
                mb={1}
                sx={{ verticalAlign: "top" }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    sx={{
                      margin: 1,
                      lineHeight: 20,
                      minWidth: 140,
                      maxWidth: 170,
                    }}
                    format="DD-MM-YYYY"
                    onChange={(date) => setFromDate(date)}
                  />
                  <DatePicker
                    label="To Date"
                    value={toDate}
                    sx={{
                      margin: 1,
                      lineHeight: 20,
                      minWidth: 140,
                      maxWidth: 170,
                    }}
                    format="DD-MM-YYYY"
                    onChange={(date) => setToDate(date)}
                  />
                </LocalizationProvider>
              </Box>
            </Box>
          </FilterRow>
        </Grid>
      </Grid>
      <FeedbackTransactions showServiceTrans={filteredRows} />
    </Layout>
  );
}

export default withAuth(FeedbackReport);
