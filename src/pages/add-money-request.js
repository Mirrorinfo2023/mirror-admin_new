"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import AddMoneyRequestTransactions from "@/components/AddMoneyRequest/AddMoneyRequestReport";
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
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { styled } from "@mui/material/styles";

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

function AddMoneyRequestReport() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setMasterReport] = useState({});
  const [selectedValue, setSelectedValue] = useState("");

  const dispatch = useDispatch();
  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs());

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const encryptedPayload = DataEncrypt(JSON.stringify(reqData));
        const response = await api.post("/api/add_money/add-money-list", {
          data: encryptedPayload
        });

        if (response.data) {
          const decryptedData = DataDecrypt(response.data.data);
          setShowServiceTrans(decryptedData.data || []);
          setMasterReport(decryptedData.report || {});
        }
      } catch (error) {
        console.error("🚨 Error fetching Add Money report:", error);
      }
    };

    if (fromDate || toDate) {
      getTnx();
    }
  }, [fromDate, toDate]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const filteredRows = showServiceTrans.filter((row) => {
    const isStatusMatch =
      selectedValue === "" || row.status === parseInt(selectedValue);
    const isSearchTermMatch =
      (row.user_name && row.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.amount && row.amount.toString().includes(searchTerm));

    return isStatusMatch && isSearchTermMatch;
  });

  const cards = [
    {
      label: "Total Add Money",
      value: masterReport.totalAddmoneyCount ?? 0,
      color: "#FFC107",
      icon: <AccountBalanceWalletIcon />
    },
    {
      label: "Pending Add Money",
      value: masterReport.totalPendingAddMoney ?? 0,
      color: "#5C6BC0",
      icon: <PendingActionsIcon />
    },
    {
      label: "Approved Add Money",
      value: masterReport.totalApprovedaddMoney ?? 0,
      color: "#26A69A",
      icon: <CheckCircleIcon />
    },
    {
      label: "Rejected Add Money",
      value: masterReport.totalRejectedaddMoney_view ?? 0,
      color: "#EC407A",
      icon: <CancelIcon />
    }
  ];

  return (
    <Layout>
      <Grid container spacing={1.5} sx={{ p: 1.5 }}>
        {/* Compact Statistics Cards */}
        <Grid item xs={12}>
          <Box sx={{ 
            display: "flex", 
            gap: 1.5, 
            flexWrap: "wrap",
            mb: 2 
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
                Add Money Request Report
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

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedValue}
                    label="Status"
                    onChange={handleChange}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="0">Pending</MenuItem>
                    <MenuItem value="1">Approved</MenuItem>
                    <MenuItem value="2">Rejected</MenuItem>
                  </Select>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box display="flex" gap={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                    <DatePicker
                      label="From Date"
                      value={fromDate}
                      format="DD-MM-YYYY"
                      onChange={(date) => setFromDate(date)}
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
                      onChange={(date) => setToDate(date)}
                      slotProps={{ 
                        textField: { 
                          size: "small",
                          sx: { minWidth: '140px' }
                        } 
                      }}
                    />
                  </Box>
                </LocalizationProvider>
              </Box>
            </Box>
          </FilterCard>
        </Grid>
      </Grid>
      
      <AddMoneyRequestTransactions showServiceTrans={filteredRows} />
    </Layout>
  );
}

export default withAuth(AddMoneyRequestReport);