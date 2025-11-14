"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import KycTransactions from "@/components/KycReport/KycReport";
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
  CardContent,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';

function KycReport() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setMasterReport] = useState({
    totalKyc: 0,
    totalPendingKyc: 0,
    totalApprovedKyc: 0,
    totalRejectedKyc: 0,
  });
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };
      try {
        const response = await api.post("/api/users/get-kyc-report", reqData);
        if (response.status === 200) {
          setShowServiceTrans(response.data.data || []);
          setMasterReport(response.data.report || {});
        }
      } catch (error) {
        const message =
          error?.response?.data?.error || error.message || "Something went wrong";
        dispatch(callAlert({ message, type: "FAILED" }));
      }
    };
    getTnx();
  }, [fromDate, toDate, dispatch]);

  const handleChange = (event) => setSelectedValue(event.target.value);

  // Filter logic
  const filteredRows = (showServiceTrans || []).filter((row) => {
    const matchSearch =
      (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm)) ||
      (row.pan_number && row.pan_number.includes(searchTerm)) ||
      (row.ifsc_code && row.ifsc_code.includes(searchTerm)) ||
      (row.nominee_name && row.nominee_name.includes(searchTerm)) ||
      (row.nominee_relation && row.nominee_relation.includes(searchTerm)) ||
      (row.account_number && row.account_number.includes(searchTerm));

    if (selectedValue === "") return matchSearch;
    return row.status !== undefined && row.status === parseInt(selectedValue) && matchSearch;
  });

  // Compact cards with icons
  const cards = [
    {
      label: "Total",
      value: masterReport.totalKyc ?? 0,
      color: "#FFC107",
      icon: <AssignmentIcon sx={{ fontSize: 24, color: "#FFC107" }} />
    },
    {
      label: "Pending",
      value: masterReport.totalPendingKyc ?? 0,
      color: "#5C6BC0",
      icon: <PendingActionsIcon sx={{ fontSize: 24, color: "#5C6BC0" }} />
    },
    {
      label: "Approved",
      value: masterReport.totalApprovedKyc ?? 0,
      color: "#26A69A",
      icon: <VerifiedIcon sx={{ fontSize: 24, color: "#26A69A" }} />
    },
    {
      label: "Rejected",
      value: masterReport.totalRejectedKyc ?? 0,
      color: "#EC407A",
      icon: <CancelIcon sx={{ fontSize: 24, color: "#EC407A" }} />
    }
  ];

  return (
    <Layout>
      <Box sx={{ p: 1 }}>
        {/* Ultra Compact Stats Cards */}
        <Grid container spacing={1} sx={{ mb: 1.5 }}>
          {cards.map((card, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Card sx={{ 
                backgroundColor: '#f5f5f5', 
                borderLeft: `3px solid ${card.color}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease-in-out',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px',
                '&:hover': {
                  backgroundColor: card.color,
                  transform: 'translateY(-1px)',
                  '& .MuiTypography-root': { color: '#fff' },
                  '& .stat-icon': { color: '#fff' }
                }
              }}>
                <Box sx={{ flex: 1, textAlign: 'left' }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontSize: '10px', 
                    fontWeight: 600, 
                    color: '#666', 
                    mb: 0.25,
                    transition: 'color 0.2s ease'
                  }}>
                    {card.label}
                  </Typography>
                  <Typography sx={{ 
                    color: '#000', 
                    fontSize: '16px', 
                    fontWeight: 700, 
                    lineHeight: 1,
                    transition: 'color 0.2s ease'
                  }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box className="stat-icon" sx={{ transition: 'color 0.2s ease' }}>
                  {card.icon}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Ultra Compact Filter Row */}
        <Paper sx={{ p: 1, mb: 1.5 }}>
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 1,
            flexWrap: 'wrap'
          }}>
            {/* Title */}
            <Typography variant="h6" sx={{ 
              fontWeight: "bold",
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              whiteSpace: "nowrap",
              fontSize: '14px',
              minWidth: 'fit-content'
            }}>
              KYC Report
            </Typography>

            {/* Status Filter */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel sx={{ fontSize: '0.8rem' }}>Status</InputLabel>
              <Select
                value={selectedValue}
                label="Status"
                onChange={handleChange}
                sx={{ height: '32px', fontSize: '0.75rem' }}
              >
                <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All</MenuItem>
                <MenuItem value="0" sx={{ fontSize: '0.75rem' }}>Pending</MenuItem>
                <MenuItem value="1" sx={{ fontSize: '0.75rem' }}>Approved</MenuItem>
                <MenuItem value="2" sx={{ fontSize: '0.75rem' }}>Rejected</MenuItem>
              </Select>
            </FormControl>

            {/* Search Field */}
            <TextField
              placeholder="Search..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#666', mr: 0.5, fontSize: 18 }} />,
              }}
              sx={{
                width: "140px",
                '& .MuiOutlinedInput-root': {
                  height: '32px',
                  fontSize: '0.75rem',
                }
              }}
            />

            {/* Date Range */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                <DatePicker
                  value={fromDate}
                  format="DD/MM"
                  onChange={(newDate) => setFromDate(newDate)}
                  slotProps={{
                    textField: {
                      size: "small",
                      placeholder: "From",
                      sx: {
                        width: 90,
                        '& .MuiInputBase-root': {
                          height: 32,
                          fontSize: '0.75rem'
                        }
                      }
                    }
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary', mx: 0.25, fontSize: '0.7rem' }}>
                  to
                </Typography>
                <DatePicker
                  value={toDate}
                  format="DD/MM"
                  onChange={(newDate) => setToDate(newDate)}
                  slotProps={{
                    textField: {
                      size: "small",
                      placeholder: "To",
                      sx: {
                        width: 90,
                        '& .MuiInputBase-root': {
                          height: 32,
                          fontSize: '0.75rem'
                        }
                      }
                    }
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Box>
        </Paper>

        {/* Table Section */}
        <KycTransactions showServiceTrans={filteredRows} />
      </Box>
    </Layout>
  );
}

export default withAuth(KycReport);