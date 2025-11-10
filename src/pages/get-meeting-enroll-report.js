"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import MeetingDetailsTransactions from "@/components/Meeting/MeetingDetailsReport";

import {
  Grid,
  Button,
  TableContainer,
  Paper,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";

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

function MeetingDetailsReport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const dispatch = useDispatch();

  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs(getDate.date));

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (showServiceTrans?.length > 0) {
      const filtered = showServiceTrans.filter(
        (item) =>
          item.name?.toLowerCase().includes(text.toLowerCase()) ||
          item.description?.toLowerCase().includes(text.toLowerCase()) ||
          item.first_name?.toLowerCase().includes(text.toLowerCase()) ||
          item.last_name?.toLowerCase().includes(text.toLowerCase()) ||
          item.mlm_id?.toLowerCase().includes(text.toLowerCase()) ||
          item.mobile?.toLowerCase().includes(text.toLowerCase()) ||
          item.email?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleGenerateReport = async () => {
    const reqData = {
      from_date: fromDate.toISOString().split("T")[0],
      to_date: toDate.toISOString().split("T")[0],
    };
    try {
      const response = await api.post(
        "/api/meeting/meeting-user-enrollment-details",
        reqData
      );
      if (response.status === 200) {
        setShowServiceTrans(response.data.data);
        setFilteredData(response.data.data);
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.error || error.message || "Something went wrong";
      dispatch(callAlert({ message: errMsg, type: "FAILED" }));
    }
  };

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };
      try {
        const response = await api.post(
          "/api/meeting/meeting-user-enrollment-details",
          reqData
        );
        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
        }
      } catch (error) {
        const errMsg =
          error?.response?.data?.error ||
          error.message ||
          "Something went wrong";
        dispatch(callAlert({ message: errMsg, type: "FAILED" }));
      }
    };

    if (fromDate || toDate) getTnx();
  }, [fromDate, toDate, dispatch]);

  return (
    <Layout>
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ p: 2 }}>
            {/* ✅ Single Row Layout */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap", // ✅ Responsive
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              {/* Label */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Meeting Enroll Report
              </Typography>

              {/* Search Field */}
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <TextField
                  variant="standard"
                  placeholder="Search"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                  }}
                />
              </Box>

              {/* Date Pickers */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "nowrap",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    format="DD-MM-YYYY"
                    onChange={(newValue) => setFromDate(newValue)}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: {
                          minWidth: 130,
                          "& .MuiInputBase-root": {
                            height: 40,
                            fontSize: "0.875rem",
                          },
                        },
                      },
                    }}
                  />
                  <DatePicker
                    label="To Date"
                    value={toDate}
                    format="DD-MM-YYYY"
                    onChange={(newValue) => setToDate(newValue)}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: {
                          minWidth: 130,
                          "& .MuiInputBase-root": {
                            height: 40,
                            fontSize: "0.875rem",
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>

              {/* Button */}
              <Button
                variant="contained"
                onClick={handleGenerateReport}
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: 16,
                  px: 3,
                  py: 1,
                  background:
                    "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                  boxShadow: "0 2px 8px 0 rgba(33, 203, 243, 0.15)",
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
              >
                Generate Report
              </Button>
            </Box>
          </TableContainer>
        </Grid>
      </Grid>

      <MeetingDetailsTransactions
        showServiceTrans={searchTerm ? filteredData : showServiceTrans}
      />
    </Layout>
  );
}

export default withAuth(MeetingDetailsReport);
