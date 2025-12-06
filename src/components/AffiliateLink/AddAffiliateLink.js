"use client";
import {
    Box,
    Button,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Paper,
    Typography,
    FormControl,
    FormHelperText, TextField
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
    const [categoryID, setCategoryID] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [amount, setAmount] = useState("");
    const [valid_till, setmeetingDate] = useState(dayjs());
    const [errors, setErrors] = useState({});
    const [meeting_link, setMeetingLink] = useState("");

    // Fetch categories
    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await api.post("/api/affiliate_link/get-affiliate-category");
                if (response.status === 200) {
                    const decryptedObject = DataDecrypt(response.data);
                    const categoriesWithId = decryptedObject.data.map((category, index) => ({
                        ...category,
                        id: index + 1,
                        category_id: category.category_id || index + 1,
                        category_name: category.category_name,
                        subcategories: category.subcategories
                            ? category.subcategories.map(sub => (typeof sub === "string" ? sub : sub.name))
                            : [],
                    }));
                    setCategories(categoriesWithId);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        getCategories();
    }, []);

    // Update subcategories when category changes
    useEffect(() => {
        if (categoryID) {
            const category = categories.find(
                (c) => String(c.category_id) === String(categoryID)
            );
            if (category) {
                setFilteredSubCategories(category.subcategories || []);
            } else {
                setFilteredSubCategories([]);
            }
        } else {
            setFilteredSubCategories([]);
        }
    }, [categoryID, categories]);

    // Validation
    const validate = () => {
        let newErrors = {};
        if (!categoryID) newErrors.categoryID = "Category is required";
        if (!meeting_link.trim()) newErrors.meeting_link = "Affiliate link is required";
        if (!amount || isNaN(amount)) newErrors.amount = "Valid amount is required";
        if (!selectedFile) newErrors.file = "Please upload an image/file";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        const selectedCategory = categories.find(cat => String(cat.category_id) === String(categoryID));
        const title = selectedCategory ? selectedCategory.category_name : "";
        const subtitle = subCategory;

        const formData = new FormData();
        formData.append("image", selectedFile);
        formData.append("title", title);
        formData.append("subtitle", subtitle);
        formData.append("link", meeting_link);
        formData.append("category_id", categoryID); // Still required by DB
        formData.append("amount", amount);
        formData.append("valid_date", valid_till);

        console.log("formData:", {
            title,
            subtitle,
            category_id: categoryID,
            link: meeting_link,
            amount
        });

        try {
            const response = await api.post("/api/affiliate_link/add-affiliate-Link", formData, {
                headers: { "content-type": "multipart/form-data" },
            });

            if (response) {
                alert("Link Added successfully");
                window.history.back();
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
                            {/* Category */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={!!errors.categoryID}>
                                    <InputLabel>Category *</InputLabel>
                                    <Select
                                        value={categoryID}
                                        label="Category *"
                                        onChange={(e) => {
                                            setCategoryID(e.target.value);
                                            setSubCategory("");
                                        }}
                                    >
                                        <MenuItem value="">Please Select</MenuItem>
                                        {categories.map((category) => (
                                            <MenuItem key={category.id} value={category.category_id}>
                                                {category.category_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{errors.categoryID}</FormHelperText>
                                </FormControl>
                            </Grid>

                            {/* Sub Category */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Sub Category</InputLabel>
                                    <Select
                                        value={subCategory}
                                        label="Sub Category"
                                        onChange={(e) => setSubCategory(e.target.value)}
                                        disabled={filteredSubCategories.length === 0}
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        {filteredSubCategories.map((sub, idx) => (
                                            <MenuItem key={idx} value={sub}>
                                                {sub}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {filteredSubCategories.length === 0 && (
                                        <FormHelperText>No subcategories available</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Affiliate Link */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={!!errors.meeting_link}>
                                    <InputLabel>Affiliate Link *</InputLabel>
                                    <TextField
                                        fullWidth
                                        label="Affiliate Link *"
                                        value={meeting_link}
                                        onChange={(e) => setMeetingLink(e.target.value)}
                                        error={!!errors.meeting_link}
                                        helperText={errors.meeting_link}
                                    />
                                </FormControl>
                            </Grid>

                            {/* Amount */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    error={!!errors.amount}
                                    helperText={errors.amount}
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

                            {/* File Upload */}
                            <Grid item xs={12} sm={6}>
                                <Button
                                    component="label"
                                    variant="contained"
                                    startIcon={<CloudUploadIcon />}
                                    style={{ width: "100%", padding: "2%" }}
                                >
                                    Upload File
                                    <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                                </Button>

                                {errors.file && (
                                    <Typography color="error" variant="body2">
                                        {errors.file}
                                    </Typography>
                                )}

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
                                        onClick={handleSubmit}
                                    >
                                        Submit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
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