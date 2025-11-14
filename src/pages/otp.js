"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import OtpTransactions from "@/components/Otp/Otp";
import { 
    Grid,
    Paper, 
    Typography, 
    Box, 
    TextField,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import MessageIcon from "@mui/icons-material/Message";
import TimerOffIcon from "@mui/icons-material/TimerOff";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function OtpReport(props) {
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [masterReport, setmasterReport] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
    const [toDate, setToDate] = useState(dayjs());
    const dispatch = useDispatch();
    const uid = Cookies.get('uid');

    // Fetch OTP data with filters
    const fetchOtpData = async (filters = {}) => {
        try {
            const reqData = {
                from_date: fromDate.toISOString().split("T")[0],
                to_date: toDate.toISOString().split("T")[0],
                searchTerm,
                status: selectedStatus,
                ...filters
            };

            const response = await api.post("/api/report/otp", reqData);
            if (response.status === 200) {
                setShowServiceTrans(response.data.otpResult || []);
                setmasterReport(response.data.report || {});
            }
        } catch (error) {
            console.error("Error fetching OTP data:", error);
            // Add error handling if needed
        }
    };

    useEffect(() => {
        fetchOtpData();
    }, [fromDate, toDate]);

    // Handle search and filter changes
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const handleFromDateChange = (date) => {
        setFromDate(date);
    };

    const handleToDateChange = (date) => {
        setToDate(date);
    };

    // Apply filters
    const handleApplyFilters = () => {
        fetchOtpData({
            searchTerm,
            status: selectedStatus
        });
    };

    // Reset filters
    const handleResetFilters = () => {
        setSearchTerm("");
        setSelectedStatus("");
        setFromDate(dayjs().startOf("month"));
        setToDate(dayjs());
        fetchOtpData();
    };

    // Compact card configurations with icons
    const cards = [
        {
            label: "Total OTP",
            value: masterReport.totalSms ?? 0,
            color: "#FFC107",
            icon: <MessageIcon sx={{ fontSize: 28, color: "#FFC107" }} />
        },
        {
            label: "Expired",
            value: masterReport.totalExpsms ?? 0,
            color: "#5C6BC0",
            icon: <TimerOffIcon sx={{ fontSize: 28, color: "#5C6BC0" }} />
        },
        {
            label: "Active",
            value: masterReport.totalActivesms ?? 0,
            color: "#26A69A",
            icon: <AccessTimeIcon sx={{ fontSize: 28, color: "#26A69A" }} />
        }
    ];

    return (
        <Layout>
            <Box sx={{ p: 1.5 }}>
                {/* Compact Stats Cards */}
                <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    {cards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{ 
                                backgroundColor: '#f5f5f5', 
                                borderLeft: `4px solid ${card.color}`,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease-in-out',
                                height: '70px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px',
                                '&:hover': {
                                    backgroundColor: card.color,
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 4px 12px ${card.color}80`,
                                    '& .MuiTypography-root': { color: '#fff' },
                                    '& .stat-icon': { color: '#fff' }
                                }
                            }}>
                                <Box sx={{ flex: 1, textAlign: 'left' }}>
                                    <Typography variant="subtitle2" sx={{ 
                                        fontSize: '12px', 
                                        fontWeight: 600, 
                                        color: '#666', 
                                        mb: 0.5,
                                        transition: 'color 0.3s ease'
                                    }}>
                                        {card.label}
                                    </Typography>
                                    <Typography sx={{ 
                                        color: '#000', 
                                        fontSize: '18px', 
                                        fontWeight: 700, 
                                        lineHeight: 1,
                                        transition: 'color 0.3s ease'
                                    }}>
                                        {card.value}
                                    </Typography>
                                </Box>
                                <Box className="stat-icon" sx={{ transition: 'color 0.3s ease' }}>
                                    {card.icon}
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Compact Filter Row */}
                <Paper sx={{ p: 1.5, mb: 2 }}>
                    <Box sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 1.5,
                        flexWrap: 'wrap'
                    }}>
                        {/* Title */}
                        <Typography variant="h6" sx={{ 
                            fontWeight: "bold",
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            whiteSpace: "nowrap",
                            fontSize: '16px',
                            minWidth: 'fit-content'
                        }}>
                            OTP Report
                        </Typography>

                        {/* Search Field */}
                        <TextField
                            placeholder="Search mobile, OTP..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: '#666', mr: 1, fontSize: 20 }} />,
                            }}
                            sx={{
                                width: "180px",
                                '& .MuiOutlinedInput-root': {
                                    height: '36px',
                                    fontSize: '0.8rem',
                                }
                            }}
                        />

                        {/* Status Filter */}
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={selectedStatus}
                                label="Status"
                                onChange={handleStatusChange}
                                sx={{ height: '36px', fontSize: '0.8rem' }}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="expired">Expired</MenuItem>
                                <MenuItem value="used">Used</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Date Range */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <DatePicker
                                    value={fromDate}
                                    format="DD/MM"
                                    onChange={handleFromDateChange}
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            placeholder: "From",
                                            sx: {
                                                width: 100,
                                                '& .MuiInputBase-root': {
                                                    height: 36,
                                                    fontSize: '0.8rem'
                                                }
                                            }
                                        }
                                    }}
                                />
                                <Typography variant="caption" sx={{ color: 'text.secondary', mx: 0.5 }}>
                                    to
                                </Typography>
                                <DatePicker
                                    value={toDate}
                                    format="DD/MM"
                                    onChange={handleToDateChange}
                                    slotProps={{
                                        textField: {
                                            size: "small",
                                            placeholder: "To",
                                            sx: {
                                                width: 100,
                                                '& .MuiInputBase-root': {
                                                    height: 36,
                                                    fontSize: '0.8rem'
                                                }
                                            }
                                        }
                                    }}
                                />
                            </Box>
                        </LocalizationProvider>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <button
                                onClick={handleApplyFilters}
                                style={{
                                    backgroundColor: '#2196f3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '8px 16px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    height: '36px',
                                    minWidth: '80px'
                                }}
                            >
                                Apply
                            </button>
                            <button
                                onClick={handleResetFilters}
                                style={{
                                    backgroundColor: '#f5f5f5',
                                    color: '#666',
                                    border: '1px solid #ddd',
                                    borderRadius: '6px',
                                    padding: '8px 16px',
                                    fontSize: '0.8rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    height: '36px',
                                    minWidth: '80px'
                                }}
                            >
                                Reset
                            </button>
                        </Box>
                    </Box>
                </Paper>

                {/* Table Section */}
                <OtpTransactions showServiceTrans={showServiceTrans} searchTerm={searchTerm} />
            </Box>
        </Layout>
    );
}

export default withAuth(OtpReport);