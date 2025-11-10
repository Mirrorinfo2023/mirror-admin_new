"use client";
import {
    Box,
    Button,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Paper,
    Typography,
    FormControl,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataDecrypt } from "../../../utils/encryption";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const AddAffiliateLinkTransactions = () => {
    const [title, setTitle] = useState("");
    const [meeting_link, setMeetingLink] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [amount, setAmount] = useState("");
    const [valid_till, setmeetingDate] = useState(dayjs());

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await api.post("/api/affiliate_link/get-affiliate-category");
                if (response.status === 200) {
                    const decryptedObject = DataDecrypt(response.data);
                    setCategories(decryptedObject.data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        getCategories();
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleSubmit = async () => {
        const formData = {
            image: selectedFile,
            title: title,
            link: meeting_link,
            category_id: transactionType,
            amount: amount,
            valid_date: valid_till,
        };

        try {
            const response = await api.post("/api/affiliate_link/add-affiliate-Link", formData, {
                headers: { "content-type": "multipart/form-data" },
            });

            if (response) {
                alert("Link Added successfully");
                window.history.back();
            } else {
                console.error("Failed to add Link");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <main className="p-6 space-y-6">
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} md={11}>
                    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: "600" }}>
                            Add New Affiliate Link
                        </Typography>

                        <Grid container spacing={2}>
                            {/* Affiliate Name */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Affiliate Name"
                                    variant="outlined"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Grid>

                            {/* Category */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Link Category</InputLabel>
                                    <Select
                                        value={transactionType}
                                        label="Link Category"
                                        onChange={(e) => setTransactionType(e.target.value)}
                                    >
                                        <MenuItem value="">Please Select</MenuItem>
                                        {categories.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.category_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Affiliate Link */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Affiliate Link"
                                    variant="outlined"
                                    value={meeting_link}
                                    onChange={(e) => setMeetingLink(e.target.value)}
                                />
                            </Grid>

                            {/* Amount */}
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

                            {/* Valid Date */}
                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Valid Till"
                                        value={valid_till}
                                        onChange={(date) => setmeetingDate(date)}
                                        format="DD-MM-YYYY"
                                        sx={{ width: "100%" }}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            {/* Upload File */}
                            <Grid item xs={12} sm={6}>

                                <Button
                                    component="label"
                                    variant="contained"
                                    startIcon={<CloudUploadIcon />}
                                    style={{ width: "100%", padding: "2%" }}
                                >
                                    Upload File
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

                            {/* Buttons */}
                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="flex-end" gap={2}>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="medium"
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="medium"
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </main>
    );
};

export default AddAffiliateLinkTransactions;
