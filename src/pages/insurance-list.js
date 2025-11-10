"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/insurance/insurance";
import {
  Grid,
  Paper,
  TableContainer,
  Typography,
  Box,
  TextField,
  useMediaQuery,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";

const getDate = (timeZone) => {
  const dateString = timeZone;
  const dateObject = new Date(dateString);

  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");
  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);
  return `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;
};

const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
  },
}));

function TransactionHistory() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

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
        const response = await api.post(
          "/api/insurance/get-insurance-report",
          reqData
        );
        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
        }
      } catch (error) {
        const msg = error?.response?.data?.error || error.message;
        dispatch(callAlert({ message: msg, type: "FAILED" }));
      }
    };

    if (fromDate || toDate) getTnx();
  }, [fromDate, toDate, dispatch]);

  const filteredRows = showServiceTrans.filter((row) => {
    return (
      (row.first_name &&
        row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.last_name &&
        row.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm)) ||
      (row.email && row.email.includes(searchTerm)) ||
      (row.ins_no && row.ins_no.includes(searchTerm)) ||
      (row.ins_type &&
        row.ins_type.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <Layout>
      <Grid container spacing={3} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              p: 2,
              backgroundColor: "#f9fafc",
            }}
          >
            {/*  Responsive Filter Toolbar */}
            <StyledBox>
              {/* Title */}
              <Typography
                variant="h5"
                sx={{
                
                  whiteSpace: "nowrap",
                }}
              >
                Insurance Report
              </Typography>

              {/* Search */}
              <TextField
                variant="outlined"
                placeholder="Search by name, ID, or number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
                }}
                sx={{
                  flex: 1,
                  minWidth: { xs: "100%", sm: "220px" },
                  backgroundColor: "white",
                  borderRadius: 2,
                }}
              />

              {/* Date Filters */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                  display="flex"
                  gap={2}
                  flexWrap="wrap"
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    justifyContent: "flex-end",
                  }}
                >
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    format="DD-MM-YYYY"
                    onChange={(newDate) => setFromDate(newDate)}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: {
                          backgroundColor: "white",
                          borderRadius: 2,
                          width: { xs: "100%", sm: "180px" },
                        },
                      },
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
                        sx: {
                          backgroundColor: "white",
                          borderRadius: 2,
                          width: { xs: "100%", sm: "180px" },
                        },
                      },
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </StyledBox>
          </Paper>
        </Grid>

   
        
      </Grid>
          <Transactions showServiceTrans={filteredRows} />
    </Layout>
  );
}

export default withAuth(TransactionHistory);
