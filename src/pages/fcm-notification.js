"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import { callAlert } from "../../redux/actions/alert";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import NotificationTransactions from "@/components/Notification/Notification";
import {
  Grid,
  Button,
  Paper,
  Typography,
  Box,
  TextField,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ScheduleIcon from "@mui/icons-material/Schedule";

function Notification() {
  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setmasterReport] = useState({});
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const dispatch = useDispatch();

  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const response = await api.post("api/notification/get-notification", reqData);
        if (response.status === 200) {
          setShowServiceTrans(response.data.notificationResult || {});
          setmasterReport(response.data.report || {});
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

    if (fromDate || toDate) {
      getTnx();
    }
  }, [fromDate, toDate, dispatch]);

  // Enhanced cards with more notification metrics
  const cards = [
    {
      label: "Total",
      value: masterReport.totalCount ?? 0,
      color: "#FFC107",
      icon: <LeaderboardIcon sx={{ fontSize: 20, color: "#FFC107" }} />
    },
    {
      label: "Success",
      value: masterReport.totalSuccessFcm ?? 0,
      color: "#5C6BC0",
      icon: <CheckCircleIcon sx={{ fontSize: 20, color: "#5C6BC0" }} />
    },
    {
      label: "Failed",
      value: masterReport.totalFailedFcm ?? 0,
      color: "#EC407A",
      icon: <ErrorIcon sx={{ fontSize: 20, color: "#EC407A" }} />
    },
    {
      label: "Pending",
      value: (masterReport.totalCount - (masterReport.totalSuccessFcm || 0) - (masterReport.totalFailedFcm || 0)) || 0,
      color: "#26A69A",
      icon: <ScheduleIcon sx={{ fontSize: 20, color: "#26A69A" }} />
    }
  ];

  // Notification status options
  const statusOptions = [
    { value: "sent", label: "Sent" },
    { value: "delivered", label: "Delivered" },
    { value: "failed", label: "Failed" },
    { value: "pending", label: "Pending" }
  ];

  // Notification type options
  const typeOptions = [
    "Promotional",
    "Transactional",
    "Alert",
    "Update",
    "Reminder",
    "System"
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
                    fontSize: '14px', 
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
              Notifications
            </Typography>

            {/* Search Field */}
            <TextField
              placeholder="Search title, message..."
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
                value={selectedStatus}
                label="Status"
                onChange={(e) => setSelectedStatus(e.target.value)}
                sx={{ height: '32px', fontSize: '0.75rem' }}
              >
                <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All Status</MenuItem>
                {statusOptions.map((status) => (
                  <MenuItem key={status.value} value={status.value} sx={{ fontSize: '0.75rem' }}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Type Filter */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel sx={{ fontSize: '0.8rem' }}>Type</InputLabel>
              <Select
                value={selectedType}
                label="Type"
                onChange={(e) => setSelectedType(e.target.value)}
                sx={{ height: '32px', fontSize: '0.75rem' }}
              >
                <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All Types</MenuItem>
                {typeOptions.map((type) => (
                  <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem' }}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Date Range - Original API handling preserved */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <DatePicker
                  label="From Date"
                  value={fromDate}
                  format="DD-MM-YYYY"
                  onChange={(newDate) => setFromDate(newDate)}
                  slotProps={{ 
                    textField: { 
                      size: "small",
                      sx: { minWidth: '140px' }
                    } 
                  }}
                />
                <DatePicker
                  label="To Date"
                  value={toDate}
                  format="DD-MM-YYYY"
                  onChange={(newDate) => setToDate(newDate)}
                  slotProps={{ 
                    textField: { 
                      size: "small",
                      sx: { minWidth: '140px' }
                    } 
                  }}
                />
              </Box>
            </LocalizationProvider>

            {/* Add New Button */}
            <Button
              variant="contained"
              href={`/add-new-notification/`}
              size="small"
              sx={{
                borderRadius: '6px',
                fontWeight: 600,
                px: 2,
                py: 0.8,
                minWidth: '100px',
                background: '#2198f3',
                textTransform: 'none',
                fontSize: '0.75rem',
                height: '32px'
              }}
            >
              Add New
            </Button>

            {/* Reset Filters Button */}
            <button
              onClick={() => {
                setSelectedStatus("");
                setSelectedType("");
                setSearchTerm("");
              }}
              style={{
                backgroundColor: '#f5f5f5',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.7rem',
                fontWeight: '600',
                cursor: 'pointer',
                height: '32px',
                minWidth: '60px'
              }}
            >
              Reset
            </button>
          </Box>
        </Paper>

        {/* Results Count */}
        <Box sx={{ mb: 1, px: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
            {Object.keys(showServiceTrans).length} notifications loaded
          </Typography>
        </Box>

        {/* Table Section */}
        <NotificationTransactions showServiceTrans={showServiceTrans} />
      </Box>
    </Layout>
  );
}

export default withAuth(Notification);