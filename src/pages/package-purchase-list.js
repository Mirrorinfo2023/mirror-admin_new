"use client"
import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import PrimeUserTransactions from "@/components/UserReport/PackagePurchase";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
} from "@mui/material";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

function PrimeUserReport(props) {
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });

    let rows = showServiceTrans && showServiceTrans.length > 0 ? [...showServiceTrans] : [];

    const dispatch = useDispatch();
    const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
    const [toDate, setToDate] = useState(dayjs());
    const [selectedValue, setSelectedValue] = useState('');

    useEffect(() => {
        const getTnx = async () => {
            const reqData = {
                from_date: fromDate.toISOString().split('T')[0],
                to_date: toDate.toISOString().split('T')[0],
            }

            try {
                const response = await api.post("/api/package/package-purchase-request", reqData);
                if (response.status === 200) {
                    setShowServiceTrans(response.data.data);
                    if (response.data.data) {
                        const data = response.data.data;
                        setStats({
                            total: data.length,
                            pending: data.filter(item => item.status === 'pending').length,
                            approved: data.filter(item => item.status === 'approved').length,
                            rejected: data.filter(item => item.status === 'rejected').length
                        });
                    }
                }
            } catch (error) {
                if (error?.response?.data?.error) {
                    dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
                } else {
                    dispatch(callAlert({ message: error.message, type: 'FAILED' }))
                }
            }
        }

        if (fromDate || toDate) {
            getTnx();
        }
    }, [fromDate, toDate, dispatch]);

    const handleFromDateChange = (date) => setFromDate(date);
    const handleToDateChange = (date) => setToDate(date);
    const handleChange = (event) => setSelectedValue(event.target.value);

    let filteredRows = selectedValue !== '' 
        ? rows.filter(row => row.plan && row.plan.toLowerCase() === selectedValue.toLowerCase())
        : rows.filter(row => 
            (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.last_name && row.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
            (row.mobile && row.mobile.includes(searchTerm)) ||
            (row.order_no && row.order_no.includes(searchTerm)) ||
            (row.transaction_id && row.transaction_id.includes(searchTerm))
        );

    return (
        <Layout>
            <Box sx={{ p: 1.5 }}>
                {/* Compact Stats Cards */}
                <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    {[
                        { 
                            label: "Total", 
                            value: stats.total, 
                            color: "#667eea",
                            icon: <ShoppingCartIcon sx={{ fontSize: 28, color: "#667eea" }} />
                        },
                        { 
                            label: "Pending", 
                            value: stats.pending, 
                            color: "#11998e",
                            icon: <PendingActionsIcon sx={{ fontSize: 28, color: "#11998e" }} />
                        },
                        { 
                            label: "Approved", 
                            value: stats.approved, 
                            color: "#ff6b6b",
                            icon: <CheckCircleIcon sx={{ fontSize: 28, color: "#ff6b6b" }} />
                        },
                        { 
                            label: "Rejected", 
                            value: stats.rejected, 
                            color: "#a8a8a8",
                            icon: <CancelIcon sx={{ fontSize: 28, color: "#a8a8a8" }} />
                        },
                    ].map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
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
                            background: 'linear-gradient(135deg, #2f323e 0%, #383041 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            whiteSpace: "nowrap",
                            fontSize: '16px',
                            minWidth: 'fit-content'
                        }}>
                            Package Requests
                        </Typography>

                        {/* Search Field */}
                        <TextField
                            placeholder="Search name, ID, mobile, order no..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: '#666', mr: 1, fontSize: 20 }} />,
                            }}
                            sx={{
                                width: "200px",
                                '& .MuiOutlinedInput-root': {
                                    height: '36px',
                                    fontSize: '0.8rem',
                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                }
                            }}
                        />

                        {/* Status Filter */}
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={selectedValue}
                                label="Status"
                                onChange={handleChange}
                                sx={{ 
                                    height: '36px',
                                    fontSize: '0.8rem',
                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                }}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="pending">Pending</MenuItem>
                                <MenuItem value="approved">Approved</MenuItem>
                                <MenuItem value="rejected">Rejected</MenuItem>
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
                                                    fontSize: '0.8rem',
                                                    backgroundColor: 'rgba(0,0,0,0.02)',
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
                                                    fontSize: '0.8rem',
                                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                                }
                                            }
                                        }
                                    }}
                                />
                            </Box>
                        </LocalizationProvider>

                        {/* Quick Select */}
                        <FormControl size="small" sx={{ minWidth: 110 }}>
                            <InputLabel>Period</InputLabel>
                            <Select
                                value="all"
                                label="Period"
                                sx={{ 
                                    height: '36px',
                                    fontSize: '0.8rem',
                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                }}
                            >
                                <MenuItem value="all">All Time</MenuItem>
                                <MenuItem value="today">Today</MenuItem>
                                <MenuItem value="week">This Week</MenuItem>
                                <MenuItem value="month">This Month</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Paper>

                {/* Table Section */}
                <PrimeUserTransactions showServiceTrans={filteredRows} />
            </Box>
        </Layout>
    );
}

export default withAuth(PrimeUserReport);