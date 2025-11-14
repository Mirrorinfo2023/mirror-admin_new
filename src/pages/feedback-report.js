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
  Card,
  CardContent,
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

function FeedbackReport() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setMasterReport] = useState({});
  const dispatch = useDispatch();

  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const encryptedPayload = DataEncrypt(JSON.stringify(reqData));
        const response = await api.post("/api/feedback/get-feedback-report", { data: encryptedPayload });

        if (response.status === 200 && response.data?.data) {
          const decryptedResp = DataDecrypt(response.data.data);
          if (decryptedResp.status === 200) {
            setShowServiceTrans(decryptedResp.data || []);
            setMasterReport(decryptedResp.report || {});
          }
        }
      } catch (error) {
        console.log(error?.response?.data?.error || error.message);
      }
    };

    if (fromDate || toDate) getTnx();
  }, [fromDate, toDate, dispatch]);

  const filteredRows = showServiceTrans.filter((row) => {
    const matchesStatus =
      selectedValue !== "" ? row.status === parseInt(selectedValue) : true;

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (row.first_name && row.first_name.toLowerCase().includes(term)) ||
      (row.last_name && row.last_name.toLowerCase().includes(term)) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.usermobile && row.usermobile.includes(searchTerm)) ||
      (row.category_name && row.category_name.toLowerCase().includes(term)) ||
      (row.reason_name && row.reason_name.toLowerCase().includes(term)) ||
      (row.mobile && row.mobile.toLowerCase().includes(term));

    return matchesStatus && matchesSearch;
  });

  // Ultra compact cards with icons
  const cards = [
    {
      label: "Total",
      value: masterReport.totalFeedbackCount ?? 0,
      color: "#FFC107",
      icon: <FeedbackIcon sx={{ fontSize: 22, color: "#FFC107" }} />
    },
    {
      label: "Resolved",
      value: masterReport.totalResolveFeedback ?? 0,
      color: "#5C6BC0",
      icon: <CheckCircleIcon sx={{ fontSize: 22, color: "#5C6BC0" }} />
    },
    {
      label: "Hold",
      value: masterReport.totalHoldFeedback ?? 0,
      color: "#26A69A",
      icon: <HourglassEmptyIcon sx={{ fontSize: 22, color: "#26A69A" }} />
    },
    {
      label: "Pending",
      value: masterReport.totalPendingFeedback ?? 0,
      color: "#EC407A",
      icon: <PendingIcon sx={{ fontSize: 22, color: "#EC407A" }} />
    }
  ];

  return (
    <Layout>
      <Box sx={{ p: 1 }}>
        {/* Ultra Compact Stats Cards */}
        <Grid container spacing={1} sx={{ mb: 1.5 }}>
          {cards.map((card, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Card sx={{ 
                backgroundColor: '#f5f5f5', 
                borderLeft: `3px solid ${card.color}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease-in-out',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px',
                '&:hover': {
                  backgroundColor: card.color,
                  transform: 'translateY(-1px)',
                  '& .MuiTypography-root': { color: '#fff' },
                  '& .stat-icon': { color: '#fff' }
                }
              }}>
                <Box sx={{ flex: 1, textAlign: 'left' }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontSize: '10px', 
                    fontWeight: 600, 
                    color: '#666', 
                    mb: 0.25,
                    transition: 'color 0.2s ease'
                  }}>
                    {card.label}
                  </Typography>
                  <Typography sx={{ 
                    color: '#000', 
                    fontSize: '16px', 
                    fontWeight: 700, 
                    lineHeight: 1,
                    transition: 'color 0.2s ease'
                  }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box className="stat-icon" sx={{ transition: 'color 0.2s ease' }}>
                  {card.icon}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Ultra Compact Filter Row */}
        <Paper sx={{ p: 1, mb: 1.5 }}>
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1,
            flexWrap: 'wrap'
          }}>
            {/* Title */}
            <Typography variant="h6" sx={{ 
              fontWeight: "bold",
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              whiteSpace: "nowrap",
              fontSize: '14px',
              minWidth: 'fit-content'
            }}>
              Feedback Report
            </Typography>

            {/* Search Field */}
            <TextField
              placeholder="Search..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#666', mr: 0.5, fontSize: 18 }} />,
              }}
              sx={{
                width: "140px",
                '& .MuiOutlinedInput-root': {
                  height: '32px',
                  fontSize: '0.75rem',
                }
              }}
            />

            {/* Status Filter */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel sx={{ fontSize: '0.8rem' }}>Status</InputLabel>
              <Select
                value={selectedValue}
                label="Status"
                onChange={(e) => setSelectedValue(e.target.value)}
                sx={{ height: '32px', fontSize: '0.75rem' }}
              >
                <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All</MenuItem>
                <MenuItem value="2" sx={{ fontSize: '0.75rem' }}>Pending</MenuItem>
                <MenuItem value="1" sx={{ fontSize: '0.75rem' }}>Resolved</MenuItem>
                <MenuItem value="3" sx={{ fontSize: '0.75rem' }}>Hold</MenuItem>
              </Select>
            </FormControl>

            {/* Date Range */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <DatePicker
                  value={fromDate}
                  format="DD/MM"
                  onChange={(date) => setFromDate(date)}
                  slotProps={{
                    textField: {
                      size: "small",
                      placeholder: "From",
                      sx: {
                        width: 90,
                        '& .MuiInputBase-root': {
                          height: 32,
                          fontSize: '0.75rem'
                        }
                      }
                    }
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', mx: 0.25, fontSize: '0.7rem' }}>
                  to
                </Typography>
                <DatePicker
                  value={toDate}
                  format="DD/MM"
                  onChange={(date) => setToDate(date)}
                  slotProps={{
                    textField: {
                      size: "small",
                      placeholder: "To",
                      sx: {
                        width: 90,
                        '& .MuiInputBase-root': {
                          height: 32,
                          fontSize: '0.75rem'
                        }
                      }
                    }
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Box>
        </Paper>

        {/* Table Section */}
        <FeedbackTransactions showServiceTrans={filteredRows} />
      </Box>
    </Layout>
  );
}

export default withAuth(FeedbackReport);