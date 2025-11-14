"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Recharge/recharge-details";
import {
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  TextField,
  Card,
  CardContent,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

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

function TransactionHistory() {
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(false);

  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs(currentDate));

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchData = async () => {
    setLoading(true);
    const reqData = {
      from_date: fromDate.toISOString().split("T")[0],
      to_date: toDate.toISOString().split("T")[0],
    };
    try {
      const response = await api.post("api/report/recharge-report", reqData);
      if (response.status === 200) {
        setShowServiceTrans(response.data.data || []);
      }
    } catch (error) {
      dispatch(
        callAlert({
          message:
            error?.response?.data?.error || error.message || "Error occurred",
          type: "FAILED",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uid) fetchData();
  }, [uid, fromDate, toDate, dispatch]);

  const filteredRows = showServiceTrans.filter((row) => {
    const matchOperator =
      !selectedValue ||
      (row.operator_name &&
        row.operator_name.toLowerCase().includes(selectedValue.toLowerCase()));
    const matchSearch =
      row.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.mlm_id?.includes(searchTerm) ||
      row.mobile?.includes(searchTerm) ||
      row.ConsumerNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.operator_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.recharge_status?.includes(searchTerm) ||
      row.reference_no?.includes(searchTerm) ||
      row.trax_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.transaction_id?.includes(searchTerm) ||
      row.service_name?.includes(searchTerm);
    return matchOperator && matchSearch;
  });

  // Stats cards for recharge data
  const cards = [
    { 
      label: "Total Recharges", 
      value: showServiceTrans.length || 0, 
      color: "#FFC107",
      bgColor: "#FFF8E1"
    },
    { 
      label: "Success", 
      value: showServiceTrans.filter(item => item.recharge_status === 'success').length, 
      color: "#10B981",
      bgColor: "#ECFDF5"
    },
    { 
      label: "Failed", 
      value: showServiceTrans.filter(item => item.recharge_status === 'failed').length, 
      color: "#EF4444",
      bgColor: "#FEF2F2"
    },
    { 
      label: "Pending", 
      value: showServiceTrans.filter(item => item.recharge_status === 'pending').length, 
      color: "#3B82F6",
      bgColor: "#EFF6FF"
    }
  ];

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedValue("");
    setFromDate(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
    setToDate(dayjs(currentDate));
  };

  return (
    <Layout>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(2px)",
            zIndex: 1300,
          }}
        >
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <img src="/loader.gif" alt="Loading..." width={80} height={80} />
            <Typography mt={1} sx={{ fontSize: '0.9rem' }}>Loading...</Typography>
          </Paper>
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
                Recharge Report
              </Typography>
            </Box>

            {/* Operator Filter */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel sx={{ fontSize: '0.7rem' }}>Operator</InputLabel>
              <Select
                value={selectedValue}
                label="Operator"
                onChange={(e) => setSelectedValue(e.target.value)}
                sx={{ 
                  height: '30px', 
                  fontSize: '0.7rem',
                  '& .MuiSelect-select': {
                    padding: '6px 8px'
                  }
                }}
              >
                <MenuItem value="" sx={{ fontSize: '0.7rem' }}>All</MenuItem>
                <MenuItem value="Airtel" sx={{ fontSize: '0.7rem' }}>Airtel</MenuItem>
                <MenuItem value="Bsnl" sx={{ fontSize: '0.7rem' }}>BSNL</MenuItem>
                <MenuItem value="Jio" sx={{ fontSize: '0.7rem' }}>Jio</MenuItem>
                <MenuItem value="Vodafone Idea" sx={{ fontSize: '0.7rem' }}>Vodafone Idea</MenuItem>
                <MenuItem value="Dish Tv" sx={{ fontSize: '0.7rem' }}>Dish TV</MenuItem>
                <MenuItem value="Sun Direct" sx={{ fontSize: '0.7rem' }}>Sun Direct</MenuItem>
                <MenuItem value="Tata Play" sx={{ fontSize: '0.7rem' }}>Tata Play</MenuItem>
              </Select>
            </FormControl>

            {/* Search Field */}
            <TextField
              placeholder="Search recharges..."
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
                  onChange={setFromDate}
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
                  onChange={setToDate}
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
            Showing {filteredRows.length} recharge records
          </Typography>
        </Box>
      </Box>

      {/* Data Table */}
      <Box sx={{ px: 0.5, pb: 0.5 }}>
        <Transactions showServiceTrans={filteredRows} />
      </Box>
    </Layout>
  );
}

export default withAuth(TransactionHistory);