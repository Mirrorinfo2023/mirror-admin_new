"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import BannersTransactions from "@/components/Banners/BannersReport";
import {
    Grid,
    Button,
    Paper,
    Typography,
    Box
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled } from "@mui/material/styles";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const StatCard = styled(Paper)(({ bgcolor, theme }) => ({
    background: bgcolor,
    color: "#fff",
    borderRadius: 12,
    padding: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flex: "1 1 240px",
    minHeight: 100,
    position: "relative",
    overflow: "hidden",
    [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "20px",
        gap: "8px",
    },
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
    marginBottom: 4,
});

const StatLabel = styled("div")({
    fontSize: 14,
    fontWeight: 500,
    opacity: 0.85,
    letterSpacing: 1,
    textTransform: "uppercase",
});

const StatIcon = styled("div")(({ theme }) => ({
    position: "absolute",
    right: 24,
    top: "50%",
    transform: "translateY(-50%)",
    opacity: 0.18,
    fontSize: 64,
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
        position: "relative",
        right: "auto",
        top: "auto",
        transform: "none",
        fontSize: 48,
        opacity: 0.25,
        marginTop: 8,
    },
}));

const FilterRow = styled(Box)(({ theme }) => ({
    background: "#f5faff",
    borderRadius: 12,
    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "stretch",
        gap: 12,
    },
}));

function BannersReport() {
    const [report, setReport] = useState(null);
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const dispatch = useDispatch();

    const today = dayjs();
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);

    useEffect(() => {
        generateReport();
    }, []);

    const generateReport = async () => {
        const reqData = {
            from_date: fromDate.toISOString().split("T")[0],
            to_date: toDate.toISOString().split("T")[0],
        };

        try {
            const response = await api.post("/api/banner/get-banner-report", reqData);

            if (response.status === 200) {
                setShowServiceTrans(response.data.data);
                setReport(response.data.report);
            }
        } catch (error) {
            const msg = error?.response?.data?.error || error.message;
            dispatch(callAlert({ message: msg, type: "FAILED" }));
        }
    };

    return (
        <Layout>
            <Grid container spacing={2} sx={{ p: 2 }}>
                {/* --- STAT CARDS --- */}
                <Grid item xs={12}>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                            justifyContent: { xs: "center", sm: "flex-start" },
                        }}
                    >
                        <StatCard bgcolor="#FFC107">
                            <StatContent>
                                <StatValue>{report?.total_count || 0}</StatValue>
                                <StatLabel>Total</StatLabel>
                            </StatContent>
                            <StatIcon>
                                <LeaderboardIcon sx={{ fontSize: 64, color: "#fff" }} />
                            </StatIcon>
                        </StatCard>

                        <StatCard bgcolor="#5C6BC0">
                            <StatContent>
                                <StatValue>{report?.total_active || 0}</StatValue>
                                <StatLabel>Active</StatLabel>
                            </StatContent>
                            <StatIcon>
                                <CheckCircleIcon sx={{ fontSize: 64, color: "#fff" }} />
                            </StatIcon>
                        </StatCard>

                        <StatCard bgcolor="#26A69A">
                            <StatContent>
                                <StatValue>{report?.total_inactive || 0}</StatValue>
                                <StatLabel>Inactive</StatLabel>
                            </StatContent>
                            <StatIcon>
                                <HighlightOffIcon sx={{ fontSize: 64, color: "#fff" }} />
                            </StatIcon>
                        </StatCard>

                        <StatCard bgcolor="#EC407A">
                            <StatContent>
                                <StatValue>{report?.total_deleted || 0}</StatValue>
                                <StatLabel>Deleted</StatLabel>
                            </StatContent>
                            <StatIcon>
                                <DeleteForeverIcon sx={{ fontSize: 64, color: "#fff" }} />
                            </StatIcon>
                        </StatCard>
                    </Box>
                </Grid>

                {/* --- FILTER ROW --- */}
                <Grid item xs={12}>
                    <FilterRow>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: "#333",
                                mb: { xs: 1, sm: 0 },
                                textAlign: { xs: "center", sm: "left" },
                            }}
                        >
                            Banners
                        </Typography>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 2,
                                    justifyContent: { xs: "center", sm: "flex-start" },
                                    width: { xs: "100%", sm: "auto" },
                                }}
                            >
                                <DatePicker
                                    label="From Date"
                                    value={fromDate}
                                    onChange={(date) => setFromDate(date)}
                                    sx={{ background: "#fff", borderRadius: 1, minWidth: 140 }}
                                    format="DD-MM-YYYY"
                                />
                                <DatePicker
                                    label="To Date"
                                    value={toDate}
                                    onChange={(date) => setToDate(date)}
                                    sx={{ background: "#fff", borderRadius: 1, minWidth: 140 }}
                                    format="DD-MM-YYYY"
                                />
                                <Button
                                    variant="contained"
                                    onClick={generateReport}
                                    sx={{
                                        borderRadius: 2,
                                        fontWeight: 700,
                                        fontSize: 16,
                                        px: 3,
                                        py: 1,
                                        background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
                                        boxShadow: '0 2px 8px 0 rgba(33, 203, 243, 0.15)',
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    Generate Report
                                </Button>
                                <Button
                                    variant="contained"
                                    href="/add-new-banner/"
                                    sx={{
                                        borderRadius: 2,
                                        fontWeight: 700,
                                        fontSize: 16,
                                        px: 3,
                                        py: 1,
                                        background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
                                        boxShadow: '0 2px 8px 0 rgba(33, 203, 243, 0.15)',
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    Add New
                                </Button>
                            </Box>
                        </LocalizationProvider>
                    </FilterRow>
                </Grid>
            </Grid>

            {/* --- REPORT TABLE --- */}
            <BannersTransactions showServiceTrans={showServiceTrans} />
        </Layout>
    );
}

export default withAuth(BannersReport);
