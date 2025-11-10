"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Recharge/recharge_hold_list";
import {
  Grid,
  Paper,
  TableContainer,
  Typography,
  Box,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs(currentDate));

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const getTnx = async () => {
    const reqData = {
      from_date: fromDate.toISOString().split("T")[0],
      to_date: toDate.toISOString().split("T")[0],
    };

    try {
      setLoading(true);
      const response = await api.post("/api/report/recharge-hold-report", reqData);
      if (response.status === 200) {
        setShowServiceTrans(response.data.data);
      }
    } catch (error) {
      dispatch(
        callAlert({
          message:
            error?.response?.data?.error || error.message || "Something went wrong",
          type: "FAILED",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uid) getTnx();
  }, [uid, fromDate, toDate, dispatch]);

  const filteredRows = showServiceTrans.filter((row) => {
    return (
      row.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.mlm_id?.includes(searchTerm) ||
      row.mobile?.includes(searchTerm) ||
      row.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.ref_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.ref_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.ref_mlm_id?.includes(searchTerm) ||
      row.ref_mobile?.includes(searchTerm) ||
      row.ref_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Layout>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(3px)",
            backgroundColor: "rgba(255,255,255,0.5)",
            zIndex: 1300,
          }}
        >
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <img src="/loader.gif" alt="Loading..." width={100} height={100} />
            <Typography mt={2}>Loading...</Typography>
          </Paper>
        </Box>
      )}

      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: 3,
              background: "#fff",
            }}
          >
            {/* Filter + Title Row */}
            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              alignItems={isMobile ? "stretch" : "center"}
              justifyContent="space-between"
              gap={isMobile ? 2 : 3}
              sx={{ mb: 2 }}
            >
              {/* Title */}
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  textAlign: isMobile ? "center" : "left",
                  // color: "#1976d2",
                }}
              >
                Recharge Hold List
              </Typography>

              {/* Search Box */}
              <TextField
                placeholder="Search..."
                variant="outlined"
                size="small"
                sx={{ width: isMobile ? "100%" : "250px" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: "gray", mr: 1 }} />,
                }}
              />

              {/* Date Pickers */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                  display="flex"
                  gap={2}
                  flexDirection={isMobile ? "column" : "row"}
                  alignItems="center"
                >
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    format="DD-MM-YYYY"
                    onChange={setFromDate}
                    slotProps={{ textField: { size: "small" } }}
                  />
                  <DatePicker
                    label="To Date"
                    value={toDate}
                    format="DD-MM-YYYY"
                    onChange={setToDate}
                    slotProps={{ textField: { size: "small" } }}
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
