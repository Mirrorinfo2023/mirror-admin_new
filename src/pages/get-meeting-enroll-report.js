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

function MeetingDetailsReport() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const dispatch = useDispatch();

  const [fromDate, setFromDate] = useState(dayjs().startOf('month'));
  const [toDate, setToDate] = useState(dayjs());

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
      <Grid container sx={{ padding: 1.5 }}>
        <Grid item xs={12}>
          <TableContainer component={Paper} sx={{ p: 1.5 }}>
            {/* 🔹 Compact Single Row Layout */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: 'wrap'
              }}
            >
              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  fontSize: '16px',
                  minWidth: 'fit-content'
                }}
              >
                Meeting Enroll
              </Typography>

              {/* Search Field */}
              <TextField
                placeholder="Search..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: '#666', mr: 1, fontSize: 20 }} />,
                }}
                sx={{
                  width: "180px",
                  '& .MuiOutlinedInput-root': {
                    height: '36px',
                    fontSize: '0.8rem',
                  }
                }}
              />

              {/* Date Pickers */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <DatePicker
                    value={fromDate}
                    format="DD/MM"
                    onChange={(newValue) => setFromDate(newValue)}
                    slotProps={{
                      textField: {
                        size: "small",
                        placeholder: "From",
                        sx: {
                          width: 100,
                          '& .MuiInputBase-root': {
                            height: 36,
                            fontSize: '0.8rem'
                          }
                        }
                      },
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', mx: 0.5 }}>
                    to
                  </Typography>
                  <DatePicker
                    value={toDate}
                    format="DD/MM"
                    onChange={(newValue) => setToDate(newValue)}
                    slotProps={{
                      textField: {
                        size: "small",
                        placeholder: "To",
                        sx: {
                          width: 100,
                          '& .MuiInputBase-root': {
                            height: 36,
                            fontSize: '0.8rem'
                          }
                        }
                      },
                    }}
                  />
                </Box>
              </LocalizationProvider>

              {/* Generate Report Button */}
              <Button
                variant="contained"
                size="small"
                onClick={handleGenerateReport}
                sx={{
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  px: 2,
                  py: 0.8,
                  background: "#2198f3",
                  boxShadow: "none",
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  minWidth: 'fit-content',
                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
              >
                Generate
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