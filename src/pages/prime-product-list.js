"use client"
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import PrimeUserTransactions from "@/components/UserReport/PrimeProduct";
import { 
  Grid, 
  Paper, 
  Typography, 
  Divider, 
  Box, 
  TextField,
  FormControl, 
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Container
} from "@mui/material";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';

// Modern card styling with full gradient backgrounds
const StatCard = styled(Card)(({ theme, gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }) => ({
  background: gradient,
  color: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  height: '120px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
    zIndex: 1,
  }
}));

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  padding: '16px !important',
  width: '100%',
}));

const FilterCard = styled(Card)(({ theme }) => ({
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  marginBottom: '24px',
}));

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

  const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;

  return formattedDateTime;
};

function PrimeUserReport(props) {
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [report, setReport] = useState(null);
  let rows;

  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [
      ...showServiceTrans
    ];
  } else {
    rows = [];
  }

  const dispatch = useDispatch();
  const currentDate = new Date();
  const [fromDate, setFromDate] = React.useState(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
  const [toDate, setToDate] = React.useState(dayjs());

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split('T')[0],
        to_date: toDate.toISOString().split('T')[0],
      }

      try {
        const response = await api.post("/api/refferal-report/user-prime-product-list", reqData);
         
        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
          setReport(response.data.report);
        }

      } catch (error) {
        if (error?.response?.data?.error) {
          dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
        } else {
          dispatch(callAlert({ message: error.message, type: 'FAILED' }))
        }
      }
    }

    if (fromDate || toDate) {
      getTnx();
    }
  }, [fromDate, toDate, dispatch]);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  let filteredRows;

  if(selectedValue != ''){
    filteredRows = rows.filter(row => {
      return (
        (row.plan && row.plan.toLowerCase() === selectedValue.toLowerCase())
      );
    });
  } else {
    filteredRows = rows.filter(row => {
      return (
        (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.last_name && row.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
        (row.mobile && row.mobile.includes(searchTerm)) ||
        (row.plan_name && row.plan_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Statistics Cards Section with Full Background Colors */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Total Transit Card */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
              <CardContentStyled>
                <Typography variant="h4" component="div" sx={{ 
                  fontWeight: 'bold', 
                  fontSize: { xs: '1.75rem', md: '2rem' }, 
                  mb: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {report ? report.total_count : 0}
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontSize: '0.9rem', 
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  opacity: 0.9,
                  mb: 0.5
                }}>
                  Total Transit
                </Typography>
                <Typography variant="caption" sx={{ 
                  opacity: 0.8,
                  fontSize: '0.75rem',
                  display: 'block'
                }}>
                  {report ? report.totalTransit : 0} transactions
                </Typography>
              </CardContentStyled>
            </StatCard>
          </Grid>

          {/* Total Deliver Card */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
              <CardContentStyled>
                <Typography variant="h4" component="div" sx={{ 
                  fontWeight: 'bold', 
                  fontSize: { xs: '1.75rem', md: '2rem' }, 
                  mb: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {report ? report.total_count : 0}
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontSize: '0.9rem', 
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  opacity: 0.9,
                  mb: 0.5
                }}>
                  Total Deliver
                </Typography>
                <Typography variant="caption" sx={{ 
                  opacity: 0.8,
                  fontSize: '0.75rem',
                  display: 'block'
                }}>
                  {report ? report.totalDeliver : 0} delivered
                </Typography>
              </CardContentStyled>
            </StatCard>
          </Grid>

          {/* Total Cancel Card */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
              <CardContentStyled>
                <Typography variant="h4" component="div" sx={{ 
                  fontWeight: 'bold', 
                  fontSize: { xs: '1.75rem', md: '2rem' }, 
                  mb: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {report ? report.total_count : 0}
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontSize: '0.9rem', 
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  opacity: 0.9,
                  mb: 0.5
                }}>
                  Total Cancel
                </Typography>
                <Typography variant="caption" sx={{ 
                  opacity: 0.8,
                  fontSize: '0.75rem',
                  display: 'block'
                }}>
                  {report ? report.totalCancel : 0} cancelled
                </Typography>
              </CardContentStyled>
            </StatCard>
          </Grid>

          {/* Total Order Place Card */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
              <CardContentStyled>
                <Typography variant="h4" component="div" sx={{ 
                  fontWeight: 'bold', 
                  fontSize: { xs: '1.75rem', md: '2rem' }, 
                  mb: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {report ? report.total_count : 0}
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontSize: '0.9rem', 
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  opacity: 0.9,
                  mb: 0.5
                }}>
                  Total Order Place
                </Typography>
                <Typography variant="caption" sx={{ 
                  opacity: 0.8,
                  fontSize: '0.75rem',
                  display: 'block'
                }}>
                  {report ? report.totalOrderPlaced : 0} orders
                </Typography>
              </CardContentStyled>
            </StatCard>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Report Section */}
        <FilterCard>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ 
              fontWeight: 'bold', 
              mb: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Prime Product Report
            </Typography>

            {/* Filters Section */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
              {/* Search Field */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search by name, ID, mobile, or plan..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    }
                  }}
                />
              </Grid>

              {/* Transaction Type Filter */}
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Filter Type</InputLabel>
                  <Select
                    value={selectedValue}
                    label="Filter Type"
                    onChange={handleChange}
                    sx={{ borderRadius: '8px' }}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="Hybrid Prime">Hybrid Prime</MenuItem>
                    <MenuItem value="Booster Prime">Booster Prime</MenuItem>
                    <MenuItem value="Prime">Prime</MenuItem>
                    <MenuItem value="Prime B">Prime B</MenuItem>
                    <MenuItem value="Repurchase">Repurchase</MenuItem>
                    <MenuItem value="Royality">Royality</MenuItem>
                    <MenuItem value="Redeem">Redeem</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Date Range */}
              <Grid item xs={12} md={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <DatePicker
                      label="From Date"
                      value={fromDate}
                      format="DD/MM/YYYY"
                      onChange={handleFromDateChange}
                      slotProps={{ 
                        textField: { 
                          size: 'small', 
                          fullWidth: true,
                          sx: { borderRadius: '8px' }
                        } 
                      }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary', mx: 1 }}>
                      to
                    </Typography>
                    <DatePicker
                      label="To Date"
                      value={toDate}
                      format="DD/MM/YYYY"
                      onChange={handleToDateChange}
                      slotProps={{ 
                        textField: { 
                          size: 'small', 
                          fullWidth: true,
                          sx: { borderRadius: '8px' }
                        } 
                      }}
                    />
                  </Box>
                </LocalizationProvider>
              </Grid>

              {/* Date Range Quick Select */}
              <Grid item xs={12} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value="all"
                    label="Date Range"
                    sx={{ borderRadius: '8px' }}
                  >
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="week">This Week</MenuItem>
                    <MenuItem value="month">This Month</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Results Count */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 2,
              p: 2,
              backgroundColor: 'rgba(102, 126, 234, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(102, 126, 234, 0.1)'
            }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Showing {filteredRows.length} records
              </Typography>
              <Typography variant="body2" sx={{ 
                color: 'primary.main', 
                fontWeight: '600',
                fontSize: '0.875rem'
              }}>
                {fromDate.format('DD/MM/YYYY')} - {toDate.format('DD/MM/YYYY')}
              </Typography>
            </Box>

            {/* Table Section */}
            <Box sx={{ 
              mt: 3,
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
            </Box>
              <PrimeUserTransactions showServiceTrans={filteredRows} />
          </CardContent>
        </FilterCard>
      </Container>
    </Layout>
  );
}

export default withAuth(PrimeUserReport);