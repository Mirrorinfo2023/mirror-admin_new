"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import BannersTransactions from "@/components/Product/product";
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
import SearchIcon from "@mui/icons-material/Search";

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
    return `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;
};

function BannersReport() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const dispatch = useDispatch();

    const currentDate = new Date();
    const [fromDate, setFromDate] = useState(
        dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
    );
    const [toDate, setToDate] = useState(dayjs(getDate.date));

    useEffect(() => {
        const getTnx = async () => {
            const reqData = {
                from_date: fromDate.toISOString().split("T")[0],
                to_date: toDate.toISOString().split("T")[0],
            };
            try {
                const response = await api.post("/api/product/get-product-list", reqData);
                if (response.status === 200) {
                    setShowServiceTrans(response.data.data);
                }
            } catch (error) {
                const errMsg =
                    error?.response?.data?.error ||
                    error.message ||
                    "Something went wrong";
                dispatch(callAlert({ message: errMsg, type: "FAILED" }));
            }
        };
        if (fromDate || toDate) getTnx();
    }, [fromDate, toDate, dispatch]);

    const filteredRows = showServiceTrans.filter((row) =>
        row?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <Grid container spacing={4} sx={{ padding: 2 }}>
                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ p: 2 }}>
                        {/*  Single Responsive Row */}
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap", // allows wrapping on mobile
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
                                Product List
                            </Typography>

                            {/* Search */}
                            <Box sx={{ flex: 1, ml: 5 }}>
                                <TextField
                                    variant="standard"
                                    placeholder="Search"
                                    fullWidth
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon sx={{ mr: 1 }} />,
                                    }}
                                />
                            </Box>

                            {/* Add New Button */}
                            <Button
                                variant="contained"
                                href={`/add-new-product/`}
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    fontSize: 16,
                                    px: 3,
                                    py: 1,
                                    background: "#2198f3",
                                    boxShadow: "0 2px 8px 0 rgba(33, 203, 243, 0.15)",
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                    "&:hover": {
                                        background:
                                            "#2198f3",
                                        opacity: 0.9,
                                    },
                                }}
                            >
                                Add New
                            </Button>
                        </Box>
                    </TableContainer>
                </Grid>
            </Grid>

            <BannersTransactions showServiceTrans={filteredRows} />
        </Layout>
    );
}

export default withAuth(BannersReport);
