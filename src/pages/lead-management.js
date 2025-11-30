"use client"
import React, { useEffect, useState } from "react";
import {
    Container,
    Paper,
    Typography,
    Button,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box
} from '@mui/material';
import { useRouter } from 'next/navigation';
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import LeadReportTable from "@/components/leads/LeadReportTable";
import AddIcon from '@mui/icons-material/Add';
import { DataEncrypt, DataDecrypt } from "../../utils/encryption";
import api from "../../utils/api";
import EditLeadModal from "@/components/leads/EditLeadModal";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PendingIcon from "@mui/icons-material/Pending";
import ReviewsIcon from "@mui/icons-material/Reviews";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

// Styled components from BannersReport - UPDATED WITH SMALLER HEIGHTS
const StatCard = styled(Paper)(({ theme }) => ({
    background: '#f5f5f5',
    color: "#fff",
    borderRadius: 12,
    padding: "10px", // Reduced from 24px
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flex: "1 1 200px", // Slightly smaller base width
    minHeight: 80, // Reduced from 100px
    position: "relative",
    overflow: "hidden",
    [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "12px", // Reduced from 20px
        gap: "6px", // Reduced from 8px
    },
}));

const StatContent = styled("div")({
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
});

const StatValue = styled("div")({
    fontSize: 24, // Reduced from 28
    fontWeight: 700,
    marginBottom: 2, // Reduced from 4
});

const StatLabel = styled("div")({
    fontSize: 12, // Reduced from 14
    fontWeight: 500,
    opacity: 0.85,
    letterSpacing: 0.5, // Reduced from 1
    textTransform: "uppercase",
});

const StatIcon = styled("div")(({ theme }) => ({
    position: "absolute",
    right: 16, // Reduced from 24
    top: "50%",
    transform: "translateY(-50%)",
    opacity: 0.18,
    fontSize: 48, // Reduced from 64
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
        position: "relative",
        right: "auto",
        top: "auto",
        transform: "none",
        fontSize: 36, // Reduced from 48
        opacity: 0.25,
        marginTop: 6, // Reduced from 8
    },
}));

const FilterRow = styled(Box)(({ theme }) => ({
    background: "#f5faff",
    borderRadius: 12,
    boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
    padding: "16px",
    display: "flex",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
    justifyContent: "space-between",
    [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "stretch",
        gap: 12,
    },
}));

