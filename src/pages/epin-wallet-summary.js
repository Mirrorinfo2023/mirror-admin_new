"use client";
import React, { useEffect, useState } from "react";
import {
    Grid,
    Button,
    TableContainer,
    Paper,
    Typography,
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
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

// Card styling
const Card = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: "center",
    color: "#fff",
    borderRadius: "12px",
    height: 100,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0px 3px 10px rgba(0,0,0,0.15)",
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

    return (
        <Layout>
            <Grid container spacing={2} sx={{ p: 2 }}>
             
                {/* Summary Cards - Full Width Row */}
                <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    sx={{ px: { xs: 2, sm: 4, md: 6 }, mt: 2, mb: 2 }}
                >
                    {/* Card 1 - Total Old Balance */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            sx={{
                                backgroundColor: "#FFC107",
                                color: "#fff",
                                textAlign: "center",
                                pl: 1,
                                borderRadius: 2,
                                height: 110,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                boxShadow: "0px 3px 8px rgba(0,0,0,0.2)",
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {masterReport.totalOldBal ?? 0}
                            </Typography>
                            <Typography variant="body2">Total Old Balance</Typography>
                        </Paper>
                    </Grid>

                    {/* Card 2 - Total New Balance */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            sx={{
                                backgroundColor: "#5C6BC0",
                                color: "#fff",
                                textAlign: "center",
                                pl: 1,
                                borderRadius: 2,
                                height: 110,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                boxShadow: "0px 3px 8px rgba(0,0,0,0.2)",
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {masterReport.totalNewBal ?? 0}
                            </Typography>
                            <Typography variant="body2">Total New Balance</Typography>
                        </Paper>
                    </Grid>

                    {/* Card 3 - Total Credit */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            sx={{
                                backgroundColor: "#26A69A",
                                color: "#fff",
                                textAlign: "center",
                                pl: 1,
                                borderRadius: 2,
                                height: 110,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                boxShadow: "0px 3px 8px rgba(0,0,0,0.2)",
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {masterReport.totalCredit ?? 0}
                            </Typography>
                            <Typography variant="body2">Total Credit</Typography>
                        </Paper>
                    </Grid>

                    {/* Card 4 - Total Debit */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Paper
                            sx={{
                                backgroundColor: "#EC407A",
                                color: "#fff",
                                textAlign: "center",
                                pl: 1,
                                borderRadius: 2,
                                height: 110,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                boxShadow: "0px 3px 8px rgba(0,0,0,0.2)",
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {masterReport.totalDebit ?? 0}
                            </Typography>
                            <Typography variant="body2">Total Debit</Typography>
                        </Paper>
                    </Grid>
                </Grid>



                {/* Filter Section */}
                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ p: 2, mt: 2 }}>
                        <Box
                            display="flex"
                            flexWrap={{ xs: "wrap", md: "nowrap" }}
                            justifyContent="space-between"
                            alignItems="center"
                            gap={2}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                User E-Pin Summary
                            </Typography>

                            <Box
                                display="flex"
                                flexWrap={{ xs: "wrap", md: "nowrap" }}
                                alignItems="center"
                                gap={2}
                                flex={1}
                                justifyContent={{ xs: "flex-start", md: "flex-end" }}
                            >
                                <FormControl size="small" sx={{ minWidth: 150 }}>
                                    <InputLabel>Transaction Type</InputLabel>
                                    <Select
                                        value={selectedValue}
                                        label="Transaction Type"
                                        onChange={(e) => setSelectedValue(e.target.value)}
                                    >
                                        <MenuItem value="">Default</MenuItem>
                                        <MenuItem value="Add Money">Add Money</MenuItem>
                                        <MenuItem value="Plan Purchase">Plan Purchase</MenuItem>
                                        <MenuItem value="Send Money">Send Money</MenuItem>
                                        <MenuItem value="Receive Money">Receive Money</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    size="small"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <SearchIcon sx={{ mr: 1, color: "action.active", fontSize: 20 }} />
                                        ),
                                    }}
                                    sx={{ width: { xs: "100%", sm: 200, md: 220 } }}
                                />

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="From Date"
                                        value={fromDate}
                                        format="DD-MM-YYYY"
                                        onChange={(newDate) => setFromDate(newDate)}
                                        slotProps={{ textField: { size: "small", sx: { minWidth: 140 } } }}
                                    />
                                    <DatePicker
                                        label="To Date"
                                        value={toDate}
                                        format="DD-MM-YYYY"
                                        onChange={(newDate) => setToDate(newDate)}
                                        slotProps={{ textField: { size: "small", sx: { minWidth: 140 } } }}
                                    />
                                </LocalizationProvider>

                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    href={`/credit-balance-to-user/?action=Credit`}
                                >
                                    Credit
                                </Button>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    size="small"
                                    href={`/credit-balance-to-user/?action=Debit`}
                                >
                                    Debit
                                </Button>
                            </Box>
                        </Box>
                    </TableContainer>
                </Grid>

                {/* Table Data */}
                <Grid item xs={12}>
                    <Transactions
                        showServiceTrans={filteredRows}
                        totalPageCount={totalPageCount}
                        setTotalPageCount={setTotalPageCount}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
}

export default withAuth(TransactionHistory);
