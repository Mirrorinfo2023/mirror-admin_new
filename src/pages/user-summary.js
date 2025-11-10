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

// New StatCard Design
const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: '8px',
  height: '120px',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
}));

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

  // Card configurations with new design
  const cards = [
    { 
      label: "Total Count", 
      value: report?.total_count || 0, 
      color: "#1976d2" 
    },
    {
      label: "Total Credit Amount",
      value: report?.total_credit || 0,
      color: "#2e7d32",
    },
    { 
      label: "Total Debit", 
      value: report?.total_debit || 0, 
      color: "#ed6c02" 
    },
    {
      label: "Total Old Balance",
      value: report?.total_oldbalance || 0,
      color: "#6a1b9a",
    },
    {
      label: "Total New Balance",
      value: report?.total_newbalance || 0,
      color: "#00838f",
    },
  ];

  return (
    <Layout>
      <Box sx={{ p: 2 }}>
        {/* Top Summary Cards - New Design */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {cards.map((item, index) => (
            <Grid key={index} item xs={12} sm={6} md={2.4}>
              <StatCard sx={{ 
                backgroundColor: '#f5f5f5', 
                borderLeft: `4px solid ${item.color}`,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: item.color,
                  boxShadow: `0 8px 25px ${item.color}80`,
                  transform: 'translateY(-4px)',
                  '& .MuiTypography-root': {
                    color: 'white',
                  }
                }
              }}>
                <CardContent sx={{ 
                  textAlign: 'center', 
                  padding: '16px !important', 
                  width: '100%' 
                }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: '#000000', 
                      transition: 'color 0.3s ease', 
                      fontWeight: 700, 
                      fontSize: '24px', 
                      mb: 1 
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#000000', 
                      transition: 'color 0.3s ease', 
                      fontWeight: 600,
                      fontSize: '14px'
                    }}
                  >
                    {item.label}
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
          ))}
        </Grid>

        {/* Filter Row */}
        <TableContainer
          component={Paper}
          sx={{
            mt: 3,
            p: 2,
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            border: '1px solid #e0e0e0'
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 2, 
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            User Summary
          </Typography>

          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{
              "& .MuiTextField-root, & .MuiFormControl-root": {
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  height: "40px",
                  backgroundColor: 'rgba(0,0,0,0.02)',
                },
              },
            }}
          >
            {/* Transaction Type */}
            <Grid item xs={12} sm={6} md={2.4}>
              <FormControl fullWidth size="small">
                <InputLabel>Transaction Type</InputLabel>
                <Select
                  value={selectedValue}
                  label="Transaction Type"
                  onChange={(e) => setSelectedValue(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Add Money">Add Money</MenuItem>
                  <MenuItem value="Recharge">Recharge</MenuItem>
                  <MenuItem value="Plan Purchase">Plan Purchase</MenuItem>
                  <MenuItem value="Send Money">Send Money</MenuItem>
                  <MenuItem value="Receive Money">Receive Money</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Search */}
            <Grid item xs={12} sm={6} md={2.4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
                }}
              />
            </Grid>

            {/* From Date */}
            <Grid item xs={12} sm={6} md={2.4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="From Date"
                  value={fromDate}
                  format="DD-MM-YYYY"
                  onChange={(date) => setFromDate(date)}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true, 
                      size: 'small',
                    } 
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* To Date */}
            <Grid item xs={12} sm={6} md={2.4}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="To Date"
                  value={toDate}
                  format="DD-MM-YYYY"
                  onChange={(date) => setToDate(date)}
                  slotProps={{ 
                    textField: { 
                      fullWidth: true, 
                      size: 'small',
                    } 
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Action Buttons */}
            <Grid
              item
              xs={12}
              sm={12}
              md={2.4}
              display="flex"
              justifyContent="flex-start"
              gap={1}
            >
              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "#4CAF50",
                  "&:hover": { 
                    backgroundColor: "#43A047",
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                  },
                  textTransform: "none",
                  width: "100px",
                  transition: 'all 0.3s ease-in-out',
                  borderRadius: '6px'
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
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(255, 160, 0, 0.3)'
                  },
                  textTransform: "none",
                  width: "100px",
                  transition: 'all 0.3s ease-in-out',
                  borderRadius: '6px'
                }}
                href={`/credit-balance-to-user/?action=Debit`}
              >
                Debit
              </Button>
            </Grid>
          </Grid>
        </TableContainer>

        {/* Transactions Table */}
        <Box sx={{ mt: 3 }}>
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