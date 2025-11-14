"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/leads/leads_user_action_report";
import { Grid, Paper, TableContainer } from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { Typography, Box, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { styled } from "@mui/material/styles";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

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

  const [report, setReport] = useState(null);
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  let rows;

  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [...showServiceTrans];
  } else {
    rows = [];
  }
  // const [fromDate, setFromDate] = useState(new Date());
  // const [toDate, setToDate] = useState(new Date());

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

          //   console.log(response.data.data);
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
      <Grid container spacing={2} sx={{ padding: 2 }} justifyContent="space-between" alignItems="stretch">
        <Grid item xs={12} sm={6} md={4} lg={2.4} sx={{ flexBasis: { lg: '19.2%' }, maxWidth: { lg: '19.2%' } }}>
          <Item sx={{
            height: 90,
            backgroundColor: '#f5f5f5',
            borderLeft: '4px solid #FFC107',
            color: '#000',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: '#FFC107',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)',
              '& .MuiTypography-root, & .count-value': {
                color: '#fff',
              },
              '& .stat-icon': {
                opacity: 0.8,
              }
            }
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 600, mb: 0.5, color: 'inherit' }}>
                Total Count
              </Typography>
              <Box className="count-value" sx={{ color: 'inherit', fontSize: '20px', fontWeight: 700 }}>
                {report?.total_count || 0}
              </Box>
            </Box>
            <LeaderboardIcon className="stat-icon" sx={{ fontSize: 32, color: "#FFC107", transition: 'all 0.3s ease' }} />
          </Item>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4} sx={{ flexBasis: { lg: '19.2%' }, maxWidth: { lg: '19.2%' } }}>
          <Item sx={{
            height: 90,
            backgroundColor: '#f5f5f5',
            borderLeft: '4px solid #5C6BC0',
            color: '#000',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: '#5C6BC0',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(92, 107, 192, 0.3)',
              '& .MuiTypography-root, & .count-value': {
                color: '#fff',
              },
              '& .stat-icon': {
                opacity: 0.8,
              }
            }
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 600, mb: 0.5, color: 'inherit' }}>
                Total Accept
              </Typography>
              <Box className="count-value" sx={{ color: 'inherit', fontSize: '20px', fontWeight: 700 }}>
                {report?.total_accept || 0}
              </Box>
            </Box>
            <CheckCircleIcon className="stat-icon" sx={{ fontSize: 32, color: "#5C6BC0", transition: 'all 0.3s ease' }} />
          </Item>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4} sx={{ flexBasis: { lg: '19.2%' }, maxWidth: { lg: '19.2%' } }}>
          <Item sx={{
            height: 90,
            backgroundColor: '#f5f5f5',
            borderLeft: '4px solid #26A69A',
            color: '#000',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: '#26A69A',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(38, 166, 154, 0.3)',
              '& .MuiTypography-root, & .count-value': {
                color: '#fff',
              },
              '& .stat-icon': {
                opacity: 0.8,
              }
            }
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 600, mb: 0.5, color: 'inherit' }}>
                Total Pending
              </Typography>
              <Box className="count-value" sx={{ color: 'inherit', fontSize: '20px', fontWeight: 700 }}>
                {report?.total_pending || 0}
              </Box>
            </Box>
            <HourglassEmptyIcon className="stat-icon" sx={{ fontSize: 32, color: "#26A69A", transition: 'all 0.3s ease' }} />
          </Item>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4} sx={{ flexBasis: { lg: '19.2%' }, maxWidth: { lg: '19.2%' } }}>
          <Item sx={{
            height: 90,
            backgroundColor: '#f5f5f5',
            borderLeft: '4px solid #29B6F6',
            color: '#000',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: '#29B6F6',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(41, 182, 246, 0.3)',
              '& .MuiTypography-root, & .count-value': {
                color: '#fff',
              },
              '& .stat-icon': {
                opacity: 0.8,
              }
            }
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 600, mb: 0.5, color: 'inherit' }}>
                Total Hold
              </Typography>
              <Box className="count-value" sx={{ color: 'inherit', fontSize: '20px', fontWeight: 700 }}>
                {report?.total_hold || 0}
              </Box>
            </Box>
            <PauseCircleIcon className="stat-icon" sx={{ fontSize: 32, color: "#29B6F6", transition: 'all 0.3s ease' }} />
          </Item>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={2.4} sx={{ flexBasis: { lg: '19.2%' }, maxWidth: { lg: '19.2%' } }}>
          <Item sx={{
            height: 90,
            backgroundColor: '#f5f5f5',
            borderLeft: '4px solid #EC407A',
            color: '#000',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: '#EC407A',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(236, 64, 122, 0.3)',
              '& .MuiTypography-root, & .count-value': {
                color: '#fff',
              },
              '& .stat-icon': {
                opacity: 0.8,
              }
            }
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 600, mb: 0.5, color: 'inherit' }}>
                Total Reject
              </Typography>
              <Box className="count-value" sx={{ color: 'inherit', fontSize: '20px', fontWeight: 700 }}>
                {report?.total_reject || 0}
              </Box>
            </Box>
            <HighlightOffIcon className="stat-icon" sx={{ fontSize: 32, color: "#EC407A", transition: 'all 0.3s ease' }} />
          </Item>
        </Grid>
      </Grid>

      <Grid item={true} xs={12}>
        <TableContainer component={Paper} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          <Typography variant="h5" sx={{ padding: 1 }} whiteSpace={"nowrap"}>
            Product User Action Report
          </Typography>


        <Box
  display={"inline-block"}
  justifyContent={"space-between"}
  alignItems={"right"}
  mt={3}
  mb={1}
  sx={{ width: "30%", verticalAlign: "top" }}
>
  <TextField
    id="standard-basic"
    placeholder="Search"
    variant="standard"
    mt={2}
    style={{ width: "100%" }}
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    InputProps={{
      startAdornment: <SearchIcon />,
    }}
    sx={{
      '& .MuiInputBase-root': {
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        padding: '8px 12px',
        backgroundColor: '#fff',
        '&:before, &:after': {
          display: 'none', // Remove standard variant lines
        }
      },
      '& .MuiInputBase-root:hover': {
        border: '1px solid #bdbdbd',
      },
      '& .MuiInputBase-root.Mui-focused': {
        border: '2px solid #1976d2',
      }
    }}
  />
</Box>

          <Box
            display={"inline-block"}
            justifyContent={"space-between"}
            alignItems={"center"}
            mt={1}
            mb={1}
            mr={1}
            sx={{ verticalAlign: "top", whiteSpace: "nowrap" }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box display="flex" alignItems="center" gap={2}>
                <DatePicker
                  value={fromDate}
                  sx={{ minWidth: 120, maxWidth: 160 }}
                  format="DD-MM-YYYY"
                  onChange={handleFromDateChange}
                />
                <DatePicker
                  value={toDate}
                  sx={{ minWidth: 120, maxWidth: 160 }}
                  format="DD-MM-YYYY"
                  onChange={handleToDateChange}
                />
              </Box>
            </LocalizationProvider>
          </Box>
        </TableContainer>
      </Grid>

      <Transactions showServiceTrans={filteredRows} />
    </Layout>
  );
}
export default withAuth(LeadsHistory);
