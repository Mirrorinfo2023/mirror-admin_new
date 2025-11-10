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

function IncomeReport() {
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [report, setReport] = useState(null);
    const [selectedValue, setSelectedValue] = useState("");

    const dispatch = useDispatch();
    const currentDate = new Date();
    const [fromDate, setFromDate] = useState(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
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
            <Grid container spacing={3} sx={{ paddingY: 2 }}>
                {/* ======= Cards Row ======= */}
                <Grid container spacing={2} sx={{ px: 5, mb: 2 }}>
                    {[
                        { label: "Total Income Count", value: report?.total_incomeCount || 0, color: "#FFC107" },
                        { label: "Total Repurchase Count", value: report?.total_repurchaseCount || 0, color: "#5C6BC0" },
                        { label: "Affiliate To Wallet", value: report?.total_affiliateToWallet || 0, color: "#26A69A" },
                        { label: "Redeem Count", value: report?.total_RedeemCount || 0, color: "#EC407A" },
                    ].map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper
                                elevation={3}
                                sx={{
                                    height: 90,
                                    backgroundColor: card.color,
                                    borderRadius: "10px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "#fff",
                                    textAlign: "center",
                                }}
                            >
                                <Typography variant="h5" fontWeight="bold">
                                    {card.value}
                                </Typography>
                                <Typography variant="body1">{card.label}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* ======= Filters Row ======= */}
                <Grid container spacing={2} alignItems="center" sx={{ px: 5,py:1,bgcolor:"white" }}>
                    <Grid item xs={12} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Income Report
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Filter</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                value={selectedValue}
                                label="Filter"
                                onChange={handleChange}
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
                    </Grid>

                    <Grid item xs={12} md={2}>
                        <TextField
                            placeholder="Search"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ marginRight: 1 }} />,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="From Date"
                                value={fromDate}
                                format="DD-MM-YYYY"
                                onChange={(date) => setFromDate(date)}
                                slotProps={{ textField: { fullWidth: true, size: "small" } }}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="To Date"
                                value={toDate}
                                format="DD-MM-YYYY"
                                onChange={(date) => setToDate(date)}
                                slotProps={{ textField: { fullWidth: true, size: "small" } }}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>
            </Grid>

            {/* ======= Income Transactions ======= */}
            <IncomeTransactions showServiceTrans={filteredRows} />
        </Layout>
    );
}

export default withAuth(IncomeReport);
