"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Recharge/recharge-details";
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
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

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
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(false);

  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs(currentDate));

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const getTnx = async () => {
      setLoading(true);
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };
      try {
        const response = await api.post("api/report/recharge-report", reqData);
        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
        }
      } catch (error) {
        dispatch(
          callAlert({
            message:
              error?.response?.data?.error || error.message || "Error occurred",
            type: "FAILED",
          })
        );
      } finally {
        setLoading(false);
      }
    };
    if (uid) getTnx();
  }, [uid, fromDate, toDate, dispatch]);

  const filteredRows = showServiceTrans.filter((row) => {
    const matchOperator =
      !selectedValue ||
      (row.operator_name &&
        row.operator_name.toLowerCase().includes(selectedValue.toLowerCase()));
    const matchSearch =
      row.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.mlm_id?.includes(searchTerm) ||
      row.mobile?.includes(searchTerm) ||
      row.ConsumerNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.operator_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.recharge_status?.includes(searchTerm) ||
      row.reference_no?.includes(searchTerm) ||
      row.trax_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.transaction_id?.includes(searchTerm) ||
      row.service_name?.includes(searchTerm);
    return matchOperator && matchSearch;
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
            backdropFilter: "blur(2px)",
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
            {/* Filters Row */}
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
                Recharge Report
              </Typography>

              {/* Operator Filter */}
              <FormControl sx={{ minWidth: 180 }} size="small">
                <InputLabel>Operator</InputLabel>
                <Select
                  value={selectedValue}
                  label="Operator"
                  onChange={(e) => setSelectedValue(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Airtel">Airtel</MenuItem>
                  <MenuItem value="Bsnl">BSNL</MenuItem>
                  <MenuItem value="Jio">Jio</MenuItem>
                  <MenuItem value="Vodafone Idea">Vodafone Idea</MenuItem>
                  <MenuItem value="Dish Tv">Dish TV</MenuItem>
                  <MenuItem value="Sun Direct">Sun Direct</MenuItem>
                  <MenuItem value="Tata Play">Tata Play</MenuItem>
                </Select>
              </FormControl>

              {/* Search */}
              <TextField
                placeholder="Search..."
                variant="outlined"
                size="small"
                sx={{ width: isMobile ? "100%" : "220px" }}
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

      {/* Data Table */}
      <Transactions showServiceTrans={filteredRows} />
    </Layout>
  );
}

export default withAuth(TransactionHistory);
