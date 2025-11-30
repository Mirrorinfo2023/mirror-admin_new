'use client';
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Card,
    CardContent,
    Avatar,
    Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DataEncrypt, DataDecrypt } from "../../../utils/encryption";
import api from "../../../utils/api";

const LeadDetailsModal = ({ open, onClose, leadId, leadName }) => {
    const [leadData, setLeadData] = useState(null);
    const [formSubmissions, setFormSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formFields, setFormFields] = useState([]);

    // Get base URL from environment variables
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

    useEffect(() => {
        if (open && leadId) {
            fetchLeadDetails();
        }
    }, [open, leadId]);

    const fetchLeadDetails = async () => {
        try {
            setLoading(true);
            const payload = { lead_id: leadId };
            const response = await api.post('/api/leads/get-lead-submission-details', payload);

            if (response.status === 200) {
                const apiData = response.data.data;
                console.log("API Response:", apiData);

                setLeadData(apiData.lead_info);
                setFormFields(apiData.form_fields || []);
                setFormSubmissions(apiData.submissions || []);
            }
        } catch (error) {
            console.error("Error fetching lead details:", error);
            setFormFields([]);
            setFormSubmissions([]);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get field value from submission
    const getFieldValue = (submission, fieldName) => {
        const fieldData = submission.form_data.find(item => item.field_name === fieldName);
        return fieldData ? fieldData.user_value : 'Not provided';
    };

    // Function to get full image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath || imagePath === 'Not provided') return null;

        // If it's already a full URL, return as is
        if (imagePath.startsWith('http')) return imagePath;

        // Otherwise, prepend base URL
        return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    };

    const formatFieldValue = (value, type, fieldLabel) => {
        if (!value || value === 'Not provided' || value === 'null') return '—';

        switch (type) {
            case 'date':
                return new Date(value).toLocaleDateString('en-IN');
            case 'datetime-local':
                return new Date(value).toLocaleString('en-IN');
            case 'checkbox':
                return value ? 'Yes' : 'No';
            case 'file':
            case 'image':
                const imageUrl = getImageUrl(value);
                return imageUrl ? (
                    // <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        
                        <Button
                            variant="text"
                            size="small"
                            onClick={() => window.open(imageUrl, '_blank')}
                            sx={{
                                fontSize: '0.75rem',
                                padding: '2px 8px',
                                minWidth: 'auto',
                                color: '#1976D2',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    color: '#1565C0'
                                }
                            }}
                        >
                            View Image
                        </Button>
                    // </Box>
                ) : '—';
            default:
                return String(value);
        }
    };

    const getStatusChip = (status) => {
        const statusMap = {
            1: { label: 'Active', color: 'success' },
            0: { label: 'Inactive', color: 'error' },
            active: { label: 'Active', color: 'success' },
            inactive: { label: 'Inactive', color: 'error' }
        };

        const statusInfo = statusMap[status] || { label: 'Unknown', color: 'default' };
        return (
            <Chip
                label={statusInfo.label}
                color={statusInfo.color}
                size="small"
            />
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: 2,
                    minHeight: '80vh',
                    maxHeight: '90vh'
                }
            }}
        >
            {/* Dialog Header */}
            <DialogTitle sx={{
                m: 0,
                p: 2,
                // backgroundColor: '#1976D2',
                color: '#333',
                display: 'flex',
                textAlign:"center",
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h6" fontWeight="bold">
                    Lead Name - {leadData?.lead_name || leadName || 'Loading...'}
                </Typography>
                <IconButton aria-label="close" onClick={onClose} sx={{ color: 'black' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: .3 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                        <CircularProgress />
                        <Typography variant="body1" sx={{ ml: 2 }}>Loading lead details...</Typography>
                    </Box>
                ) : (
                    <>
                        {/* Lead Image Only - Displayed directly */}
                        {/* {leadData?.img && leadData.img !== 'Not provided' && (
                            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                                <Card 
                                    variant="outlined" 
                                    sx={{ 
                                        maxWidth: 300,
                                        textAlign: 'center'
                                    }}
                                >
                                    <CardContent>
                                        
                                        <Typography variant="body1" sx={{ mt: 1, fontWeight: 'medium' }}>
                                            {leadData.lead_name}
                                        </Typography>
                                        <Button
                                            variant="text"
                                            size="small"
                                            onClick={() => window.open(getImageUrl(leadData.img), '_blank')}
                                            sx={{
                                                mt: 1,
                                                color: '#1976D2',
                                                textDecoration: 'underline',
                                                fontSize: '0.9rem',
                                                '&:hover': {
                                                    backgroundColor: 'transparent',
                                                    color: '#1565C0'
                                                }
                                            }}
                                        >
                                            View Image
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Box>
                        )} */}

                        {/* Form Submissions Table */}
                        {formSubmissions.length > 0 ? (
                            <TableContainer
                                sx={{
                                    maxHeight: '60vh',
                                    overflow: 'auto',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 1
                                }}
                            >
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#1976D2' }}>
                                            <TableCell sx={{ bgcolor: '#1976D2', color: '#fff', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                                Sr No.
                                            </TableCell>
                                            {formFields.map(field => (
                                                <TableCell
                                                    key={field.name}
                                                    sx={{ bgcolor: '#1976D2', color: '#fff', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                                                >
                                                    {field.label || field.name}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {formSubmissions.map((submission, index) => (
                                            <TableRow
                                                key={submission.user_form_id}
                                                hover
                                                sx={{
                                                    '&:nth-of-type(odd)': {
                                                        backgroundColor: '#f9f9f9'
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: '#f0f0f0'
                                                    }
                                                }}
                                            >
                                                <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'medium' }}>
                                                    {index + 1}
                                                </TableCell>
                                                {formFields.map(field => (
                                                    <TableCell
                                                        key={`${submission.user_form_id}-${field.name}`}
                                                        sx={{ whiteSpace: 'nowrap' }}
                                                    >
                                                        {formatFieldValue(
                                                            getFieldValue(submission, field.name),
                                                            field.type,
                                                            field.label
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Box sx={{
                                p: 4,
                                textAlign: 'center',
                                border: '1px dashed #ccc',
                                borderRadius: 1,
                                backgroundColor: '#f5f5f5'
                            }}>
                                <Typography variant="h6" color="textSecondary" gutterBottom>
                                    No form submissions found for this lead.
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    When users fill out the form, their submissions will appear here.
                                </Typography>
                            </Box>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default LeadDetailsModal;