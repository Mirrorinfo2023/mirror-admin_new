"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import AffiliateTrackDetailsTransactions from "@/components/AffiliateLink/AffiliateTrackDetailsReport";
import {
  Grid,
  Paper,
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
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Ultra Compact StatCard Design
const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: '6px',
  height: '52px',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.15s ease',
  flex: '1 1 140px',
  minWidth: '120px',
  border: '1px solid rgba(0,0,0,0.04)',
}));

function AffiliateTrackDetailsHistory() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [masterReport, setMasterReport] = useState({}); 
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs(currentDate));
  const [searchTerm, setSearchTerm] = useState("");

  const getTnx = async () => {
    const reqData = {
      from_date: fromDate.toISOString().split("T")[0],
      to_date: toDate.toISOString().split("T")[0],
    };
    try {
      const response = await api.post(
        "/api/affiliate_link/get-affiliate-user-track-report",
        reqData
      );
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

  useEffect(() => {
    getTnx();
  }, [fromDate, toDate, dispatch]);

  const filteredRows = showServiceTrans.filter((row) => {
    return (
      (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm)) ||
      (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.category_name && row.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.link && row.link.includes(searchTerm)) ||
      (row.title && row.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const cards = [
    {
      label: "Total Count",
      value: masterReport?.totalAflr ?? 0,
      color: "#FFC107",
      bgColor: "#FFF8E1"
    },
    {
      label: "Follow Up Done",
      value: masterReport?.totalFollowUpAflr ?? 0,
      color: "#5C6BC0",
      bgColor: "#E8EAF6"
    }
  ];

  const resetFilters = () => {
    setSearchTerm("");
    setFromDate(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
    setToDate(dayjs(currentDate));
  };

  return (
    <Layout>
      <Box sx={{ p: 0.5 }}>
        {/* Ultra Compact Statistics Cards */}
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
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-1px)',
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
                Affiliate Track
              </Typography>
            </Box>

            {/* Search Field */}
            <TextField
              placeholder="Search..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />,
              }}
              sx={{ 
                minWidth: { xs: '100%', sm: '120px' },
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
                  onChange={(newDate) => setFromDate(newDate)}
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
                  onChange={(newDate) => setToDate(newDate)}
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
                onClick={getTnx}
                sx={{ 
                  width: '30px', 
                  height: '30px',
                  backgroundColor: '#f0f0f0',
                  '&:hover': { backgroundColor: '#e0e0e0' }
                }}
              >
                <RefreshIcon sx={{ fontSize: 16, color: '#666' }} />
              </IconButton>

              {/* Reset Button */}
              <IconButton 
                size="small" 
                onClick={resetFilters}
                sx={{ 
                  width: '30px', 
                  height: '30px',
                  backgroundColor: '#f0f0f0',
                  '&:hover': { backgroundColor: '#e0e0e0' }
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '10px' }}>
                  Reset
                </Typography>
              </IconButton>
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
            Showing {filteredRows.length} records
          </Typography>
        </Box>
      </Box>
      
      {/* Table Section */}
      <Box sx={{ px: 0.5, pb: 0.5 }}>
        <AffiliateTrackDetailsTransactions showServiceTrans={filteredRows} />
      </Box>
    </Layout>
  );
}

export default withAuth(AffiliateTrackDetailsHistory);