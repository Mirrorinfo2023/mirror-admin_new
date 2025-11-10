"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Settings/setting.js";
import {
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function TransactionHistory() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  useEffect(() => {
    const getTnx = async () => {
      try {
        const response = await api.post("/api/setting/get-setting", {});
        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
        }
      } catch (error) {
        const message =
          error?.response?.data?.error || error.message || "Something went wrong";
        dispatch(callAlert({ message, type: "FAILED" }));
      }
    };

    if (uid) getTnx();
  }, [uid, dispatch]);

  // optional: filtering logic for search
  const filteredSettings = showServiceTrans?.filter((item) =>
    item?.setting_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <Box sx={{ px: { xs: 2, sm: 4 }, py: { xs: 2, sm: 4 } }}>
        {/* Header Section */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            color: "white",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            System Settings
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Manage system configurations and preferences.
          </Typography>
        </Paper>

        {/* Search and Filter Section */}
        <Paper
          elevation={1}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 3,
            borderRadius: 3,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8} md={5}>
              <TextField
                fullWidth
                label="Search Setting"
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        <Divider sx={{ mb: 3 }} />

        {/* Main Settings Table Section */}
     
          <Transactions showServiceTrans={filteredSettings} />
       
      </Box>
    </Layout>
  );
}

export default withAuth(TransactionHistory);
