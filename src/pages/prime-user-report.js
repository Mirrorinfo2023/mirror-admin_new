"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import PrimeUserTransactions from "@/components/UserReport/PrimeUserReport";
import {
  Grid,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  TableContainer,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

// Styled components
const StatCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  borderRadius: "8px",
  padding: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "70px",
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  }
}));

function PrimeUserReport() {
  const dispatch = useDispatch();

  const [transactions, setTransactions] = useState([]);
  const [report, setReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");

  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      const payload = {
        from_date: fromDate.format("YYYY-MM-DD"),
        to_date: toDate.format("YYYY-MM-DD"),
      };

      try {
        const response = await api.post("/api/refferal-report/prime-user-report", payload);
        if (response.status === 200) {
          setTransactions(response.data.data || []);
          setReport(response.data.report || null);
        }
      } catch (error) {
        dispatch(
          callAlert({
            message: error?.response?.data?.error || error.message || "Something went wrong",
            type: "FAILED",
          })
        );
      }
    };
    fetchTransactions();
  }, [fromDate, toDate, dispatch]);

  // Handlers
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handlePlanChange = (e) => setSelectedPlan(e.target.value);
  const handleDateRangeChange = (e) => setDateRangeFilter(e.target.value);
  const handleFromDateChange = (date) => setFromDate(date);
  const handleToDateChange = (date) => setToDate(date);

  // Filter transactions
  const filteredTransactions = transactions.filter((row) => {
    const matchesSearch =
      row.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.mlm_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.mobile?.includes(searchTerm) ||
      row.referal_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.refer_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.refer_mobile?.includes(searchTerm) ||
      row.plan?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedPlan && row.plan?.toLowerCase() !== selectedPlan.toLowerCase()) return false;

    // Apply date filter based on prime_date field
    if (dateRangeFilter !== "all" && row.prime_date) {
      const dateParts = row.prime_date.split(' ')[0].split('-');
      const day = parseInt(dateParts[0]);
      
      if (dateRangeFilter === "s1") {
        return (day >= 26 && day <= 31) || (day >= 1 && day <= 5);
      } else if (dateRangeFilter === "s2") {
        return day >= 6 && day <= 15;
      } else if (dateRangeFilter === "s3") {
        return day >= 16 && day <= 25;
      }
    }

    return true;
  });

  return (
    <Layout>
      <Box sx={{ p: 1.5 }}>
        {/* Compact Stats Cards */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {[
            { 
              label: "Total", 
              value: report?.total_count || 0, 
              color: "#FFC107",
              icon: <LeaderboardIcon sx={{ fontSize: 28, color: "#FFC107" }} />
            },
            { 
              label: "Prime", 
              value: report?.total_prime || 0, 
              color: "#5C6BC0",
              icon: <CheckCircleIcon sx={{ fontSize: 28, color: "#5C6BC0" }} />
            },
            { 
              label: "Prime B", 
              value: report?.total_primeB || 0, 
              color: "#26A69A",
              icon: <HighlightOffIcon sx={{ fontSize: 28, color: "#26A69A" }} />
            },
            { 
              label: "Hybrid", 
              value: report?.total_hybrid || 0, 
              color: "#EC407A",
              icon: <DeleteForeverIcon sx={{ fontSize: 28, color: "#EC407A" }} />
            },
            { 
              label: "Booster", 
              value: report?.total_booster || 0, 
              color: "#FF9800",
              icon: <RocketLaunchIcon sx={{ fontSize: 28, color: "#FF9800" }} />
            },
          ].map((card, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <StatCard sx={{ borderLeft: `4px solid ${card.color}` }}>
                <Box sx={{ flex: 1, textAlign: 'left' }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontSize: '12px', 
                    fontWeight: 600, 
                    color: '#666', 
                    mb: 0.5 
                  }}>
                    {card.label}
                  </Typography>
                  <Typography sx={{ 
                    color: '#000', 
                    fontSize: '18px', 
                    fontWeight: 700, 
                    lineHeight: 1 
                  }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box>
                  {card.icon}
                </Box>
              </StatCard>
            </Grid>
          ))}
        </Grid>

        {/* Compact Filter Row */}
        <TableContainer component={Paper} sx={{ p: 1.5, mb: 2 }}>
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 2,
            flexWrap: 'wrap'
          }}>
            {/* Title */}
            <Typography variant="h6" sx={{ 
              fontWeight: "bold",
              whiteSpace: "nowrap",
              fontSize: '16px',
              minWidth: 'fit-content'
            }}>
              Prime Report
            </Typography>

            {/* Search Field */}
            <TextField
              placeholder="Search..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
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

            {/* Plan Filter */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Type</InputLabel>
              <Select value={selectedPlan} onChange={handlePlanChange} sx={{ height: '36px' }}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Hybrid Prime">Hybrid</MenuItem>
                <MenuItem value="Booster Prime">Booster</MenuItem>
                <MenuItem value="Prime">Prime</MenuItem>
                <MenuItem value="Prime B">Prime B</MenuItem>
                <MenuItem value="Repurchase">Repurchase</MenuItem>
                <MenuItem value="Royality">Royality</MenuItem>
                <MenuItem value="Redeem">Redeem</MenuItem>
              </Select>
            </FormControl>

            {/* Date Range Filter */}
            <FormControl size="small" sx={{ minWidth: 110 }}>
              <InputLabel>Period</InputLabel>
              <Select value={dateRangeFilter} onChange={handleDateRangeChange} sx={{ height: '36px' }}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="s1">S1 (26-5)</MenuItem>
                <MenuItem value="s2">S2 (6-15)</MenuItem>
                <MenuItem value="s3">S3 (16-25)</MenuItem>
              </Select>
            </FormControl>

            {/* Date Pickers */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <DatePicker
                  value={fromDate}
                  format="DD/MM"
                  onChange={handleFromDateChange}
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
                  onChange={handleToDateChange}
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
          </Box>
        </TableContainer>

        {/* Transaction Table */}
        <PrimeUserTransactions showServiceTrans={filteredTransactions} />
      </Box>
    </Layout>
  );
}

export default withAuth(PrimeUserReport);