"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
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
    FormHelperText,
    TextField
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataDecrypt } from "../../utils/encryption";

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

function EditAffiliateLink() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { id } = router.query;

    const [categoryID, setCategoryID] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [existingImage, setExistingImage] = useState("");
    const [amount, setAmount] = useState("");
    const [valid_till, setValidDate] = useState(dayjs());
    const [meeting_link, setMeetingLink] = useState("");
    const [status, setStatus] = useState(1);
    const [errors, setErrors] = useState({});

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

    // Fetch existing affiliate link data
    useEffect(() => {
        const getAffiliateLink = async () => {
            if (!id) return;

            try {
                const response = await api.post('/api/affiliate_link/get-link', { id });

                if (response.status === 200) {
                    const data = response.data.data;

                    // Set category ID
                    setCategoryID(data.category_id || "");

                    // Set subcategory (from subtitle field)
                    setSubCategory(data.subtitle || "");

                    setMeetingLink(data.link || "");
                    setStatus(data.status || 1);
                    setAmount(data.amount || "");

                    // Set valid date
                    if (data.valid_date || data.till_date) {
                        setValidDate(dayjs(data.valid_date || data.till_date));
                    }

                    // Store existing image
                    setExistingImage(data.image || "");

                    // Note: Title is now derived from category, so we don't set it directly
                }
            } catch (error) {
                if (error?.response?.data?.error) {
                    dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }));
                } else {
                    dispatch(callAlert({ message: error.message, type: 'FAILED' }));
                }
            }
        };

        if (id) {
            getAffiliateLink();
        }
    }, [id, dispatch]);

    // Validation
    const validate = () => {
        let newErrors = {};
        if (!categoryID) newErrors.categoryID = "Category is required";
        if (!meeting_link.trim()) newErrors.meeting_link = "Affiliate link is required";
        if (!amount || isNaN(amount)) newErrors.amount = "Valid amount is required";

        // File is optional for update
        // if (!selectedFile && !existingImage) newErrors.file = "Please upload an image/file";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        // Get category name for title and subcategory for subtitle
        const selectedCategory = categories.find(cat => String(cat.category_id) === String(categoryID));
        const title = selectedCategory ? selectedCategory.category_name : "";
        const subtitle = subCategory || "";

        const formData = new FormData();
        formData.append("id", id);

        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        formData.append("title", title);
        formData.append("subtitle", subtitle);
        formData.append("link", meeting_link);
        formData.append("category_id", categoryID);
        formData.append("amount", amount);
        formData.append("status", status);
        formData.append("valid_date", valid_till.isValid() ? valid_till.format("YYYY-MM-DD") : "");

        try {
            const response = await api.post('/api/affiliate_link/update-affiliate-link', formData, {
                headers: { 'content-type': 'multipart/form-data' }
            });

            if (response) {
                alert('Updated successfully');
                window.history.back();
            }

        } catch (error) {
            console.error('Error updating:', error);
            dispatch(callAlert({
                message: error.response?.data?.message || "Failed to update affiliate link",
                type: 'FAILED'
            }));
        }
    };

    return (
        <Layout>
            <main className="p-6 space-y-6">
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} md={11}>
                        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                            <Typography variant="h5" sx={{ mb: 3, fontWeight: "600" }}>
                                Update Affiliate Link
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
                                    <TextField
                                        fullWidth
                                        label="Affiliate Link *"
                                        value={meeting_link}
                                        onChange={(e) => setMeetingLink(e.target.value)}
                                        error={!!errors.meeting_link}
                                        helperText={errors.meeting_link}
                                    />
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
                                            onChange={(date) => setValidDate(date)}
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
                                        Upload File (Optional)
                                        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                                    </Button>

                                    {errors.file && (
                                        <Typography color="error" variant="body2">
                                            {errors.file}
                                        </Typography>
                                    )}

                                    {selectedFile ? (
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            New file: {selectedFile.name}
                                        </Typography>
                                    ) : existingImage ? (
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Current file: {existingImage.split('/').pop()}
                                        </Typography>
                                    ) : null}
                                </Grid>

                                {/* Status */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={status}
                                            label="Status"
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <MenuItem value={1}>Active</MenuItem>
                                            <MenuItem value={0}>Inactive</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Buttons */}
                                <Grid item xs={12}>
                                    <Box display="flex" justifyContent="flex-end" gap={2}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={handleSubmit}
                                        >
                                            Update
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
        </Layout>
    );
}

export default withAuth(EditAffiliateLink);