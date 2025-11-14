"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import AffiliateInvoiceTransactions from "@/components/AffiliateLink/InvoiceUploadReport";
import {
  Grid,
  Paper,
  Button,
  Typography,
  Box,
  TextField,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Ultra Compact StatCard Design with Hover Effect
const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: '6px',
  height: '52px',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.15s ease',
  flex: '1 1 120px',
  minWidth: '110px',
  border: '1px solid rgba(0,0,0,0.04)',
}));

function AffiliateInvoiceHistory() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs(new Date()));
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  const fetchData = async () => {
    const reqData = {
      from_date: fromDate.toISOString().split("T")[0],
      to_date: toDate.toISOString().split("T")[0],
    };

    try {
      const response = await api.post(
        "/api/affiliate_link/get-affiliate-upload-invoice-report",
        reqData
      );
      if (response.status === 200) {
        setShowServiceTrans(response.data.data || []);
      }
    } catch (error) {
      if (error?.response?.data?.error) {
        dispatch(
          callAlert({ message: error.response.data.error, type: "FAILED" })
        );
      } else {
        dispatch(callAlert({ message: error.message, type: "FAILED" }));
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate, dispatch]);

  const filteredRows = showServiceTrans.filter((row) => {
    return (
      (row.first_name &&
        row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm)) ||
      (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.category_name &&
        row.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.link && row.link.includes(searchTerm)) ||
      (row.title && row.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Stats cards for invoice data
  const cards = [
    { 
      label: "Total Invoices", 
      value: showServiceTrans.length || 0, 
      color: "#FFC107",
      bgColor: "#FFF8E1"
    },
    { 
      label: "This Month", 
      value: showServiceTrans.filter(item => {
        const itemDate = dayjs(item.created_at);
        return itemDate.isSame(dayjs(), 'month');
      }).length, 
      color: "#10B981",
      bgColor: "#ECFDF5"
    },
    { 
      label: "Pending", 
      value: showServiceTrans.filter(item => item.status === 'pending').length, 
      color: "#6B7280",
      bgColor: "#F9FAFB"
    },
    { 
      label: "Approved", 
      value: showServiceTrans.filter(item => item.status === 'approved').length, 
      color: "#3B82F6",
      bgColor: "#EFF6FF"
    }
  ];

  const resetFilters = () => {
    setSearchTerm("");
    setFromDate(dayjs(new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
    setToDate(dayjs(new Date()));
  };

  return (
    <Layout>
      <Box sx={{ p: 0.5 }}>
        {/* Ultra Compact Statistics Cards with Hover Effect */}
        <Grid container spacing={0.5} sx={{ mb: 1 }}>
          <Grid item xs={12}>
            <Box sx={{ 
              display: "flex", 
              gap: 0.5, 
              flexWrap: "wrap",
            }}>
              {cards.map((card, index) => (
                <StatCard 
                  key={index}
                  sx={{ 
                    backgroundColor: card.bgColor, 
                    borderLeft: `3px solid ${card.color}`,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                    '&:hover': {
                      backgroundColor: card.color,
                      boxShadow: `0 4px 12px ${card.color}60`,
                      transform: 'translateY(-1px)',
                      '& .MuiTypography-root': {
                        color: 'white',
                      }
                    }
                  }}
                >
                  <CardContent sx={{ 
                    padding: '4px 8px !important', 
                    width: '100%',
                    textAlign: 'center',
                    '&:last-child': { pb: '4px' }
                  }}>
                    <Typography 
                      sx={{ 
                        color: '#000000', 
                        transition: 'color 0.2s ease',
                        fontWeight: 700, 
                        fontSize: '14px', 
                        mb: 0.1,
                        lineHeight: 1.2
                      }}
                    >
                      {card.value}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#666666', 
                        transition: 'color 0.2s ease',
                        fontWeight: 500,
                        fontSize: '10px',
                        lineHeight: 1.2,
                      }}
                    >
                      {card.label}
                    </Typography>
                  </CardContent>
                </StatCard>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Ultra Compact Filter Section */}
        <Paper sx={{ 
          p: 0.75, 
          mb: 1,
          backgroundColor: '#fafafa',
          border: '1px solid #e0e0e0'
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 0.5,
            alignItems: 'center'
          }}>
            {/* Title with Icon */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mr: 0.5,
              minWidth: 'fit-content'
            }}>
              <FilterAltIcon sx={{ fontSize: 16, color: '#667eea', mr: 0.5 }} />
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 600,
                  color: '#667eea',
                  fontSize: '13px',
                }}
              >
                Invoice Reports
              </Typography>
            </Box>

            {/* Search Field */}
            <TextField
              placeholder="Search invoices..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />,
              }}
              sx={{ 
                minWidth: { xs: '100%', sm: '140px' },
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  fontSize: '0.7rem',
                  height: '30px',
                  '& input': {
                    padding: '6px 8px',
                    height: '18px'
                  }
                }
              }}
            />

            {/* Compact Date Range */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box display="flex" gap={0.5} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                <DatePicker
                  value={fromDate}
                  format="DD/MM"
                  onChange={(date) => setFromDate(date)}
                  slotProps={{ 
                    textField: { 
                      size: "small",
                      sx: { 
                        minWidth: '90px',
                        '& .MuiInputBase-root': {
                          height: '30px',
                          fontSize: '0.7rem'
                        }
                      }
                    } 
                  }}
                />
                <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
                  to
                </Typography>
                <DatePicker
                  value={toDate}
                  format="DD/MM"
                  onChange={(date) => setToDate(date)}
                  slotProps={{ 
                    textField: { 
                      size: "small",
                      sx: { 
                        minWidth: '90px',
                        '& .MuiInputBase-root': {
                          height: '30px',
                          fontSize: '0.7rem'
                        }
                      }
                    } 
                  }}
                />
              </Box>
            </LocalizationProvider>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', ml: 'auto' }}>
              {/* Refresh Button */}
              <IconButton 
                size="small" 
                onClick={fetchData}
                sx={{ 
                  width: '30px', 
                  height: '30px',
                  backgroundColor: '#f0f0f0',
                  '&:hover': { backgroundColor: '#e0e0e0' }
                }}
              >
                <RefreshIcon sx={{ fontSize: 16, color: '#666' }} />
              </IconButton>

              {/* Add New Button */}
              <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                href={`/add-new-affiliate-link/`}
                size="small"
                sx={{
                  minWidth: '90px',
                  background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
                  borderRadius: '4px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  height: '30px',
                  px: 1
                }}
              >
                Add New
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Results Count */}
        <Box sx={{ mb: 0.5, px: 0.5 }}>
          <Typography variant="caption" sx={{ 
            color: 'text.secondary', 
            fontSize: '0.7rem',
            fontWeight: 500
          }}>
            Showing {filteredRows.length} invoice records
          </Typography>
        </Box>
      </Box>

      {/* Data Table / Transactions */}
      <Box sx={{ px: 0.5, pb: 0.5 }}>
        <AffiliateInvoiceTransactions showServiceTrans={filteredRows} />
      </Box>
    </Layout>
  );
}

export default withAuth(AffiliateInvoiceHistory);