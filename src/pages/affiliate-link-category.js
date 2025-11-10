"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/AffiliateLink/category";
import {
    Grid,
    Paper,
    TableContainer,
    Button,
    Typography,
    Box,
    TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: "center",
    borderRadius: "12px",
    color: "#fff",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
}));

function TransactionHistory() {
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [masterReport, setMasterReport] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const uid = Cookies.get("uid");

    // Dummy date initialization (for consistency)
    const [fromDate, setFromDate] = useState(dayjs());
    const [toDate, setToDate] = useState(dayjs());

    useEffect(() => {
        const all_parameters = {
            category_name1: null,
        };
        const encryptedData = DataEncrypt(JSON.stringify(all_parameters));

        const getTnx = async () => {
            const reqData = { encReq: encryptedData };

            try {
                const response = await api.post(
                    "/api/affiliate_link/get-affiliate-category",
                    reqData
                );
                if (response.status === 200) {
                    const decryptedObject = DataDecrypt(response.data);
                    setShowServiceTrans(decryptedObject.data || []);
                    setMasterReport(decryptedObject.report || {});
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

        if (uid) getTnx();
    }, [uid, fromDate, toDate, dispatch]);

    const filteredRows = showServiceTrans.filter((row) =>
        row.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            <Grid container spacing={2} sx={{ p: 2 }}>
                {/* ====== CARD SECTION ====== */}
                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mb: 3 }}
                >
                    {[
                        {
                            label: "Total Count",
                            value: masterReport?.totalAffilatelinkListCount ?? 0,
                            bg: "#FFC107",
                        },
                        {
                            label: "Active",
                            value: masterReport?.totalActiveAffilatelinkList ?? 0,
                            bg: "#5C6BC0",
                        },
                        {
                            label: "Inactive",
                            value: masterReport?.totalInactiveAffilatelinkList ?? 0,
                            bg: "#26A69A",
                        },
                        {
                            label: "Deleted",
                            value: masterReport?.totalDeleteAffilatelinkList ?? 0,
                            bg: "#EC407A",
                        },
                    ].map((card, index) => (
                        <Grid
                            item
                            key={index}
                            xs={12}
                            sm={6}
                            md={3}
                            display="flex"
                            justifyContent="center"
                        >
                            <Item sx={{ backgroundColor: card.bg, height: 90, width: "100%" }}>
                                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                    {card.value}
                                </Typography>
                                <Typography variant="body1">{card.label}</Typography>
                            </Item>
                        </Grid>
                    ))}
                </Grid>

                {/* ====== FILTER + ACTION SECTION ====== */}
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            mb: 2,
                            backgroundColor: "#f9f9f9",
                            boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                        }}
                    >
                        <Box
                            display="flex"
                            flexWrap={{ xs: "wrap", md: "nowrap" }}
                            alignItems="center"
                            justifyContent="space-between"
                            gap={2}
                        >
                            {/* Title */}
                            <Typography
                                variant="h6"
                                sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
                            >
                                Affiliate Categories
                            </Typography>

                            {/* Search */}
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Search Category"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon sx={{ mr: 1, color: "action.active" }} />
                                    ),
                                }}
                                sx={{
                                    flex: 1,
                                    minWidth: { xs: "100%", sm: 200 },
                                    backgroundColor: "#fff",
                                    borderRadius: 1,
                                }}
                            />

                            {/* Add Button */}
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                href="/add-new-affiliate-category/"
                                sx={{
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
                                }}
                            >
                                Add New
                            </Button>
                        </Box>
                    </Paper>
                </Grid>



            </Grid>
            <Transactions showServiceTrans={filteredRows} />
        </Layout>
    );
}

export default withAuth(TransactionHistory);
