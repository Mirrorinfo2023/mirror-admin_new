"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import BlockIcon from '@mui/icons-material/Block';

function TransactionHistory() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [masterReport, setmasterReport] = useState({});
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
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

    // Enhanced filter logic
    const filteredRows = showServiceTrans.filter((row) => {
        const matchesStatus = selectedStatus === "" || row.status === selectedStatus;
        const matchesCategory = selectedCategory === "" || row.category === selectedCategory;
        const matchesSearch = [row.ebook_name, row.author]
            .filter(Boolean)
            .some((field) =>
                field.toLowerCase().includes(searchTerm.toLowerCase())
            );

        return matchesStatus && matchesCategory && matchesSearch;
    });

    // Ultra compact cards with icons
    const cards = [
        {
            label: "Total",
            value: masterReport.totalEbookCount ?? 0,
            color: "#FFC107",
            icon: <MenuBookIcon sx={{ fontSize: 20, color: "#FFC107" }} />
        },
        {
            label: "Approved",
            value: masterReport.totalApproveEbook ?? 0,
            color: "#5C6BC0",
            icon: <CheckCircleIcon sx={{ fontSize: 20, color: "#5C6BC0" }} />
        },
        {
            label: "Pending",
            value: masterReport.totalpendingEbook ?? 0,
            color: "#26A69A",
            icon: <PendingIcon sx={{ fontSize: 20, color: "#26A69A" }} />
        },
        {
            label: "Deactivated",
            value: masterReport.totalDeactivatedEbook ?? 0,
            color: "#EC407A",
            icon: <BlockIcon sx={{ fontSize: 20, color: "#EC407A" }} />
        }
    ];

    // Ebook status options
    const statusOptions = [
        { value: "approved", label: "Approved" },
        { value: "pending", label: "Pending" },
        { value: "deactivated", label: "Deactivated" }
    ];

    // Ebook category options (you can fetch these from API or use static)
    const categoryOptions = [
        "Technology",
        "Business",
        "Science",
        "Literature",
        "Education",
        "Health",
        "Finance",
        "Self-Help"
    ];

    return (
        <Layout>
            <Box sx={{ p: 1 }}>
                {/* Ultra Compact Stats Cards */}
                <Grid container spacing={1} sx={{ mb: 1.5 }}>
                    {cards.map((card, index) => (
                        <Grid item xs={6} sm={3} key={index}>
                            <Card sx={{ 
                                backgroundColor: '#f5f5f5', 
                                borderLeft: `3px solid ${card.color}`,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s ease-in-out',
                                height: '60px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px',
                                '&:hover': {
                                    backgroundColor: card.color,
                                    transform: 'translateY(-1px)',
                                    '& .MuiTypography-root': { color: '#fff' },
                                    '& .stat-icon': { color: '#fff' }
                                }
                            }}>
                                <Box sx={{ flex: 1, textAlign: 'left' }}>
                                    <Typography variant="subtitle2" sx={{ 
                                        fontSize: '10px', 
                                        fontWeight: 600, 
                                        color: '#666', 
                                        mb: 0.25,
                                        transition: 'color 0.2s ease'
                                    }}>
                                        {card.label}
                                    </Typography>
                                    <Typography sx={{ 
                                        color: '#000', 
                                        fontSize: '14px', 
                                        fontWeight: 700, 
                                        lineHeight: 1,
                                        transition: 'color 0.2s ease'
                                    }}>
                                        {card.value}
                                    </Typography>
                                </Box>
                                <Box className="stat-icon" sx={{ transition: 'color 0.2s ease' }}>
                                    {card.icon}
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Ultra Compact Filter Row */}
                <Paper sx={{ p: 1, mb: 1.5 }}>
                    <Box sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 1,
                        flexWrap: 'wrap'
                    }}>
                        {/* Title */}
                        <Typography variant="h6" sx={{ 
                            fontWeight: "bold",
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            whiteSpace: "nowrap",
                            fontSize: '14px',
                            minWidth: 'fit-content'
                        }}>
                            Ebooks
                        </Typography>

                        {/* Search Field */}
                        <TextField
                            placeholder="Search name, author..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: '#666', mr: 0.5, fontSize: 18 }} />,
                            }}
                            sx={{
                                width: "140px",
                                '& .MuiOutlinedInput-root': {
                                    height: '32px',
                                    fontSize: '0.75rem',
                                }
                            }}
                        />

                        {/* Status Filter */}
                        <FormControl size="small" sx={{ minWidth: 100 }}>
                            <InputLabel sx={{ fontSize: '0.8rem' }}>Status</InputLabel>
                            <Select
                                value={selectedStatus}
                                label="Status"
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                sx={{ height: '32px', fontSize: '0.75rem' }}
                            >
                                <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All Status</MenuItem>
                                {statusOptions.map((status) => (
                                    <MenuItem key={status.value} value={status.value} sx={{ fontSize: '0.75rem' }}>
                                        {status.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Category Filter */}
                        <FormControl size="small" sx={{ minWidth: 100 }}>
                            <InputLabel sx={{ fontSize: '0.8rem' }}>Category</InputLabel>
                            <Select
                                value={selectedCategory}
                                label="Category"
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                sx={{ height: '32px', fontSize: '0.75rem' }}
                            >
                                <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All Categories</MenuItem>
                                {categoryOptions.map((category) => (
                                    <MenuItem key={category} value={category} sx={{ fontSize: '0.75rem' }}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Date Range - Original API handling preserved */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                <DatePicker
                                    label="From Date"
                                    value={fromDate}
                                    format="DD-MM-YYYY"
                                    onChange={(newDate) => setFromDate(newDate)}
                                    slotProps={{ 
                                        textField: { 
                                            size: "small",
                                            sx: { minWidth: '140px' }
                                        } 
                                    }}
                                />
                                <DatePicker
                                    label="To Date"
                                    value={toDate}
                                    format="DD-MM-YYYY"
                                    onChange={(newDate) => setToDate(newDate)}
                                    slotProps={{ 
                                        textField: { 
                                            size: "small",
                                            sx: { minWidth: '140px' }
                                        } 
                                    }}
                                />
                            </Box>
                        </LocalizationProvider>

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                                href={`/add-ebook/`}
                                size="small"
                                sx={{
                                    minWidth: '100px',
                                    background: '#2198f3',
                                    borderRadius: '6px',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    fontSize: '0.7rem',
                                    height: '32px'
                                }}
                            >
                                Add Ebook
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<CategoryIcon sx={{ fontSize: 16 }} />}
                                href={`/ebook-category-list/`}
                                size="small"
                                sx={{
                                    minWidth: '120px',
                                    background: '#2198f3',
                                    borderRadius: '6px',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    fontSize: '0.7rem',
                                    height: '32px'
                                }}
                            >
                                Categories
                            </Button>
                        </Box>

                        {/* Reset Filters Button */}
                        <button
                            onClick={() => {
                                setSelectedStatus("");
                                setSelectedCategory("");
                                setSearchTerm("");
                            }}
                            style={{
                                backgroundColor: '#f5f5f5',
                                color: '#666',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '0.7rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                height: '32px',
                                minWidth: '60px'
                            }}
                        >
                            Reset
                        </button>
                    </Box>
                </Paper>

                {/* Results Count */}
                <Box sx={{ mb: 1, px: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                        Showing {filteredRows.length} of {showServiceTrans.length} ebooks
                    </Typography>
                </Box>

                {/* Table Section */}
                <EbookTransactions showServiceTrans={filteredRows} />
            </Box>
        </Layout>
    );
}

export default withAuth(TransactionHistory);