"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import AffiliateTrackDetailsTransactions from "@/components/AffiliateLink/campaigns";
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
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import CampaignIcon from "@mui/icons-material/Campaign";
import { styled } from "@mui/material/styles";

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

function AffiliateHistory() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await api.post("/api/affiliate_link/get-compaigns-admin");
      if (response.status === 200) {
        setShowServiceTrans(response.data.data || []);
      }
    } catch (error) {
      if (error?.response?.data?.error) {
        dispatch(callAlert({ message: error.response.data.error, type: "FAILED" }));
      } else {
        dispatch(callAlert({ message: error.message, type: "FAILED" }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOKButtonClick = async () => {
    setLoading(true);
    setPageCount(pageCount + 1);
    const requestData = { page: pageCount + 1 };

    try {
      const response = await api.post("/api/affiliate_link/get-compaigns", requestData);
      if (response.status === 200) {
        setShowServiceTrans(response.data.data || []);
      } else {
        console.log("Failed to get data.");
      }
    } catch (error) {
      if (error?.response?.data?.error) {
        dispatch(callAlert({ message: error.response.data.error, type: "FAILED" }));
      } else {
        dispatch(callAlert({ message: error.message, type: "FAILED" }));
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredRows = showServiceTrans.filter((row) => {
    return (
      (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.category_name && row.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Stats cards for campaigns
  const cards = [
    { 
      label: "Total Campaigns", 
      value: showServiceTrans.length || 0, 
      color: "#FFC107",
      bgColor: "#FFF8E1"
    },
    { 
      label: "Active", 
      value: showServiceTrans.filter(item => item.status === 'active').length, 
      color: "#10B981",
      bgColor: "#ECFDF5"
    },
    { 
      label: "Inactive", 
      value: showServiceTrans.filter(item => item.status === 'inactive').length, 
      color: "#6B7280",
      bgColor: "#F9FAFB"
    },
    { 
      label: "Draft", 
      value: showServiceTrans.filter(item => item.status === 'draft').length, 
      color: "#3B82F6",
      bgColor: "#EFF6FF"
    }
  ];

  const resetFilters = () => {
    setSearchTerm("");
  };

  return (
    <Layout>
      {/* ===== Loader Overlay ===== */}
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(4px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src="/loader.gif" alt="Loader" width="80" height="80" />
          <Typography sx={{ mt: 1, fontWeight: 600, color: "#555", fontSize: '0.9rem' }}>Loading...</Typography>
        </Box>
      )}

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
                Campaigns
              </Typography>
            </Box>

            {/* Search Field */}
            <TextField
              placeholder="Search campaigns..."
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

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', ml: 'auto' }}>
              {/* Refresh Button */}
              <IconButton 
                size="small" 
                onClick={fetchCampaigns}
                sx={{ 
                  width: '30px', 
                  height: '30px',
                  backgroundColor: '#f0f0f0',
                  '&:hover': { backgroundColor: '#e0e0e0' }
                }}
              >
                <RefreshIcon sx={{ fontSize: 16, color: '#666' }} />
              </IconButton>

              {/* Get Campaign Button */}
              <Button
                variant="contained"
                startIcon={<CampaignIcon sx={{ fontSize: 16 }} />}
                onClick={handleOKButtonClick}
                size="small"
                sx={{
                  minWidth: '110px',
                  background: '#26A69A',
                  borderRadius: '4px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '0.7rem',
                  height: '30px',
                  px: 1,
                  '&:hover': {
                    backgroundColor: '#1f8c83',
                  }
                }}
              >
                Get Campaign
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
            Showing {filteredRows.length} campaigns
          </Typography>
        </Box>
      </Box>

      {/* ===== Data List ===== */}
      <Box sx={{ px: 0.5, pb: 0.5 }}>
        <AffiliateTrackDetailsTransactions showServiceTrans={filteredRows} />
      </Box>
    </Layout>
  );
}

export default withAuth(AffiliateHistory);