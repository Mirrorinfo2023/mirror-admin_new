"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import AffiliateTrackDetailsTransactions from "@/components/AffiliateLink/campaigns";
import {
  Grid,
  Paper,
  TableContainer,
  Button,
  Typography,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function AffiliateHistory() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await api.post("/api/affiliate_link/get-compaigns-admin");
      if (response.status === 200) {
        setShowServiceTrans(response.data.data);
      }
    } catch (error) {
      if (error?.response?.data?.error) {
        dispatch(callAlert({ message: error.response.data.error, type: "FAILED" }));
      } else {
        dispatch(callAlert({ message: error.message, type: "FAILED" }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOKButtonClick = async () => {
    setLoading(true);
    setPageCount(pageCount + 1);
    const requestData = { page: pageCount + 1 };

    try {
      const response = await api.post("/api/affiliate_link/get-compaigns", requestData);
      if (response.status === 200) {
        setShowServiceTrans(response.data.data);
      } else {
        console.log("Failed to get data.");
      }
    } catch (error) {
      if (error?.response?.data?.error) {
        dispatch(callAlert({ message: error.response.data.error, type: "FAILED" }));
      } else {
        dispatch(callAlert({ message: error.message, type: "FAILED" }));
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredRows = showServiceTrans.filter((row) => {
    return (
      (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.category_name && row.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <Layout>
      {/* ===== Loader Overlay ===== */}
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(4px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src="/loader.gif" alt="Loader" width="120" height="120" />
          <Typography sx={{ mt: 2, fontWeight: 600, color: "#555" }}>Loading...</Typography>
        </Box>
      )}

      {/* ===== Header & Filters ===== */}
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#f9f9f9",
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
                p: 1,
                borderRadius: 2,
              }}
            >
              {/* Title */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#333",
                  flex: { xs: "1 1 100%", sm: "0 0 auto" },
                }}
              >
                Campaigns
              </Typography>

              {/* Search Box */}
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search Campaigns"
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

              {/* Action Button */}
              <Button
                variant="contained"
                size="medium"
                onClick={handleOKButtonClick}
                sx={{
                  flex: { xs: "1 1 100%", sm: "0 0 auto" },
                  bgcolor: "#26A69A",
                  ":hover": { bgcolor: "#1f8c83" },
                  fontWeight: 600,
                }}
              >
                Get Campaign
              </Button>
            </Box>
          </TableContainer>
        </Grid>
      </Grid>

      {/* ===== Data List ===== */}
      <AffiliateTrackDetailsTransactions showServiceTrans={filteredRows} />
    </Layout>
  );
}

export default withAuth(AffiliateHistory);
