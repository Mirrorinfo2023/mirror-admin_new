"use client"
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";
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
    Container,
    Paper,
    useTheme,
    useMediaQuery
} from "@mui/material";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { styled } from '@mui/material/styles';

// Styled components for modern UI
const FilterCard = styled(Card)(({ theme }) => ({
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    marginBottom: '24px',
    border: '1px solid rgba(0,0,0,0.05)',
}));

const StatCard = styled(Card)(({ theme, gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }) => ({
    background: gradient,
    color: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease-in-out',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
    },
}));

const CardContentStyled = styled(CardContent)(({ theme }) => ({
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    padding: '16px !important',
    width: '100%',
}));

const getDate = (timeZone) => {
    const dateString = timeZone;
    const dateObject = new Date(dateString);

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");

    const amOrPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);

    const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;

    return formattedDateTime;
};

function PrimeUserReport(props) {
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });

    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [...showServiceTrans];
    } else {
        rows = [];
    }

    const dispatch = useDispatch();
    const currentDate = new Date();
    const [fromDate, setFromDate] = React.useState(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
    const [toDate, setToDate] = React.useState(dayjs());

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
                    // Calculate stats from the data
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

    const handleFromDateChange = (date) => {
        setFromDate(date);
    };

    const handleToDateChange = (date) => {
        setToDate(date);
    };

    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    let filteredRows;

    if (selectedValue != '') {
        filteredRows = rows.filter(row => {
            return (
                (row.plan && row.plan.toLowerCase() === selectedValue.toLowerCase())
            );
        });
    } else {
        filteredRows = rows.filter(row => {
            return (
                (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (row.last_name && row.last_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
                (row.mobile && row.mobile.includes(searchTerm)) ||
                (row.order_no && row.order_no.includes(searchTerm)) ||
                (row.transaction_id && row.transaction_id.includes(searchTerm))
            );
        });
    }

    return (
        <Layout>
            <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
                {/* Header Section */}
                <Box sx={{ mb: 4 }}>


                    {/* Statistics Cards - Mobile Responsive */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6} sm={3}>
                            <StatCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                                <CardContentStyled>
                                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                        {stats.total}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>
                                        Total
                                    </Typography>
                                </CardContentStyled>
                            </StatCard>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <StatCard gradient="linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)">
                                <CardContentStyled>
                                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                        {stats.pending}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>
                                        Pending
                                    </Typography>
                                </CardContentStyled>
                            </StatCard>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <StatCard gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
                                <CardContentStyled>
                                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                        {stats.approved}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>
                                        Approved
                                    </Typography>
                                </CardContentStyled>
                            </StatCard>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                            <StatCard gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
                                <CardContentStyled>
                                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                                        {stats.rejected}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>
                                        Rejected
                                    </Typography>
                                </CardContentStyled>
                            </StatCard>
                        </Grid>
                    </Grid>
                </Box>

                {/* Filters Section */}
                <FilterCard>
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        {/* Section Header */}

                        <Typography
                            variant="h5"
                            component="h1"
                            sx={{
                                background: 'linear-gradient(135deg, #2f323eff 0%, #383041ff 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 2,
                            }}
                        >
                            Package Purchase Request
                        </Typography>

                        {/* Search and Filters Grid */}
                        <Grid container spacing={2} alignItems="center">
                            {/* Search Field - Full width on mobile */}
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    placeholder="Search by name, ID, mobile, order no..."
                                    variant="outlined"
                                    size="small"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            backgroundColor: 'rgba(0,0,0,0.02)',
                                        }
                                    }}
                                />
                            </Grid>

                            {/* Transaction Type Filter */}
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={selectedValue}
                                        label="Status"
                                        onChange={handleChange}
                                        sx={{
                                            borderRadius: '8px',
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: 'rgba(0,0,0,0.02)',
                                            }
                                        }}
                                    >
                                        <MenuItem value="">All Status</MenuItem>
                                        <MenuItem value="pending">Pending</MenuItem>
                                        <MenuItem value="approved">Approved</MenuItem>
                                        <MenuItem value="rejected">Rejected</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Date Range - Stack vertically on mobile */}
                            <Grid item xs={12} md={4}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Box sx={{
                                        display: 'flex',
                                        gap: 1,
                                        alignItems: 'center',
                                        flexDirection: isMobile ? 'column' : 'row'
                                    }}>
                                        <DatePicker
                                            label="From Date"
                                            value={fromDate}
                                            format="DD/MM/YYYY"
                                            onChange={handleFromDateChange}
                                            slotProps={{
                                                textField: {
                                                    size: 'small',
                                                    fullWidth: true,
                                                    sx: {
                                                        borderRadius: '8px',
                                                        mb: isMobile ? 1 : 0,
                                                        '& .MuiOutlinedInput-root': {
                                                            backgroundColor: 'rgba(0,0,0,0.02)',
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                        {!isMobile && (
                                            <Typography variant="body2" sx={{ color: 'text.secondary', mx: 1 }}>
                                                to
                                            </Typography>
                                        )}
                                        <DatePicker
                                            label="To Date"
                                            value={toDate}
                                            format="DD/MM/YYYY"
                                            onChange={handleToDateChange}
                                            slotProps={{
                                                textField: {
                                                    size: 'small',
                                                    fullWidth: true,
                                                    sx: {
                                                        borderRadius: '8px',
                                                        '& .MuiOutlinedInput-root': {
                                                            backgroundColor: 'rgba(0,0,0,0.02)',
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>
                                </LocalizationProvider>
                            </Grid>

                            {/* Quick Date Range Selector */}
                            <Grid item xs={12} md={2}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Quick Select</InputLabel>
                                    <Select
                                        value="all"
                                        label="Quick Select"
                                        sx={{
                                            borderRadius: '8px',
                                            '& .MuiOutlinedInput-root': {
                                                backgroundColor: 'rgba(0,0,0,0.02)',
                                            }
                                        }}
                                    >
                                        <MenuItem value="all">All Time</MenuItem>
                                        <MenuItem value="today">Today</MenuItem>
                                        <MenuItem value="week">This Week</MenuItem>
                                        <MenuItem value="month">This Month</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                    </CardContent>
                </FilterCard>

                {/* Table Section */}
                <Paper
                    sx={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}
                >

                </Paper>
            </Container>
            <PrimeUserTransactions showServiceTrans={filteredRows} />
        </Layout>
    );
}

export default withAuth(PrimeUserReport);