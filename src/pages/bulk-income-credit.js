"use client";
import {
    Box,
    Button,
    Divider,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    Container,
    Grid,
    Paper,
    Typography,
    FormControl,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import { useRouter } from "next/router";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { read, utils } from "xlsx";
import api from "../../utils/api";

const { sheet_to_json } = utils;

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 10,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 10,
});

function AddLeads() {
    const router = useRouter();
    const attr = router.query;
    const uid = Cookies.get("uid");

    const [narration, setNarration] = useState("");
    const [amount, setAmount] = useState("");
    const [updata, setUpdata] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedValue, setSelectedValue] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleSubmit = async () => {
        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const excelData = sheet_to_json(sheet, { header: 1 });

                const headers = excelData[0];
                const jsonData = excelData.slice(1).map((row) => {
                    const obj = {};
                    headers.forEach((header, index) => {
                        obj[header] = row[index];
                    });
                    return obj;
                });

                setUpdata(jsonData);
            };

            reader.readAsArrayBuffer(selectedFile);
        } else {
            alert("Please upload an Excel file in proper format");
        }

        try {
            const formData = {
                walletType: selectedValue,
                narration: narration,
                amount: amount,
                uploadedData: updata,
                action: attr.action,
                sender_id: uid,
            };

            if (updata) {
                const response = await api.post(
                    "/api/wallet/bulk-credit-debit-income",
                    formData
                );

                if (response.status == 200) {
                    window.history.back();
                    alert(attr.action + "ed successfully");
                } else {
                    console.error("Failed to " + attr.action);
                    alert(response.data.error);
                }
            } else {
                alert("Are you sure you want to submit?");
            }
        } catch (error) {
            alert("Submission failed!");
        }
    };

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleCancel = () => {
        window.history.back();
    };


    return (
        <Layout>
            <main className="p-6 space-y-6">

                {/* ---- Upload + Form Section ---- */}
                <Grid container spacing={4} sx={{ padding: 2 }}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h5" sx={{ mb: 2 }}>
                                Bulk Income {attr.action}
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Wallet Type</InputLabel>
                                        <Select
                                            value={selectedValue}
                                            label="Wallet Type"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="">Please Select</MenuItem>
                                            <MenuItem value="income">Income Wallet</MenuItem>
                                            <MenuItem value="Royality">Royality</MenuItem>
                                            <MenuItem value="Reward">Reward</MenuItem>
                                            <MenuItem value="SIP">SIP</MenuItem>
                                            <MenuItem value="MF">MF</MenuItem>
                                            <MenuItem value="Laptop">Laptop</MenuItem>
                                            <MenuItem value="Bike">Bike</MenuItem>
                                            <MenuItem value="Car">Car</MenuItem>
                                            <MenuItem value="House">House</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Narration"
                                        variant="outlined"
                                        value={narration}
                                        onChange={(e) => setNarration(e.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        label="Amount"
                                        variant="outlined"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Button
                                        component="label"
                                        variant="contained"
                                        startIcon={<CloudUploadIcon />}
                                        fullWidth
                                        sx={{
                                            p: 1.5
                                        }}
                                    >
                                        Upload CSV file
                                        <VisuallyHiddenInput
                                            type="file"
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                    {selectedFile && (
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            {selectedFile.name}
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>

                            <Box mt={3}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    sx={{
                                        backgroundColor: "#4CAF50", 
                                        color: "#fff",
                                        "&:hover": {
                                            backgroundColor: "#43A047",
                                        },
                                       mr:2
                                    }}
                                >
                                    Submit
                                </Button>
                                <Button variant="outlined" onClick={handleCancel}>
                                    Cancel
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </main>
        </Layout>
    );
}

export default withAuth(AddLeads);
