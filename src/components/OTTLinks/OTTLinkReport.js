"use client";
import { Box, Button, Grid, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, Typography, IconButton, Modal, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from "@mui/material";
import { useState } from "react";
import api from "../../../utils/api";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import dayjs from 'dayjs';
import Link from "next/link";
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// import { callAlert } from "@/redux/actions/alert";
import { useDispatch } from "react-redux";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ThemedTableContainer = styled(TableContainer)(({ theme }) => ({
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 4px 24px 0 rgba(33,150,243,0.08)',
    marginTop: 16,
    marginBottom: 16,
    overflowX: 'auto',
    overflowY: 'hidden',
    '&::-webkit-scrollbar': {
        height: 8,
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#90caf9',
        borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#42a5f5',
    },
    [theme.breakpoints.down('sm')]: {
        borderRadius: 8,
        boxShadow: 'none',
    },
}));

const ThemedTableHeadCell = styled(TableCell)(({ theme }) => ({
    background: '#2198f3',
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    padding: 10,
    borderRight: '1px solid #e3e3e3',
    letterSpacing: 1,
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
}));

const ThemedTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        background: '#f5faff',
    },
}));

const NoRecordsBox = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#f44336',
    fontWeight: 600,
    fontSize: 18,
    padding: '32px 0',
    width: '100%',
    gap: 8,
});

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
    '.MuiTablePagination-select': {
        color: '#2196f3',
        fontWeight: 600,
        paddingRight: '24px',
    },
    '.MuiTablePagination-selectLabel': {
        color: '#666',
        fontWeight: 500,
    },
    '.MuiTablePagination-displayedRows': {
        color: '#666',
        fontWeight: 500,
    },
    '.MuiTablePagination-actions': {
        '.MuiIconButton-root': {
            color: '#2196f3',
            '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.08)',
            },
            '&.Mui-disabled': {
                color: '#ccc',
            },
        },
    },
    '.MuiTablePagination-selectIcon': {
        color: '#2196f3',
    },
    '.MuiTablePagination-menuItem': {
        padding: '4px 16px',
    },
    '.MuiTablePagination-selectRoot': {
        marginRight: '32px',
    },
    '.MuiTablePagination-toolbar': {
        minHeight: '52px',
        padding: '0 16px',
        flexWrap: 'wrap',
        gap: '4px',
    },
    '.MuiTablePagination-spacer': {
        flex: 'none',
    },
}));

