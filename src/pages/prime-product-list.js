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
  Box, 
  TextField,
  FormControl, 
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent
} from "@mui/material";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function PrimeUserReport(props) {
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [report, setReport] = useState(null);
  let rows;

  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }

  const dispatch = useDispatch();
  const [fromDate, setFromDate] = React.useState(dayjs().startOf("month"));
  const [toDate, setToDate] = React.useState(dayjs());
  const [selectedValue, setSelectedValue] = useState('');

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

  const handleFromDateChange = (date) => setFromDate(date);
  const handleToDateChange = (date) => setToDate(date);
  const handleChange = (event) => setSelectedValue(event.target.value);

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
      <Box sx={{ p: 1.5 }}>
        {/* Compact Stats Cards */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {[
            { 
              label: "Transit", 
              value: report?.total_count || 0, 
              subValue: report?.totalTransit || 0,
              color: "#667eea",
              icon: <LocalShippingIcon sx={{ fontSize: 28, color: "#667eea" }} />
            },
            { 
              label: "Deliver", 
              value: report?.total_count || 0, 
              subValue: report?.totalDeliver || 0,
              color: "#43e97b",
              icon: <CheckCircleIcon sx={{ fontSize: 28, color: "#43e97b" }} />
            },
            { 
              label: "Cancel", 
              value: report?.total_count || 0, 
              subValue: report?.totalCancel || 0,
              color: "#fa709a",
              icon: <CancelIcon sx={{ fontSize: 28, color: "#fa709a" }} />
            },
            { 
              label: "Orders", 
              value: report?.total_count || 0, 
              subValue: report?.totalOrderPlaced || 0,
              color: "#4facfe",
              icon: <ShoppingCartIcon sx={{ fontSize: 28, color: "#4facfe" }} />
            },
          ].map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                backgroundColor: '#f5f5f5', 
                borderLeft: `4px solid ${card.color}`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                height: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                '&:hover': {
                  backgroundColor: card.color,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 12px ${card.color}80`,
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
                    {card.label}
                  </Typography>
                  <Typography sx={{ 
                    color: '#000', 
                    fontSize: '18px', 
                    fontWeight: 700, 
                    lineHeight: 1,
                    transition: 'color 0.3s ease'
                  }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box className="stat-icon" sx={{ transition: 'color 0.3s ease' }}>
                  {card.icon}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Compact Filter Row */}
        <Paper sx={{ p: 1.5, mb: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            flexWrap: 'wrap' 
          }}>
            {/* Title */}
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              minWidth: 'fit-content',
              mr: 1,
              fontSize: '16px'
            }}>
              Prime Report
            </Typography>

            {/* Search */}
            <TextField
              placeholder="Search..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />,
              }}
              sx={{
                minWidth: 180,
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '6px',
                  height: '36px',
                  fontSize: '0.8rem'
                }
              }}
            />

            {/* Type Filter */}
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedValue}
                label="Type"
                onChange={handleChange}
                sx={{ borderRadius: '6px', height: '36px', fontSize: '0.8rem' }}
              >
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

            {/* Date Range */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <DatePicker
                  value={fromDate}
                  format="DD/MM"
                  onChange={handleFromDateChange}
                  slotProps={{ 
                    textField: { 
                      size: 'small', 
                      placeholder: "From",
                      sx: { 
                        borderRadius: '6px',
                        minWidth: 100,
                        '& .MuiInputBase-root': { 
                          height: '36px',
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
                      size: 'small', 
                      placeholder: "To",
                      sx: { 
                        borderRadius: '6px',
                        minWidth: 100,
                        '& .MuiInputBase-root': { 
                          height: '36px',
                          fontSize: '0.8rem'
                        }
                      }
                    } 
                  }}
                />
              </Box>
            </LocalizationProvider>

            {/* Results Count */}
            <Typography variant="caption" sx={{ 
              color: 'text.secondary', 
              fontWeight: 500,
              minWidth: 'fit-content',
              px: 1,
              ml: 'auto'
            }}>
              {filteredRows.length} records
            </Typography>
          </Box>
        </Paper>

        {/* Table Section */}
        <Box sx={{ mt: 2 }}>
          <PrimeUserTransactions showServiceTrans={filteredRows} />
        </Box>
      </Box>
    </Layout>
  );
}

export default withAuth(PrimeUserReport);