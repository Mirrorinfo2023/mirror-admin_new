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
    FormHelperText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Partners/transactions";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch } from "react-redux";

function TransactionHistory() {
    const dispatch = useDispatch();
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [partners, setPartners] = useState([]);
    const [partner_id, setPartnerId] = useState("");
    const [selectedValue, setSelectedValue] = useState("");
    const [amount, setAmount] = useState("");
    const [narration, setNarration] = useState("");
    const [errors, setErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [buttonHidden, setButtonHidden] = useState(false);
    const [totalPageCount, setTotalPageCount] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);

    const currentDate = new Date();
    const [fromDate, setFromDate] = useState(
        dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    );
    const [toDate, setToDate] = useState(dayjs(new Date()));

    //  Fetch partners
    useEffect(() => {
        const getPartners = async () => {
            try {
                const res = await api.post("/api/partner/get-partners");
                if (res.status === 200) setPartners(res.data.data || []);
            } catch (error) {
                dispatch(
                    callAlert({
                        message: error?.response?.data?.error || error.message,
                        type: "FAILED",
                    })
                );
            }
        };
        getPartners();
    }, [dispatch]);

    //  Fetch transactions
    const fetchData = async () => {
        const reqData = {
            from_date: fromDate.toISOString().split("T")[0],
            to_date: toDate.toISOString().split("T")[0],
            partner_id,
        };
        try {
            const response = await api.post(
                "/api/partner/get-partner-transactions",
                reqData
            );
            if (response.status === 200) {
                setShowServiceTrans(response.data.data || []);
                setTotalPageCount(response.data.totalPageCount);
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

    useEffect(() => {
        if (fromDate || toDate || partner_id) fetchData();
    }, [fromDate, toDate, partner_id, dispatch]);

    //  Validation
    const validateForm = () => {
        let tempErrors = {};
        if (!selectedValue) tempErrors.selectedValue = "Please select a transaction type.";
        if (!amount) tempErrors.amount = "Amount is required.";
        else if (parseFloat(amount) <= 0) tempErrors.amount = "Amount must be greater than 0.";
        if (!narration.trim()) tempErrors.narration = "Narration cannot be empty.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    //  Submit Credit/Debit
    const handleSubmit = async () => {
        if (!validateForm()) return;
        setButtonHidden(true);
        const formData = { amount, action: selectedValue, narration };
        try {
            const response = await api.post("/api/partner/credit-debit-wallet", formData);
            if (response) {
                alert(response.data.message);
                window.location.reload();
            }
        } catch (error) {
            console.error("Error submitting:", error);
        } finally {
            setButtonHidden(false);
            setOpenDialog(false);
        }
    };

    //  Search Filter
    const filteredRows = showServiceTrans.filter((row) => {
        const term = searchTerm.toLowerCase();
        return (
            row.first_name?.toLowerCase().includes(term) ||
            row.mlm_id?.includes(term) ||
            row.mobile?.includes(term) ||
            row.email?.toLowerCase().includes(term) ||
            row.sub_type?.toLowerCase().includes(term) ||
            row.recharge_type?.toLowerCase().includes(term) ||
            row.reference_no?.toLowerCase().includes(term) ||
            row.transaction_id?.toLowerCase().includes(term)
        );
    });

    const resetFilters = () => {
        setSearchTerm("");
        setPartnerId("");
        setFromDate(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
        setToDate(dayjs(new Date()));
    };

    return (
        <Layout>
            <Box sx={{ p: 0.5 }}>
                {/* Ultra Compact Filter Section */}
                <Paper sx={{ 
                    p: 0.75, 
                    mb: 1,
                    backgroundColor: '#fafafa',
                    border: '1px solid #e0e0e0'
                }}>
                    <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap',
                        gap: 0.5,
                        alignItems: 'center'
                    }}>
                        {/* Title with Icon */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mr: 0.5,
                            minWidth: 'fit-content'
                        }}>
                            <FilterAltIcon sx={{ fontSize: 16, color: '#667eea', mr: 0.5 }} />
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    fontWeight: 600,
                                    color: '#667eea',
                                    fontSize: '13px',
                                }}
                            >
                                Partner Transactions
                            </Typography>
                        </Box>

                        {/* Search Field */}
                        <TextField
                            placeholder="Search transactions..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />,
                            }}
                            sx={{ 
                                minWidth: { xs: '100%', sm: '140px' },
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '4px',
                                    backgroundColor: 'white',
                                    fontSize: '0.7rem',
                                    height: '30px',
                                    '& input': {
                                        padding: '6px 8px',
                                        height: '18px'
                                    }
                                }
                            }}
                        />

                        {/* Partner Dropdown */}
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel sx={{ fontSize: '0.7rem' }}>Partner</InputLabel>
                            <Select
                                value={partner_id}
                                label="Partner"
                                onChange={(e) => setPartnerId(e.target.value)}
                                sx={{ 
                                    height: '30px', 
                                    fontSize: '0.7rem',
                                    '& .MuiSelect-select': {
                                        padding: '6px 8px'
                                    }
                                }}
                            >
                                <MenuItem value="" sx={{ fontSize: '0.7rem' }}>All Partners</MenuItem>
                                {partners.map((partner) => (
                                    <MenuItem key={partner.id} value={partner.id} sx={{ fontSize: '0.7rem' }}>
                                        {partner.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Compact Date Range */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box display="flex" gap={0.5} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                                <DatePicker
                                    value={fromDate}
                                    format="DD/MM"
                                    onChange={(date) => setFromDate(date)}
                                    slotProps={{ 
                                        textField: { 
                                            size: "small",
                                            sx: { 
                                                minWidth: '90px',
                                                '& .MuiInputBase-root': {
                                                    height: '30px',
                                                    fontSize: '0.7rem'
                                                }
                                            }
                                        } 
                                    }}
                                />
                                <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
                                    to
                                </Typography>
                                <DatePicker
                                    value={toDate}
                                    format="DD/MM"
                                    onChange={(date) => setToDate(date)}
                                    slotProps={{ 
                                        textField: { 
                                            size: "small",
                                            sx: { 
                                                minWidth: '90px',
                                                '& .MuiInputBase-root': {
                                                    height: '30px',
                                                    fontSize: '0.7rem'
                                                }
                                            }
                                        } 
                                    }}
                                />
                            </Box>
                        </LocalizationProvider>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', ml: 'auto' }}>
                            {/* Refresh Button */}
                            <IconButton 
                                size="small" 
                                onClick={fetchData}
                                sx={{ 
                                    width: '30px', 
                                    height: '30px',
                                    backgroundColor: '#f0f0f0',
                                    '&:hover': { backgroundColor: '#e0e0e0' }
                                }}
                            >
                                <RefreshIcon sx={{ fontSize: 16, color: '#666' }} />
                            </IconButton>

                            {/* Add Credit/Debit Button */}
                            <Button
                                variant="contained"
                                startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                                onClick={() => setOpenDialog(true)}
                                size="small"
                                sx={{
                                    minWidth: '110px',
                                    background: '#2196f3',
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    fontSize: '0.7rem',
                                    height: '30px',
                                    px: 1
                                }}
                            >
                                Credit/Debit
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {/* Results Count */}
                <Box sx={{ mb: 0.5, px: 0.5 }}>
                    <Typography variant="caption" sx={{ 
                        color: 'text.secondary', 
                        fontSize: '0.7rem',
                        fontWeight: 500
                    }}>
                        Showing {filteredRows.length} transactions
                    </Typography>
                </Box>
            </Box>

            {/* Transactions Table */}
            <Box sx={{ px: 0.5, pb: 0.5 }}>
                <Transactions
                    showServiceTrans={filteredRows}
                    totalPageCount={totalPageCount}
                    setTotalPageCount={setTotalPageCount}
                />
            </Box>

            {/* Credit/Debit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ p: 1.5, fontSize: '1rem', fontWeight: 600 }}>
                    Credit / Debit Wallet
                </DialogTitle>
                <DialogContent dividers sx={{ p: 1.5 }}>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <FormControl size="small" error={!!errors.selectedValue}>
                            <InputLabel sx={{ fontSize: '0.8rem' }}>Transaction Type</InputLabel>
                            <Select
                                value={selectedValue}
                                label="Transaction Type"
                                onChange={(e) => setSelectedValue(e.target.value)}
                                sx={{ fontSize: '0.8rem' }}
                            >
                                <MenuItem value="" sx={{ fontSize: '0.8rem' }}>Select</MenuItem>
                                <MenuItem value="Credit" sx={{ fontSize: '0.8rem' }}>Credit</MenuItem>
                                <MenuItem value="Debit" sx={{ fontSize: '0.8rem' }}>Debit</MenuItem>
                            </Select>
                            {errors.selectedValue && (
                                <FormHelperText sx={{ fontSize: '0.7rem' }}>{errors.selectedValue}</FormHelperText>
                            )}
                        </FormControl>

                        <TextField
                            label="Amount"
                            variant="outlined"
                            type="number"
                            size="small"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            error={!!errors.amount}
                            helperText={errors.amount}
                            sx={{ 
                                '& .MuiInputBase-root': { fontSize: '0.8rem' },
                                '& .MuiFormHelperText-root': { fontSize: '0.7rem' }
                            }}
                        />

                        <TextField
                            label="Narration"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={narration}
                            onChange={(e) => setNarration(e.target.value)}
                            error={!!errors.narration}
                            helperText={errors.narration}
                            sx={{ 
                                '& .MuiInputBase-root': { fontSize: '0.8rem' },
                                '& .MuiFormHelperText-root': { fontSize: '0.7rem' }
                            }}
                        />
                    </Box>
                </DialogContent>

                <DialogActions sx={{ p: 1.5 }}>
                    <Button 
                        onClick={() => setOpenDialog(false)} 
                        size="small"
                        sx={{ fontSize: '0.8rem' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={buttonHidden}
                        size="small"
                        sx={{ fontSize: '0.8rem' }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
}

export default withAuth(TransactionHistory);