const OTTTransactions = ({ ottLinks, onDelete, onStatusChange, refreshReport }) => {
    const dispatch = useDispatch();

    const getDate = (timeZone) => {
        if (!timeZone) return '-';
        const dateString = timeZone;
        const dateObject = new Date(dateString);

        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, "0");
        const day = String(dateObject.getDate()).padStart(2, "0");
        const hours = String(dateObject.getHours()).padStart(2, "0");
        const minutes = String(dateObject.getMinutes()).padStart(2, "0");

        const amOrPm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);

        const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;
        return formattedDateTime;
    };

    let rows = ottLinks && ottLinks.length > 0 ? [...ottLinks] : [];

    const rowsPerPageOptions = [5, 10, 25];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState(null);
    const [editForm, setEditForm] = useState({
        ott_name: '',
        link: '',
        status: 1
    });

    const onPageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#ccc',
            color: theme.palette.common.black,
            fontSize: 12,
            lineHeight: '15px',
            padding: 7,
            borderRight: "1px solid rgba(224, 224, 224, 1)"
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 12,
            lineHeight: '15px',
            padding: 7,
            borderRight: "1px solid rgba(224, 224, 224, 1)"
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const [openModal1, setOpenModal1] = useState(false);
    const [openModal2, setOpenModal2] = useState(false);
    const [openModal3, setOpenModal3] = useState(false);
    const [Id, setId] = useState(null);
    const [status, setStatus] = useState(null);

    const handleOpenModal1 = (Id, status) => {
        setId(Id);
        setStatus(status);
        setOpenModal1(true);
    };

    const handleOpenModal3 = (Id, status) => {
        setId(Id);
        setStatus(status);
        setOpenModal3(true);
    };

    const handleCloseModal1 = () => {
        setId(null);
        setStatus(null);
        setOpenModal1(false);
    };

    const handleOpenModal2 = (Id, status) => {
        setId(Id);
        setStatus(status);
        setOpenModal2(true);
    };

    const handleCloseModal2 = () => {
        setOpenModal2(false);
    };

    const handleCloseModal3 = () => {
        setOpenModal3(false);
    };

    const handleStatusButtonClick = async () => {
        if (!Id) return;

        if (status === 0) {
            onDelete(Id);
        } else {
            onStatusChange(Id, status);
        }

        handleCloseModal1();
        handleCloseModal2();
        handleCloseModal3();
    };

    const handleLinkClick = (link) => {
        if (link) {
            window.open(link, '_blank', 'noopener,noreferrer');
        }
    };

    const copyToClipboard = (text) => {
        if (text) {
            navigator.clipboard.writeText(text).then(() => {
                // dispatch(callAlert({ message: "Link copied to clipboard", type: "SUCCESS" }));
            });
        }
    };

    const handleEditClick = (link) => {
        setSelectedLink(link);
        setEditForm({
            ott_name: link.ott_name || '',
            link: link.link || '',
            status: link.status || 1
        });
        setEditDialogOpen(true);
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setSelectedLink(null);
        setEditForm({
            ott_name: '',
            link: '',
            status: 1
        });
    };

    const handleEditSubmit = async () => {
        if (!selectedLink || !editForm.ott_name || !editForm.link) {
            // dispatch(callAlert({ message: "Please fill all required fields", type: "FAILED" }));
            return;
        }

        try {
            const response = await api.post("/api/ott/update-ott", {
                id: selectedLink.id,
                ott_name: editForm.ott_name,
                link: editForm.link,
                status: editForm.status
            });

            if (response.data.status === 200) {
                // dispatch(callAlert({ message: "OTT link updated successfully", type: "SUCCESS" }));
                handleEditClose();
                refreshReport();
            }
        } catch (error) {
            const msg = error?.response?.data?.error || error.message;
            // dispatch(callAlert({ message: msg, type: "FAILED" }));
        }
    };

    return (
        <main className="p-6 space-y-6">
            <Grid container spacing={4} sx={{ padding: 2 }}>
                <Grid item xs={12}>
                    <ThemedTableContainer>
                        <Table aria-label="OTT Links Report">
                            <TableHead>
                                <TableRow>
                                    <ThemedTableHeadCell>Sl No.</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Date & Time</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>OTT Name</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Link</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Status</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Action</ThemedTableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ottLinks.length > 0 ? (
                                    rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                        <ThemedTableRow key={index}>
                                            <StyledTableCell>{index + 1 + page * rowsPerPage}</StyledTableCell>
                                            <StyledTableCell>{getDate(row.created_at)}</StyledTableCell>
                                            <StyledTableCell>{row.ott_name || '-'}</StyledTableCell>
                                            <StyledTableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: '#1976d2',
                                                            cursor: 'pointer',
                                                            '&:hover': { textDecoration: 'underline' }
                                                        }}
                                                        onClick={() => handleLinkClick(row.link)}
                                                    >
                                                        {row.link ? (row.link.length > 50 ? row.link.substring(0, 50) + '...' : row.link) : '-'}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => copyToClipboard(row.link)}
                                                        title="Copy link"
                                                    >
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </StyledTableCell>
                                            <StyledTableCell style={{
                                                color: row.status === 1 ? 'Green' : (row.status === 2 ? 'Red' : 'Gray'),
                                                fontWeight: 'bold'
                                            }}>
                                                {row.status === 1 ? 'Active' : (row.status === 2 ? 'Inactive' : 'Deleted')}
                                            </StyledTableCell>
                                            <StyledTableCell>
                                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<EditIcon />}
                                                        onClick={() => handleEditClick(row)}
                                                        disabled={row.status === 0}
                                                    >
                                                        Edit
                                                    </Button>
                                                    {row.status !== 0 && (
                                                        <>
                                                            {row.status === 2 ? (
                                                                <Button
                                                                    variant="contained"
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={() => handleOpenModal1(row.id, 1)}
                                                                >
                                                                    Activate
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    variant="contained"
                                                                    size="small"
                                                                    color="warning"
                                                                    onClick={() => handleOpenModal2(row.id, 2)}
                                                                >
                                                                    Deactivate
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="contained"
                                                                size="small"
                                                                color="error"
                                                                onClick={() => handleOpenModal3(row.id, 0)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </>
                                                    )}
                                                </Box>
                                            </StyledTableCell>
                                        </ThemedTableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <NoRecordsBox>
                                                <InfoOutlinedIcon color="error" sx={{ fontSize: 28 }} />
                                                No OTT Links Found
                                            </NoRecordsBox>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ThemedTableContainer>

                    {ottLinks.length > 0 && (
                        <StyledTablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={onPageChange}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{
                                borderTop: '1px solid #e0e0e0',
                                padding: '16px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '0 0 16px 16px',
                            }}
                        />
                    )}
                </Grid>
            </Grid>

            {/* Modals for Status Changes */}
            <Modal open={openModal1} onClose={handleCloseModal1}>
                <Box sx={style} alignItems={'center'} justifyContent={'space-between'}>
                    <HelpOutlineOutlinedIcon sx={{ fontSize: 40, marginLeft: 20 }} color="warning" />
                    <Typography id="modal-modal-title" variant="h6" component="h2" align="center" sx={{ mt: 2 }}>
                        Are you sure you want to activate this OTT link?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} align="center">
                        <Button variant="contained" size="large" color="success" onClick={handleStatusButtonClick}>
                            OK
                        </Button>
                        <Button variant="outlined" size="large" onClick={handleCloseModal1} sx={{ ml: 2 }}>
                            Cancel
                        </Button>
                    </Typography>
                </Box>
            </Modal>

            <Modal open={openModal2} onClose={handleCloseModal2}>
                <Box sx={style} alignItems={'center'} justifyContent={'space-between'}>
                    <HelpOutlineOutlinedIcon sx={{ fontSize: 40, marginLeft: 20 }} color="warning" />
                    <Typography id="modal-modal-title" variant="h6" component="h2" align="center" sx={{ mt: 2 }}>
                        Are you sure you want to deactivate this OTT link?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} align="center">
                        <Button variant="contained" size="large" color="success" onClick={handleStatusButtonClick}>
                            OK
                        </Button>
                        <Button variant="outlined" size="large" onClick={handleCloseModal2} sx={{ ml: 2 }}>
                            Cancel
                        </Button>
                    </Typography>
                </Box>
            </Modal>

            <Modal open={openModal3} onClose={handleCloseModal3}>
                <Box sx={style} alignItems={'center'} justifyContent={'space-between'}>
                    <HelpOutlineOutlinedIcon sx={{ fontSize: 40, marginLeft: 20 }} color="warning" />
                    <Typography id="modal-modal-title" variant="h6" component="h2" align="center" sx={{ mt: 2 }}>
                        Are you sure you want to delete this OTT link?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }} align="center">
                        <Button variant="contained" size="large" color="success" onClick={handleStatusButtonClick}>
                            OK
                        </Button>
                        <Button variant="outlined" size="large" onClick={handleCloseModal3} sx={{ ml: 2 }}>
                            Cancel
                        </Button>
                    </Typography>
                </Box>
            </Modal>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit OTT Link</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="OTT Name"
                            value={editForm.ott_name}
                            onChange={(e) => setEditForm({ ...editForm, ott_name: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Link"
                            value={editForm.link}
                            onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                            fullWidth
                            required
                            multiline
                            rows={2}
                        />
                        <TextField
                            select
                            label="Status"
                            value={editForm.status}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                            fullWidth
                        >
                            <MenuItem value={1}>Active</MenuItem>
                            <MenuItem value={2}>Inactive</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button onClick={handleEditSubmit} variant="contained" color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </main>
    );
};

export default OTTTransactions;