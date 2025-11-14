"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
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
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Dashboard/User/prime";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

function TransactionHistory() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setMasterReport] = useState({});
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const dispatch = useDispatch();

  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs(currentDate));

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const response = await api.post("/api/report/prime-wallet-report", reqData);

        if (response.status === 200) {
          setShowServiceTrans(response.data.data || []);
          setMasterReport(response.data.report || {});
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

  // Filter logic - enhanced with new filters
  const filteredRows = showServiceTrans.filter((row) => {
    const matchesType = selectedType === "" || row.sub_type === selectedType;
    const matchesStatus = selectedStatus === "" || row.status === selectedStatus;
    const matchesSearch = 
      (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm)) ||
      (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.sub_type && row.sub_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.transaction_id && row.transaction_id == searchTerm);

    return matchesType && matchesStatus && matchesSearch;
  });

  // Ultra compact cards with icons
  const cards = [
    {
      label: "Opening",
      value: `₹${masterReport.OpeningBal ?? 0}`,
      color: "#42A5F5",
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 20, color: "#42A5F5" }} />
    },
    {
      label: "Closing",
      value: `₹${masterReport.ClosingBal ?? 0}`,
      color: "#66BB6A",
      icon: <AccountBalanceIcon sx={{ fontSize: 20, color: "#66BB6A" }} />
    },
    {
      label: "Credit",
      value: `₹${masterReport.Credit ?? 0}`,
      color: "#FFA726",
      icon: <TrendingUpIcon sx={{ fontSize: 20, color: "#FFA726" }} />
    },
    {
      label: "Debit",
      value: `₹${masterReport.Debit ?? 0}`,
      color: "#EF5350",
      icon: <TrendingDownIcon sx={{ fontSize: 20, color: "#EF5350" }} />
    }
  ];

  // Prime wallet transaction types
  const transactionTypes = [
    "Prime Purchase",
    "Prime Renewal", 
    "Commission",
    "Bonus",
    "Reward",
    "Cashback",
    "Refund",
    "Transfer"
  ];

  // Status options for prime wallet
  const statusOptions = [
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "cancelled", label: "Cancelled" }
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
              Prime Wallet
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

            {/* Transaction Type Filter */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel sx={{ fontSize: '0.8rem' }}>Type</InputLabel>
              <Select
                value={selectedType}
                label="Type"
                onChange={(e) => setSelectedType(e.target.value)}
                sx={{ height: '32px', fontSize: '0.75rem' }}
              >
                <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All Types</MenuItem>
                {transactionTypes.map((type) => (
                  <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem' }}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
                setSelectedType("");
                setSelectedStatus("");
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
        <Transactions showServiceTrans={filteredRows} />
      </Box>
    </Layout>
  );
}

export default withAuth(TransactionHistory);