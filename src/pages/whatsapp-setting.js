"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Settings/whatsappSetting";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  TableContainer,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function TransactionHistory() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  // 🔹 Fetch data from API
  useEffect(() => {
    const getTnx = async () => {
      try {
        const response = await api.post("/api/setting/get-whatsapp-setting", {});
        if (response.status === 200) {
          const data = response.data.data || [];
          setShowServiceTrans(data);
          setFilteredData(data);
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
    if (uid) getTnx();
  }, [uid, dispatch]);

  // 🔹 Search Function
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    if (!value) {
      setFilteredData(showServiceTrans);
      return;
    }

    const filtered = showServiceTrans.filter((item) => {
      // Match by any text field (adjust fields based on your API data)
      return Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(value);
    });

    setFilteredData(filtered);
  };

  return (
    <Layout>
      <Box sx={{ backgroundColor: "#f7f8fa", minHeight: "100vh", p: 2 }}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: "#fff",
            mx: "auto",
          }}
        >
          {/* Title + Search in one row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              mb: 2,
              gap: 1.5,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              WhatsApp Setting
            </Typography>

            <TextField
              size="small"
              placeholder="Search..."
              value={search}
              onChange={handleSearch}
              sx={{
                width: { xs: "100%", sm: "300px" },
                bgcolor: "#fafafa",
                borderRadius: 2,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TableContainer
            component={Paper}
            elevation={1}
            sx={{
              borderRadius: 2,
            }}
          >
            {/* 🔹 Pass filteredData instead of showServiceTrans */}
            <Transactions showServiceTrans={filteredData} />
          </TableContainer>
        </Paper>
      </Box>
    </Layout>
  );
}

export default withAuth(TransactionHistory);
