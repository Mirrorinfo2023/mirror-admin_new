'use client';
import React, { useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Typography,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import LeadDetailsModal from './LeadDetailsModal'; // We'll create this component

const LeadReportTable = ({ leads, onEditLead, onDeleteLead, loading }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedLead, setSelectedLead] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewDetails = (lead) => {
        setSelectedLead(lead);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedLead(null);
    };

    const paginatedLeads = leads.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // Enhanced table styles
    const headerCellStyle = {
        color: "white",
        fontWeight: "bold",
        whiteSpace: "nowrap",
        padding: "14px 12px",
        fontSize: "14px",
        backgroundColor: "#2198f3",
        borderBottom: "2px solid #0F172A",
        borderRight: "1px solid rgba(255,255,255,0.15)",
        "&:last-child": {
            borderRight: "none"
        }
    };

    const subHeaderCellStyle = {
        fontSize: '13px'
    };

    const bodyCellStyle = {
        whiteSpace: 'nowrap',
        padding: '12px 10px',
        fontSize: '14px',
        borderRight: '1px solid rgba(0,0,0,0.1)',
        '&:last-child': {
            borderRight: 'none'
        }
    };

    // Row background colors for better readability
    const getRowStyle = (index) => ({
        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
        '&:hover': {
            backgroundColor: '#e3f2fd',
            transition: 'background-color 0.2s ease'
        }
    });

    return (
        <>
            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: 'calc(100vh - 300px)',
                    overflow: 'auto',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
            >
                <Table sx={{ minWidth: 800 }} aria-label="lead report table" stickyHeader>
                    <TableHead sx={{ height: 'auto', lineHeight: 1 }}>
                        {/* MAIN HEADER ROW */}
                        <TableRow sx={{
                            height: 28,
                            minHeight: 28,
                            backgroundColor: "#1565c0",
                            background: "linear-gradient(135deg, #1565c0 0%, #1976d2 100%)",
                        }}>
                            <TableCell sx={{ ...headerCellStyle, padding: '0px 4px' }} rowSpan={2}>
                                Sr No.
                            </TableCell>
                            <TableCell sx={{ ...headerCellStyle, padding: '0px 4px' }} rowSpan={2}>
                                Lead Date
                            </TableCell>
                            <TableCell sx={{ ...headerCellStyle, padding: '0px 4px' }} rowSpan={2}>
                                Lead Name
                            </TableCell>
                            <TableCell sx={{ ...headerCellStyle, padding: '0px 4px' }} rowSpan={2}>
                                Lead Details
                            </TableCell>

                            {/* 🔥 Group Header */}
                            <TableCell
                                sx={{ ...headerCellStyle, padding: '0px 4px' }}
                                align="center"
                                colSpan={5}
                            >
                                Open Lead
                            </TableCell>

                            <TableCell sx={{ ...headerCellStyle, padding: '0px 4px' }} rowSpan={2}>
                                Actions
                            </TableCell>
                        </TableRow>

                        {/* SUB HEADER ROW */}
                        <TableRow sx={{
                            height: 24,
                            minHeight: 24,
                            backgroundColor: "#1976d2",
                            background: "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)",
                        }}>
                            <TableCell align="center" sx={{ ...subHeaderCellStyle, padding: '0px 2px' }}>Open</TableCell>
                            <TableCell align="center" sx={{ ...subHeaderCellStyle, padding: '0px 2px' }}>Close</TableCell>
                            <TableCell align="center" sx={{ ...subHeaderCellStyle, padding: '0px 2px' }}>Pending</TableCell>
                            <TableCell align="center" sx={{ ...subHeaderCellStyle, padding: '0px 2px' }}>Review</TableCell>
                            <TableCell align="center" sx={{ ...subHeaderCellStyle, padding: '0px 2px' }}>Transfer</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <CircularProgress size={40} />
                                        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                                            Loading leads...
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : paginatedLeads.length > 0 ? (
                            paginatedLeads.map((lead, index) => (
                                <TableRow
                                    key={lead.id}
                                    hover
                                    sx={getRowStyle(index)}
                                >
                                    <TableCell sx={{ ...bodyCellStyle, padding: '6px 4px' }}>
                                        <Typography variant="body2" fontWeight="medium">
                                            {page * rowsPerPage + index + 1}
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ ...bodyCellStyle, padding: '6px 4px' }}>
                                        <Typography variant="body2">
                                            {lead.leadDate ?
                                                new Date(lead.leadDate).toLocaleDateString('en-IN')
                                                : '—'
                                            }
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ ...bodyCellStyle, padding: '6px 4px' }}>
                                        <Typography variant="body2" fontWeight="medium">
                                            {lead.leadName || '—'}
                                        </Typography>
                                    </TableCell>

                                    <TableCell sx={{ ...bodyCellStyle, padding: '6px 4px' }}>
                                        {lead.leadDetails ? (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleViewDetails(lead)}
                                                sx={{
                                                    whiteSpace: 'nowrap',
                                                    backgroundColor: '#4caf50',
                                                    padding: '2px 8px',
                                                    minHeight: '24px',
                                                    fontSize: '0.75rem',
                                                    '&:hover': {
                                                        backgroundColor: '#45a049'
                                                    }
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                —
                                            </Typography>
                                        )}
                                    </TableCell>

                                    {/* Status Chips */}
                                    <TableCell align="center" sx={{ ...bodyCellStyle, padding: '6px 2px' }}>
                                        <Chip
                                            label={lead.openLeads?.open || 0}
                                            color="success"
                                            size="small"
                                            variant="filled"
                                            sx={{
                                                fontWeight: 'bold',
                                                minWidth: '40px',
                                                height: '24px',
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center" sx={{ ...bodyCellStyle, padding: '6px 2px' }}>
                                        <Chip
                                            label={lead.openLeads?.close || 0}
                                            color="error"
                                            size="small"
                                            variant="filled"
                                            sx={{
                                                fontWeight: 'bold',
                                                minWidth: '40px',
                                                height: '24px',
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center" sx={{ ...bodyCellStyle, padding: '6px 2px' }}>
                                        <Chip
                                            label={lead.openLeads?.pending || 0}
                                            color="warning"
                                            size="small"
                                            variant="filled"
                                            sx={{
                                                fontWeight: 'bold',
                                                minWidth: '40px',
                                                height: '24px',
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center" sx={{ ...bodyCellStyle, padding: '6px 2px' }}>
                                        <Chip
                                            label={lead.openLeads?.review || 0}
                                            color="info"
                                            size="small"
                                            variant="filled"
                                            sx={{
                                                fontWeight: 'bold',
                                                minWidth: '40px',
                                                height: '24px',
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center" sx={{ ...bodyCellStyle, padding: '6px 2px' }}>
                                        <Chip
                                            label={lead.openLeads?.transfer || 0}
                                            color="secondary"
                                            size="small"
                                            variant="filled"
                                            sx={{
                                                fontWeight: 'bold',
                                                minWidth: '40px',
                                                height: '24px',
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                    </TableCell>

                                    <TableCell sx={{ ...bodyCellStyle, padding: '6px 4px' }}>
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'nowrap' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                startIcon={<EditIcon sx={{ fontSize: '16px' }} />}
                                                onClick={() => onEditLead(lead)}
                                                sx={{
                                                    whiteSpace: 'nowrap',
                                                    px: 1,
                                                    py: 0.5,
                                                    minHeight: '24px',
                                                    fontSize: '0.7rem',
                                                    backgroundColor: '#2196f3',
                                                    '&:hover': {
                                                        backgroundColor: '#1976d2'
                                                    }
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                startIcon={<DeleteIcon sx={{ fontSize: '16px' }} />}
                                                onClick={() => onDeleteLead(lead.id)}
                                                sx={{
                                                    whiteSpace: 'nowrap',
                                                    px: 1,
                                                    py: 0.5,
                                                    minHeight: '24px',
                                                    fontSize: '0.7rem',
                                                    backgroundColor: '#f44336',
                                                    '&:hover': {
                                                        backgroundColor: '#d32f2f'
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Typography
                                            variant="h6"
                                            color="textSecondary"
                                            sx={{ mb: 1 }}
                                        >
                                            No leads found
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Try adjusting your search or filter criteria
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Lead Details Modal */}
            <LeadDetailsModal
                open={modalOpen}
                onClose={handleCloseModal}
                leadId={selectedLead?.id}
                leadName={selectedLead?.leadName}
            />

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={leads.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    borderTop: '1px solid #e0e0e0',
                    borderColor: 'divider',
                    mt: 2,
                    '& .MuiTablePagination-toolbar': {
                        padding: '12px 8px'
                    }
                }}
            />
        </>
    );
};

export default LeadReportTable;