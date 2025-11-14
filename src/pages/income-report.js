"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import IncomeTransactions from "@/components/IncomeReport/IncomeReport";
import {
    Grid,
    TableContainer,
    Paper,
    Typography,
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import RedeemIcon from '@mui/icons-material/Redeem';

function IncomeReport() {
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [report, setReport] = useState(null);
    const [selectedValue, setSelectedValue] = useState("");

    const dispatch = useDispatch();
    const [fromDate, setFromDate] = useState(dayjs().startOf('month'));
    const [toDate, setToDate] = useState(dayjs());

    useEffect(() => {
        const getTnx = async () => {
            const reqData = {
                from_date: fromDate.toISOString().split("T")[0],
                to_date: toDate.toISOString().split("T")[0],
            };
            try {
                const response = await api.post("/api/refferal-report/user-income-report", reqData);
                if (response.status === 200) {
                    setShowServiceTrans(response.data.data);
                    setReport(response.data.report);
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

    const rows = Array.isArray(showServiceTrans) ? showServiceTrans : [];

    const handleChange = (event) => setSelectedValue(event.target.value);

    const filteredRows =
        selectedValue !== ""
            ? rows.filter(
                (row) => row.plan_name && row.plan_name.toLowerCase() === selectedValue.toLowerCase()
            )
            : rows.filter((row) => {
                const term = searchTerm.toLowerCase();
                return (
                    (row.name && row.name.toLowerCase().includes(term)) ||
                    (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
                    (row.mobile && row.mobile.includes(searchTerm)) ||
                    (row.transaction_id && row.transaction_id.includes(searchTerm)) ||
                    (row.type && row.type.toLowerCase().includes(term)) ||
                    (row.tran_for && row.tran_for.toLowerCase().includes(term)) ||
                    (row.details && row.details.toLowerCase().includes(term))
                );
            });

    return (
        <Layout>
            <Box sx={{ p: 1.5 }}>
                {/* ======= Compact Stats Cards ======= */}
                <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    {[
                        { 
                            label: "Income Count", 
                            value: report?.total_incomeCount || 0, 
                            color: "#FFC107",
                            icon: <AttachMoneyIcon sx={{ fontSize: 28, color: "#FFC107" }} />
                        },
                        { 
                            label: "Repurchase", 
                            value: report?.total_repurchaseCount || 0, 
                            color: "#5C6BC0",
                            icon: <ShoppingCartIcon sx={{ fontSize: 28, color: "#5C6BC0" }} />
                        },
                        { 
                            label: "Affiliate Wallet", 
                            value: report?.total_affiliateToWallet || 0, 
                            color: "#26A69A",
                            icon: <AccountBalanceWalletIcon sx={{ fontSize: 28, color: "#26A69A" }} />
                        },
                        { 
                            label: "Redeem Count", 
                            value: report?.total_RedeemCount || 0, 
                            color: "#EC407A",
                            icon: <RedeemIcon sx={{ fontSize: 28, color: "#EC407A" }} />
                        },
                    ].map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper
                                sx={{
                                    height: 70,
                                    backgroundColor: '#f5f5f5',
                                    borderLeft: `4px solid ${card.color}`,
                                    borderRadius: "6px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: '12px',
                                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: card.color,
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 4px 12px ${card.color}80`,
                                        '& .MuiTypography-root, & .stat-value': {
                                            color: '#fff',
                                        },
                                        '& .stat-icon': {
                                            opacity: 0.8,
                                        }
                                    }
                                }}
                            >
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
                                    <Typography className="stat-value" sx={{ 
                                        color: '#000', 
                                        fontSize: '18px', 
                                        fontWeight: 700, 
                                        lineHeight: 1,
                                        transition: 'color 0.3s ease'
                                    }}>
                                        {card.value}
                                    </Typography>
                                </Box>
                                <Box className="stat-icon" sx={{ transition: 'all 0.3s ease' }}>
                                    {card.icon}
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* ======= Compact Filter Row ======= */}
                <TableContainer component={Paper} sx={{ p: 1.5, mb: 2 }}>
                    <Box sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 2,
                        flexWrap: 'wrap'
                    }}>
                        {/* Title */}
                        <Typography variant="h6" sx={{ 
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                            fontSize: '16px',
                            minWidth: 'fit-content'
                        }}>
                            Income Report
                        </Typography>

                        {/* Filter Dropdown */}
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Filter</InputLabel>
                            <Select
                                value={selectedValue}
                                label="Filter"
                                onChange={handleChange}
                                sx={{ height: '36px' }}
                            >
                                <MenuItem value="">Default</MenuItem>
                                <MenuItem value="Hybrid Prime">Hybrid Prime</MenuItem>
                                <MenuItem value="Booster Prime">Booster Plan</MenuItem>
                                <MenuItem value="Prime">Prime</MenuItem>
                                <MenuItem value="Prime B">Prime B</MenuItem>
                                <MenuItem value="Royality">Royality</MenuItem>
                                <MenuItem value="Repurchase">Repurchase</MenuItem>
                                <MenuItem value="Redeem">Redeem</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Search Field */}
                        <TextField
                            placeholder="Search..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: '#666', mr: 1, fontSize: 20 }} />,
                            }}
                            sx={{
                                width: "160px",
                                '& .MuiOutlinedInput-root': {
                                    height: '36px',
                                    fontSize: '0.8rem',
                                }
                            }}
                        />

                        {/* Date Pickers */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <DatePicker
                                    value={fromDate}
                                    format="DD/MM"
                                    onChange={(date) => setFromDate(date)}
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
                                    onChange={(date) => setToDate(date)}
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
                    </Box>
                </TableContainer>

                {/* Table Component */}
                <Box sx={{ mt: 2 }}> 
                    <IncomeTransactions showServiceTrans={filteredRows} />
                </Box>
            </Box>
        </Layout>
    );
}

export default withAuth(IncomeReport);