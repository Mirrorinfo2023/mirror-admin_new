"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
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

function AddMoneyRequestReport() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setMasterReport] = useState({});
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();
  const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
  const [toDate, setToDate] = useState(dayjs());

  // ✅ Helper to print large JSON nicely
  const printFullJson = (obj, title = "JSON LOG") => {
    try {
      const formatted = JSON.stringify(obj, null, 2);
      console.log(`\n=== ${title} START ===`);
      for (let i = 0; i < formatted.length; i += 800) {
        console.log(formatted.slice(i, i + 800));
      }
      console.log(`=== ${title} END ===\n`);
    } catch (e) {
      console.log("⚠️ Error printing JSON:", e);
    }
  };

  // ✅ Fetch Add Money Report (no encryption)
  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const response = await api.post("/api/add_money/add-money-list", reqData);

        if (response?.data) {
          printFullJson(response.data, "RAW ADD MONEY RESPONSE");
          setShowServiceTrans(response.data.data || []);
          setMasterReport(response.data.report || {});
        }
      } catch (error) {
        console.error("🚨 Error fetching Add Money report:", error);
      }
    };

    if (fromDate && toDate) {
      getTnx();
    }
  }, [fromDate, toDate]);

  const handleChange = (event) => setSelectedValue(event.target.value);

  // ✅ Filtered rows
  const filteredRows = showServiceTrans.filter((row) => {
    const isStatusMatch =
      selectedValue === "" || row.status === parseInt(selectedValue);
    const isSearchTermMatch =
      (row.user_name &&
        row.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.amount && row.amount.toString().includes(searchTerm));
    return isStatusMatch && isSearchTermMatch;
  });

  // ✅ Summary cards
  const cards = [
    {
      label: "Total",
      value: masterReport.totalAddmoneyCount ?? 0,
      color: "#FFC107",
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 22, color: "#FFC107" }} />,
    },
    {
      label: "Pending",
      value: masterReport.totalPendingAddMoney ?? 0,
      color: "#5C6BC0",
      icon: <PendingActionsIcon sx={{ fontSize: 22, color: "#5C6BC0" }} />,
    },
    {
      label: "Approved",
      value: masterReport.totalApprovedaddMoney ?? 0,
      color: "#26A69A",
      icon: <CheckCircleIcon sx={{ fontSize: 22, color: "#26A69A" }} />,
    },
    {
      label: "Rejected",
      value: masterReport.totalRejectedaddMoney_view ?? 0,
      color: "#EC407A",
      icon: <CancelIcon sx={{ fontSize: 22, color: "#EC407A" }} />,
    },
  ];

  // ✅ UI
  return (
    <Layout>
      <Box sx={{ p: 1 }}>
        {/* Summary Cards */}
        <Grid container spacing={1} sx={{ mb: 1.5 }}>
          {cards.map((card, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Card
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderLeft: `3px solid ${card.color}`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease-in-out",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px",
                  "&:hover": {
                    backgroundColor: card.color,
                    transform: "translateY(-1px)",
                    "& .MuiTypography-root": { color: "#fff" },
                    "& .stat-icon": { color: "#fff" },
                  },
                }}
              >
                <Box sx={{ flex: 1, textAlign: "left" }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#666",
                      mb: 0.25,
                      transition: "color 0.2s ease",
                    }}
                  >
                    {card.label}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#000",
                      fontSize: "16px",
                      fontWeight: 700,
                      lineHeight: 1,
                      transition: "color 0.2s ease",
                    }}
                  >
                    {card.value}
                  </Typography>
                </Box>
                <Box className="stat-icon" sx={{ transition: "color 0.2s ease" }}>
                  {card.icon}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 1, mb: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                whiteSpace: "nowrap",
                fontSize: "14px",
                minWidth: "fit-content",
              }}
            >
              Add Money Report
            </Typography>

            {/* Search */}
            <TextField
              placeholder="Search name, amount..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ color: "#666", mr: 0.5, fontSize: 18 }} />
                ),
              }}
              sx={{
                width: "150px",
                "& .MuiOutlinedInput-root": {
                  height: "32px",
                  fontSize: "0.75rem",
                },
              }}
            />

            {/* Status Filter */}
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel sx={{ fontSize: "0.8rem" }}>Status</InputLabel>
              <Select
                value={selectedValue}
                label="Status"
                onChange={handleChange}
                sx={{ height: "32px", fontSize: "0.75rem" }}
              >
                <MenuItem value="" sx={{ fontSize: "0.75rem" }}>
                  All
                </MenuItem>
                <MenuItem value="0" sx={{ fontSize: "0.75rem" }}>
                  Pending
                </MenuItem>
                <MenuItem value="1" sx={{ fontSize: "0.75rem" }}>
                  Approved
                </MenuItem>
                <MenuItem value="2" sx={{ fontSize: "0.75rem" }}>
                  Rejected
                </MenuItem>
              </Select>
            </FormControl>

            {/* Date Range */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                <DatePicker
                  value={fromDate}
                  format="DD/MM"
                  onChange={(date) => setFromDate(date)}
                  slotProps={{
                    textField: {
                      size: "small",
                      placeholder: "From",
                      sx: {
                        width: 90,
                        "& .MuiInputBase-root": {
                          height: 32,
                          fontSize: "0.75rem",
                        },
                      },
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    mx: 0.25,
                    fontSize: "0.7rem",
                  }}
                >
                  to
                </Typography>
                <DatePicker
                  value={toDate}
                  format="DD/MM"
                  onChange={(date) => setToDate(date)}
                  slotProps={{
                    textField: {
                      size: "small",
                      placeholder: "To",
                      sx: {
                        width: 90,
                        "& .MuiInputBase-root": {
                          height: 32,
                          fontSize: "0.75rem",
                        },
                      },
                    },
                  }}
                />
              </Box>
            </LocalizationProvider>
          </Box>
        </Paper>

        {/* Table Section */}
        <AddMoneyRequestTransactions showServiceTrans={filteredRows} />
      </Box>
    </Layout>
  );
}

export default withAuth(AddMoneyRequestReport);
