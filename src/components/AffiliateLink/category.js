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

const Transactions = ({ showServiceTrans }) => {
    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [...showServiceTrans];
    } else {
        rows = [];
    }

    const rowsPerPageOptions = [5, 10, 25];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(100);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredRows = rows.filter((row) => {
        return row.category_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
    });

    const onPageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 100));
        setPage(0);
    };

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
        "&:last-child td, &:last-child th": {
            border: 0,
        },
    }));

    // ------------------------------------------------------------------------------
    // DELETE MODAL STATES
    // ------------------------------------------------------------------------------
    const [openModal1, setOpenModal1] = React.useState(false);
    const [addMoneyReqId, setAddMoneyReqId] = React.useState(null);
    const [status, setStatus] = React.useState(null);

    const handleOpenModal1 = (id, status) => {
        setAddMoneyReqId(id);
        setStatus(status);
        setOpenModal1(true);
    };

    const handleCloseModal1 = () => {
        setAddMoneyReqId(null);
        setStatus(null);
        setOpenModal1(false);
    };

    // DELETE FUNCTION
    const handleOKButtonClick = async () => {
        try {
            const response = await api.post(
                "/api/graphics/update-graphics-status",
                {
                    status: 0,
                    note: "",
                    id: addMoneyReqId,
                    action: "Delete",
                }
            );

            if (response.data.status === 200) {
                alert(response.data.message);
                location.reload();
            } else {
                console.log("Failed to delete category.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
        handleCloseModal1();
    };

    // ------------------------------------------------------------------------------
    // UPDATE CATEGORY MODAL STATES
    // ------------------------------------------------------------------------------
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState({
        id: "",
        category_name: "",
        status: 1,
    });

    // OPEN UPDATE POPUP
    const openUpdateModal = (row) => {
        setSelectedCategory({
            id: row.id,
            category_name: row.category_name,
            status: row.status,
        });
        setOpenUpdateDialog(true);
    };

    // CLOSE UPDATE POPUP
    const closeUpdateModal = () => {
        setOpenUpdateDialog(false);
    };

    // SAVE UPDATED CATEGORY
    const handleUpdateCategory = async () => {
        try {
            // Validate before sending to backend
            if (!selectedCategory.id) {
                alert("Invalid Category ID");
                return;
            }

            if (!selectedCategory.category_name || selectedCategory.category_name.trim() === "") {
                alert("Category name cannot be empty");
                return;
            }

            const payload = {
                id: selectedCategory.id,
                category_name: selectedCategory.category_name.trim(),
                status: Number(selectedCategory.status),
            };

            const response = await api.post(
                "/api/affiliate_link/update-affiliate-category",
                payload
            );

            if (response.data.status === 200) {
                alert("Category Updated Successfully");
                setOpenUpdateDialog(false);
                location.reload();
            } else {
                alert(response.data.message || "Failed to update category");
            }

        } catch (error) {
            console.error("Update Error:", error);
            alert("Something went wrong while updating the category");
        }
    };


    return (
        <main className="p-6 space-y-6">
            <Grid container spacing={4} sx={{ padding: "0px 16px" }}>
                <Grid item={true} xs={12}>
                    <TableContainer component={Paper}>
                        <Divider />
                        <Table aria-label="User Details">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Sr No.</StyledTableCell>
                                    <StyledTableCell>Category Name</StyledTableCell>
                                    <StyledTableCell>Status</StyledTableCell>
                                    <StyledTableCell>Action</StyledTableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {showServiceTrans.length > 0 ? (
                                    (rowsPerPage > 0
                                        ? filteredRows.slice(
                                            page * rowsPerPage,
                                            page * rowsPerPage + rowsPerPage
                                        )
                                        : filteredRows
                                    ).map((row, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell>
                                                {index + 1 + page * rowsPerPage}
                                            </StyledTableCell>

                                            <StyledTableCell>{row.category_name}</StyledTableCell>

                                            <StyledTableCell
                                                style={{
                                                    color: row.status === 1 ? "green" : "red",
                                                }}
                                            >
                                                {row.status === 1 ? "Active" : "Inactive"}
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

                                                {row.status === 1 && (
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        color="error"
                                                        onClick={() =>
                                                            handleOpenModal1(row.id, 0)
                                                        }
                                                        sx={{ ml: 1 }}
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={11}>
                                            <Typography color={"error"}>
                                                No Records Found.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={{}}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={onPageChange}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Grid>

                {/* --------------------------------------------------------- */}
                {/* DELETE MODAL */}
                {/* --------------------------------------------------------- */}
                <Modal open={openModal1} onClose={handleCloseModal1}>
                    <Box sx={style}>
                        <HelpOutlineOutlinedIcon
                            sx={{ fontSize: 40 }}
                            color="warning"
                        />
                        <Typography variant="h6" sx={{ mt: 1 }}>
                            Are you sure you want to delete this category?
                        </Typography>

                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleOKButtonClick}
                            sx={{ mt: 3 }}
                        >
                            Delete
                        </Button>
                    </Box>
                </Modal>

                {/* --------------------------------------------------------- */}
                {/* UPDATE CATEGORY MODAL */}
                {/* --------------------------------------------------------- */}
                <Modal open={openUpdateDialog} onClose={closeUpdateModal}>
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
                            <option value={0}>Inactive</option>
                        </TextField>

                        <Button
                            variant="contained"
                            onClick={handleUpdateCategory}
                            fullWidth
                        >
                            Save Changes
                        </Button>
                    </Box>
                </Modal>
            </Grid>
        </main>
    );
};

export default Transactions;