function LeadManagement(props) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [leads, setLeads] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState(null);
    const [statusCounts, setStatusCounts] = useState({
        total: 0,
        open: 0,
        close: 0,
        pending: 0,
        review: 0,
        transfer: 0
    });

    useEffect(() => {
        fetchLeads();
    }, []);

    // Calculate status counts whenever leads change
    useEffect(() => {
        if (leads.length > 0) {
            const counts = {
                total: leads.length,
                open: leads.filter(lead => lead.status === 'open').length,
                close: leads.filter(lead => lead.status === 'close').length,
                pending: leads.filter(lead => lead.status === 'pending').length,
                review: leads.filter(lead => lead.status === 'review').length,
                transfer: leads.filter(lead => lead.status === 'transfer').length
            };
            setStatusCounts(counts);
        }
    }, [leads]);

    const fetchLeads = async () => {
        try {
            const response = await api.post("/api/leads/get-lead-reports");
            if (response.status === 200) {
                const apiData = response.data.data || [];
                const formatted = apiData.map(item => ({
                    id: item.sr_no,
                    leadDate: item.lead_at_date,
                    leadName: item.lead_name,
                    leadDetails: item.lead_details,
                    status: item.action,
                    totalLeads: item.total_lead,
                    openLeads: item.open_lead,
                    // Add more fields that might be needed for editing
                    title: item.lead_name, // Using leadName as title
                    description: item.description,
                    category: item.category_id,
                    discountRange: item.discount_upto
                }));
                setLeads(formatted);
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
            setLeads([]);
        }
    };

    const handleAddNewLead = () => {
        router.push('/add-new-lead');
    };

    const handleEditLead = async (lead) => {
        try {
            // Fetch complete lead details by ID
            const leadDetails = await fetchLeadDetails(lead.id);
            setEditingLead({
                ...lead,
                ...leadDetails // Merge basic lead info with detailed data
            });
            setEditModalOpen(true);
        } catch (error) {
            console.error('Error fetching lead details:', error);
            // Fallback to basic lead data
            setEditingLead(lead);
            setEditModalOpen(true);
        }
    };

    const fetchLeadDetails = async (leadId) => {
        try {
            const payload = { lead_id: leadId };
            const encryptedData = DataEncrypt(JSON.stringify(payload));
            const reqData = { encReq: encryptedData };

            const response = await api.post('/api/leads/get-lead-details', reqData);
            if (response.status === 200) {
                const decrypted = DataDecrypt(response.data);
                return decrypted.data || {};
            }
        } catch (error) {
            console.error('Error fetching lead details:', error);
            return {};
        }
    };

    const handleDeleteLead = async (leadId) => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            try {
                const payload = { lead_id: leadId };
                const encryptedData = DataEncrypt(JSON.stringify(payload));
                const reqData = { encReq: encryptedData };

                const response = await api.post('/api/leads/delete-lead', payload);
                if (response.status === 200) {
                    alert('Lead deleted successfully!');
                    fetchLeads();
                }
            } catch (error) {
                console.error('Error deleting lead:', error);
                alert('Error deleting lead. Please try again.');
            }
        }
    };

    const handleEditSuccess = () => {
        setEditModalOpen(false);
        setEditingLead(null);
        fetchLeads();
    };

    const handleEditCancel = () => {
        setEditModalOpen(false);
        setEditingLead(null);
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            lead.leadName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.leadDetails?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <Layout>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Status Cards Section */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "nowrap",
                                gap: 2,
                                overflowX: "auto",
                                pb: 1,
                                "&::-webkit-scrollbar": {
                                    height: 1,
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    background: "#ccc",
                                    borderRadius: 3,
                                },
                            }}
                        >

                            {/* Total Leads Card */}
                            <StatCard
                                sx={{
                                    backgroundColor: '#f5f5f5',
                                    borderLeft: '4px solid #667eea',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: '#667eea',
                                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)',
                                        transform: 'translateY(-4px)',
                                        '& .MuiTypography-root': {
                                            color: 'white',
                                        }
                                    }
                                }}
                            >
                                <StatContent>
                                    <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease' }}>{statusCounts.total}</StatValue>
                                    <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease' }}>Total Leads</StatLabel>
                                </StatContent>
                                <StatIcon>
                                    <LeaderboardIcon sx={{ fontSize: 48, color: "#667eea", transition: 'color 0.3s ease' }} />
                                </StatIcon>
                            </StatCard>

                            {/* Open Leads Card */}
                            <StatCard
                                sx={{
                                    backgroundColor: '#f5f5f5',
                                    borderLeft: '4px solid #11998e',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: '#11998e',
                                        boxShadow: '0 8px 25px rgba(17, 153, 142, 0.5)',
                                        transform: 'translateY(-4px)',
                                        '& .MuiTypography-root': {
                                            color: 'white',
                                        }
                                    }
                                }}
                            >
                                <StatContent>
                                    <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease' }}>{statusCounts.open}</StatValue>
                                    <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease' }}>Open</StatLabel>
                                </StatContent>
                                <StatIcon>
                                    <CheckCircleIcon sx={{ fontSize: 48, color: "#11998e", transition: 'color 0.3s ease' }} />
                                </StatIcon>
                            </StatCard>

                            {/* Close Leads Card */}
                            <StatCard
                                sx={{
                                    backgroundColor: '#f5f5f5',
                                    borderLeft: '4px solid #ff6b6b',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: '#ff6b6b',
                                        boxShadow: '0 8px 25px rgba(255, 107, 107, 0.5)',
                                        transform: 'translateY(-4px)',
                                        '& .MuiTypography-root': {
                                            color: 'white',
                                        }
                                    }
                                }}
                            >
                                <StatContent>
                                    <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease' }}>{statusCounts.close}</StatValue>
                                    <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease' }}>Close</StatLabel>
                                </StatContent>
                                <StatIcon>
                                    <HighlightOffIcon sx={{ fontSize: 48, color: "#ff6b6b", transition: 'color 0.3s ease' }} />
                                </StatIcon>
                            </StatCard>

                            {/* Pending Leads Card */}
                            <StatCard
                                sx={{
                                    backgroundColor: '#f5f5f5',
                                    borderLeft: '4px solid #ffa726',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: '#ffa726',
                                        boxShadow: '0 8px 25px rgba(255, 167, 38, 0.5)',
                                        transform: 'translateY(-4px)',
                                        '& .MuiTypography-root': {
                                            color: 'white',
                                        }
                                    }
                                }}
                            >
                                <StatContent>
                                    <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease' }}>{statusCounts.pending}</StatValue>
                                    <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease' }}>Pending</StatLabel>
                                </StatContent>
                                <StatIcon>
                                    <PendingIcon sx={{ fontSize: 48, color: "#ffa726", transition: 'color 0.3s ease' }} />
                                </StatIcon>
                            </StatCard>

                            {/* Review Leads Card */}
                            <StatCard
                                sx={{
                                    backgroundColor: '#f5f5f5',
                                    borderLeft: '4px solid #42a5f5',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: '#42a5f5',
                                        boxShadow: '0 8px 25px rgba(66, 165, 245, 0.5)',
                                        transform: 'translateY(-4px)',
                                        '& .MuiTypography-root': {
                                            color: 'white',
                                        }
                                    }
                                }}
                            >
                                <StatContent>
                                    <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease' }}>{statusCounts.review}</StatValue>
                                    <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease' }}>Review</StatLabel>
                                </StatContent>
                                <StatIcon>
                                    <ReviewsIcon sx={{ fontSize: 48, color: "#42a5f5", transition: 'color 0.3s ease' }} />
                                </StatIcon>
                            </StatCard>

                            {/* Transfer Leads Card */}
                            <StatCard
                                sx={{
                                    backgroundColor: '#f5f5f5',
                                    borderLeft: '4px solid #ab47bc',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: '#ab47bc',
                                        boxShadow: '0 8px 25px rgba(171, 71, 188, 0.5)',
                                        transform: 'translateY(-4px)',
                                        '& .MuiTypography-root': {
                                            color: 'white',
                                        }
                                    }
                                }}
                            >
                                <StatContent>
                                    <StatValue sx={{ color: '#000000', transition: 'color 0.3s ease' }}>{statusCounts.transfer}</StatValue>
                                    <StatLabel sx={{ color: '#000000', transition: 'color 0.3s ease' }}>Transfer</StatLabel>
                                </StatContent>
                                <StatIcon>
                                    <SwapHorizIcon sx={{ fontSize: 48, color: "#ab47bc", transition: 'color 0.3s ease' }} />
                                </StatIcon>
                            </StatCard>
                        </Box>
                    </Grid>
                </Grid>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                    {/* Filter Row Section */}
                    <FilterRow sx={{ mb: 3 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: "#333",
                                mb: { xs: 1, sm: 0 },
                                textAlign: { xs: "center", sm: "left" },
                            }}
                        >
                            Lead Management
                        </Typography>

                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 2,
                                justifyContent: { xs: "center", sm: "flex-start" },
                                width: { xs: "100%", sm: "auto" },
                            }}
                        >
                            <TextField
                                label="Search by Lead Name"
                                variant="outlined"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{
                                    background: "#fff",
                                    borderRadius: 1,
                                    minWidth: 200,
                                    "& .MuiInputBase-root": {
                                        height: 43
                                    }
                                }}
                            />

                            <FormControl
                                sx={{
                                    background: "#fff",
                                    borderRadius: 1,
                                    minWidth: 200,
                                    "& .MuiInputBase-root": {
                                        height: 43
                                    }
                                }}
                            >
                                <InputLabel>Filter by Status</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="Filter by Status"
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <MenuItem value="all">All Status</MenuItem>
                                    <MenuItem value="open">Open</MenuItem>
                                    <MenuItem value="close">Close</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="review">Review</MenuItem>
                                    <MenuItem value="transfer">Transfer</MenuItem>
                                </Select>
                            </FormControl>

                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={handleAddNewLead}
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    fontSize: 16,
                                    px: 3,
                                    py: 1,
                                    background: '#2198f3',
                                    boxShadow: '0 2px 8px 0 rgba(33, 203, 243, 0.15)',
                                    textTransform: 'none',
                                    whiteSpace: 'nowrap',
                                    height: 43,
                                    minWidth: 180
                                }}
                            >
                                Add New Lead
                            </Button>
                        </Box>
                    </FilterRow>

                    {/* Table */}
                    <LeadReportTable
                        leads={filteredLeads}
                        onEditLead={handleEditLead}
                        onDeleteLead={handleDeleteLead}
                    />
                </Paper>

                {/* Edit Lead Modal */}
                <EditLeadModal
                    open={editModalOpen}
                    onClose={handleEditCancel}
                    onSuccess={handleEditSuccess}
                    leadId={editingLead?.id}
                    leadData={editingLead}
                />
            </Container>
        </Layout>
    );
}

export default withAuth(LeadManagement);