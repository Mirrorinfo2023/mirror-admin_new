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
    TableContainer,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Typography,
    Box,
    TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import { useRouter } from "next/router";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}));

const getDate = (timeZone) => {
    const dateObject = new Date(timeZone);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");
    const amOrPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);
    return `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;
};

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
    const router = useRouter();

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

    return (
        <Layout>
            <Grid container spacing={2} sx={{ p: 2 }}>
                {/* ====== Summary Cards ====== */}
                {[
                    {
                        title: "Active Users",
                        color: "#FFC107",
                        count: masterReport.totalActiveusers,
                    },
                    {
                        title: "Inactive Users",
                        color: "#5C6BC0",
                        count: masterReport.totalInactiveusers,
                    },
                    {
                        title: "Prime Users",
                        color: "#26A69A",
                        count: masterReport.totalPrimeusers,
                    },
                    {
                        title: "Non-Prime Users",
                        color: "#EC407A",
                        count: masterReport.totalNonprimeusers,
                    },
                ].map((card, i) => (
                    <Grid key={i} item xs={12} sm={6} md={3}>
                        <Item
                            sx={{
                                height: 90,
                                backgroundColor: card.color,
                                color: "#FFF",
                                borderRadius: "10px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="h6" sx={{ fontSize: "16px" }}>
                                {masterReport.totalUsers ?? 0} : {card.count ?? 0}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ fontSize: "16px", fontWeight: 600 }}
                            >
                                {card.title}
                            </Typography>
                        </Item>
                    </Grid>
                ))}

                {/* ====== Filters Section ====== */}
                <Grid item xs={12}>
                    {loading && (
                        <div className="loader-overlay">
                            <div className="loader-wrapper">
                                <img src="/loader.gif" alt="Loader" width="150" height="150" />
                                <br /> Loading...
                            </div>
                        </div>
                    )}

                    <TableContainer component={Paper} sx={{ p: 2 }}>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            User Details
                        </Typography>




                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 2,
                                alignItems: "center",
                                justifyContent: "flex-start",
                            }}
                        >
                            {/* Search Input */}
                            <TextField
                                variant="outlined"
                                placeholder="Search"
                                size="small"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon sx={{ mr: 1, color: "action.active", fontSize: 20 }} />
                                    ),
                                }}
                                sx={{
                                    flex: 1,
                                    minWidth: { xs: "100%", sm: 180 },
                                    "& .MuiInputBase-root": {
                                        height: 40, // Adjust height
                                    },
                                }}
                            />


                            {/* Date Pickers */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="From Date"
                                    value={fromDate}
                                    onChange={setFromDate}
                                    format="DD-MM-YYYY"
                                    sx={{ minWidth: { xs: "100%", sm: 180 } }}
                                />
                                <DatePicker
                                    label="To Date"
                                    value={toDate}
                                    onChange={setToDate}
                                    format="DD-MM-YYYY"
                                    sx={{ minWidth: { xs: "100%", sm: 180 } }}
                                />
                            </LocalizationProvider>

                            {/* Filter Dropdown */}
                            <FormControl sx={{ minWidth: { xs: "100%", sm: 160 } }}>
                                <InputLabel>Filter</InputLabel>
                                <Select
                                    value={selectedValue}
                                    label="Filter"
                                    onChange={(e) => setSelectedValue(e.target.value)}
                                >
                                    <MenuItem value="">Default</MenuItem>
                                    <MenuItem value="mlm_id">User Id</MenuItem>
                                    <MenuItem value="first_name">Name</MenuItem>
                                    <MenuItem value="mobile">Mobile</MenuItem>
                                    <MenuItem value="email">Email</MenuItem>
                                    <MenuItem value="ref_mlm_id">Referral User Id</MenuItem>
                                    <MenuItem value="ref_first_name">Referral Name</MenuItem>
                                    <MenuItem value="wallet_balance">Wallet Balance</MenuItem>
                                    <MenuItem value="cashback_balance">Cashback</MenuItem>
                                    <MenuItem value="city">City</MenuItem>
                                    <MenuItem value="state">State</MenuItem>
                                    <MenuItem value="pincode">Pincode</MenuItem>
                                </Select>
                            </FormControl>


                            {/* Search Button */}
                            <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={handleOKButtonClick}
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    fontSize: 16,
                                    px: 4,
                                    py: 1.2,
                                    background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                                    boxShadow: "0 2px 8px 0 rgba(33, 203, 243, 0.15)",
                                    textTransform: "none",
                                    whiteSpace: "nowrap",

                                }}
                            >
                                Search
                            </Button>
                        </Box>
                    </TableContainer>
                </Grid>
            </Grid>

            <Transactions showServiceTrans={showServiceTrans} />
        </Layout>
    );
}

export default withAuth(TransactionHistory);
