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
    Link,
    Divider,
} from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import Layout from "@/components/Dashboard/layout";
import CreditTransactions from "@/components/Dashboard/User/CreditBalance";
import { callAlert } from "../../redux/actions/alert";
import withAuth from "../../utils/withAuth";

function TransactionHistory() {
    const router = useRouter();
    const dispatch = useDispatch();
    const attr = router.query;

    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [selectedValue, setSelectedValue] = useState("");
    const [mobile, setMobile] = useState("");
    const [amount, setAmount] = useState("");
    const [narration, setNarration] = useState("");
    const [buttonHidden, setButtonHidden] = useState(false);

    const rows = showServiceTrans || [];

    const filteredRows = rows.filter((row) => {
        const search = (row?.first_name || "").toLowerCase();
        return search.includes(search);
    });

    const handleSubmit = async () => {
        setButtonHidden(true);
        const formData = {
            walletType: selectedValue,
            mobile,
            amount,
            action: attr.action,
            narration,
        };

        setMobile("");
        setAmount("");
        setNarration("");

        try {
            const response = await api.post(
                "/api/wallet/credit-debit-income-to-user",
                formData
            );
            if (response) {
                window.history.back();
                alert(response.data.message);
            }
        } catch (error) {
            dispatch(
                callAlert({
                    message: error?.response?.data?.error || error.message,
                    type: "FAILED",
                })
            );
        } finally {
            setButtonHidden(false);
        }
    };

    return (
        <Layout>
            <Box sx={{ p: 3 }}>
                <Paper
                    elevation={2}
                    sx={{
                        borderRadius: 3,
                        p: 3,
                        boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight={600}
                        sx={{ mb: 2 }}
                    >
                        {attr.action === "Credit" ? "Credit Balance" : "Debit Balance"}
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    {/* --- Simple Form Layout --- */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Wallet Type</InputLabel>
                                <Select
                                    value={selectedValue}
                                    label="Wallet Type"
                                    onChange={(e) => setSelectedValue(e.target.value)}
                                >
                                    <MenuItem value="">Select Wallet</MenuItem>
                                    <MenuItem value="wallet">Main Wallet</MenuItem>
                                    <MenuItem value="cashback">Cashback Wallet</MenuItem>
                                    <MenuItem value="income">Income Wallet</MenuItem>
                                    <MenuItem value="prime">Prime Wallet</MenuItem>
                                    <MenuItem value="epin">Epin Wallet</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={2.4}>
                            <TextField
                                label="Mobile Number"
                                fullWidth
                                size="small"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={2.4}>
                            <TextField
                                label="Amount"
                                fullWidth
                                size="small"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4.8}>
                            <TextField
                                label="Narration"
                                fullWidth
                                size="small"
                                value={narration}
                                onChange={(e) => setNarration(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    {/* --- Buttons below form --- */}
                    <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#4CAF50",
                                "&:hover": { backgroundColor: "#43A047" },
                                color: "#fff",
                                borderRadius: 1.5,
                                px: 4,
                                py: 1,
                                textTransform: "none",
                            }}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>

                        <Link href={`/bulk-income-credit/?action=${attr.action}`} underline="none">
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#FFA000",
                                    "&:hover": { backgroundColor: "#FB8C00" },
                                    color: "#fff",
                                    borderRadius: 1.5,
                                    px: 4,
                                    py: 1,
                                    textTransform: "none",
                                }}
                            >
                                Bulk Upload
                            </Button>
                        </Link>
                    </Box>

                </Paper>


            </Box>
            <CreditTransactions showServiceTrans={filteredRows} />
        </Layout>
    );
}

export default withAuth(TransactionHistory);
