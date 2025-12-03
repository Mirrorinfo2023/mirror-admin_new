"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import OTTTransactions from "@/components/OTTLinks/OTTLinkReport";
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
import LinkIcon from "@mui/icons-material/Link";
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

// Loading Component
const LoadingOverlay = () => (
    <Box
        sx={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }}
    >
        <Box
            sx={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Box
                sx={{
                    width: 150,
                    height: 150,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}
            >
                <img
                    src="/loader.gif"
                    alt="Loading..."
                    width="150"
                    height="150"
                    style={{
                        borderRadius: '50%',
                        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                    onError={(e) => {
                        // Hide broken image and show CSS loader
                        e.target.style.display = 'none';
                        const fallback = document.querySelector('.fallback-loader');
                        if (fallback) fallback.style.display = 'block';
                    }}
                />
                {/* Fallback CSS loader - hidden by default */}
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        border: '6px solid #f3f3f3',
                        borderTop: '6px solid #1976d2',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        display: 'none',
                    }}
                    className="fallback-loader"
                />
            </Box>

            <Typography
                sx={{
                    mt: 3,
                    fontWeight: 600,
                    color: "#1976d2",
                    fontSize: '1.3rem',
                }}
            >
                Loading OTT Links...
            </Typography>
        </Box>
    </Box>
);

function OttReports() {
    const [report, setReport] = useState(null);
    const [ottLinks, setOttLinks] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const today = dayjs();
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);

    useEffect(() => {
        generateReport();
    }, []);

    const generateReport = async () => {
        setLoading(true);

        const reqData = {
            from_date: fromDate.toISOString().split("T")[0],
            to_date: toDate.toISOString().split("T")[0],
        };

        try {
            // Changed API endpoint to OTT links
            const response = await api.post("/api/ott/get-ott-links", reqData);

            if (response.status === 200) {
                setOttLinks(response.data.data || []);
                setReport(response.data.report || {
                    total_count: response.data.data?.length || 0,
                    total_active: response.data.data?.filter(item => item.status === 1)?.length || 0,
                    total_inactive: response.data.data?.filter(item => item.status === 2)?.length || 0,
                    total_deleted: response.data.data?.filter(item => item.status === 0)?.length || 0
                });
            }
        } catch (error) {
            const msg = error?.response?.data?.error || error.message;
            dispatch(callAlert({ message: msg, type: "FAILED" }));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await api.post("/api/ott/update-ott-status", {
                id: id,
                status: 0,
                action: 'Delete'
            });

            if (response.data.status === 200) {
                dispatch(callAlert({ message: "OTT link deleted successfully", type: "SUCCESS" }));
                generateReport();
            }
        } catch (error) {
            const msg = error?.response?.data?.error || error.message;
            dispatch(callAlert({ message: msg, type: "FAILED" }));
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await api.post("/api/ott/update-ott-status", {
                id: id,
                status: newStatus,
                action: newStatus === 1 ? 'Active' : 'Inactive'
            });

            if (response.data.status === 200) {
                dispatch(callAlert({ 
                    message: `OTT link ${newStatus === 1 ? 'activated' : 'deactivated'} successfully`, 
                    type: "SUCCESS" 
                }));
                generateReport();
            }
        } catch (error) {
            const msg = error?.response?.data?.error || error.message;
            dispatch(callAlert({ message: msg, type: "FAILED" }));
        }
    };

    return (
        <Layout>
            {loading && <LoadingOverlay />}

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
                        <StatCard
                            sx={{
                                backgroundColor: '#f5f5f5',
                                borderLeft: '4px solid #667eea',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    backgroundColor: '#667eea',
                                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)',
                                    transform: 'translateY(-4px)',
                                    '& .MuiTypography-root': {
                                        color: 'white',
                                    }
                                }
                            }}
                        >
                            <StatContent>
                                <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease' }}>
                                    {report?.total_count || 0}
                                </StatValue>
                                <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease' }}>
                                    Total OTT Links
                                </StatLabel>
                            </StatContent>
                            <StatIcon>
                                <LinkIcon sx={{ fontSize: 64, color: "#667eea", transition: 'color 0.3s ease' }} />
                            </StatIcon>
                        </StatCard>

                        <StatCard
                            sx={{
                                backgroundColor: '#f5f5f5',
                                borderLeft: '4px solid #11998e',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    backgroundColor: '#11998e',
                                    boxShadow: '0 8px 25px rgba(17, 153, 142, 0.5)',
                                    transform: 'translateY(-4px)',
                                    '& .MuiTypography-root': {
                                        color: 'white',
                                    }
                                }
                            }}
                        >
                            <StatContent>
                                <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease' }}>
                                    {report?.total_active || 0}
                                </StatValue>
                                <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease' }}>
                                    Active
                                </StatLabel>
                            </StatContent>
                            <StatIcon>
                                <CheckCircleIcon sx={{ fontSize: 64, color: "#11998e", transition: 'color 0.3s ease' }} />
                            </StatIcon>
                        </StatCard>

                        <StatCard
                            sx={{
                                backgroundColor: '#f5f5f5',
                                borderLeft: '4px solid #ff6b6b',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    backgroundColor: '#ff6b6b',
                                    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.5)',
                                    transform: 'translateY(-4px)',
                                    '& .MuiTypography-root': {
                                        color: 'white',
                                    }
                                }
                            }}
                        >
                            <StatContent>
                                <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease' }}>
                                    {report?.total_inactive || 0}
                                </StatValue>
                                <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease' }}>
                                    Inactive
                                </StatLabel>
                            </StatContent>
                            <StatIcon>
                                <HighlightOffIcon sx={{ fontSize: 64, color: "#ff6b6b", transition: 'color 0.3s ease' }} />
                            </StatIcon>
                        </StatCard>

                        <StatCard
                            sx={{
                                backgroundColor: '#f5f5f5',
                                borderLeft: '4px solid #a8a8a8',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    backgroundColor: '#a8a8a8',
                                    boxShadow: '0 8px 25px rgba(168, 168, 168, 0.5)',
                                    transform: 'translateY(-4px)',
                                    '& .MuiTypography-root': {
                                        color: 'white',
                                    }
                                }
                            }}
                        >
                            <StatContent>
                                <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease' }}>
                                    {report?.total_deleted || 0}
                                </StatValue>
                                <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease' }}>
                                    Deleted
                                </StatLabel>
                            </StatContent>
                            <StatIcon>
                                <DeleteForeverIcon sx={{ fontSize: 64, color: "#a8a8a8", transition: 'color 0.3s ease' }} />
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
                            OTT Links Report
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
                                    disabled={loading}
                                    sx={{
                                        borderRadius: 2,
                                        fontWeight: 700,
                                        fontSize: 16,
                                        px: 3,
                                        py: 1,
                                        background: '#2198f3',
                                        boxShadow: '0 2px 8px 0 rgba(33, 203, 243, 0.15)',
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap',
                                        '&:disabled': {
                                            background: '#ccc',
                                            boxShadow: 'none',
                                        }
                                    }}
                                >
                                    {loading ? 'Generating...' : 'Generate Report'}
                                </Button>
                                <Button
                                    variant="contained"
                                    href="/add-new-ott-link"
                                    disabled={loading}
                                    sx={{
                                        borderRadius: 2,
                                        fontWeight: 700,
                                        fontSize: 16,
                                        px: 3,
                                        py: 1,
                                        background: '#4CAF50',
                                        boxShadow: '0 2px 8px 0 rgba(76, 175, 80, 0.15)',
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap',
                                        '&:disabled': {
                                            background: '#ccc',
                                            boxShadow: 'none',
                                        }
                                    }}
                                >
                                    + Add New OTT Link
                                </Button>
                            </Box>
                        </LocalizationProvider>
                    </FilterRow>
                </Grid>
            </Grid>

            {/* --- REPORT TABLE --- */}
            <OTTTransactions 
                ottLinks={ottLinks} 
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                refreshReport={generateReport}
            />

            <style jsx global>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </Layout>
    );
}

export default withAuth(OttReports);