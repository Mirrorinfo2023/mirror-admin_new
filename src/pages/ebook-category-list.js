"use client";
import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  TableContainer,
  Button,
  Typography,
  Box,
  TextField,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import EbookTransactions from "@/components/Ebook/EbookCategoryList";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import { callAlert } from "../../redux/actions/alert";

const TransactionHistory = () => {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [fromDate, setFromDate] = useState(dayjs());
  const [toDate, setToDate] = useState(dayjs());
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = { category_name1: null };
        const encrypted = DataEncrypt(JSON.stringify(params));

        const res = await api.post("/api/ebookCategories/get-category", {
          encReq: encrypted,
        });

        if (res.status === 200) {
          setShowServiceTrans(res.data.data);
        }
      } catch (error) {
        dispatch(
          callAlert({
            message:
              error?.response?.data?.error || "Failed to fetch categories",
            type: "FAILED",
          })
        );
      }
    };

    if (uid) fetchData();
  }, [uid, fromDate, toDate, dispatch]);

  const filteredRows = showServiceTrans.filter((row) =>
    row?.category_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Grid container spacing={3} sx={{ p: 3 }}>
        {/* Header */}


        {/* Filter/Search/Add Section */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: "#f9f9f9",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Typography variant="h5" fontWeight="600" gutterBottom>
                  Ebook Categories
                </Typography>
              </Grid>
              {/* Search Box */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ color: "gray", mr: 1 }} />
                    ),
                  }}
                />
              </Grid>

              {/* Date Pickers */}
              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From Date"
                    value={fromDate}
                    onChange={(newDate) => setFromDate(newDate)}
                    sx={{ width: "100%" }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="To Date"
                    value={toDate}
                    onChange={(newDate) => setToDate(newDate)}
                    sx={{ width: "100%" }}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Add New Button */}
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  startIcon={<AddIcon />}
                  href="/add-new-ebook-category/"
                  sx={{
                    background: "#2198f3",
                    borderRadius: "12px",
                    color: "#fff",
                    fontWeight: "bold",
                    boxShadow: "none",
                    textTransform: "none",
                    fontSize: "1rem",
                    px: 3,
                    py: 1,
                    whiteSpace: "nowrap",
                    "&:hover": { opacity: 0.9 },
                  }}
                >
                  Add New
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>



      </Grid>
      <EbookTransactions showServiceTrans={filteredRows} />
    </Layout>
  );
};

export default withAuth(TransactionHistory);
