"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import AffiliateTrackDetailsTransactions from "@/components/AffiliateLink/AffiliateReport";
import {
    Grid,
    Paper,
    Button,
    Typography,
    Box,
    TextField,
    Card,
    CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

// Compact StatCard Design
const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: '8px',
  height: '90px',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  flex: 1,
  minWidth: '160px',
}));

const FilterCard = styled(Paper)(({ theme }) => ({
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  marginBottom: '16px',
  border: '1px solid rgba(0,0,0,0.05)',
}));

function AffiliateHistory() {
    const [showServiceTrans, setShowServiceTrans] = useState([]);
    const [masterReport, setmasterReport] = useState({});
    const dispatch = useDispatch();

    const currentDate = new Date();
    const [fromDate, setFromDate] = useState(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
    const [toDate, setToDate] = useState(dayjs(new Date()));
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const getTnx = async () => {
            const reqData = {
                from_date: fromDate.toISOString().split("T")[0],
                to_date: toDate.toISOString().split("T")[0],
            };
            try {
                const response = await api.post("/api/affiliate_link/get-affiliate-links-Admin", reqData);
                if (response.status === 200) {
                    setShowServiceTrans(response.data.data || []);
                    setmasterReport(response.data.report || {});
                }
            } catch (error) {
                dispatch(callAlert({
                    message: error?.response?.data?.error || error.message,
                    type: "FAILED",
                }));
            }
        };
        getTnx();
    }, [fromDate, toDate, dispatch]);

    const filteredRows = showServiceTrans.filter((row) =>
        (row.first_name && row.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.mlm_id && row.mlm_id.includes(searchTerm)) ||
        (row.mobile && row.mobile.includes(searchTerm)) ||
        (row.email && row.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.category_name && row.category_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (row.link && row.link.includes(searchTerm)) ||
        (row.title && row.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const cards = [
        { label: "Total Count", value: masterReport.totalAffilatelinkListCount ?? 0, color: "#FFC107" },
        { label: "Active", value: masterReport.totalActiveAffilatelinkList ?? 0, color: "#5C6BC0" },
        { label: "Inactive", value: masterReport.totalInactiveAffilatelinkList ?? 0, color: "#26A69A" },
        { label: "Deleted", value: masterReport.totalDeleteAffilatelinkList ?? 0, color: "#EC407A" },
    ];

    return (
        <Layout>
            <Box sx={{ p: 1.5 }}>
                {/* Compact Statistics Cards */}
                <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                        <Box sx={{ 
                            display: "flex", 
                            gap: 1.5, 
                            flexWrap: "wrap",
                        }}>
                            {cards.map((card, index) => (
                                <StatCard 
                                    key={index}
                                    sx={{ 
                                        backgroundColor: '#f5f5f5', 
                                        borderLeft: `4px solid ${card.color}`,
                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                        '&:hover': {
                                            backgroundColor: card.color,
                                            boxShadow: `0 8px 25px ${card.color}80`,
                                            transform: 'translateY(-2px)',
                                            '& .MuiTypography-root': {
                                                color: 'white',
                                            }
                                        }
                                    }}
                                >
                                    <CardContent sx={{ 
                                        padding: '12px !important', 
                                        width: '100%',
                                        textAlign: 'center',
                                        '&:last-child': { pb: '12px' }
                                    }}>
                                        <Typography 
                                            variant="h5" 
                                            sx={{ 
                                                color: '#000000', 
                                                transition: 'color 0.3s ease', 
                                                fontWeight: 700, 
                                                fontSize: '20px', 
                                                mb: 0.5,
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {card.value}
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: '#000000', 
                                                transition: 'color 0.3s ease', 
                                                fontWeight: 600,
                                                fontSize: '12px',
                                                lineHeight: 1.2
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

                {/* Compact Filter Section */}
                <Grid item xs={12}>
                    <FilterCard>
                        <Box sx={{ p: 2 }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    mb: 2,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem'
                                }}
                            >
                                Affiliate Link List
                            </Typography>

                            <Box sx={{ 
                                display: 'flex', 
                                flexWrap: 'wrap',
                                gap: 1.5,
                                alignItems: 'center'
                            }}>
                                <TextField
                                    placeholder="Search"
                                    variant="outlined"
                                    size="small"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon color="action" sx={{ fontSize: 20, mr: 1 }} />,
                                    }}
                                    sx={{ 
                                        minWidth: { xs: '100%', sm: '180px' },
                                        flex: 1,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            backgroundColor: 'rgba(0,0,0,0.02)',
                                        }
                                    }}
                                />

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Box display="flex" gap={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                                        <DatePicker
                                            label="From Date"
                                            value={fromDate}
                                            format="DD-MM-YYYY"
                                            onChange={(date) => setFromDate(date)}
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
                                            onChange={(date) => setToDate(date)}
                                            slotProps={{ 
                                                textField: { 
                                                    size: "small",
                                                    sx: { minWidth: '140px' }
                                                } 
                                            }}
                                        />
                                    </Box>
                                </LocalizationProvider>

                                <Box display="flex" gap={1} sx={{ flexWrap: 'wrap' }}>
                                    <Button
                                        variant="contained"
                                        href={`/add-new-affiliate-link/`}
                                        sx={{
                                            minWidth: '100px',
                                            background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            fontSize: '0.875rem',
                                            py: 1,
                                            '&:hover': {
                                                opacity: 0.9,
                                            }
                                        }}
                                    >
                                        Add New
                                    </Button>
                                    <Button
                                        variant="contained"
                                        href={`/affiliate-link-category/`}
                                        sx={{
                                            minWidth: '100px',
                                            background: 'linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)',
                                            borderRadius: '8px',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            fontSize: '0.875rem',
                                            py: 1,
                                            '&:hover': {
                                                opacity: 0.9,
                                            }
                                        }}
                                    >
                                        Category
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </FilterCard>
                </Grid>
            </Box>
            
            <AffiliateTrackDetailsTransactions showServiceTrans={filteredRows} />
        </Layout>
    );
}

export default withAuth(AffiliateHistory);