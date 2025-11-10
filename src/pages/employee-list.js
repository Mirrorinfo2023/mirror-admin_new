"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Employee/employee";
import {
    Grid,
    Button,
    TableContainer,
    Paper,
    Typography,
    Box,
    TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";

const Item = styled(Paper)(({ theme, bgcolor }) => ({
    backgroundColor: bgcolor || "#f9f9f9",
    ...theme.typography.body2,
    textAlign: "center",
    padding: theme.spacing(2),
    color: "#fff",
    borderRadius: "12px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
        transform: "translateY(-4px)",
    },
}));

function TransactionHistory() {
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [masterReport, setmasterReport] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const router = useRouter();
    const role = Cookies.get("employee_role");

    useEffect(() => {
        const getTnx = async () => {
            try {
                const response = await api.post("/api/employee/get-employee-list");
                if (response.status === 200) {
                    setShowServiceTrans(response.data.data);
                    setmasterReport(response.data.report);
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
    }, [dispatch]);

    const filteredRows = showServiceTrans.filter((row) => {
        return (
            (row.first_name &&
                row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
            (row.mobile && row.mobile.includes(searchTerm)) ||
            (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.employee_code &&
                row.employee_code.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    return (
        <Layout>
            <Grid container spacing={2} sx={{ p: 2 }}>
                {/* ===== Summary Cards ===== */}
                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="stretch"
                    sx={{ mb: 3,m:1,mt:0 }}
                >
                    <Grid item xs={12} sm={6} md={4}>
                        <Item bgcolor="#3B82F6">
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {masterReport.totalempCount ?? 0}
                            </Typography>
                            <Typography variant="subtitle1">Total Employees</Typography>
                        </Item>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Item bgcolor="#10B981">
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {masterReport.totalActiveempCount ?? 0}
                            </Typography>
                            <Typography variant="subtitle1">Active</Typography>
                        </Item>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Item bgcolor="#EF4444">
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {masterReport.totalInactiveempCount ?? 0}
                            </Typography>
                            <Typography variant="subtitle1">Inactive</Typography>
                        </Item>
                    </Grid>
                </Grid>

                {/* ===== Filter & Header Row ===== */}
                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ p: 2 }}>
                        <Box
                            display="flex"
                            flexDirection={{ xs: "column", sm: "row" }}
                            alignItems={{ xs: "stretch", sm: "center" }}
                            justifyContent="space-between"
                            gap={2}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                Staff List
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    width: { xs: "100%", sm: "50%" },
                                }}
                            >
                                <TextField
                                    placeholder="Search employee..."
                                    variant="standard"
                                    fullWidth
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon color="action" />,
                                    }}
                                />
                            </Box>

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                href={`/add-new-employee/`}
                                sx={{
                                    flex: { xs: "1 1 100%", sm: "0 0 auto" },
                                    background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
                                    boxShadow: "0 2px 8px 0 rgba(33, 203, 243, 0.15)",
                                    textTransform: "none",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Add New
                            </Button>
                        </Box>
                    </TableContainer>
                </Grid>
            </Grid>

            {/* ===== Table ===== */}
            <Transactions showServiceTrans={filteredRows} />
        </Layout>
    );
}

export default withAuth(TransactionHistory);
