"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/leads/leads_user_form";
import { Grid, Paper, TableContainer } from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Typography, Box, TextField } from "@mui/material";
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

const drawWidth = 220;
const getDate = (timeZone) => {
  const dateString = timeZone;
  const dateObject = new Date(dateString);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");

  // Determine if it's AM or PM
  const amOrPm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);

  const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;

  return formattedDateTime;
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  overflow: "auto",
};

const innerStyle = {
  overflow: "auto",
  width: 400,
  height: 400,
};

function LeadsHistory(props) {
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const dispatch = useDispatch();
  const [report, setReport] = useState(null);
  const uid = Cookies.get("uid");
  let rows;
  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }

  const [fromDate, setFromDate] = React.useState(dayjs(getDate.dateObject));
  const [toDate, setToDate] = React.useState(dayjs(getDate.dateObject));

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const response = await api.post(
          "/api/leads/lead-user-action-report",
          reqData
        );

        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
          setReport(response.data.report);
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

    if (fromDate || toDate) {
      getTnx();
    }
  }, [fromDate, toDate, dispatch]);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = rows.filter((row) => {
    return (
      (row.first_name &&
        row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm))
    );
  });
  return (
    <Layout>
      <Grid container  sx={{ padding: 2 }}>
     <Grid container spacing={2} sx={{ padding: 2 }}>
  {/* First Row - Stat Cards */}
  <Grid item xs={12}>
    <Grid container spacing={2} alignItems="stretch" sx={{ width: "100%", flexWrap: "nowrap", mb: 3 }}>
      <Grid item xs={12} md={6}>
        <Item
          sx={{
            height: 100,
            backgroundColor: "#f5f5f5",
            borderLeft: "4px solid #FFC107",
            color: "#000",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "8px",
            padding: "16px",
            paddingBottom: "20px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease-in-out",
            width: "100%",
            overflow: "hidden",
            whiteSpace: "nowrap",
            '&:hover': {
              backgroundColor: "#FFC107",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(255, 193, 7, 0.3)",
              '& .MuiTypography-root, & .stat-value': {
                color: "#fff",
              },
              '& .stat-icon': {
                opacity: 0.8,
              }
            }
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{ 
                fontSize: "16px", 
                fontWeight: 600, 
                color: "inherit",
                whiteSpace: "nowrap",
                mb: 0.5
              }}
            >
              Total Count
            </Typography>
            <Box className="stat-value" sx={{ 
              color: "inherit", 
              fontSize: "22px", 
              fontWeight: 700,
              whiteSpace: "nowrap" 
            }}>
              {report?.total_count || 0}
            </Box>
          </Box>
          <LeaderboardIcon 
            className="stat-icon"
            sx={{
              fontSize: 36,
              color: "#FFC107",
              transition: "all 0.3s ease",
              flexShrink: 0
            }}
          />
        </Item>
      </Grid>

      <Grid item xs={12} md={6}>
        <Item
          sx={{
            height: 100,
            backgroundColor: "#f5f5f5",
            borderLeft: "4px solid #2196f3",
            color: "#000",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "8px",
            padding: "16px",
            paddingBottom: "20px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease-in-out",
            width: "100%",
            overflow: "hidden",
            whiteSpace: "nowrap",
            '&:hover': {
              backgroundColor: "#2196f3",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
              '& .MuiTypography-root, & .stat-value': {
                color: "#fff",
              },
              '& .stat-icon': {
                opacity: 0.8,
              }
            }
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{ 
                fontSize: "16px", 
                fontWeight: 600, 
                color: "inherit",
                whiteSpace: "nowrap",
                mb: 0.5
              }}
            >
              Total Distributed Amt.
            </Typography>
            <Box className="stat-value" sx={{ 
              color: "inherit", 
              fontSize: "22px", 
              fontWeight: 700,
              whiteSpace: "nowrap" 
            }}>
              {report?.total_distributed_amount ?? 0}
            </Box>
          </Box>
          <PaidIcon 
            className="stat-icon"
            sx={{
              fontSize: 36,
              color: "#2196f3",
              transition: "all 0.3s ease",
              flexShrink: 0
            }}
          />
        </Item>
      </Grid>
    </Grid>
  </Grid>

  {/* Second Row - Table Header with Search and Date */}
  <Grid item xs={12}>
    <TableContainer 
      component={Paper} 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e0e0e0'
      }}
    >
      <Typography 
        variant="h5" 
        sx={{ 
          padding: 1,
          whiteSpace: "nowrap",
          flex: 1
        }}
      >
        User Lead Form Request List
      </Typography>

      <Box
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }}
      >
        {/* Search Field */}
        <TextField
          id="standard-basic"
          placeholder="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" />,
          }}
          sx={{ 
            width: "200px",
            '& .MuiOutlinedInput-root': {
              height: '40px'
            }
          }}
        />

        {/* Date Pickers */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <DatePicker
              value={fromDate}
              format="DD-MM-YYYY"
              onChange={handleFromDateChange}
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    width: 140,
                    '& .MuiInputBase-root': {
                      height: 40,
                      fontSize: '0.875rem'
                    }
                  }
                }
              }}
            />
            <DatePicker
              value={toDate}
              format="DD-MM-YYYY"
              onChange={handleToDateChange}
              slotProps={{
                textField: {
                  size: "small",
                  sx: {
                    width: 140,
                    '& .MuiInputBase-root': {
                      height: 40,
                      fontSize: '0.875rem'
                    }
                  }
                }
              }}
            />
          </Box>
        </LocalizationProvider>
      </Box>
    </TableContainer>
  </Grid>
</Grid>
      </Grid>

      <Transactions showServiceTrans={filteredRows} />
    </Layout>
  );
}
export default withAuth(LeadsHistory);
