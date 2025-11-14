"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import { DataDecrypt, DataEncrypt } from "../../utils/encryption";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import RatingTransactions from "@/components/Rating/Rating";
import {
    Grid,
    Paper,
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
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

function RateReport(props) {
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [masterReport, setMasterReport] = useState({});
    const [selectedRating, setSelectedRating] = useState("");
    const [selectedService, setSelectedService] = useState("");
    const dispatch = useDispatch();

    const [fromDate, setFromDate] = useState(dayjs().startOf("month"));
    const [toDate, setToDate] = useState(dayjs());

    useEffect(() => {
        const getTnx = async () => {
            const reqData = {
                from_date: fromDate.toISOString().split("T")[0],
                to_date: toDate.toISOString().split("T")[0],
            };

            try {
                const encryptedPayload = DataEncrypt(JSON.stringify(reqData));
                const response = await api.post("/api/rating/get-rating", {
                    data: encryptedPayload,
                });

                if (response.data?.data) {
                    const decryptedData = DataDecrypt(response.data.data);
                    setShowServiceTrans(decryptedData.data || []);
                    setMasterReport(decryptedData.report || {});
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
    }, [fromDate, toDate, dispatch]);

    // Enhanced filter logic
    const filteredRows = showServiceTrans.filter((row) => {
        const matchesRating = selectedRating === "" || row.rating == selectedRating;
        const matchesService = selectedService === "" || row.service === selectedService;
        const matchesSearch = 
            (row.service && row.service.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (row.first_name && row.first_name.includes(searchTerm)) ||
            (row.last_name && row.last_name.includes(searchTerm)) ||
            (row.comment && row.comment.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesRating && matchesService && matchesSearch;
    });

    // Ultra compact cards with icons
    const cards = [
        {
            label: "Total",
            value: masterReport.totalCount ?? 0,
            color: "#2196F3",
            icon: <StarIcon sx={{ fontSize: 20, color: "#2196F3" }} />
        },
        {
            label: "Avg Rating",
            value: masterReport.totalAvg ?? 0,
            color: "#4CAF50",
            icon: <StarHalfIcon sx={{ fontSize: 20, color: "#4CAF50" }} />
        },
        {
            label: "5 Star",
            value: masterReport.fiveStarCount ?? 0,
            color: "#FFC107",
            icon: <StarBorderIcon sx={{ fontSize: 20, color: "#FFC107" }} />
        },
        {
            label: "Positive",
            value: masterReport.positiveCount ?? 0,
            color: "#9C27B0",
            icon: <ThumbUpIcon sx={{ fontSize: 20, color: "#9C27B0" }} />
        }
    ];

    // Rating options
    const ratingOptions = [
        { value: "5", label: "5 Stars" },
        { value: "4", label: "4 Stars" },
        { value: "3", label: "3 Stars" },
        { value: "2", label: "2 Stars" },
        { value: "1", label: "1 Star" }
    ];

    // Service type options (you can extract these from your data)
    const serviceOptions = [
        "Customer Service",
        "Product Quality",
        "Delivery",
        "Support",
        "Website",
        "Mobile App"
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
                            Ratings
                        </Typography>

                        {/* Search Field */}
                        <TextField
                            placeholder="Search service, name, comment..."
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ color: '#666', mr: 0.5, fontSize: 18 }} />,
                            }}
                            sx={{
                                width: "160px",
                                '& .MuiOutlinedInput-root': {
                                    height: '32px',
                                    fontSize: '0.75rem',
                                }
                            }}
                        />

                        {/* Rating Filter */}
                        <FormControl size="small" sx={{ minWidth: 100 }}>
                            <InputLabel sx={{ fontSize: '0.8rem' }}>Rating</InputLabel>
                            <Select
                                value={selectedRating}
                                label="Rating"
                                onChange={(e) => setSelectedRating(e.target.value)}
                                sx={{ height: '32px', fontSize: '0.75rem' }}
                            >
                                <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All Ratings</MenuItem>
                                {ratingOptions.map((rating) => (
                                    <MenuItem key={rating.value} value={rating.value} sx={{ fontSize: '0.75rem' }}>
                                        {rating.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Service Filter */}
                        <FormControl size="small" sx={{ minWidth: 100 }}>
                            <InputLabel sx={{ fontSize: '0.8rem' }}>Service</InputLabel>
                            <Select
                                value={selectedService}
                                label="Service"
                                onChange={(e) => setSelectedService(e.target.value)}
                                sx={{ height: '32px', fontSize: '0.75rem' }}
                            >
                                <MenuItem value="" sx={{ fontSize: '0.75rem' }}>All Services</MenuItem>
                                {serviceOptions.map((service) => (
                                    <MenuItem key={service} value={service} sx={{ fontSize: '0.75rem' }}>
                                        {service}
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

                        {/* Reset Filters Button */}
                        <button
                            onClick={() => {
                                setSelectedRating("");
                                setSelectedService("");
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
                        Showing {filteredRows.length} of {showServiceTrans.length} ratings
                    </Typography>
                </Box>

                {/* Table Section */}
                <RatingTransactions showServiceTrans={filteredRows} />
            </Box>
        </Layout>
    );
}

export default withAuth(RateReport);