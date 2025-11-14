"use client";
import React, { useEffect, useState } from "react";
import {
  Grid,
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
import { useDispatch } from "react-redux";
import { callAlert } from "../../redux/actions/alert";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Dashboard/User/idCardDetails";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

function TransactionHistory() {
  const dispatch = useDispatch();
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMasterReport, setShowMasterReport] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());
  const [totalPageCount, setTotalPageCount] = useState(0);

  // Fetch data - API handling unchanged
  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };
      try {
        const response = await api.post("/api/report/idcard-request-report", reqData);
        if (response.status === 200) {
          setShowServiceTrans(response.data.data || []);
          setShowMasterReport(response.data.report || {});
          setTotalPageCount(response.data.totalPageCount || 0);
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

  // Enhanced filter logic
  const filteredRows = showServiceTrans.filter((row) => {
    const matchesStatus = selectedStatus === "" || row.status === selectedStatus;
    const matchesType = selectedType === "" || row.request_type === selectedType;
    const matchesSearch = 
      (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm)) ||
      (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStatus && matchesType && matchesSearch;
  });

  // Ultra compact cards with icons
  const cards = [
    {
      label: "Total",
      value: showMasterReport.totalRequestsCount ?? 0,
      color: "#FFC107",
      icon: <AssignmentIcon sx={{ fontSize: 20, color: "#FFC107" }} />
    },
    {
      label: "Pending",
      value: showMasterReport.totalPendingRequests ?? 0,
      color: "#5C6BC0",
      icon: <PendingActionsIcon sx={{ fontSize: 20, color: "#5C6BC0" }} />
    },
    {
      label: "Issued",
      value: showMasterReport.totalIssueRequests ?? 0,
      color: "#26A69A",
      icon: <CheckCircleIcon sx={{ fontSize: 20, color: "#26A69A" }} />
    },
    {
      label: "Rejected",
      value: showMasterReport.totalRejectedRequests_view ?? 0,
      color: "#EC407A",
      icon: <CancelIcon sx={{ fontSize: 20, color: "#EC407A" }} />
    }
  ];

  // Status options for ID card requests
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "issued", label: "Issued" }
  ];

  // Request type options
  const requestTypes = [
    "New Card",
    "Replacement",
    "Update",
    "Renewal"
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
              ID Card Requests
            </Typography>

            {/* Search Field */}
            <TextField
              placeholder="Search name, mobile, ID..."
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

            {/* Request Type Filter */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel sx={{ fontSize: '0.8rem' }}>Type</InputLabel>
              <Select
                value={selectedType}
                label="Type"
                onChange={(e) => setSelectedType(e.target.value)}
                sx={{ height: '32px', fontSize: '0.75rem' }}
              >
                <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All Types</MenuItem>
                {requestTypes.map((type) => (
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
            Showing {filteredRows.length} of {showServiceTrans.length} records
          </Typography>
        </Box>

        {/* Table Section */}
        <Transactions
          showServiceTrans={filteredRows}
          totalPageCount={totalPageCount}
          setTotalPageCount={setTotalPageCount}
        />
      </Box>
    </Layout>
  );
}

export default withAuth(TransactionHistory);