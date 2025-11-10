"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import { DataDecrypt, DataEncrypt } from "../../utils/encryption";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import RatingTransactions from "@/components/Rating/Rating";
import {
    Grid,
    Paper,
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
import { styled, useTheme } from "@mui/material/styles";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
}));

const StatContent = styled("div")({
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
});

const StatValue = styled("div")({
    fontSize: 26,
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: 4,
});

const StatLabel = styled("div")({
    fontSize: 13,
    fontWeight: 500,
    opacity: 0.9,
    textTransform: "uppercase",
});

const StatIcon = styled("div")({
    opacity: 0.2,
    fontSize: 56,
    zIndex: 1,
});

const FilterRow = styled(Box)(({ theme }) => ({
    background: "#f5faff",
    borderRadius: 12,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    padding: "16px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 16,
    marginBottom: 10,
    justifyContent: "space-between",
}));

function RateReport(props) {
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [masterReport, setMasterReport] = useState({});
    const dispatch = useDispatch();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
                const encryptedPayload = DataEncrypt(JSON.stringify(reqData));
                const response = await api.post("/api/rating/get-rating", {
                    data: encryptedPayload,
                });

                if (response.data?.data) {
                    const decryptedData = DataDecrypt(response.data.data);
                    setShowServiceTrans(decryptedData.data);
                    setMasterReport(decryptedData.report);
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

        getTnx();
    }, [fromDate, toDate, dispatch]);

    const filteredRows = showServiceTrans.filter((row) => {
        return (
            (row.service &&
                row.service.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.first_name && row.first_name.includes(searchTerm)) ||
            (row.last_name && row.last_name.includes(searchTerm))
        );
    });

    return (
        <Layout>
            <Grid container spacing={3} sx={{ padding: 2 }}>
                {/* Cards */}
                <Grid item xs={12}>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} sm={6} md={4}>
                            <StatCard bgcolor="#2196F3">
                                <StatContent>
                                    <StatValue>{masterReport.totalCount ?? 0}</StatValue>
                                    <StatLabel>Total User Rating</StatLabel>
                                </StatContent>
                                <StatIcon>
                                    <LeaderboardIcon sx={{ fontSize: 56, color: "#fff" }} />
                                </StatIcon>
                            </StatCard>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <StatCard bgcolor="#4CAF50">
                                <StatContent>
                                    <StatValue>{masterReport.totalAvg ?? 0}</StatValue>
                                    <StatLabel>Average Rating</StatLabel>
                                </StatContent>
                                <StatIcon>
                                    <CheckCircleIcon sx={{ fontSize: 56, color: "#fff" }} />
                                </StatIcon>
                            </StatCard>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Filter Row */}
                <Grid item xs={12}>
                    <FilterRow
                        sx={{
                            flexDirection: isMobile ? "column" : "row",
                            alignItems: isMobile ? "stretch" : "center",
                        }}
                    >
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Rating
                        </Typography>

                        <TextField
                            placeholder="Search"
                            variant="standard"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon />,
                            }}
                            sx={{ width: isMobile ? "100%" : 200 }}
                        />

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box display="flex" gap={2} flexWrap={isMobile ? "wrap" : "nowrap"}>
                                <DatePicker
                                    label="From Date"
                                    value={fromDate}
                                    onChange={setFromDate}
                                    format="DD-MM-YYYY"
                                    sx={{
                                        width: isMobile ? "100%" : 160,
                                        background: "#fff",
                                        borderRadius: 1,
                                    }}
                                />
                                <DatePicker
                                    label="To Date"
                                    value={toDate}
                                    onChange={setToDate}
                                    format="DD-MM-YYYY"
                                    sx={{
                                        width: isMobile ? "100%" : 160,
                                        background: "#fff",
                                        borderRadius: 1,
                                    }}
                                />
                            </Box>
                        </LocalizationProvider>
                    </FilterRow>
                </Grid>
            </Grid>

            {/* Table */}
            <RatingTransactions showServiceTrans={filteredRows} />
        </Layout>
    );
}

export default withAuth(RateReport);
