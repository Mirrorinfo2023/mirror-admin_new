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
import { styled } from "@mui/material/styles";
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

// Compact StatCard Design
const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: '8px',
  height: '90px',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  flex: 1,
  minWidth: '160px',
}));

const FilterCard = styled(Paper)(({ theme }) => ({
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  marginBottom: '16px',
  border: '1px solid rgba(0,0,0,0.05)',
}));

function TransactionHistory() {
    const dispatch = useDispatch();
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [masterReport, setMasterReport] = useState({});
    const [selectedValue, setSelectedValue] = useState("");
    const [totalPageCount, setTotalPageCount] = useState(1);

    const currentDate = new Date();
    const [fromDate, setFromDate] = useState(
        dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    );
    const [toDate, setToDate] = useState(dayjs(new Date()));

    // Fetch data
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

    // Filter logic
    const filteredRows = (showServiceTrans || []).filter((row) => {
        const matchesSearch =
            (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
            (row.mobile && row.mobile.includes(searchTerm)) ||
            (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.sub_type && row.sub_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.reference_no && row.reference_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.transaction_id && row.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!selectedValue) return matchesSearch;
        return row.sub_type && row.sub_type.toLowerCase().includes(selectedValue.toLowerCase()) && matchesSearch;
    });

    const cards = [
        {
            label: "Total Old Balance",
            value: masterReport.totalOldBal ?? 0,
            color: "#FFC107"
        },
        {
            label: "Total New Balance",
            value: masterReport.totalNewBal ?? 0,
            color: "#5C6BC0"
        },
        {
            label: "Total Credit",
            value: masterReport.totalCredit ?? 0,
            color: "#26A69A"
        },
        {
            label: "Total Debit",
            value: masterReport.totalDebit ?? 0,
            color: "#EC407A"
        }
    ];

    return (
        <Layout>
            <Box sx={{ p: 1.5 }}>
                {/* Compact Statistics Cards */}
                <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                        <Box sx={{ 
                            display: "flex", 
                            gap: 1.5, 
                            flexWrap: "wrap",
                        }}>
                            {cards.map((card, index) => (
                                <StatCard 
                                    key={index}
                                    sx={{ 
                                        backgroundColor: '#f5f5f5', 
                                        borderLeft: `4px solid ${card.color}`,
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                        '&:hover': {
                                            backgroundColor: card.color,
                                            boxShadow: `0 8px 25px ${card.color}80`,
                                            transform: 'translateY(-2px)',
                                            '& .MuiTypography-root': {
                                                color: 'white',
                                            }
                                        }
                                    }}
                                >
                                    <CardContent sx={{ 
                                        padding: '12px !important', 
                                        width: '100%',
                                        textAlign: 'center',
                                        '&:last-child': { pb: '12px' }
                                    }}>
                                        <Typography 
                                            variant="h5" 
                                            sx={{ 
                                                color: '#000000', 
                                                transition: 'color 0.3s ease', 
                                                fontWeight: 700, 
                                                fontSize: '20px', 
                                                mb: 0.5,
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {card.value}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: '#000000', 
                                                transition: 'color 0.3s ease', 
                                                fontWeight: 600,
                                                fontSize: '12px',
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {card.label}
                                        </Typography>
                                    </CardContent>
                                </StatCard>
                            ))}
                        </Box>
                    </Grid>
                </Grid>

                {/* Compact Filter Section */}
                <Grid item xs={12}>
                    <FilterCard>
                        <Box sx={{ p: 2 }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    mb: 2,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem'
                                }}
                            >
                                User E-Pin Summary
                            </Typography>

                            <Box sx={{ 
                                display: 'flex', 
                                flexWrap: 'wrap',
                                gap: 1.5,
                                alignItems: 'center'
                            }}>
                                <TextField
                                    placeholder="Search"
                                    variant="outlined"
                                    size="small"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon color="action" sx={{ fontSize: 20, mr: 1 }} />,
                                    }}
                                    sx={{ 
                                        minWidth: { xs: '100%', sm: '180px' },
                                        flex: 1,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            backgroundColor: 'rgba(0,0,0,0.02)',
                                        }
                                    }}
                                />

                                <FormControl size="small" sx={{ minWidth: 160 }}>
                                    <InputLabel>Transaction Type</InputLabel>
                                    <Select
                                        value={selectedValue}
                                        label="Transaction Type"
                                        onChange={(e) => setSelectedValue(e.target.value)}
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="Add Money">Add Money</MenuItem>
                                        <MenuItem value="Plan Purchase">Plan Purchase</MenuItem>
                                        <MenuItem value="Send Money">Send Money</MenuItem>
                                        <MenuItem value="Receive Money">Receive Money</MenuItem>
                                    </Select>
                                </FormControl>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Box display="flex" gap={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
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

                                <Box display="flex" gap={1} sx={{ flexWrap: 'wrap' }}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        href={`/credit-balance-to-user/?action=Credit`}
                                        sx={{ minWidth: '80px' }}
                                    >
                                        Credit
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        size="small"
                                        href={`/credit-balance-to-user/?action=Debit`}
                                        sx={{ minWidth: '80px' }}
                                    >
                                        Debit
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </FilterCard>
                </Grid>
            </Box>
            
            {/* Table Data */}
            <Transactions
                showServiceTrans={filteredRows}
                totalPageCount={totalPageCount}
                setTotalPageCount={setTotalPageCount}
            />
        </Layout>
    );
}

export default withAuth(TransactionHistory);