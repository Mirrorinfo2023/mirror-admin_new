import { Box, Button, Divider, TextField, InputLabel, Select, MenuItem, Container, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import Cookies from "js-cookie";
import { ArrowBack } from "@mui/icons-material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import dayjs from 'dayjs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormControl from '@mui/material/FormControl';

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

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 10,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 10,
});

const AddBannersTransactions = () => {
    const [title, setTitle] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [appCategories, setAppCategories] = useState([]);
    const [appType, setAppType] = useState('');

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await api.get("/api/banner/get-banner-category");
                if (response.status === 200) {
                    setAppCategories(response.data.data.notificationApp);
                    setCategories(response.data.data.sCategory);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        getCategories();
    }, []);

    const handleChange = (event) => {
        setTransactionType(event.target.value);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleChange1 = (event) => {
        setAppType(event.target.value);
    };

    const handleSubmit = async () => {
        const formData = {
            'img': selectedFile,
            'title': title,
            'categoryId': transactionType,
            'app_id': appType
        }

        try {
            const response = await api.post('/api/banner/add-new-banner', formData, {
                headers: { 'content-type': 'multipart/form-data' }
            });

            if (response) {
                window.history.back();
                alert('File uploaded successfully');
            } else {
                console.error('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <main className="p-6 space-y-6">
            <Grid container spacing={2} sx={{ padding: 2 }}>
                <Grid item xs={12}>
                    <Paper sx={{ padding: 3 }}>
                        {/* Title Section */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ 
                                padding: 2,
                                textAlign: { xs: 'center', md: 'left' }
                            }}>
                                Add New Banner
                            </Typography>
                        </Box>

                        {/* Form Fields */}
                        <Grid container spacing={3}>
                            {/* Title Field */}
                            <Grid item xs={12} md={6}>
                                <TextField 
                                    required 
                                    fullWidth 
                                    label="Title" 
                                    variant="outlined"
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Grid>

                            {/* App Type Field */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="app-type-label">App Type</InputLabel>
                                    <Select
                                        labelId="app-type-label"
                                        id="app-type"
                                        variant="outlined"
                                        value={appType}
                                        label="App Type"
                                        onChange={handleChange1}
                                    >
                                        <MenuItem value="">Please Select</MenuItem>
                                        {appCategories.map((appType) => (
                                            <MenuItem key={appType.id} value={appType.id}>
                                                {appType.app_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Banner Category Field */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="banner-category-label">Banner Category</InputLabel>
                                    <Select
                                        labelId="banner-category-label"
                                        id="banner-category"
                                        value={transactionType}
                                        label="Banner Category"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="">Please Select</MenuItem>
                                        {(categories || []).map((category) => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.category_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* File Upload Field */}
                            <Grid item xs={12} md={6}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    gap: 1,
                                    height: '100%',
                                    justifyContent: 'center'
                                }}>
                                    <Button 
                                        component="label" 
                                        variant="contained" 
                                        startIcon={<CloudUploadIcon />}
                                        fullWidth
                                        sx={{ py: 1.5 }}
                                    >
                                        Upload file
                                        <VisuallyHiddenInput type="file" onChange={(event) => handleFileChange(event)} />
                                    </Button>
                                    {selectedFile && (
                                        <Typography variant="body2" sx={{ 
                                            textAlign: { xs: 'center', md: 'left' },
                                            wordBreak: 'break-word'
                                        }}>
                                            {selectedFile.name}
                                        </Typography>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Submit Button */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: { xs: 'center', md: 'flex-start' },
                            mt: 3,
                            pt: 2
                        }}>
                            <Button 
                                variant="contained" 
                                color="success" 
                                size="large"
                                onClick={handleSubmit}
                                sx={{
                                    width: { xs: '100%', md: 'auto' },
                                    minWidth: 120,
                                    px: 4,
                                    py: 1
                                }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </main>
    )
}

export default AddBannersTransactions;