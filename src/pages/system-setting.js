"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Settings/setting.js";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";

function TransactionHistory() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  const fetchData = async () => {
    try {
      const response = await api.post("/api/setting/get-setting", {});
      if (response.status === 200) {
        setShowServiceTrans(response.data.data || []);
      }
    } catch (error) {
      const message =
        error?.response?.data?.error || error.message || "Something went wrong";
      dispatch(callAlert({ message, type: "FAILED" }));
    }
  };

  useEffect(() => {
    if (uid) fetchData();
  }, [uid, dispatch]);

  const filteredSettings = showServiceTrans?.filter((item) =>
    item?.setting_name?.toLowerCase().includes(search.toLowerCase())
  );

  const resetFilters = () => {
    setSearch("");
  };

  return (
    <Layout>
      <Box sx={{ p: 0.5 }}>
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
                System Settings
              </Typography>
            </Box>

            {/* Search Field */}
            <TextField
              placeholder="Search settings..."
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />,
              }}
              sx={{ 
                minWidth: { xs: '100%', sm: '180px' },
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
            Showing {filteredSettings?.length || 0} settings
          </Typography>
        </Box>

        {/* Settings Table Section */}
        <Box sx={{ px: 0.5, pb: 0.5 }}>
          <Transactions showServiceTrans={filteredSettings} />
        </Box>
      </Box>
    </Layout>
  );
}

export default withAuth(TransactionHistory);