"use client";
import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Grid,
    Paper,
    Typography,
} from "@mui/material";
import api from "../../../utils/api";

const AddEbookCategoryTransactions = () => {
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError("Category name is required");
            return;
        }
        setError("");

        const formData = { category_name: title };

        try {
            const response = await api.post("/api/ebookCategories/add-category", formData);
            if (response.data.status === 200) {
                alert(response.data.message);
                window.history.back();
            } else {
                alert("Failed to save category");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const handleCancel = () => {
        window.history.back();
    };

    return (
        <main style={{ padding: "16px" }}>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} md={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Add New Ebook Category
                        </Typography>

                        <TextField
                            fullWidth
                            required
                            label="Category Name"
                            variant="outlined"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            error={!!error}
                            helperText={error}
                            sx={{ mb: 2 }}
                        />

                        <Box display="flex" gap={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
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
    );
};

export default AddEbookCategoryTransactions;
