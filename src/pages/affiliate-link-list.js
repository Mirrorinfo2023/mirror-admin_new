"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import AffiliateTrackDetailsTransactions from "@/components/AffiliateLink/AffiliateReport";
import {
    Grid,
    Paper,
    TableContainer,
    Button,
    Typography,
    Box,
    TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
}));

const getDate = (timeZone) => {
    const dateObject = new Date(timeZone);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

function AffiliateHistory() {
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [masterReport, setmasterReport] = useState({});
    const dispatch = useDispatch();

    const currentDate = new Date();
    const [fromDate, setFromDate] = useState(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
    const [toDate, setToDate] = useState(dayjs(new Date()));

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const getTnx = async () => {
            const reqData = {
                from_date: fromDate.toISOString().split("T")[0],
                to_date: toDate.toISOString().split("T")[0],
            };
            try {
                const response = await api.post("/api/affiliate_link/get-affiliate-links-Admin", reqData);
                if (response.status === 200) {
                    setShowServiceTrans(response.data.data);
                    setmasterReport(response.data.report);
                }
            } catch (error) {
                dispatch(callAlert({
                    message: error?.response?.data?.error || error.message,
                    type: "FAILED",
                }));
            }
        };
        getTnx();
    }, [fromDate, toDate, dispatch]);

    const filteredRows = showServiceTrans.filter((row) =>
        (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
        (row.mobile && row.mobile.includes(searchTerm)) ||
        (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.category_name && row.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.link && row.link.includes(searchTerm)) ||
        (row.title && row.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const cardData = [
        { title: "Total Count", value: masterReport.totalAffilatelinkListCount ?? 0, color: "#FFC107" },
        { title: "Active", value: masterReport.totalActiveAffilatelinkList ?? 0, color: "#5C6BC0" },
        { title: "Inactive", value: masterReport.totalInactiveAffilatelinkList ?? 0, color: "#26A69A" },
        { title: "Deleted", value: masterReport.totalDeleteAffilatelinkList ?? 0, color: "#EC407A" },
    ];

    return (
        <Layout>
            <Box sx={{ padding: 2 }}>
                {/* ====== Cards Section ====== */}
                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ marginBottom: 3 }}
                >
                    {cardData.map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Item sx={{ backgroundColor: card.color, color: "#fff", height: 100 }}>
                                <Typography variant="h5" fontWeight="bold">
                                    {card.value}
                                </Typography>
                                <Typography variant="subtitle1">{card.title}</Typography>
                            </Item>
                        </Grid>
                    ))}
                </Grid>

                {/* ====== Filter & Action Section ====== */}
                <TableContainer component={Paper} sx={{ p: 2, borderRadius: 2, boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                    <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                        <Grid item xs={12} md={3}>
                            <Typography variant="h6">Affiliate Link List</Typography>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <TextField
                                placeholder="Search"
                                variant="standard"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Box display="flex" gap={2}>
                                    <DatePicker
                                        label="From Date"
                                        value={fromDate}
                                        format="DD-MM-YYYY"
                                        onChange={(date) => setFromDate(date)}
                                        sx={{ flex: 1 }}
                                    />
                                    <DatePicker
                                        label="To Date"
                                        value={toDate}
                                        format="DD-MM-YYYY"
                                        onChange={(date) => setToDate(date)}
                                        sx={{ flex: 1 }}
                                    />
                                </Box>
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} md={2} display="flex" justifyContent="flex-end" gap={1}>
                            <Button variant="contained" color="primary" sx={{
                                height: 40,
                                px: 3,
                                background: "linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)",
                                borderRadius: "12px",
                                color: "#fff",
                                fontWeight: "bold",
                                boxShadow: "none",
                                textTransform: "none",
                                fontSize: "1rem",
                                px: 3,
                                py: 1,
                                whiteSpace: "nowrap",
                                "&:hover": { opacity: 0.9 },
                            }} href={`/add-new-affiliate-link/`}>
                                Add New
                            </Button>
                            <Button variant="contained" color="secondary" sx={{
                                height: 40,
                                px: 3,
                                background: "linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)",
                                borderRadius: "12px",
                                color: "#fff",
                                fontWeight: "bold",
                                boxShadow: "none",
                                textTransform: "none",
                                fontSize: "1rem",
                                px: 3,
                                py: 1,
                                whiteSpace: "nowrap",
                                "&:hover": { opacity: 0.9 },
                            }} href={`/affiliate-link-category/`}>
                                Category
                            </Button>
                        </Grid>
                    </Grid>
                </TableContainer>

                {/* ====== Table Section ====== */}
            </Box>
            <AffiliateTrackDetailsTransactions showServiceTrans={filteredRows} />
        </Layout>
    );
}

export default withAuth(AffiliateHistory);
