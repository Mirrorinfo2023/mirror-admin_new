"use client";
import React, { useEffect, useState } from "react";
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
  Button,
  TableContainer,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { callAlert } from "../../redux/actions/alert";
import api from "../../utils/api";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Dashboard/User/Summary";
import withAuth from "../../utils/withAuth";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SavingsIcon from '@mui/icons-material/Savings';

function TransactionHistory() {
  const dispatch = useDispatch();
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [report, setReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());
  const [totalPageCount, setTotalPageCount] = useState(0);

  // Fetch data
  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const response = await api.post("/api/report/user-summary", reqData);
        if (response.status === 200) {
          setShowServiceTrans(response.data.data || []);
          setReport(response.data.report);
          setTotalPageCount(response.data.totalPageCount);
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

  // Filters
  const filteredRows = showServiceTrans.filter((row) => {
    const matchType =
      selectedValue === "" ||
      row.sub_type?.toLowerCase().includes(selectedValue.toLowerCase());
    const matchSearch =
      searchTerm === "" ||
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  // Compact card configurations with icons
  const cards = [
    { 
      label: "Total", 
      value: report?.total_count || 0, 
      color: "#1976d2",
      icon: <AccountBalanceIcon sx={{ fontSize: 28, color: "#1976d2" }} />
    },
    {
      label: "Credit",
      value: report?.total_credit || 0,
      color: "#2e7d32",
      icon: <CreditCardIcon sx={{ fontSize: 28, color: "#2e7d32" }} />
    },
    { 
      label: "Debit", 
      value: report?.total_debit || 0, 
      color: "#ed6c02",
      icon: <MoneyOffIcon sx={{ fontSize: 28, color: "#ed6c02" }} />
    },
    {
      label: "Old Bal",
      value: report?.total_oldbalance || 0,
      color: "#6a1b9a",
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 28, color: "#6a1b9a" }} />
    },
    {
      label: "New Bal",
      value: report?.total_newbalance || 0,
      color: "#00838f",
      icon: <SavingsIcon sx={{ fontSize: 28, color: "#00838f" }} />
    },
  ];

  return (
    <Layout>
      <Box sx={{ p: 1.5 }}>
        {/* Compact Stats Cards */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {cards.map((item, index) => (
            <Grid key={index} item xs={12} sm={6} md={2.4}>
              <Card sx={{ 
                backgroundColor: '#f5f5f5', 
                borderLeft: `4px solid ${item.color}`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                '&:hover': {
                  backgroundColor: item.color,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${item.color}80`,
                  '& .MuiTypography-root': { color: '#fff' },
                  '& .stat-icon': { color: '#fff' }
                }
              }}>
                <Box sx={{ flex: 1, textAlign: 'left' }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    color: '#666', 
                    mb: 0.5,
                    transition: 'color 0.3s ease'
                  }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ 
                    color: '#000', 
                    fontSize: '18px', 
                    fontWeight: 700, 
                    lineHeight: 1,
                    transition: 'color 0.3s ease'
                  }}>
                    {item.value}
                  </Typography>
                </Box>
                <Box className="stat-icon" sx={{ transition: 'color 0.3s ease' }}>
                  {item.icon}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Compact Filter Row */}
        <TableContainer component={Paper} sx={{ p: 1.5, mb: 2 }}>
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1.5,
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
              fontSize: '16px',
              minWidth: 'fit-content'
            }}>
              User Summary
            </Typography>

            {/* Transaction Type */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedValue}
                label="Type"
                onChange={(e) => setSelectedValue(e.target.value)}
                sx={{ height: '36px', fontSize: '0.8rem' }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Add Money">Add Money</MenuItem>
                <MenuItem value="Recharge">Recharge</MenuItem>
                <MenuItem value="Plan Purchase">Plan Purchase</MenuItem>
                <MenuItem value="Send Money">Send Money</MenuItem>
                <MenuItem value="Receive Money">Receive Money</MenuItem>
              </Select>
            </FormControl>

            {/* Search */}
            <TextField
              placeholder="Search..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#666', mr: 1, fontSize: 20 }} />,
              }}
              sx={{
                width: "160px",
                '& .MuiOutlinedInput-root': {
                  height: '36px',
                  fontSize: '0.8rem',
                }
              }}
            />

            {/* Date Range */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <DatePicker
                  value={fromDate}
                  format="DD/MM"
                  onChange={(date) => setFromDate(date)}
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
                    }
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', mx: 0.5 }}>
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
                        width: 100,
                        '& .MuiInputBase-root': {
                          height: 36,
                          fontSize: '0.8rem'
                        }
                      }
                    }
                  }}
                />
              </Box>
            </LocalizationProvider>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#4CAF50",
                  "&:hover": { 
                    backgroundColor: "#43A047",
                  },
                  textTransform: "none",
                  width: "80px",
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  height: '36px'
                }}
                href={`/credit-balance-to-user/?action=Credit`}
              >
                Credit
              </Button>

              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#FFA000",
                  "&:hover": { 
                    backgroundColor: "#FB8C00",
                  },
                  textTransform: "none",
                  width: "80px",
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  height: '36px'
                }}
                href={`/credit-balance-to-user/?action=Debit`}
              >
                Debit
              </Button>
            </Box>
          </Box>
        </TableContainer>

        {/* Transactions Table */}
        <Box sx={{ mt: 2 }}>
          <Transactions
            showServiceTrans={filteredRows}
            totalPageCount={totalPageCount}
            setTotalPageCount={setTotalPageCount}
          />
        </Box>
      </Box>
    </Layout>
  );
}

export default withAuth(TransactionHistory);