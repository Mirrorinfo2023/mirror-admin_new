import { Box, Button, Grid, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, Typography, Link, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import * as React from 'react';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import api from "../../../utils/api";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
    border: '1px solid #e0e0e0'
};

const ThemedTableContainer = styled(TableContainer)(({ theme }) => ({
    background: '#fff',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginTop: 16,
    marginBottom: 16,
    overflowX: 'auto',
    overflowY: 'hidden',
    border: '1px solid #e0e0e0',
    WebkitOverflowScrolling: 'touch',
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
        borderRadius: 4,
        border: '1px solid #e0e0e0'
    },
}));

const ThemedTableHeadCell = styled(TableCell)(({ theme }) => ({
    background: '#2198f3',
    color: '#fff',
    fontWeight: 600,
    fontSize: 14,
    padding: '12px 16px',
    borderRight: '1px solid rgba(255,255,255,0.3)',
    borderBottom: '1px solid rgba(255,255,255,0.3)',
    whiteSpace: 'nowrap',
    '&:last-child': {
        borderRight: 'none'
    }
}));

const ThemedTableRow = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        background: '#f5faff',
    },
    '& td': {
        padding: '12px 16px',
        fontSize: '14px',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid #e0e0e0',
        borderRight: '1px solid #f0f0f0'
    },
    '& td:last-child': {
        borderRight: 'none'
    }
}));

const NoRecordsBox = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#f44336',
    fontWeight: 600,
    fontSize: 16,
    padding: '32px 0',
    width: '100%',
    gap: 8,
    border: '1px solid #ffcdd2',
    borderRadius: 4,
    backgroundColor: '#ffebee',
    margin: '16px'
});

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
    border: '1px solid #e0e0e0',
    borderTop: 'none',
    borderRadius: '0 0 8px 8px',
    backgroundColor: '#f8f9fa',
    '.MuiTablePagination-select': {
        color: '#2196f3',
        fontWeight: 600,
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
        },
    },
}));

const ActionSelect = styled(Select)({
    width: '120px',
    height: '36px',
    fontSize: '14px',
    border: '1px solid #e0e0e0',
    borderRadius: 4,
    '& .MuiSelect-select': {
        padding: '8px 12px'
    },
    '&:hover': {
        borderColor: '#2196f3'
    }
});

const TableCellWithBorder = styled(TableCell)({
    borderRight: '1px solid #f0f0f0',
    borderBottom: '1px solid #e0e0e0',
    '&:last-child': {
        borderRight: 'none'
    }
});

