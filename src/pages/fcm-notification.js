"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import { callAlert } from "../../redux/actions/alert";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import NotificationTransactions from "@/components/Notification/Notification";
import {
  Grid,
  Button,
  Paper,
  Typography,
  Box,
  TextField,
  TableContainer,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Styled Components
const StatCard = styled(Paper)(({ bgcolor }) => ({
  background: bgcolor,
  color: "#fff",
  borderRadius: 12,
  padding: "20px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minHeight: 100,
  position: "relative",
  overflow: "hidden",
  width: "100%",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
}));

const StatContent = styled("div")({
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});

const StatValue = styled("div")({
  fontSize: 28,
  fontWeight: 700,
  lineHeight: 1.1,
  marginBottom: 4,
});

const StatLabel = styled("div")({
  fontSize: 12,
  fontWeight: 500,
  opacity: 0.9,
  textTransform: "uppercase",
});

const StatIcon = styled("div")({
  position: "absolute",
  right: 16,
  top: "50%",
  transform: "translateY(-50%)",
  opacity: 0.18,
  fontSize: 64,
  zIndex: 1,
});

const FilterRow = styled(Box)(({ theme }) => ({
  background: "#f5faff",
  borderRadius: 12,
  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  gap: 16,
  marginBottom: 16,
  flexWrap: "wrap",
  justifyContent: "space-between",
}));

function Notification() {
  const [searchTerm, setSearchTerm] = useState("");
  const [masterReport, setmasterReport] = useState({});
  const [showServiceTrans, setShowServiceTrans] = useState({});
  const dispatch = useDispatch();

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
        const response = await api.post("api/notification/get-notification", reqData);
        if (response.status === 200) {
          setShowServiceTrans(response.data.notificationResult);
          setmasterReport(response.data.report);
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

    if (fromDate || toDate) {
      getTnx();
    }
  }, [fromDate, toDate, dispatch]);

  return (
    <Layout>
      <Box sx={{ p: { xs: 1.5, md: 3 } }}>
        {/* === STAT CARDS === */}
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard bgcolor="#FFC107">
              <StatContent>
                <StatValue>{masterReport.totalCount ?? 0}</StatValue>
                <StatLabel>Total Count</StatLabel>
              </StatContent>
              <StatIcon>
                <LeaderboardIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard bgcolor="#5C6BC0">
              <StatContent>
                <StatValue>{masterReport.totalSuccessFcm ?? 0}</StatValue>
                <StatLabel>Total Success</StatLabel>
              </StatContent>
              <StatIcon>
                <CheckCircleIcon sx={{ fontSize: 64, color: "#fff" }} />
              </StatIcon>
            </StatCard>
          </Grid>
        </Grid>

        {/* === FILTER ROW === */}
        <FilterRow
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              minWidth: { xs: "100%", sm: "auto" },
              textAlign: { xs: "center", sm: "left" },
              mb: { xs: 1, sm: 0 },
            }}
          >
            Notification
          </Typography>

          <TextField
            placeholder="Search"
            variant="standard"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "action.active" }} />,
            }}
            sx={{
              flex: 1,
              minWidth: { xs: "100%", sm: 180 },
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexDirection: { xs: "column", sm: "row" },
                width: { xs: "100%", sm: "auto" },
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
                    sx: { background: "#fff", borderRadius: 1, flex: 1 },
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
                    sx: { background: "#fff", borderRadius: 1, flex: 1 },
                  },
                }}
              />
            </Box>
          </LocalizationProvider>

          <Button
            variant="contained"
            href={`/add-new-notification/`}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 16,
              px: 4,
              py: 1.2,
              mt: { xs: 1, sm: 0 },
              width: { xs: "100%", sm: "auto" },
              background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
              boxShadow: "0 2px 8px 0 rgba(33, 203, 243, 0.15)",
              textTransform: "none",
            }}
          >
            Add New
          </Button>
        </FilterRow>

        {/* === TABLE SECTION === */}
        <TableContainer component={Paper}>
          <NotificationTransactions showServiceTrans={showServiceTrans} />
        </TableContainer>
      </Box>
    </Layout>
  );
}

export default withAuth(Notification);
