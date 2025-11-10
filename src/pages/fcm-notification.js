"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import { callAlert } from "../../redux/actions/alert";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import NotificationTransactions from "@/components/Notification/Notification";
import {
  Grid,
  Button,
  Paper,
  Typography,
  Box,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Compact StatCard Design
const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: '8px',
  height: '90px',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  flex: 1,
  minWidth: '160px',
}));

const FilterCard = styled(Paper)(({ theme }) => ({
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  marginBottom: '16px',
  border: '1px solid rgba(0,0,0,0.05)',
}));

function Notification() {
  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setmasterReport] = useState({});
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const dispatch = useDispatch();

  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs(new Date()));

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const response = await api.post("api/notification/get-notification", reqData);
        if (response.status === 200) {
          setShowServiceTrans(response.data.notificationResult || {});
          setmasterReport(response.data.report || {});
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

    if (fromDate || toDate) {
      getTnx();
    }
  }, [fromDate, toDate, dispatch]);

  const cards = [
    {
      label: "Total Count",
      value: masterReport.totalCount ?? 0,
      color: "#FFC107",
      icon: <LeaderboardIcon />
    },
    {
      label: "Total Success",
      value: masterReport.totalSuccessFcm ?? 0,
      color: "#5C6BC0",
      icon: <CheckCircleIcon />
    }
  ];

  return (
    <Layout>
      <Box sx={{ p: 1.5 }}>
        {/* Compact Statistics Cards */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Box sx={{ 
              display: "flex", 
              gap: 1.5, 
              flexWrap: "wrap",
            }}>
              {cards.map((card, index) => (
                <StatCard 
                  key={index}
                  sx={{ 
                    backgroundColor: '#f5f5f5', 
                    borderLeft: `4px solid ${card.color}`,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                      backgroundColor: card.color,
                      boxShadow: `0 8px 25px ${card.color}80`,
                      transform: 'translateY(-2px)',
                      '& .MuiTypography-root': {
                        color: 'white',
                      },
                      '& .stat-icon': {
                        color: 'white',
                        opacity: 0.8
                      }
                    }
                  }}
                >
                  <CardContent sx={{ 
                    padding: '12px !important', 
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    '&:last-child': { pb: '12px' }
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: '#000000', 
                          transition: 'color 0.3s ease', 
                          fontWeight: 700, 
                          fontSize: '20px', 
                          mb: 0.5,
                          lineHeight: 1.2
                        }}
                      >
                        {card.value}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#000000', 
                          transition: 'color 0.3s ease', 
                          fontWeight: 600,
                          fontSize: '12px',
                          lineHeight: 1.2
                        }}
                      >
                        {card.label}
                      </Typography>
                    </Box>
                    <Box 
                      className="stat-icon"
                      sx={{ 
                        color: card.color, 
                        transition: 'color 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        ml: 1
                      }}
                    >
                      {React.cloneElement(card.icon, { sx: { fontSize: 32 } })}
                    </Box>
                  </CardContent>
                </StatCard>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Compact Filter Section */}
        <Grid item xs={12}>
          <FilterCard>
            <Box sx={{ p: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                Notification
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: 1.5,
                alignItems: 'center'
              }}>
                <TextField
                  placeholder="Search"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon color="action" sx={{ fontSize: 20, mr: 1 }} />,
                  }}
                  sx={{ 
                    minWidth: { xs: '100%', sm: '180px' },
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0,0,0,0.02)',
                    }
                  }}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box display="flex" gap={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                    <DatePicker
                      label="From Date"
                      value={fromDate}
                      format="DD-MM-YYYY"
                      onChange={(newDate) => setFromDate(newDate)}
                      slotProps={{ 
                        textField: { 
                          size: "small",
                          sx: { minWidth: '140px' }
                        } 
                      }}
                    />
                    <DatePicker
                      label="To Date"
                      value={toDate}
                      format="DD-MM-YYYY"
                      onChange={(newDate) => setToDate(newDate)}
                      slotProps={{ 
                        textField: { 
                          size: "small",
                          sx: { minWidth: '140px' }
                        } 
                      }}
                    />
                  </Box>
                </LocalizationProvider>

                <Button
                  variant="contained"
                  href={`/add-new-notification/`}
                  sx={{
                    borderRadius: '8px',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    minWidth: '120px',
                    background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
                    boxShadow: '0 2px 8px 0 rgba(33, 203, 243, 0.15)',
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      boxShadow: '0 4px 12px 0 rgba(33, 203, 243, 0.3)',
                    }
                  }}
                >
                  Add New
                </Button>
              </Box>
            </Box>
          </FilterCard>
        </Grid>
      </Box>
      
      {/* Table Section */}
      <NotificationTransactions showServiceTrans={showServiceTrans} />
    </Layout>
  );
}

export default withAuth(Notification);