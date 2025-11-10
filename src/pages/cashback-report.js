"use client";
import React, { useEffect, useState } from "react";
import {
    Grid,
    TableContainer,
    Paper,
    Typography,
    Box,
    TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Dashboard/User/cashback";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: "center",
    borderRadius: "12px",
    height: 100,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    boxShadow: "0px 3px 10px rgba(0,0,0,0.2)",
}));

function TransactionHistory() {
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [masterReport, setMasterReport] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();

    const currentDate = new Date();
    const [fromDate, setFromDate] = useState(
        dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    );
    const [toDate, setToDate] = useState(dayjs(new Date()));

    useEffect(() => {
        const getTnx = async () => {
            const reqData = {
                from_date: fromDate.toISOString().split("T")[0],
                to_date: toDate.toISOString().split("T")[0],
            };

            try {
                const response = await api.post("/api/report/cashback-report", reqData);
                if (response.status === 200) {
                    setShowServiceTrans(response.data.data);
                    setMasterReport(response.data.report);
                }
            } catch (error) {
                const message =
                    error?.response?.data?.error || error.message || "Something went wrong";
                dispatch(callAlert({ message, type: "FAILED" }));
            }
        };

        getTnx();
    }, [fromDate, toDate, dispatch]);

    const filteredRows = (showServiceTrans || []).filter((row) => {
        return (
            (row.first_name &&
                row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
            (row.mobile && row.mobile.includes(searchTerm)) ||
            (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.sub_type &&
                row.sub_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.recharge_type &&
                row.recharge_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.reference_no &&
                row.reference_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.transaction_id && row.transaction_id.includes(searchTerm))
        );
    });

    return (
        <Layout>
            <Box sx={{ p: { xs: 1, sm: 3 } }}>
                {/* Summary Cards */}
                <Grid container spacing={2} mb={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Item sx={{ backgroundColor: "#42A5F5" }}>
                            <Typography variant="h6">Opening Balance</Typography>
                            <Typography variant="h5" fontWeight={600}>
                                ₹{masterReport.OpeningBal ?? 0}
                            </Typography>
                        </Item>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Item sx={{ backgroundColor: "#66BB6A" }}>
                            <Typography variant="h6">Closing Balance</Typography>
                            <Typography variant="h5" fontWeight={600}>
                                ₹{masterReport.ClosingBal ?? 0}
                            </Typography>
                        </Item>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Item sx={{ backgroundColor: "#FFA726" }}>
                            <Typography variant="h6">Credit</Typography>
                            <Typography variant="h5" fontWeight={600}>
                                ₹{masterReport.Credit ?? 0}
                            </Typography>
                        </Item>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Item sx={{ backgroundColor: "#EF5350" }}>
                            <Typography variant="h6">Debit</Typography>
                            <Typography variant="h5" fontWeight={600}>
                                ₹{masterReport.Debit ?? 0}
                            </Typography>
                        </Item>
                    </Grid>
                </Grid>

                {/* Filters in One Row */}
                <Paper sx={{ p: 2, mb: 2 }}>


                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        sx={{
                            flexWrap: { xs: "wrap", md: "nowrap" }, // keep one row on desktop
                        }}
                    >
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                User Cashback Report
                            </Typography>

                        </Grid>

                        {/* Search */}
                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search by name, mobile, or ID"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon sx={{ mr: 1, color: "action.active", fontSize: 20 }} />
                                    ),
                                }}
                            />
                        </Grid>

                        {/* From Date */}
                        <Grid item xs={12} md={3}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="From Date"
                                    value={fromDate}
                                    format="DD-MM-YYYY"
                                    onChange={(newDate) => setFromDate(newDate)}
                                    slotProps={{
                                        textField: { fullWidth: true, size: "small" },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>

                        {/* To Date */}
                        <Grid item xs={12} md={3}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="To Date"
                                    value={toDate}
                                    format="DD-MM-YYYY"
                                    onChange={(newDate) => setToDate(newDate)}
                                    slotProps={{
                                        textField: { fullWidth: true, size: "small" },
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </Paper>


                {/* Table Section */}

            </Box>
            <Transactions showServiceTrans={filteredRows} />
        </Layout>
    );
}

export default withAuth(TransactionHistory);
