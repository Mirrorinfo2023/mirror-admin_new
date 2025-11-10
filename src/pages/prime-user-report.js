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

// Styled components
const StatCard = styled(Paper)(({ bgcolor }) => ({
  background: bgcolor,
  color: "#fff",
  borderRadius: 12,
  padding: "28px 36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minWidth: 280,
  minHeight: 100,
  position: "relative",
  overflow: "hidden",
}));

const StatContent = styled("div")({
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});

const StatValue = styled("div")({
  fontSize: 32,
  fontWeight: 700,
  lineHeight: 1.1,
  marginBottom: 4,
});

const StatLabel = styled("div")({
  fontSize: 14,
  fontWeight: 500,
  opacity: 0.85,
  letterSpacing: 1,
  textTransform: "uppercase",
});

const StatIcon = styled("div")({
  position: "absolute",
  right: 24,
  top: "50%",
  transform: "translateY(-50%)",
  opacity: 0.18,
  fontSize: 64,
  zIndex: 1,
});

const FilterRow = styled(Box)({
  background: "#f5faff",
  borderRadius: 12,
  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  gap: 16,
  marginBottom: 16,
  flexWrap: "nowrap",
  overflowX: "auto", // scroll if screen is small
});

// Component
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
      // Extract day from prime_date (format: DD-MM-YYYY HH:mm:ss)
      const dateParts = row.prime_date.split(' ')[0].split('-');
      const day = parseInt(dateParts[0]);
      
      if (dateRangeFilter === "s1") {
        // S1: 26-31 and 1-5
        return (day >= 26 && day <= 31) || (day >= 1 && day <= 5);
      } else if (dateRangeFilter === "s2") {
        // S2: 6-15
        return day >= 6 && day <= 15;
      } else if (dateRangeFilter === "s3") {
        // S3: 16-25
        return day >= 16 && day <= 25;
      }
    }

    return true;
  });

  return (
    <Layout>
      <Grid container spacing={3} sx={{ padding: 2 }}>
        {/* Stats Cards */}
      <Grid item xs={12}>
  <Box sx={{ 
    display: "flex", 
    gap: 2, 
    flexWrap: "wrap", 
    mb: 2, 
    justifyContent: { xs: "center", sm: "space-between" },
    alignItems: "stretch" 
  }}>
    <StatCard sx={{ 
      backgroundColor: '#f5f5f5', 
      borderLeft: '4px solid #FFC107',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease-in-out',
      minWidth: { xs: "100%", sm: "48%", md: "30%", lg: "18%" },
      flex: "1 1 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px",
      height: "120px",
      '&:hover': {
        backgroundColor: '#FFC107',
        boxShadow: '0 8px 25px rgba(255, 193, 7, 0.5)',
        transform: 'translateY(-4px)',
        '& .MuiTypography-root': {
          color: 'white',
        }
      }
    }}>
      <StatContent sx={{ flex: 1 }}>
        <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease', fontSize: "24px", fontWeight: 700, lineHeight: 1.2, mb: 1 }}>
          {report?.total_count || 0}
        </StatValue>
        <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease', fontSize: "14px", fontWeight: 600, lineHeight: 1.2 }}>
          Total Count
        </StatLabel>
      </StatContent>
      <StatIcon sx={{ display: "flex", alignItems: "center" }}>
        <LeaderboardIcon sx={{ fontSize: 48, color: "#FFC107", transition: 'color 0.3s ease' }} />
      </StatIcon>
    </StatCard>

    <StatCard sx={{ 
      backgroundColor: '#f5f5f5', 
      borderLeft: '4px solid #5C6BC0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease-in-out',
      minWidth: { xs: "100%", sm: "48%", md: "30%", lg: "18%" },
      flex: "1 1 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px",
      height: "120px",
      '&:hover': {
        backgroundColor: '#5C6BC0',
        boxShadow: '0 8px 25px rgba(92, 107, 192, 0.5)',
        transform: 'translateY(-4px)',
        '& .MuiTypography-root': {
          color: 'white',
        }
      }
    }}>
      <StatContent sx={{ flex: 1 }}>
        <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease', fontSize: "24px", fontWeight: 700, lineHeight: 1.2, mb: 1 }}>
          {report?.total_prime || 0}
        </StatValue>
        <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease', fontSize: "14px", fontWeight: 600, lineHeight: 1.2 }}>
          Total Prime
        </StatLabel>
      </StatContent>
      <StatIcon sx={{ display: "flex", alignItems: "center" }}>
        <CheckCircleIcon sx={{ fontSize: 48, color: "#5C6BC0", transition: 'color 0.3s ease' }} />
      </StatIcon>
    </StatCard>

    <StatCard sx={{ 
      backgroundColor: '#f5f5f5', 
      borderLeft: '4px solid #26A69A',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease-in-out',
      minWidth: { xs: "100%", sm: "48%", md: "30%", lg: "18%" },
      flex: "1 1 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px",
      height: "120px",
      '&:hover': {
        backgroundColor: '#26A69A',
        boxShadow: '0 8px 25px rgba(38, 166, 154, 0.5)',
        transform: 'translateY(-4px)',
        '& .MuiTypography-root': {
          color: 'white',
        }
      }
    }}>
      <StatContent sx={{ flex: 1 }}>
        <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease', fontSize: "24px", fontWeight: 700, lineHeight: 1.2, mb: 1 }}>
          {report?.total_primeB || 0}
        </StatValue>
        <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease', fontSize: "14px", fontWeight: 600, lineHeight: 1.2 }}>
          Total Prime B
        </StatLabel>
      </StatContent>
      <StatIcon sx={{ display: "flex", alignItems: "center" }}>
        <HighlightOffIcon sx={{ fontSize: 48, color: "#26A69A", transition: 'color 0.3s ease' }} />
      </StatIcon>
    </StatCard>

    <StatCard sx={{ 
      backgroundColor: '#f5f5f5', 
      borderLeft: '4px solid #EC407A',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease-in-out',
      minWidth: { xs: "100%", sm: "48%", md: "30%", lg: "18%" },
      flex: "1 1 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px",
      height: "120px",
      '&:hover': {
        backgroundColor: '#EC407A',
        boxShadow: '0 8px 25px rgba(236, 64, 122, 0.5)',
        transform: 'translateY(-4px)',
        '& .MuiTypography-root': {
          color: 'white',
        }
      }
    }}>
      <StatContent sx={{ flex: 1 }}>
        <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease', fontSize: "24px", fontWeight: 700, lineHeight: 1.2, mb: 1 }}>
          {report?.total_hybrid || 0}
        </StatValue>
        <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease', fontSize: "14px", fontWeight: 600, lineHeight: 1.2 }}>
          Total Hybrid
        </StatLabel>
      </StatContent>
      <StatIcon sx={{ display: "flex", alignItems: "center" }}>
        <DeleteForeverIcon sx={{ fontSize: 48, color: "#EC407A", transition: 'color 0.3s ease' }} />
      </StatIcon>
    </StatCard>

    <StatCard sx={{ 
      backgroundColor: '#f5f5f5', 
      borderLeft: '4px solid #FF9800',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease-in-out',
      minWidth: { xs: "100%", sm: "48%", md: "30%", lg: "18%" },
      flex: "1 1 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px",
      height: "120px",
      '&:hover': {
        backgroundColor: '#FF9800',
        boxShadow: '0 8px 25px rgba(255, 152, 0, 0.5)',
        transform: 'translateY(-4px)',
        '& .MuiTypography-root': {
          color: 'white',
        }
      }
    }}>
      <StatContent sx={{ flex: 1 }}>
        <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease', fontSize: "24px", fontWeight: 700, lineHeight: 1.2, mb: 1 }}>
          {report?.total_booster || 0}
        </StatValue>
        <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease', fontSize: "14px", fontWeight: 600, lineHeight: 1.2 }}>
          Total Booster
        </StatLabel>
      </StatContent>
      <StatIcon sx={{ display: "flex", alignItems: "center" }}>
        <LeaderboardIcon sx={{ fontSize: 48, color: "#FF9800", transition: 'color 0.3s ease' }} />
      </StatIcon>
    </StatCard>
  </Box>
</Grid>

        {/* Filters */}
        <Grid item xs={12}>
          <FilterRow>
            <Typography variant="h5" sx={{ minWidth: 180 }}>
              Prime User Report
            </Typography>

            <TextField
              placeholder="Search"
              variant="standard"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{ startAdornment: <SearchIcon /> }}
              sx={{ minWidth: 160 }}
            />

            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Transaction Type</InputLabel>
              <Select value={selectedPlan} onChange={handlePlanChange}>
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="Hybrid Prime">Hybrid Prime</MenuItem>
                <MenuItem value="Booster Prime">Booster Prime</MenuItem>
                <MenuItem value="Prime">Prime</MenuItem>
                <MenuItem value="Prime B">Prime B</MenuItem>
                <MenuItem value="Repurchase">Repurchase</MenuItem>
                <MenuItem value="Royality">Royality</MenuItem>
                <MenuItem value="Redeem">Redeem</MenuItem>
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={handleFromDateChange}
                sx={{ minWidth: 140 }}
              />
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={handleToDateChange}
                sx={{ minWidth: 140 }}
              />
            </LocalizationProvider>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Date Range</InputLabel>
              <Select value={dateRangeFilter} onChange={handleDateRangeChange}>
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="s1">S1 (26-5)</MenuItem>
                <MenuItem value="s2">S2 (6-15)</MenuItem>
                <MenuItem value="s3">S3 (16-25)</MenuItem>
              </Select>
            </FormControl>
          </FilterRow>
        </Grid>
      </Grid>

      {/* Transaction Table */}
      <PrimeUserTransactions showServiceTrans={filteredTransactions} />
    </Layout>
  );
}

export default withAuth(PrimeUserReport);