const Transactions = ({ showServiceTrans }) => {
    const rows = showServiceTrans && showServiceTrans.length > 0 ? [...showServiceTrans] : [];

    const rowsPerPageOptions = [5, 10, 25, 50];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    
    const [openModal, setOpenModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({ 
        type: '', // 'delete', 'active', 'inactive'
        id: null, 
        title: '', 
        message: '' 
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenModal = (id, actionType) => {
        let title = '';
        let message = '';
        let status = null;

        switch(actionType) {
            case 'delete':
                title = 'Delete Category';
                message = 'Are you sure you want to delete this category?';
                status = 0;
                break;
            case 'active':
                title = 'Activate Category';
                message = 'Are you sure you want to activate this category?';
                status = 1;
                break;
            case 'inactive':
                title = 'Deactivate Category';
                message = 'Are you sure you want to deactivate this category?';
                status = 2;
                break;
            default:
                return;
        }

        setModalConfig({
            type: actionType,
            id: id,
            title: title,
            message: message,
            status: status
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setModalConfig({ type: '', id: null, title: '', message: '' });
    };

    const handleOKButtonClick = async () => {
        if (!modalConfig.id || modalConfig.status === null) {
            console.error('Missing ID or status');
            return;
        }

        const actionMap = {
            0: 'Delete',
            1: 'Active', 
            2: 'Inactive'
        };

        const requestData = {
            status: modalConfig.status,
            id: modalConfig.id,
            action: actionMap[modalConfig.status]
        };

        try {
            const response = await api.post("/api/leads/update-status-category", requestData);

            if (response.data.status === 200) {
                alert(`${actionMap[modalConfig.status]} successfully.`);
                window.location.reload();
            } else {
                console.log('Failed to update status.');
                alert('Failed to update status.');
            }
        } catch (error) {
            console.error("Error:", error);
            alert('Error updating status.');
        }

        handleCloseModal();
    };

    const handleLinkClick = (img) => {
        if (img) {
            window.open(img, '_blank', 'noopener,noreferrer');
        }
    };

    const handleOptionChange = (event, rowId, rowData) => {
        const value = event.target.value;
        
        if (value === 'edit') {
            window.location.href = `/edit-leads-category/?id=${rowData.id}`;
        } else if (['active', 'inactive', 'delete'].includes(value)) {
            handleOpenModal(rowData.id, value);
        }
    };

    const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <main className="p-4 space-y-4">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <ThemedTableContainer>
                        <Table aria-label="Lead Categories" sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    <ThemedTableHeadCell>Sr No.</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Category Name</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Parent Category</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Discount Upto</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Category Image</ThemedTableHeadCell>
                                    <ThemedTableHeadCell>Action</ThemedTableHeadCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedRows.length > 0 ? (
                                    paginatedRows.map((row, index) => (
                                        <ThemedTableRow key={row.id || index}>
                                            <TableCellWithBorder>{page * rowsPerPage + index + 1}</TableCellWithBorder>
                                            <TableCellWithBorder>{row.category_name || '-'}</TableCellWithBorder>
                                            <TableCellWithBorder>{row.parent_category || '-'}</TableCellWithBorder>
                                            <TableCellWithBorder>{row.discount_upto || '-'}</TableCellWithBorder>
                                            <TableCellWithBorder>
                                                {row.category_image ? (
                                                    <Link 
                                                        href="#" 
                                                        onClick={() => handleLinkClick(row.category_image)}
                                                        sx={{ 
                                                            textDecoration: 'none',
                                                            color: '#2196f3',
                                                            '&:hover': { textDecoration: 'underline' }
                                                        }}
                                                    >
                                                        View
                                                    </Link>
                                                ) : '-'}
                                            </TableCellWithBorder>
                                            <TableCellWithBorder>
                                                <ActionSelect
                                                    defaultValue=""
                                                    displayEmpty
                                                    onChange={(event) => handleOptionChange(event, index, row)}
                                                >
                                                    <MenuItem value="" disabled>Select Action</MenuItem>
                                                    <MenuItem value="active">Active</MenuItem>
                                                    <MenuItem value="inactive">Inactive</MenuItem>
                                                    <MenuItem value="edit">Edit</MenuItem>
                                                    <MenuItem value="delete">Delete</MenuItem>
                                                </ActionSelect>
                                            </TableCellWithBorder>
                                        </ThemedTableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ border: '1px solid #e0e0e0' }}>
                                            <NoRecordsBox>
                                                <InfoOutlinedIcon color="error" sx={{ fontSize: 24 }} />
                                                No Records Found
                                            </NoRecordsBox>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ThemedTableContainer>

                    {rows.length > 0 && (
                        <StyledTablePagination
                            rowsPerPageOptions={rowsPerPageOptions}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    )}
                </Grid>
            </Grid>

            {/* Single Modal for all actions */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="confirmation-modal"
            >
                <Box sx={style}>
                    <HelpOutlineOutlinedIcon sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
                    <Typography variant="h6" component="h2" gutterBottom>
                        {modalConfig.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        {modalConfig.message}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button 
                            variant="outlined" 
                            onClick={handleCloseModal}
                            sx={{ 
                                minWidth: 100,
                                border: '1px solid #e0e0e0',
                                '&:hover': {
                                    border: '1px solid #2196f3'
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={handleOKButtonClick}
                            sx={{ 
                                minWidth: 100,
                                border: '1px solid #1976d2'
                            }}
                        >
                            OK
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </main>
    );
};

export default Transactions;