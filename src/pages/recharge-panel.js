"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Settings/recharge_panel";
import {
  Grid,
  Paper,
  Box,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";

function TransactionHistory() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  useEffect(() => {
    const getTnx = async () => {
      setLoading(true);
      try {
        const response = await api.post("/api/setting/recharge-panel", {});
        if (response.status === 200) {
          setShowServiceTrans(response.data.data || []);
        }
      } catch (error) {
        dispatch(
          callAlert({
            message: error?.response?.data?.error || error.message,
            type: "FAILED",
          })
        );
      } finally {
        setLoading(false);
      }
    };
    if (uid) getTnx();
  }, [uid, dispatch]);

  return (
    <Layout>
      <Grid
        container
        justifyContent="center"

      >
        <Grid item xs={12} md={11} lg={12}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              background: "#fafafa",
            }}
          >
            {/* Header Section */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              mb={2}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#333",
                  mb: { xs: 1, sm: 0 },
                }}
              >
                Recharge Panel [List]
              </Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Table or Loader */}
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
              >
                <CircularProgress />
              </Box>
            ) : (
              <Transactions showServiceTrans={showServiceTrans} />
            )}
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default withAuth(TransactionHistory);
