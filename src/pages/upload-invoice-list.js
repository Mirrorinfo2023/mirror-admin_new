"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import AffiliateInvoiceTransactions from "@/components/AffiliateLink/InvoiceUploadReport";
import {
  Grid,
  Paper,
  TableContainer,
  Button,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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

function AffiliateInvoiceHistory() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs(new Date()));
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const response = await api.post(
          "/api/affiliate_link/get-affiliate-upload-invoice-report",
          reqData
        );
        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
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

  const filteredRows = showServiceTrans.filter((row) => {
    return (
      (row.first_name &&
        row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
      (row.mobile && row.mobile.includes(searchTerm)) ||
      (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.category_name &&
        row.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.link && row.link.includes(searchTerm)) ||
      (row.title && row.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <Layout>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Box
              display="flex"
              flexWrap="wrap"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
              sx={{
                backgroundColor: "#f9f9f9",
                p: 2,
                borderRadius: 2,
              }}
            >
              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  flex: { xs: "1 1 100%", sm: "0 0 auto" },
                  fontWeight: 600,
                  color: "#333",
                }}
              >
                Affiliate Upload Invoice List
              </Typography>

              {/* Search Box */}
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                sx={{
                  flex: { xs: "1 1 100%", sm: "1 1 220px" },
                  bgcolor: "#fff",
                  borderRadius: 1,
                }}
              />

              {/* Date Pickers */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                  display="flex"
                  gap={2}
                  flexWrap="wrap"
                  sx={{
                    flex: { xs: "1 1 100%", sm: "1 1 auto" },
                    alignItems: "center",
                  }}
                >
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    format="DD-MM-YYYY"
                    onChange={(date) => setFromDate(date)}
                    slotProps={{ textField: { size: "small" } }}
                  />
                  <DatePicker
                    label="To Date"
                    value={toDate}
                    format="DD-MM-YYYY"
                    onChange={(date) => setToDate(date)}
                    slotProps={{ textField: { size: "small" } }}
                  />
                </Box>
              </LocalizationProvider>

              {/* Add New Button */}
              <Button
                variant="contained"
                href={`/add-new-affiliate-link/`}
                sx={{
                  flex: { xs: "1 1 100%", sm: "0 0 auto" },
                  background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                  boxShadow: "0 2px 8px 0 rgba(33, 203, 243, 0.15)",
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Add New
              </Button>
            </Box>
          </TableContainer>
        </Grid>
      </Grid>

      {/* Data Table / Transactions */}
      <AffiliateInvoiceTransactions showServiceTrans={filteredRows} />
    </Layout >
  );
}

export default withAuth(AffiliateInvoiceHistory);
