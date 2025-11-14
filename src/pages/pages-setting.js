"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import PagesTransactions from "@/components/Pages/contentList";
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

function PagesReport() {
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();

    const currentDate = new Date();
    const [fromDate] = useState(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
    const [toDate] = useState(dayjs(currentDate));

    useEffect(() => {
        const getPages = async () => {
            try {
                const response = await api.post("/api/page/get-pages-admin");
                if (response.status === 200) {
                    setShowServiceTrans(response.data.data || []);
                }
            } catch (error) {
                const msg = error?.response?.data?.error || error.message;
                dispatch(callAlert({ message: msg, type: "FAILED" }));
            }
        };
        getPages();
    }, [fromDate, toDate, dispatch]);

    const filteredRows = showServiceTrans.filter((row) =>
        row.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout>
            {/* ===== Header Section ===== */}
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    mb: 3,
                    m: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "stretch", sm: "center" },
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <Typography variant="h5" fontWeight={600}>
                    Pages
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                    <TextField
                        fullWidth
                        placeholder="Search pages..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        href="/add-new-page/"
                        sx={{
                            flex: { xs: "1 1 100%", sm: "0 0 auto" },
                            background: "#2198f3",
                            boxShadow: "0 2px 8px 0 rgba(33, 203, 243, 0.15)",
                            textTransform: "none",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Add New Content
                    </Button>
                </Box>
            </Paper>


            <PagesTransactions showServiceTrans={filteredRows} />
        </Layout>
    );
}

export default withAuth(PagesReport);
