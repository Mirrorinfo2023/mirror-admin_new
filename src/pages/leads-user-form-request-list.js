"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/leads/leads_user_form";
import { Grid, Paper, TableContainer, Typography, Box, TextField } from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PaidIcon from "@mui/icons-material/Paid";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function LeadsHistory(props) {
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const dispatch = useDispatch();
  const [report, setReport] = useState(null);
  const uid = Cookies.get("uid");
  
  let rows = showServiceTrans && showServiceTrans.length > 0 ? [...showServiceTrans] : [];
 const [fromDate, setFromDate] = React.useState(dayjs().startOf('month'));
  const [toDate, setToDate] = React.useState(dayjs());
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const response = await api.post("/api/leads/lead-user-action-report", reqData);
        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
          setReport(response.data.report);
        }
      } catch (error) {
        if (error?.response?.data?.error) {
          dispatch(callAlert({ message: error.response.data.error, type: "FAILED" }));
        } else {
          dispatch(callAlert({ message: error.message, type: "FAILED" }));
        }
      }
    };

    if (fromDate || toDate) {
      getTnx();
    }
  }, [fromDate, toDate, dispatch]);

  const handleFromDateChange = (date) => setFromDate(date);
  const handleToDateChange = (date) => setToDate(date);

  const filteredRows = rows.filter((row) => {
    return (
      (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm))
    );
  });

  return (
    <Layout>
      {/* Ultra Compact Single Row Layout */}
      <Box sx={{ p: 1.5 }}>
        {/* Stats Cards - Single Row */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Item sx={{
              height: 70,
              backgroundColor: '#f5f5f5',
              borderLeft: '4px solid #FFC107',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '6px',
              padding: '12px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            }}>
              <Box sx={{ flex: 1, textAlign: 'left' }}>
                <Typography variant="subtitle2" sx={{ fontSize: '12px', fontWeight: 600, color: '#666', mb: 0.5 }}>
                  Total Count
                </Typography>
                <Typography sx={{ color: '#000', fontSize: '18px', fontWeight: 700, lineHeight: 1 }}>
                  {report?.total_count || 0}
                </Typography>
              </Box>
              <LeaderboardIcon sx={{ fontSize: 28, color: "#FFC107", flexShrink: 0 }} />
            </Item>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Item sx={{
              height: 70,
              backgroundColor: '#f5f5f5',
              borderLeft: '4px solid #2196f3',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '6px',
              padding: '12px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            }}>
              <Box sx={{ flex: 1, textAlign: 'left' }}>
                <Typography variant="subtitle2" sx={{ fontSize: '12px', fontWeight: 600, color: '#666', mb: 0.5 }}>
                  Distributed Amt.
                </Typography>
                <Typography sx={{ color: '#000', fontSize: '18px', fontWeight: 700, lineHeight: 1 }}>
                  {report?.total_distributed_amount ?? 0}
                </Typography>
              </Box>
              <PaidIcon sx={{ fontSize: 28, color: "#2196f3", flexShrink: 0 }} />
            </Item>
          </Grid>
        </Grid>

        {/* Filter Bar - Single Compact Row */}
        <TableContainer component={Paper} sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '12px 16px',
          borderRadius: '6px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
          gap: 2,
          flexWrap: 'wrap'
        }}>
          <Typography variant="h6" sx={{ 
            whiteSpace: "nowrap",
            fontSize: '16px',
            fontWeight: 600,
            flex: 1,
            minWidth: 'fit-content'
          }}>
            Lead Form Requests
          </Typography>

          {/* Search and Date in single line */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            flexWrap: 'wrap'
          }}>
            {/* Search Field */}
            <TextField
              placeholder="Search..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#666', mr: 1, fontSize: 20 }} />,
              }}
              sx={{ 
                width: "160px",
                '& .MuiOutlinedInput-root': {
                  height: '36px',
                  fontSize: '0.8rem',
                  '& input': {
                    padding: '8px 12px'
                  }
                }
              }}
            />

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
                        width: 110,
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
                        width: 110,
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
      </Box>

      <Transactions showServiceTrans={filteredRows} />
    </Layout>
  );
}

export default withAuth(LeadsHistory);