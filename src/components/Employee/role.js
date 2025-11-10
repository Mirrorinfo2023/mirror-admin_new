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
    StyledTableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    Link,
    Menu,
    MenuItem,
    Select,
    Modal,
} from "@mui/material";
import { useEffect, useState } from "react";
import * as React from "react";
import Cookies from "js-cookie";
import { ArrowBack } from "@mui/icons-material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import api from "../../../utils/api";
import Image from "next/image";

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
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [searchTerm, setSearchTerm] = useState("");

    const filteredRows = rows.filter((row) => {
        return (
            row.role_name && row.role_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
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
              background: "linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)",
            color: "white", // makes text visible on gradient
            fontSize: 12,
            linHeight: 15,
            padding: 7,
            borderRight: "1px solid rgba(224, 224, 224, 1)",
            whiteSpace: "nowrap"
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 12,
            linHeight: 15,
            padding: 7,
            borderRight: "1px solid rgba(224, 224, 224, 1)",
            whiteSpace: "nowrap"
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

    const [openModal1, setOpenModal1] = React.useState(false);
    const [status, setStatus] = React.useState(null);
    const [role_id, setRoleId] = React.useState(null);
    const [role_name, setRoleName] = React.useState(null);

    const handleOpenModal1 = (roleId, roleName, status) => {
        setRoleId(roleId);
        setStatus(status);
        setRoleName(roleName);
        setOpenModal1(true);
    };

    const handleCloseModal1 = () => {
        setRoleId(null);
        setRoleName(null);
        setStatus(null);
        setOpenModal1(false);
    };

    const handleOKButtonClick = async () => {
        if (!role_id) {
            console.error("Id is missing.");
            return;
        }

        let action = "";
        if (status === 0) {
            action = "Inactive";
        } else if (status === 1) {
            action = "Active";
        }

        const requestData = {
            status: status,
            role_name: role_name,
            role_id: role_id,
            action: action,
        };

        try {
            const response = await api.post("/api/employee/update-role", requestData);

            if (response.data.status === 200) {
                alert(`${action} successfully.`);
                location.reload();
            } else {
                console.log("Failed to update status.");
            }
        } catch (error) {
            console.error("Error:", error);
        }

        handleCloseModal1();
    };

    return (
        <main className="p-6 space-y-6">
            <Grid container spacing={4} sx={{ padding: "0px 16px" }}>
                <Grid item={true} xs={12}>
                    <TableContainer component={Paper}>
                        <Divider />
                        <Table aria-label="role" sx={{ size: 2 }} mt={2}>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                                        Sr No.
                                    </StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                                        Role
                                    </StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                                        Status
                                    </StyledTableCell>
                                    <StyledTableCell style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                                        Action
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {showServiceTrans.length > 0 ? (
                                    (rowsPerPage > 0
                                        ? filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : filteredRows
                                    ).map((row, index) => (
                                        <StyledTableRow
                                            key={index}
                                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                            className="position-relative-row"
                                        >
                                            <StyledTableCell>{index + 1 + page * rowsPerPage}</StyledTableCell>
                                            <StyledTableCell>{row.role_name}</StyledTableCell>
                                            <StyledTableCell
                                                style={{
                                                    color: row.status === 1 ? "Green" : "Red",
                                                }}
                                            >
                                                {row.status === 1 ? "Active" : "Inactive"}
                                            </StyledTableCell>

                                            {/* ✅ ACTION BUTTONS INSTEAD OF DROPDOWN */}
                                            <StyledTableCell sx={{ "& button": { m: 0.5 } }}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    onClick={() => handleOpenModal1(row.id, row.role_name, 1)}
                                                >
                                                    Activate
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleOpenModal1(row.id, row.role_name, 0)}
                                                >
                                                    Deactivate
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    size="small"
                                                    component={Link}
                                                    href={`/edit-role/?id=${row.id}`}
                                                >
                                                    Edit
                                                </Button>

                                                {/* Confirmation Modal */}
                                                <Modal
                                                    open={openModal1}
                                                    onClose={handleCloseModal1}
                                                    aria-labelledby="modal-modal-title"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Box sx={style} alignItems={"center"} justifyContent={"space-between"}>
                                                        <HelpOutlineOutlinedIcon
                                                            sx={{ fontSize: 40, marginLeft: 20 }}
                                                            color="warning"
                                                            alignItems={"center"}
                                                        />
                                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                                            Are you sure to Active/Inactive this Role ?
                                                        </Typography>
                                                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                                            <Button
                                                                variant="contained"
                                                                size="large"
                                                                color="success"
                                                                onClick={handleOKButtonClick}
                                                                sx={{ marginLeft: 20 }}
                                                            >
                                                                OK
                                                            </Button>
                                                        </Typography>
                                                    </Box>
                                                </Modal>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={11} component="th" scope="row">
                                            <Typography color={"error"}>No Records Found.</Typography>
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
            </Grid>
        </main>
    );
};

export default Transactions;
