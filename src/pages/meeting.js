"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import MeetingTransactions from "@/components/Meeting/MeetingReport";
import {
    Grid,
    Button,
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
import DownloadIcon from "@mui/icons-material/Download";

const getDate = (timeZone) => {
    const dateString = timeZone;
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    const hours = String(dateObject.getHours()).padStart(2, "0");
    const minutes = String(dateObject.getMinutes()).padStart(2, "0");
    const amOrPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);
    const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;
    return formattedDateTime;
};

function MeetingReport() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const dispatch = useDispatch();
    const currentDate = new Date();

    const [fromDate, setFromDate] = useState(
        dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    );
    const [toDate, setToDate] = useState(dayjs(getDate.date));

    // Fetch Data
    const getTnx = async () => {
        const reqData = {
            from_date: fromDate.toISOString().split("T")[0],
            to_date: toDate.toISOString().split("T")[0],
        };
        try {
            const response = await api.post("/api/meeting/get-meeting-list", reqData);
            if (response.status === 200) {
                setShowServiceTrans(response.data.data || []);
            }
        } catch (error) {
            const errMsg =
                error?.response?.data?.error || error.message || "Something went wrong";
            dispatch(callAlert({ message: errMsg, type: "FAILED" }));
        }
    };

    useEffect(() => {
        if (fromDate || toDate) getTnx();
    }, [fromDate, toDate, dispatch]);

    return (
        <Layout>
            <Grid container spacing={4} sx={{ padding: 2 }}>
                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ p: 2 }}>
                        {/* 🔹 Header Section */}
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap", // ✅ makes it responsive
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 2,
                            }}
                        >
                            {/* Title */}
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: "bold",
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                }}
                            >
                                Meeting
                            </Typography>

                           

                            {/* Search Field */}
                            <Box sx={{ flex: 1, minWidth: 200 }}>
                                <TextField
                                    placeholder="Search"
                                    variant="standard"
                                    fullWidth
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                                    }}
                                />
                            </Box>

                            {/* Date Pickers */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "nowrap",
                                    alignItems: "center",
                                    gap: 2,
                                    minWidth: 240,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="From Date"
                                        value={fromDate}
                                        format="DD-MM-YYYY"
                                        onChange={(newValue) => setFromDate(newValue)}
                                        slotProps={{
                                            textField: {
                                                size: "small",
                                                sx: {
                                                    minWidth: 130,
                                                    "& .MuiInputBase-root": {
                                                        height: 40,
                                                        fontSize: "0.875rem",
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                    <DatePicker
                                        label="To Date"
                                        value={toDate}
                                        format="DD-MM-YYYY"
                                        onChange={(newValue) => setToDate(newValue)}
                                        slotProps={{
                                            textField: {
                                                size: "small",
                                                sx: {
                                                    minWidth: 130,
                                                    "& .MuiInputBase-root": {
                                                        height: 40,
                                                        fontSize: "0.875rem",
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Box>

                             {/* Buttons */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "nowrap",
                                    alignItems: "center",
                                    gap: 2,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <Button
                                    variant="contained"
                                    sx={{
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
                                    href="/add-new-meeting/"
                                >
                                    Add New
                                </Button>

                                <Button
                                    variant="contained"
                                    sx={{
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
                                    startIcon={<DownloadIcon />}
                                    onClick={getTnx}
                                >
                                    Generate Report
                                </Button>
                            </Box>
                        </Box>
                    </TableContainer>
                </Grid>
            </Grid>

            {/* 🔹 Meeting Table */}
            <MeetingTransactions
                showServiceTrans={showServiceTrans}
                searchTerm={searchTerm}
            />
        </Layout>
    );
}

export default withAuth(MeetingReport);
