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
import { useDispatch } from "react-redux";

const FormCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: 12,
    boxShadow: "0px 4px 16px rgba(0,0,0,0.08)",
    marginBottom: theme.spacing(3),
    backgroundColor: "#fff",
}));

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
                if (res.status === 200) setPartners(res.data.data);
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
    useEffect(() => {
        const getTnx = async () => {
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
                    setShowServiceTrans(response.data.data);
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
        if (fromDate || toDate || partner_id) getTnx();
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

    return (
        <Layout>
            <Grid container justifyContent="center" sx={{ padding: 2 }}>
                <Grid item xs={12}>
                    {/*  Title + Button Row */}
                    <FormCard sx={{ position: "sticky", top: 0, zIndex: 10 }}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                            flexWrap="wrap"
                            gap={2}
                        >
                            <Typography variant="h6" fontWeight="bold">
                                Partner Transactions
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setOpenDialog(true)}
                                sx={{
                                    flex: { xs: "1 1 100%", sm: "0 0 auto" },
                                    background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                                    boxShadow: "0 2px 8px 0 rgba(33, 203, 243, 0.15)",
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Add Credit / Debit
                            </Button>
                        </Box>

                        {/*  Filter Row */}
                        <Box
                            display="flex"
                            alignItems="center"
                            flexWrap="wrap"
                            gap={2}
                            justifyContent="space-between"
                        >

                            {/* Search */}
                            <Box
                                display="flex"
                                alignItems="center"
                                gap={1}
                                sx={{ flex: 1, minWidth: 200 }}
                            >
                                <SearchIcon color="action" />
                                <TextField
                                    placeholder="Search..."
                                    variant="outlined"
                                    size="small"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    sx={{ width: "100%" }}
                                />
                            </Box>


                            {/* Partner Dropdown */}
                            <FormControl sx={{ minWidth: 180, flex: 1 }}>
                                <InputLabel>Partner</InputLabel>
                                <Select
                                    value={partner_id}
                                    label="Partner"
                                    onChange={(e) => setPartnerId(e.target.value)}
                                    size="small"
                                >
                                    <MenuItem value="">Choose Partner</MenuItem>
                                    {partners.map((partner) => (
                                        <MenuItem key={partner.id} value={partner.id}>
                                            {partner.name} - {partner.company_code}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/* Dates */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="From Date"
                                    value={fromDate}
                                    onChange={(date) => setFromDate(date)}
                                    format="DD-MM-YYYY"
                                    slotProps={{ textField: { size: "small" } }}
                                />
                                <DatePicker
                                    label="To Date"
                                    value={toDate}
                                    onChange={(date) => setToDate(date)}
                                    format="DD-MM-YYYY"
                                    slotProps={{ textField: { size: "small" } }}
                                />
                            </LocalizationProvider>

                        </Box>
                    </FormCard>
                </Grid>
            </Grid>

            {/*  Transactions Table */}
            <Transactions
                showServiceTrans={filteredRows}
                totalPageCount={totalPageCount}
                setTotalPageCount={setTotalPageCount}
            />

            {/*  Credit/Debit Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>Credit / Debit Wallet</DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" flexWrap="wrap" alignItems="center" gap={2} mt={1}>
                        <FormControl sx={{ minWidth: 180, flex: 1 }} error={!!errors.selectedValue}>
                            <InputLabel>Transaction Type</InputLabel>
                            <Select
                                value={selectedValue}
                                label="Transaction Type"
                                onChange={(e) => setSelectedValue(e.target.value)}
                            >
                                <MenuItem value="">Select</MenuItem>
                                <MenuItem value="Credit">Credit</MenuItem>
                                <MenuItem value="Debit">Debit</MenuItem>
                            </Select>
                            {errors.selectedValue && <FormHelperText>{errors.selectedValue}</FormHelperText>}
                        </FormControl>

                        <TextField
                            label="Amount"
                            variant="outlined"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            error={!!errors.amount}
                            helperText={errors.amount}
                            sx={{ flex: 1, minWidth: 150 }}
                        />

                        <TextField
                            label="Narration"
                            variant="outlined"
                            fullWidth
                            value={narration}
                            onChange={(e) => setNarration(e.target.value)}
                            error={!!errors.narration}
                            helperText={errors.narration}
                            sx={{ flex: 2, minWidth: 250 }}
                        />
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleSubmit}
                        disabled={buttonHidden}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
}

export default withAuth(TransactionHistory);
