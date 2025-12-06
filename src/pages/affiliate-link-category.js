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
    Button,
    Typography,
    Box,
    TextField,
    Card,
    CardContent,
    IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import { styled } from "@mui/material/styles";

// Ultra Compact StatCard Design with Hover Effect
const StatCard = styled(Card)(({ theme }) => ({
    borderRadius: '6px',
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.15s ease',
    flex: '1 1 120px',
    minWidth: '110px',
    border: '1px solid rgba(0,0,0,0.04)',
}));

function TransactionHistory() {
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [masterReport, setMasterReport] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const dispatch = useDispatch();
    const uid = Cookies.get("uid");

    const fetchData = async () => {
        const all_parameters = {
            category_name1: null,
        };
        const encryptedData = DataEncrypt(JSON.stringify(all_parameters));

        const reqData = { encReq: encryptedData };

        try {
            const response = await api.post(
                "/api/affiliate_link/get-affiliate-category",
                reqData
            );
            if (response.status === 200) {
                const decryptedObject = DataDecrypt(response.data);
                const categories = decryptedObject.data || [];

                console.log("categories ", categories)
                // Process categories to ensure all necessary fields are present
                const processedCategories = categories.map((category, index) => ({
                    ...category,
                    id: category.id || index + 1, // Ensure ID exists
                    category_id: category.category_id || category.id || index + 1,
                    category_name: category.category_name || "",
                    status: category.status || 1, // Default to active if not specified
                    subcategories: category.subcategories || [],
                    // Add any other necessary fields with defaults
                    created_on: category.created_on || new Date().toISOString(),
                    modified_on: category.modified_on || null,
                }));

                setShowServiceTrans(processedCategories);
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

    useEffect(() => {
        if (uid) fetchData();
    }, [uid, dispatch]);

    const filteredRows = showServiceTrans.filter((row) =>
        row.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // Handle update action - this function should be passed to Transactions component
    const handleUpdateCategory = async (categoryData) => {
        try {
            // Make sure we have all required fields
            const updateData = {
                id: categoryData.id,
                category_name: categoryData.category_name,
                status: categoryData.status,
                subcategories: categoryData.subcategories || [],
                // Add any other fields that need to be updated
            };
            console.log("updateData", updateData)
            // Send update request
            const response = await api.post(
                "/api/affiliate_link/update-affiliate-category",
                updateData
            );

            if (response.status === 200) {
                dispatch(
                    callAlert({
                        message: "Category updated successfully!",
                        type: "SUCCESS",
                    })
                );
                // Refresh the data
                fetchData();
                return true;
            }
        } catch (error) {
            dispatch(
                callAlert({
                    message: error?.response?.data?.error || "Failed to update category",
                    type: "FAILED",
                })
            );
            return false;
        }
    };

    // Handle delete action
    const handleDeleteCategory = async (categoryId) => {
        try {
            const response = await api.post("/api/affiliate_link/delete-category", {
                id: categoryId,
                status: 0
            });
            if (response.status === 200) {
                alert("Category deleted successfully!")
                fetchData();
                return true;
            }
        } catch (error) {
            dispatch(
                callAlert({
                    message: error?.response?.data?.error || "Failed to delete category",
                    type: "FAILED",
                })
            );
            return false;
        }
    };

    const cards = [
        {
            label: "Total",
            value: masterReport?.totalAffilatelinkListCount ?? 0,
            color: "#FFC107",
            bgColor: "#FFF8E1"
        },
        {
            label: "Active",
            value: masterReport?.totalActiveAffilatelinkList ?? 0,
            color: "#10B981",
            bgColor: "#ECFDF5"
        },
        {
            label: "Inactive",
            value: masterReport?.totalInactiveAffilatelinkList ?? 0,
            color: "#6B7280",
            bgColor: "#F9FAFB"
        },
        {
            label: "Deleted",
            value: masterReport?.totalDeleteAffilatelinkList ?? 0,
            color: "#EF4444",
            bgColor: "#FEF2F2"
        }
    ];

    return (
        <Layout>
            <Box sx={{ p: 0.5 }}>
                {/* Ultra Compact Statistics Cards with Hover Effect */}
                <Grid container spacing={0.5} sx={{ mb: 1 }}>
                    <Grid item xs={12}>
                        <Box sx={{
                            display: "flex",
                            gap: 0.5,
                            flexWrap: "wrap",
                        }}>
                            {cards.map((card, index) => (
                                <StatCard
                                    key={index}
                                    sx={{
                                        backgroundColor: card.bgColor,
                                        borderLeft: `3px solid ${card.color}`,
                                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                                        '&:hover': {
                                            backgroundColor: card.color,
                                            boxShadow: `0 4px 12px ${card.color}60`,
                                            transform: 'translateY(-1px)',
                                            '& .MuiTypography-root': {
                                                color: 'white',
                                            }
                                        }
                                    }}
                                >
                                    <CardContent sx={{
                                        padding: '4px 8px !important',
                                        width: '100%',
                                        textAlign: 'center',
                                        '&:last-child': { pb: '4px' }
                                    }}>
                                        <Typography
                                            sx={{
                                                color: '#000000',
                                                transition: 'color 0.2s ease',
                                                fontWeight: 700,
                                                fontSize: '14px',
                                                mb: 0.1,
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {card.value}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: '#666666',
                                                transition: 'color 0.2s ease',
                                                fontWeight: 500,
                                                fontSize: '10px',
                                                lineHeight: 1.2,
                                            }}
                                        >
                                            {card.label}
                                        </Typography>
                                    </CardContent>
                                </StatCard>
                            ))}
                        </Box>
                    </Grid>
                </Grid>

                {/* Ultra Compact Filter Section */}
                <Paper sx={{
                    p: 0.75,
                    mb: 1,
                    backgroundColor: '#fafafa',
                    border: '1px solid #e0e0e0'
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.5,
                        alignItems: 'center'
                    }}>
                        {/* Title with Icon */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mr: 0.5,
                            minWidth: 'fit-content'
                        }}>
                            <FilterAltIcon sx={{ fontSize: 16, color: '#667eea', mr: 0.5 }} />
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    color: '#667eea',
                                    fontSize: '13px',
                                }}
                            >
                                Categories
                            </Typography>
                        </Box>

                        {/* Search Field */}
                        <TextField
                            placeholder="Search category..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />,
                            }}
                            sx={{
                                minWidth: { xs: '100%', sm: '140px' },
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '4px',
                                    backgroundColor: 'white',
                                    fontSize: '0.7rem',
                                    height: '30px',
                                    '& input': {
                                        padding: '6px 8px',
                                        height: '18px'
                                    }
                                }
                            }}
                        />

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', ml: 'auto' }}>
                            {/* Refresh Button */}
                            <IconButton
                                size="small"
                                onClick={fetchData}
                                sx={{
                                    width: '30px',
                                    height: '30px',
                                    backgroundColor: '#f0f0f0',
                                    '&:hover': { backgroundColor: '#e0e0e0' }
                                }}
                            >
                                <RefreshIcon sx={{ fontSize: 16, color: '#666' }} />
                            </IconButton>

                            {/* Add New Button */}
                            <Button
                                variant="contained"
                                startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                                href="/add-new-affiliate-category/"
                                size="small"
                                sx={{
                                    minWidth: '90px',
                                    background: '#2196f3',
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    fontSize: '0.7rem',
                                    height: '30px',
                                    px: 1,
                                    '&:hover': {
                                        opacity: 0.9,
                                    }
                                }}
                            >
                                Add New
                            </Button>
                        </Box>
                    </Box>
                </Paper>

                {/* Results Count */}
                <Box sx={{ mb: 0.5, px: 0.5 }}>
                    <Typography variant="caption" sx={{
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                        fontWeight: 500
                    }}>
                        Showing {filteredRows.length} categories
                    </Typography>
                </Box>
            </Box>

            {/* Table Section - Pass all necessary props */}
            <Box sx={{ px: 0.5, pb: 0.5 }}>
                <Transactions
                    showServiceTrans={filteredRows}
                    onUpdateCategory={handleUpdateCategory}
                    onDeleteCategory={handleDeleteCategory}
                    onRefresh={fetchData}
                />
            </Box>
        </Layout>
    );
}

export default withAuth(TransactionHistory);