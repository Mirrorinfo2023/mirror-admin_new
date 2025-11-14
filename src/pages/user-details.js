"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Dashboard/User/details";
import {
    Grid,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Typography,
    Box,
    TextField,
    Card,
    CardContent,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

function TransactionHistory() {
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [masterReport, setMasterReport] = useState({});
    const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
    const [toDate, setToDate] = useState(dayjs());
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedValue, setSelectedValue] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const uid = Cookies.get("uid");

    useEffect(() => {
        const getTnx = async () => {
            const reqData = {
                from_date: fromDate.toISOString().split("T")[0],
                to_date: toDate.toISOString().split("T")[0],
            };
            try {
                const response = await api.post("/api/report/user-details", reqData);
                if (response.status === 200) {
                    setShowServiceTrans(response.data.data);
                    setMasterReport(response.data.report);
                }
            } catch (error) {
                const message =
                    error?.response?.data?.error || error.message || "Unknown error";
                dispatch(callAlert({ message, type: "FAILED" }));
            }
        };
        if (uid) getTnx();
    }, [uid, fromDate, toDate, dispatch]);

    const handleOKButtonClick = async () => {
        setLoading(true);
        try {
            const response = await api.post("/api/report/user-details", {
                filter: selectedValue,
                searchTerm,
            });
            if (response.data.status === 200) {
                setShowServiceTrans(response.data.data);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Compact card configurations with icons
    const cards = [
        {
            title: "Active",
            value: masterReport.totalActiveusers || 0,
            color: "#FFC107",
            icon: <PersonIcon sx={{ fontSize: 28, color: "#FFC107" }} />
        },
        {
            title: "Inactive",
            value: masterReport.totalInactiveusers || 0,
            color: "#5C6BC0",
            icon: <PersonOffIcon sx={{ fontSize: 28, color: "#5C6BC0" }} />
        },
        {
            title: "Prime",
            value: masterReport.totalPrimeusers || 0,
            color: "#26A69A",
            icon: <StarIcon sx={{ fontSize: 28, color: "#26A69A" }} />
        },
        {
            title: "Non-Prime",
            value: masterReport.totalNonprimeusers || 0,
            color: "#EC407A",
            icon: <StarBorderIcon sx={{ fontSize: 28, color: "#EC407A" }} />
        },
    ];

    return (
        <Layout>
            <Box sx={{ p: 1.5 }}>
                {/* Compact Stats Cards */}
                <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    {cards.map((card, index) => (
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
                                        {card.title}
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
                            User Details
                        </Typography>

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
                                width: "180px",
                                '& .MuiOutlinedInput-root': {
                                    height: '36px',
                                    fontSize: '0.8rem',
                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                }
                            }}
                        />

                        {/* Filter Dropdown */}
                        <FormControl size="small" sx={{ minWidth: 140 }}>
                            <InputLabel>Filter</InputLabel>
                            <Select
                                value={selectedValue}
                                label="Filter"
                                onChange={(e) => setSelectedValue(e.target.value)}
                                sx={{ 
                                    height: '36px',
                                    fontSize: '0.8rem',
                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                }}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="mlm_id">User ID</MenuItem>
                                <MenuItem value="first_name">Name</MenuItem>
                                <MenuItem value="mobile">Mobile</MenuItem>
                                <MenuItem value="email">Email</MenuItem>
                                <MenuItem value="ref_mlm_id">Referral ID</MenuItem>
                                <MenuItem value="ref_first_name">Referral Name</MenuItem>
                                <MenuItem value="wallet_balance">Wallet</MenuItem>
                                <MenuItem value="cashback_balance">Cashback</MenuItem>
                                <MenuItem value="city">City</MenuItem>
                                <MenuItem value="state">State</MenuItem>
                                <MenuItem value="pincode">Pincode</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Date Range */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <DatePicker
                                    value={fromDate}
                                    format="DD/MM"
                                    onChange={setFromDate}
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
                                    onChange={setToDate}
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

                        {/* Search Button */}
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleOKButtonClick}
                            sx={{
                                borderRadius: '6px',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                px: 3,
                                py: 0.8,
                                background: "#2198f3",
                                textTransform: "none",
                                whiteSpace: "nowrap",
                                height: '36px',
                                minWidth: '100px',
                                '&:hover': {
                                    background: "#1976d2",
                                }
                            }}
                        >
                            Search
                        </Button>
                    </Box>
                </Paper>

                {/* Table Section */}
                <Transactions showServiceTrans={showServiceTrans} />
            </Box>
        </Layout>
    );
}

export default withAuth(TransactionHistory);