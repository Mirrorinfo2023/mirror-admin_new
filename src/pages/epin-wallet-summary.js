"use client";
import React, { useEffect, useState } from "react";
import {
    Grid,
    Button,
    Paper,
    Typography,
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Dashboard/User/epin_wallet";
import { callAlert } from "../../redux/actions/alert";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

function TransactionHistory() {
    const dispatch = useDispatch();
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [masterReport, setMasterReport] = useState({});
    const [selectedType, setSelectedType] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [totalPageCount, setTotalPageCount] = useState(1);

    const currentDate = new Date();
    const [fromDate, setFromDate] = useState(
        dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    );
    const [toDate, setToDate] = useState(dayjs(new Date()));

    // Fetch data - API handling unchanged
    useEffect(() => {
        const getTnx = async () => {
            const reqData = {
                from_date: fromDate.toISOString().split("T")[0],
                to_date: toDate.toISOString().split("T")[0],
            };

            try {
                const response = await api.post("/api/report/epin-wallet-summary", reqData);
                if (response.status === 200) {
                    setShowServiceTrans(response.data.data || []);
                    setTotalPageCount(response.data.totalPageCount || 1);
                    setMasterReport(response.data.report || {});
                }
            } catch (error) {
                const message =
                    error?.response?.data?.error || error.message || "Something went wrong";
                dispatch(callAlert({ message, type: "FAILED" }));
            }
        };
        getTnx();
    }, [fromDate, toDate, dispatch]);

    // Enhanced filter logic
    const filteredRows = (showServiceTrans || []).filter((row) => {
        const matchesType = selectedType === "" || row.sub_type === selectedType;
        const matchesStatus = selectedStatus === "" || row.status === selectedStatus;
        const matchesSearch =
            (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
            (row.mobile && row.mobile.includes(searchTerm)) ||
            (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.sub_type && row.sub_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.reference_no && row.reference_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.transaction_id && row.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesType && matchesStatus && matchesSearch;
    });

    // Ultra compact cards with icons
    const cards = [
        {
            label: "Old Bal",
            value: masterReport.totalOldBal ?? 0,
            color: "#FFC107",
            icon: <AccountBalanceWalletIcon sx={{ fontSize: 20, color: "#FFC107" }} />
        },
        {
            label: "New Bal",
            value: masterReport.totalNewBal ?? 0,
            color: "#5C6BC0",
            icon: <AccountBalanceIcon sx={{ fontSize: 20, color: "#5C6BC0" }} />
        },
        {
            label: "Credit",
            value: masterReport.totalCredit ?? 0,
            color: "#26A69A",
            icon: <TrendingUpIcon sx={{ fontSize: 20, color: "#26A69A" }} />
        },
        {
            label: "Debit",
            value: masterReport.totalDebit ?? 0,
            color: "#EC407A",
            icon: <TrendingDownIcon sx={{ fontSize: 20, color: "#EC407A" }} />
        }
    ];

    // E-Pin specific transaction types
    const transactionTypes = [
        "E-Pin Purchase",
        "E-Pin Transfer", 
        "E-Pin Redeem",
        "Commission",
        "Bonus",
        "Refund",
        "Reward"
    ];

    // Status options
    const statusOptions = [
        { value: "success", label: "Success" },
        { value: "pending", label: "Pending" },
        { value: "failed", label: "Failed" }
    ];

    return (
        <Layout>
            <Box sx={{ p: 1 }}>
                {/* Ultra Compact Stats Cards */}
                <Grid container spacing={1} sx={{ mb: 1.5 }}>
                    {cards.map((card, index) => (
                        <Grid item xs={6} sm={3} key={index}>
                            <Card sx={{ 
                                backgroundColor: '#f5f5f5', 
                                borderLeft: `3px solid ${card.color}`,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s ease-in-out',
                                height: '60px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px',
                                '&:hover': {
                                    backgroundColor: card.color,
                                    transform: 'translateY(-1px)',
                                    '& .MuiTypography-root': { color: '#fff' },
                                    '& .stat-icon': { color: '#fff' }
                                }
                            }}>
                                <Box sx={{ flex: 1, textAlign: 'left' }}>
                                    <Typography variant="subtitle2" sx={{ 
                                        fontSize: '10px', 
                                        fontWeight: 600, 
                                        color: '#666', 
                                        mb: 0.25,
                                        transition: 'color 0.2s ease'
                                    }}>
                                        {card.label}
                                    </Typography>
                                    <Typography sx={{ 
                                        color: '#000', 
                                        fontSize: '14px', 
                                        fontWeight: 700, 
                                        lineHeight: 1,
                                        transition: 'color 0.2s ease'
                                    }}>
                                        {card.value}
                                    </Typography>
                                </Box>
                                <Box className="stat-icon" sx={{ transition: 'color 0.2s ease' }}>
                                    {card.icon}
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Ultra Compact Filter Row */}
                <Paper sx={{ p: 1, mb: 1.5 }}>
                    <Box sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 1,
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
                            fontSize: '14px',
                            minWidth: 'fit-content'
                        }}>
                            E-Pin Wallet
                        </Typography>

                        {/* Search Field */}
                        <TextField
                            placeholder="Search name, mobile, ID..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: '#666', mr: 0.5, fontSize: 18 }} />,
                            }}
                            sx={{
                                width: "140px",
                                '& .MuiOutlinedInput-root': {
                                    height: '32px',
                                    fontSize: '0.75rem',
                                }
                            }}
                        />

                        {/* Transaction Type Filter */}
                        <FormControl size="small" sx={{ minWidth: 100 }}>
                            <InputLabel sx={{ fontSize: '0.8rem' }}>Type</InputLabel>
                            <Select
                                value={selectedType}
                                label="Type"
                                onChange={(e) => setSelectedType(e.target.value)}
                                sx={{ height: '32px', fontSize: '0.75rem' }}
                            >
                                <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All Types</MenuItem>
                                {transactionTypes.map((type) => (
                                    <MenuItem key={type} value={type} sx={{ fontSize: '0.75rem' }}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Status Filter */}
                        <FormControl size="small" sx={{ minWidth: 100 }}>
                            <InputLabel sx={{ fontSize: '0.8rem' }}>Status</InputLabel>
                            <Select
                                value={selectedStatus}
                                label="Status"
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                sx={{ height: '32px', fontSize: '0.75rem' }}
                            >
                                <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All Status</MenuItem>
                                {statusOptions.map((status) => (
                                    <MenuItem key={status.value} value={status.value} sx={{ fontSize: '0.75rem' }}>
                                        {status.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Date Range - Original API handling preserved */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                <DatePicker
                                    label="From Date"
                                    value={fromDate}
                                    format="DD-MM-YYYY"
                                    onChange={(newDate) => setFromDate(newDate)}
                                    slotProps={{ 
                                        textField: { 
                                            size: "small",
                                            sx: { minWidth: '140px' }
                                        } 
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
                                            sx: { minWidth: '140px' }
                                        } 
                                    }}
                                />
                            </Box>
                        </LocalizationProvider>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                color="success"
                                size="small"
                                href={`/credit-balance-to-user/?action=Credit`}
                                sx={{ 
                                    minWidth: '70px',
                                    height: '32px',
                                    fontSize: '0.7rem'
                                }}
                            >
                                Credit
                            </Button>
                            <Button
                                variant="contained"
                                color="warning"
                                size="small"
                                href={`/credit-balance-to-user/?action=Debit`}
                                sx={{ 
                                    minWidth: '70px',
                                    height: '32px',
                                    fontSize: '0.7rem'
                                }}
                            >
                                Debit
                            </Button>
                        </Box>

                        {/* Reset Filters Button */}
                        <button
                            onClick={() => {
                                setSelectedType("");
                                setSelectedStatus("");
                                setSearchTerm("");
                            }}
                            style={{
                                backgroundColor: '#f5f5f5',
                                color: '#666',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '0.7rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                height: '32px',
                                minWidth: '60px'
                            }}
                        >
                            Reset
                        </button>
                    </Box>
                </Paper>

                {/* Results Count */}
                <Box sx={{ mb: 1, px: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        Showing {filteredRows.length} of {showServiceTrans.length} records
                    </Typography>
                </Box>

                {/* Table Data */}
                <Transactions
                    showServiceTrans={filteredRows}
                    totalPageCount={totalPageCount}
                    setTotalPageCount={setTotalPageCount}
                />
            </Box>
        </Layout>
    );
}

export default withAuth(TransactionHistory);