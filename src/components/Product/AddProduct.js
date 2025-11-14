import { Box, Button, Divider, TextField, InputLabel, Select, MenuItem, Container, Grid, Paper, Table, TableBody, StyledTableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, Link } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import Cookies from "js-cookie";
import { ArrowBack } from "@mui/icons-material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import dayjs from 'dayjs';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FormControl from '@mui/material/FormControl';
import { useRouter } from 'next/router';

const AddBannersTransactions = () => {
    const router = useRouter();
    const uid = Cookies.get('uid');
    const { action, product_id } = router.query;

    // Input field styling
    const inputStyle = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '&:hover fieldset': {
                borderColor: '#2196F3',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#2196F3',
                borderWidth: '2px',
            },
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#2196F3',
        },
    };

    const [title, setTitle] = useState('');
    const [unit_price, setUnitPrice] = useState('');
    const [description, setDescription] = useState('');
    const [purchase_price, setPurchasePrice] = useState('');
    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
        const files = e.target.files;
        
        const validFiles = Array.from(files).filter(file =>
            file.type.startsWith('image/')
        );
        
        const filteredFiles = validFiles.filter(
            (newFile) => !images.some((image) => image.name === newFile.name)
        );

        setImages((prevImages) => [...prevImages, ...filteredFiles]);
    };

    const handleRemoveImage = async (index, item_id) => {
        if (item_id) {
            await deteleData(item_id);
        }
        
        const updatedImages = [...images];
        updatedImages.splice(index, 1); 
        setImages(updatedImages); 
    };

    // Benefit
    const [benefits, setbenefit] = useState([]);
    const [editingBenefitIndex, setEditingBenefitIndex] = useState(null);
    const [newbenefitRow, setNewbenefitRow] = useState({ benefit: '' });

    const newbenefithandleChange = (e) => {
        const { name, value } = e.target;
        setNewbenefitRow((prev) => ({ ...prev, [name]: value }));
    };

    const addNewbenefitRow = () => {
        if (newbenefitRow.benefit.trim()) {
            const updatedRows = [...benefits, { id: benefits.length + 1, ...newbenefitRow }];
            setbenefit(updatedRows);
            setNewbenefitRow({ benefit: '' });
        }
    };

    const handleEditBenefit = (index) => {
        setEditingBenefitIndex(index);
        setNewbenefitRow({ ...benefits[index] });
    };

    const handleUpdateBenefit = () => {
        const updatedRows = [...benefits];
        updatedRows[editingBenefitIndex] = { ...newbenefitRow };
        setbenefit(updatedRows);
        setEditingBenefitIndex(null);
        setNewbenefitRow({ benefit: '' });
    };

    const handleDeleteBenefit = (index) => {
        const updatedRows = [...benefits];
        updatedRows.splice(index, 1);
        setbenefit(updatedRows);
    };

    useEffect(() => {
        if(action == 'update')
        {
            const reqAllData = {
                "product_id": product_id
            };

            const getAlldata = async () => {
                try {
                    const response = await api.post("/api/product/get-product-by-id", reqAllData);
                    
                    if (response.status === 200) {
                        const data = response.data.data;

                        setTitle(data.name);
                        setUnitPrice(data.unit_price?.toString() || '');
                        setPurchasePrice(data.purchase_price?.toString() || '');
                        setDescription(data.details);
                        
                        const updatedRows = [];
                        const updatedimage = [];

                        if(data.images)
                        {
                            let i=0;
                            for(const ndetail of data.images)
                            {
                                i++;
                                updatedimage.push({'id': i,'details_id':ndetail.id,'image': ndetail.image, 'old': 1});
                            }
                        }
                        
                        setImages(updatedimage);
                        if(data.benefits)
                        {
                            let i=0;
                            for(const ndetail of data.benefits)
                            {
                                i++;
                                updatedRows.push({'id': i,'benefit': ndetail});
                            }
                        }

                        setbenefit(updatedRows);
                    }
                } catch (error) {
                    console.error("Error fetching Details:", error.message);
                }
            };

            getAlldata();
        }
    }, [action, product_id]);
    
    const handleSubmit = async () => {
        const benefitData = {};
        let i = 0;
        for (const item of benefits) {
            i++;
            benefitData[i] = item.benefit;
        }

        const formData ={
            'images': images,
            'name': title,
            'unit_price': unit_price,
            'purchase_price': purchase_price,
            'details': description,
            'created_by': uid,
            'benefits': JSON.stringify(benefitData)
        }

        try {
            let apiUrl = '/api/product/add-new-product';
            if(action == 'update')
            {   
                formData.product_id = product_id;
                apiUrl ='/api/product/update-product'
            }
            const response = await api.post(apiUrl, formData, {
                headers: { 'content-type': 'multipart/form-data' }
            });
        
            if (response) {
                if(response.status == 200)
                {
                    alert(response.data.message);
                    window.history.back();
                } else {
                    alert(response.data.message);
                }
            } else {
                console.error('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const deteleData = async (item_id) => {
        if(item_id) {
            const formData = {
                'item_detail_id': item_id,
                'action': 'update'
            }
            try {
                let response = await api.post('/api/product/delete-product-image', formData);
                
                if (response) {
                    alert('Deleted successfully');
                } else {
                    alert(response.data.error);
                    console.error('Failed to delete');
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    }

    return (
        <main className="p-6 space-y-6">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3 }}>
                        {/* Header Section */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                            <Typography variant="h4" fontWeight="bold">
                                {action === 'update' ? 'Update Product' : 'Add New Product'}
                            </Typography>
                            <Button 
                                variant="outlined" 
                                startIcon={<ArrowBack />}
                                onClick={() => window.history.back()}
                            >
                                Back
                            </Button>
                        </Box>

                        <Divider sx={{ mb: 4 }} />

                        {/* Basic Information Section */}
                        <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
                            Basic Information
                        </Typography>
                        
                        <Grid container spacing={3}>
                            {/* Product Name - Full Width */}
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Product Name"
                                    variant="outlined"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    sx={inputStyle}
                                />
                            </Grid>

                            {/* Two Inputs in One Row - Unit Price & Purchase Price */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Unit Price"
                                    variant="outlined"
                                    type="number"
                                    value={unit_price}
                                    onChange={(e) => setUnitPrice(e.target.value)}
                                    placeholder="0.00"
                                    sx={inputStyle}
                                    InputProps={{
                                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Purchase Price"
                                    variant="outlined"
                                    type="number"
                                    value={purchase_price}
                                    onChange={(e) => setPurchasePrice(e.target.value)}
                                    placeholder="0.00"
                                    sx={inputStyle}
                                    InputProps={{
                                        startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>,
                                    }}
                                />
                            </Grid>

                            {/* Description - Full Width */}
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter detailed product description..."
                                    sx={inputStyle}
                                />
                            </Grid>
                        </Grid>

                        {/* Benefits Section */}
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
                                Benefits
                            </Typography>
                            
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                {/* Add Benefit Row - Two inputs in one row */}
                                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                    <Grid item xs={12} md={8}>
                                        <TextField
                                            fullWidth
                                            name="benefit"
                                            label="Benefit"
                                            variant="outlined"
                                            value={newbenefitRow.benefit}
                                            onChange={newbenefithandleChange}
                                            size="small"
                                            sx={inputStyle}
                                            placeholder="Enter product benefit..."
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Button 
                                            variant="contained" 
                                            fullWidth
                                            onClick={addNewbenefitRow}
                                            disabled={!newbenefitRow.benefit.trim()}
                                            sx={{
                                                height: '40px',
                                                background: '#2198f3',
                                            }}
                                        >
                                            Add Benefit
                                        </Button>
                                    </Grid>
                                </Grid>

                                {/* Benefits Table */}
                                {benefits.length > 0 && (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: 'grey.100' }}>
                                                    <TableCell width="10%"><strong>#</strong></TableCell>
                                                    <TableCell width="65%"><strong>Benefit</strong></TableCell>
                                                    <TableCell width="25%"><strong>Actions</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {benefits.map((row, index) => (
                                                    <TableRow key={index} hover>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell>
                                                            {index === editingBenefitIndex ? (
                                                                <TextField
                                                                    fullWidth
                                                                    size="small"
                                                                    value={newbenefitRow.benefit}
                                                                    onChange={(e) => setNewbenefitRow({ ...newbenefitRow, benefit: e.target.value })}
                                                                    sx={inputStyle}
                                                                />
                                                            ) : (
                                                                row.benefit
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {index === editingBenefitIndex ? (
                                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                                    <Button 
                                                                        variant="contained" 
                                                                        size="small" 
                                                                        onClick={handleUpdateBenefit}
                                                                        color="success"
                                                                    >
                                                                        Save
                                                                    </Button>
                                                                    <Button 
                                                                        variant="outlined" 
                                                                        size="small" 
                                                                        onClick={() => setEditingBenefitIndex(null)}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                </Box>
                                                            ) : (
                                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                                    <Button 
                                                                        variant="outlined" 
                                                                        size="small" 
                                                                        onClick={() => handleEditBenefit(index)}
                                                                        color="warning"
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                    <Button 
                                                                        variant="outlined" 
                                                                        size="small" 
                                                                        onClick={() => handleDeleteBenefit(index)}
                                                                        color="error"
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </Box>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Paper>
                        </Box>

                        {/* Product Images Section */}
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
                                Product Images
                            </Typography>
                            
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Box sx={{ mb: 2 }}>
                                    <Button 
                                        component="label" 
                                        variant="contained" 
                                        startIcon={<CloudUploadIcon />}
                                        sx={{
                                            background: '#2198f3',
                                            mb: 2
                                        }}
                                    >
                                        Upload Images
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            multiple 
                                            onChange={handleImageChange} 
                                            style={{ display: 'none' }} 
                                        />
                                    </Button>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Supported formats: JPG, PNG, GIF. Maximum 10 images.
                                    </Typography>
                                </Box>

                                {images.length > 0 && (
                                    <Grid container spacing={2}>
                                        {images.map((image, index) => (
                                            <Grid item xs={12} sm={6} md={4} key={image.name || index}>
                                                <Paper 
                                                    variant="outlined" 
                                                    sx={{ 
                                                        p: 1,
                                                        border: '2px solid',
                                                        borderColor: 'grey.200',
                                                        borderRadius: '8px',
                                                        '&:hover': {
                                                            borderColor: 'primary.main',
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        {image.old == 1 ? (
                                                            <Link href={process.env.NEXT_PUBLIC_API_BASE_URL + '/' + image.image} target="_blank">
                                                                <img 
                                                                    src={process.env.NEXT_PUBLIC_API_BASE_URL + '/' + image.image} 
                                                                    alt="Product" 
                                                                    style={{ 
                                                                        width: '100%', 
                                                                        height: '200px', 
                                                                        objectFit: 'cover',
                                                                        borderRadius: '6px'
                                                                    }} 
                                                                />
                                                            </Link>
                                                        ) : (
                                                            <img 
                                                                src={URL.createObjectURL(image)} 
                                                                alt={`Product ${index}`} 
                                                                style={{ 
                                                                    width: '100%', 
                                                                    height: '200px', 
                                                                    objectFit: 'cover',
                                                                    borderRadius: '6px'
                                                                }} 
                                                            />
                                                        )}
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            color="error"
                                                            fullWidth
                                                            sx={{ mt: 1 }}
                                                            onClick={() => handleRemoveImage(index, image.details_id ? image.details_id : null)}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Paper>
                        </Box>

                        {/* Submit Button */}
                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button 
                                variant="outlined" 
                                size="large"
                                onClick={() => window.history.back()}
                                sx={{ minWidth: '120px' }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="contained" 
                                size="large"
                                onClick={handleSubmit}
                                sx={{ 
                                    minWidth: '120px',
                                    background: '#2198f3',
                                }}
                            >
                                {action === 'update' ? 'Update Product' : 'Add Product'}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </main>
    )
}

export default AddBannersTransactions;