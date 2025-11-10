"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import EbookTransactions from "@/components/Ebook/EbookList";
import {
    Grid,
    Paper,
    Button,
    Typography,
    Box,
    TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const cardColors = ["#FFC107", "#5C6BC0", "#26A69A", "#EC407A"];

function TransactionHistory() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [masterReport, setmasterReport] = useState({});
    const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
    const [toDate, setToDate] = useState(dayjs());
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const reqData = {
                from_date: fromDate.format("YYYY-MM-DD"),
                to_date: toDate.format("YYYY-MM-DD"),
            };
            try {
                const response = await api.post("/api/ebook/ebook-list", reqData);
                if (response.status === 200) {
                    setShowServiceTrans(response.data.data || []);
                    setmasterReport(response.data.report || {});
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
        fetchData();
    }, [fromDate, toDate, dispatch]);

    const filteredRows = showServiceTrans.filter((row) =>
        [row.ebook_name, row.author]
            .filter(Boolean)
            .some((field) =>
                field.toLowerCase().includes(searchTerm.toLowerCase())
            )
    );

    return (
        <Layout>
            <Box sx={{ p: { xs: 1, md: 3 } }}>


                {/* ==== Cards Section ==== */}
                <Grid container spacing={3} justifyContent="center">
                    {[
                        { title: "Total Count", value: masterReport.totalEbookCount ?? 0 },
                        { title: "Total Approve", value: masterReport.totalApproveEbook ?? 0 },
                        { title: "Total Pending", value: masterReport.totalpendingEbook ?? 0 },
                        { title: "Total Deactivated", value: masterReport.totalDeactivatedEbook ?? 0 },
                    ].map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper
                                elevation={4}
                                sx={{
                                    backgroundColor: cardColors[index],
                                    color: "white",
                                    p: 2,
                                    height: 100,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: 3,
                                    textAlign: "center",
                                    transition: "0.3s",
                                    "&:hover": {
                                        transform: "scale(1.03)",
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                                    },
                                }}
                            >
                                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                    {card.value}
                                </Typography>
                                <Typography variant="subtitle1">{card.title}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* ==== Filter Section ==== */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 2,
                        mt: 2,
                        mb: 3,
                        borderRadius: 3,
                        background: "#f8f9fa",
                        display: "flex",
                        flexWrap: { xs: "wrap", md: "nowrap" },
                        gap: 2,
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h5" sx={{ padding: 1 }}>
                       Ebook
                    </Typography>

                    <TextField
                        size="small"
                        placeholder="Search by name or author"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1, color: "action.active" }} />,
                        }}
                        sx={{ flex: 1, minWidth: 180 }}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="From"
                            value={fromDate}
                            format="DD-MM-YYYY"
                            onChange={(newDate) => setFromDate(newDate)}
                            slotProps={{ textField: { size: "small", sx: { minWidth: 150 } } }}
                        />
                        <DatePicker
                            label="To"
                            value={toDate}
                            format="DD-MM-YYYY"
                            onChange={(newDate) => setToDate(newDate)}
                            slotProps={{ textField: { size: "small", sx: { minWidth: 150 } } }}
                        />
                    </LocalizationProvider>

                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        href={`/add-ebook/`}
                        sx={{
                            minWidth: 150,
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
                        }}
                    >
                        Add Ebook
                    </Button>

                    <Button
                        variant="contained"
                        color="secondary"
                        href={`/ebook-category-list/`}
                        sx={{
                            minWidth: 150,
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
                        }}
                    >
                        Ebook Category
                    </Button>
                </Paper>

            </Box>
            <EbookTransactions showServiceTrans={filteredRows} />
        </Layout>
    );
}

export default withAuth(TransactionHistory);
