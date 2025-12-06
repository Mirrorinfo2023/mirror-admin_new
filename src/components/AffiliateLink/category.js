import {
    Box,
    Button,
    Divider,
    TextField,
    Container,
    Grid,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    Link,
} from "@mui/material";

import { useEffect, useState } from "react";
import * as React from "react";
import Cookies from "js-cookie";
import { ArrowBack } from "@mui/icons-material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import Modal from "@mui/material/Modal";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import api from "../../../utils/api";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const Transactions = ({ showServiceTrans, onUpdateCategory, onDeleteCategory, onRefresh }) => {
    let rows = showServiceTrans || [];

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(100);

    // Update Modal State
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState({
        id: "",
        category_name: "",
        status: 1,
    });

    // Delete Modal
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            background: "#2198f3",
            color: "white",
            fontSize: 14,
            padding: 7,
            borderRight: "1px solid rgba(224, 224, 224, 1)",
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 12,
            padding: 7,
            borderRight: "1px solid rgba(224, 224, 224, 1)",
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
    }));

    // ------------------------ Open Update Popup ------------------------
    const openUpdateModal = (row) => {
        setSelectedCategory({
            id: row.id,
            category_name: row.category_name,
            status: row.status,
        });
        setOpenUpdateDialog(true);
    };

    // ------------------------ Save Updated Category ------------------------
    const handleSaveUpdate = async () => {
        const success = await onUpdateCategory(selectedCategory);
        if (success) {
            setOpenUpdateDialog(false);
            onRefresh();
        }
    };

    // ------------------------ Delete Category ------------------------
    const openDeleteModal = (id) => {
        setDeleteCategoryId(id);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        const success = await onDeleteCategory(deleteCategoryId);
        if (success) {
            setOpenDeleteDialog(false);
            onRefresh();
        }
    };

    return (
        <main className="p-6 space-y-6">
            <Grid container spacing={4} sx={{ padding: "0px 16px" }}>
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Divider />
                        <Table aria-label="User Details">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Sr No.</StyledTableCell>
                                    <StyledTableCell>Category</StyledTableCell>
                                    <StyledTableCell>Sub Category</StyledTableCell>
                                    <StyledTableCell>Status</StyledTableCell>
                                    <StyledTableCell>Action</StyledTableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {rows.length > 0 ? (
                                    rows.map((row, index) => (
                                        <StyledTableRow key={row.id}>
                                            <StyledTableCell>
                                                {index + 1}
                                            </StyledTableCell>

                                            <StyledTableCell>{row.category_name}</StyledTableCell>

                                            <StyledTableCell>
                                                {Array.isArray(row.subcategories)
                                                    ? row.subcategories.join(", ")
                                                    : "-"}
                                            </StyledTableCell>

                                            <StyledTableCell
                                                style={{
                                                    color:
                                                        row.status === 1 ? "green" :
                                                            row.status === 2 ? "orange" :
                                                                "red"
                                                }}
                                            >
                                                {row.status === 1 ? "Active"
                                                    : row.status === 2 ? "Inactive"
                                                        : "Deleted"}
                                            </StyledTableCell>


                                            <StyledTableCell>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    color="success"
                                                    onClick={() => openUpdateModal(row)}
                                                >
                                                    Update
                                                </Button>

                                                {/* {row.status === 1 && (
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        color="error"
                                                        onClick={() => openDeleteModal(row.id)}
                                                        sx={{ ml: 1 }}
                                                    >
                                                        Delete
                                                    </Button>
                                                )} */}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={11}>
                                            <Typography color="error">
                                                No Records Found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* DELETE MODAL */}
                <Modal open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                    <Box sx={style}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Are you sure you want to delete this category?
                        </Typography>

                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleConfirmDelete}
                            fullWidth
                        >
                            Delete
                        </Button>
                    </Box>
                </Modal>

                {/* UPDATE CATEGORY MODAL */}
                <Modal open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
                    <Box sx={style}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Update Category
                        </Typography>

                        <TextField
                            fullWidth
                            label="Category Name"
                            value={selectedCategory.category_name}
                            onChange={(e) =>
                                setSelectedCategory({
                                    ...selectedCategory,
                                    category_name: e.target.value,
                                })
                            }
                            sx={{ mb: 2 }}
                        />

                        {/* Add Subcategories field if needed */}
                        <TextField
                            fullWidth
                            label="Subcategories (comma separated)"
                            value={Array.isArray(selectedCategory.subcategories)
                                ? selectedCategory.subcategories.join(", ")
                                : selectedCategory.subcategories || ""}
                            onChange={(e) =>
                                setSelectedCategory({
                                    ...selectedCategory,
                                    subcategories: e.target.value.split(",").map(item => item.trim()),
                                })
                            }
                            helperText="Enter subcategories separated by commas"
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            select
                            fullWidth
                            label="Status"
                            SelectProps={{ native: true }}
                            value={selectedCategory.status}
                            onChange={(e) =>
                                setSelectedCategory({
                                    ...selectedCategory,
                                    status: Number(e.target.value),
                                })
                            }
                            sx={{ mb: 2 }}
                        >
                            <option value={1}>Active</option>
                            <option value={2}>Inactive</option>
                        </TextField>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                onClick={() => setOpenUpdateDialog(false)}
                                sx={{ flex: 1 }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSaveUpdate}
                                sx={{ flex: 1 }}
                            >
                                Save Changes
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Grid>
        </main>
    );
};

export default Transactions;

