'use client';
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Typography,
    FormControl,
    FormHelperText,
    Card,
    CardContent,
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { DataEncrypt, DataDecrypt } from '../../../utils/encryption';
import api from '../../../utils/api';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const EditLeadModal = ({ open, onClose, onSuccess, leadId, leadData }) => {
    // State for Edit Lead Form
    const [title, setTitle] = useState('');
    const [range, setRange] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [description, setDescription] = useState('');
    const [leadCategory, setLeadCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [formFields, setFormFields] = useState([]);
    const [newField, setNewField] = useState({ name: '', label: '', type: 'text' });
    const [editingIndex, setEditingIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);

    // Validation states
    const [errors, setErrors] = useState({
        title: '',
        range: '',
        selectedFile: '',
        description: '',
        leadCategory: '',
        formFields: '',
    });

    const [touched, setTouched] = useState({
        title: false,
        range: false,
        selectedFile: false,
        description: false,
        leadCategory: false,
    });

    const fieldTypes = [
        { value: 'text', label: 'Text' },
        { value: 'number', label: 'Number' },
        { value: 'email', label: 'Email' },
        { value: 'password', label: 'Password' },
        { value: 'textarea', label: 'Textarea' },
        { value: 'date', label: 'Date' },
        { value: 'datetime-local', label: 'Date & Time' },
        { value: 'time', label: 'Time' },
        { value: 'month', label: 'Month' },
        { value: 'week', label: 'Week' },
        { value: 'color', label: 'Color Picker' },
        { value: 'file', label: 'File Upload' },
        { value: 'image', label: 'Image Upload' },
        { value: 'url', label: 'URL' },
        { value: 'tel', label: 'Phone Number' },
        { value: 'checkbox', label: 'Checkbox' },
        { value: 'radio', label: 'Radio Button' },
        { value: 'select', label: 'Select Dropdown' },
        { value: 'multi-select', label: 'Multi Select' },
        { value: 'switch', label: 'Toggle Switch' },
        { value: 'range', label: 'Range Slider' },
        { value: 'hidden', label: 'Hidden Field' },
    ];

    // Get base URL from environment or use current origin
    const getBaseUrl = () => {
        return process.env.NEXT_PUBLIC_API_BASE_URL || '';
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (open && leadId) {
            fetchLeadDetails();
        }
    }, [open, leadId]);

    const fetchCategories = async () => {
        try {
            const all_parameters = { category_name1: null };
            const encryptedData = DataEncrypt(JSON.stringify(all_parameters));
            const reqData = { encReq: encryptedData };
            const response = await api.post('/api/leads/get-category', reqData);

            if (response.status === 200) {
                const decrypted = DataDecrypt(response.data);
                setCategories(decrypted.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchLeadDetails = async () => {
        if (!leadId) return;

        setIsFetching(true);
        try {
            const payload = { lead_id: leadId };
            const encryptedData = DataEncrypt(JSON.stringify(payload));
            const reqData = { encReq: encryptedData };

            const response = await api.post('/api/leads/get-lead-submission-details', payload);

            if (response.status === 200) {
                const decrypted = (response.data);
                const leadData = decrypted.data;

                console.log('Fetched lead details:', leadData);

                // Populate form with API response
                if (leadData.lead_info) {
                    const leadInfo = leadData.lead_info;
                    setTitle(leadInfo.lead_name || '');
                    setDescription(leadInfo.description || leadInfo.specification || '');
                    setLeadCategory(leadInfo.category_id || '');
                    setRange(leadInfo.discount_upto || '');

                    // Set current image if exists
                    if (leadInfo.img) {
                        const fullImageUrl = `${getBaseUrl()}${leadInfo.img}`;
                        setCurrentImage(fullImageUrl);
                        console.log('Current image URL:', fullImageUrl);
                    }

                    // Handle form fields - use form_fields from API or parse input_params
                    if (leadData.form_fields && leadData.form_fields.length > 0) {
                        setFormFields(leadData.form_fields);
                    } else if (leadInfo.input_params) {
                        try {
                            const parsedFields = JSON.parse(leadInfo.input_params);
                            setFormFields(Array.isArray(parsedFields) ? parsedFields : []);
                        } catch (e) {
                            console.error('Error parsing input_params:', e);
                            setFormFields([]);
                        }
                    } else {
                        setFormFields([]);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching lead details:', error);
            alert('Error loading lead details. Please try again.');
        } finally {
            setIsFetching(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setRange('');
        setSelectedFile(null);
        setCurrentImage(null);
        setDescription('');
        setLeadCategory('');
        setFormFields([]);
        setNewField({ name: '', label: '', type: 'text' });
        setEditingIndex(null);
        setErrors({
            title: '',
            range: '',
            selectedFile: '',
            description: '',
            leadCategory: '',
            formFields: '',
        });
        setTouched({
            title: false,
            range: false,
            selectedFile: false,
            description: false,
            leadCategory: false,
        });
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'title':
                if (!value.trim()) return 'Title is required';
                if (value.trim().length < 2) return 'Title must be at least 2 characters long';
                return '';
            case 'range':
                if (!value.trim()) return 'Discount range is required';
                if (!/^\d+(\.\d+)?%?$/.test(value.replace('%', ''))) return 'Discount range must be a valid number';
                return '';
            case 'description':
                if (!value.trim()) return 'Description is required';
                if (value.trim().length < 10) return 'Description must be at least 10 characters long';
                return '';
            case 'leadCategory':
                if (!value) return 'Please select a category';
                return '';
            case 'selectedFile':
                // File is optional for editing
                return '';
            default:
                return '';
        }
    };

    const validateForm = () => {
        const newErrors = {
            title: validateField('title', title),
            range: validateField('range', range),
            description: validateField('description', description),
            leadCategory: validateField('leadCategory', leadCategory),
            selectedFile: validateField('selectedFile', selectedFile),
            formFields: formFields.length === 0 ? 'At least one form field is required' : '',
        };

        setErrors(newErrors);
        setTouched({
            title: true,
            range: true,
            description: true,
            leadCategory: true,
            selectedFile: true,
        });

        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleFieldBlur = (fieldName) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        const value = fieldName === 'selectedFile' ? selectedFile :
            fieldName === 'leadCategory' ? leadCategory :
                fieldName === 'title' ? title :
                    fieldName === 'range' ? range : description;

        setErrors(prev => ({
            ...prev,
            [fieldName]: validateField(fieldName, value)
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Clear current image when new file is selected
            setCurrentImage(null);
            setErrors(prev => ({
                ...prev,
                selectedFile: validateField('selectedFile', file)
            }));
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setCurrentImage(null);
        setErrors(prev => ({
            ...prev,
            selectedFile: ''
        }));
    };

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setLeadCategory(value);
        setErrors(prev => ({
            ...prev,
            leadCategory: validateField('leadCategory', value)
        }));
    };

    const handleTitleChange = (e) => {
        const value = e.target.value;
        setTitle(value);
        if (touched.title) {
            setErrors(prev => ({
                ...prev,
                title: validateField('title', value)
            }));
        }
    };

    const handleRangeChange = (e) => {
        const value = e.target.value;
        setRange(value);
        if (touched.range) {
            setErrors(prev => ({
                ...prev,
                range: validateField('range', value)
            }));
        }
    };

    const handleDescriptionChange = (e) => {
        const value = e.target.value;
        setDescription(value);
        if (touched.description) {
            setErrors(prev => ({
                ...prev,
                description: validateField('description', value)
            }));
        }
    };

    const handleAddFieldChange = (e) => {
        const { name, value } = e.target;
        setNewField((prev) => ({ ...prev, [name]: value }));
    };

    const addField = () => {
        if (!newField.name || !newField.label) {
            alert('Please fill all field details');
            return;
        }

        if (editingIndex !== null) {
            const updatedFields = [...formFields];
            updatedFields[editingIndex] = newField;
            setFormFields(updatedFields);
            setEditingIndex(null);
        } else {
            setFormFields((prev) => [...prev, newField]);
        }

        if (formFields.length === 0) {
            setErrors(prev => ({ ...prev, formFields: '' }));
        }

        setNewField({ name: '', label: '', type: 'text' });
    };

    const handleEditField = (index) => {
        setNewField(formFields[index]);
        setEditingIndex(index);
    };

    const handleDeleteField = (index) => {
        const updatedFields = formFields.filter((_, i) => i !== index);
        setFormFields(updatedFields);
        if (updatedFields.length === 0) {
            setErrors(prev => ({ ...prev, formFields: 'At least one form field is required' }));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        const formData = new FormData();

        // Append all form data
        formData.append('lead_name', title);
        formData.append('description', description);
        formData.append('category_id', leadCategory);
        formData.append('discount_upto', range);
        formData.append('lead_id', leadId);

        // Append form fields as JSON
        formData.append('formFields', JSON.stringify(formFields));

        // Append file if selected
        if (selectedFile) {
            formData.append('lead_image', selectedFile);
        }

        try {
            const response = await api.post('/api/leads/update-leads', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });

            if (response.status === 200) {
                alert('Lead Updated Successfully');
                onSuccess();
                resetForm();
            }
        } catch (error) {
            console.error('Error updating lead:', error);
            alert('Error updating lead. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: 2,
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle sx={{
                m: 0,
                p: 3,
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h5" fontWeight={600}>
                    Update Lead ({title ? `${title}` : ''})
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3 }}>
                {isFetching ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                        <Typography>Loading lead details...</Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {/* Category Select */}
                        <Grid item xs={12} md={6} sx={{ mt: 2 }}>
                            <FormControl fullWidth error={touched.leadCategory && Boolean(errors.leadCategory)}>
                                <InputLabel>Lead Category</InputLabel>
                                <Select
                                    value={leadCategory}
                                    label="Lead Category"
                                    onChange={handleCategoryChange}
                                    onBlur={() => handleFieldBlur('leadCategory')}
                                >
                                    <MenuItem value="">Select Leads Category</MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.category_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {touched.leadCategory && errors.leadCategory && (
                                    <FormHelperText>{errors.leadCategory}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        {/* Title Field */}
                        <Grid item xs={12} md={6} sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={title}
                                onChange={handleTitleChange}
                                onBlur={() => handleFieldBlur('title')}
                                error={touched.title && Boolean(errors.title)}
                                helperText={touched.title && errors.title}
                            />
                        </Grid>

                        {/* Discount Range Field */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Discount Upto"
                                value={range}
                                onChange={handleRangeChange}
                                onBlur={() => handleFieldBlur('range')}
                                error={touched.range && Boolean(errors.range)}
                                helperText={touched.range && errors.range}
                                placeholder="e.g., 5% or 10"
                            />
                        </Grid>

                        {/* Description Field */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={3}
                                value={description}
                                onChange={handleDescriptionChange}
                                onBlur={() => handleFieldBlur('description')}
                                error={touched.description && Boolean(errors.description)}
                                helperText={touched.description && errors.description}
                            />
                        </Grid>

                        {/* Enhanced File Upload Section */}
                        <Grid item xs={12}>
                            <Card
                                variant="outlined"
                                sx={{
                                    border: touched.selectedFile && errors.selectedFile ? '1px solid #d32f2f' : '1px dashed #ccc',
                                    backgroundColor: '#fafafa',
                                    transition: 'all 0.3s ease',
                                    py: 1,
                                    '&:hover': {
                                        borderColor: '#2198f3',
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center', py: 1 }}>
                                    {/* Show current image if exists */}
                                    {currentImage && !selectedFile ? (
                                        <>
                                            <Box sx={{ mb: 2 }}>
                                                <Typography variant="h6" gutterBottom>
                                                    Current Lead Image
                                                </Typography>
                                                <Box
                                                    component="img"
                                                    src={currentImage}
                                                    alt="Current lead"
                                                    sx={{
                                                        maxWidth: '100%',
                                                        maxHeight: '200px',
                                                        objectFit: 'contain',
                                                        borderRadius: 1,
                                                        border: '1px solid #e0e0e0'
                                                    }}
                                                    onError={(e) => {
                                                        console.error('Image failed to load:', currentImage);
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                    Current uploaded image
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                                                <Button
                                                    component="label"
                                                    variant="outlined"
                                                    sx={{
                                                        borderRadius: 2,
                                                        fontWeight: 700,
                                                        fontSize: 14,
                                                        px: 3,
                                                        py: 1,
                                                        textTransform: 'none',
                                                    }}
                                                    startIcon={<CloudUploadIcon />}
                                                >
                                                    Change Image
                                                    <VisuallyHiddenInput
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        accept="image/*"
                                                    />
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    sx={{
                                                        borderRadius: 2,
                                                        fontWeight: 700,
                                                        fontSize: 14,
                                                        px: 3,
                                                        py: 1,
                                                        textTransform: 'none',
                                                    }}
                                                    onClick={handleRemoveFile}
                                                >
                                                    Remove Image
                                                </Button>
                                            </Box>
                                        </>
                                    ) : selectedFile ? (
                                        <>
                                            <InsertDriveFileIcon
                                                sx={{
                                                    fontSize: 48,
                                                    color: '#4caf50',
                                                    mb: 1
                                                }}
                                            />
                                            <Typography variant="h6" gutterBottom>
                                                New File Selected
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                                {selectedFile.name}
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                                Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                                                <Button
                                                    component="label"
                                                    variant="outlined"
                                                    sx={{
                                                        borderRadius: 2,
                                                        fontWeight: 700,
                                                        fontSize: 14,
                                                        px: 3,
                                                        py: 1,
                                                        textTransform: 'none',
                                                    }}
                                                    startIcon={<CloudUploadIcon />}
                                                >
                                                    Change File
                                                    <VisuallyHiddenInput
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        accept="image/*"
                                                    />
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    sx={{
                                                        borderRadius: 2,
                                                        fontWeight: 700,
                                                        fontSize: 14,
                                                        px: 3,
                                                        py: 1,
                                                        textTransform: 'none',
                                                    }}
                                                    onClick={handleRemoveFile}
                                                >
                                                    Remove
                                                </Button>
                                            </Box>
                                        </>
                                    ) : (
                                        <>
                                            <CloudUploadIcon
                                                sx={{
                                                    fontSize: 20,
                                                    color: '#2198f3',
                                                    mb: 1
                                                }}
                                            />
                                            <Typography variant="h7" gutterBottom>
                                                Upload Lead Image
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                                Supported formats: JPG, PNG, GIF (Max 5MB)
                                            </Typography>
                                            <Button
                                                component="label"
                                                variant="contained"
                                                sx={{
                                                    borderRadius: 2,
                                                    fontWeight: 700,
                                                    fontSize: 13,
                                                    px: 4,
                                                    py: 0.5,
                                                    background: '#2198f3',
                                                    boxShadow: '0 2px 8px 0 rgba(33, 203, 243, 0.15)',
                                                    textTransform: 'none',
                                                    minWidth: 200,
                                                }}
                                                startIcon={<CloudUploadIcon />}
                                            >
                                                Choose File
                                                <VisuallyHiddenInput
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    onBlur={() => handleFieldBlur('selectedFile')}
                                                    accept="image/*"
                                                />
                                            </Button>
                                        </>
                                    )}
                                    {touched.selectedFile && errors.selectedFile && (
                                        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                                            {errors.selectedFile}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Dynamic Fields Section */}
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                                Dynamic Form Fields
                            </Typography>

                            {errors.formFields && (
                                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                                    {errors.formFields}
                                </Typography>
                            )}

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell width="30%">
                                                <TextField
                                                    label="Field Name"
                                                    name="name"
                                                    value={newField.name}
                                                    onChange={handleAddFieldChange}
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell width="30%">
                                                <TextField
                                                    label="Field Label"
                                                    name="label"
                                                    value={newField.label}
                                                    onChange={handleAddFieldChange}
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell width="30%">
                                                <TextField
                                                    select
                                                    label="Field Type"
                                                    name="type"
                                                    value={newField.type}
                                                    onChange={handleAddFieldChange}
                                                    fullWidth
                                                >
                                                    {fieldTypes.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button variant="contained" sx={{
                                                    borderRadius: 2,
                                                    fontWeight: 700,
                                                    fontSize: 16,
                                                    px: 3,
                                                    py: 1,
                                                    background: '#2198f3',
                                                    boxShadow: '0 2px 8px 0 rgba(33, 203, 243, 0.15)',
                                                    textTransform: 'none',
                                                    whiteSpace: 'nowrap',
                                                }} onClick={addField}>
                                                    {editingIndex !== null ? 'Save Field' : 'Add Field'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>

                        {/* Fields Display Table */}
                        {formFields.length > 0 && (
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                                    Current Form Fields
                                </Typography>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow sx={{ background: '#f5f5f5' }}>
                                                <TableCell sx={{ whiteSpace: "nowrap" }}>Sl No.</TableCell>
                                                <TableCell sx={{ whiteSpace: "nowrap" }}>Field Name</TableCell>
                                                <TableCell sx={{ whiteSpace: "nowrap" }}>Field Label</TableCell>
                                                <TableCell sx={{ whiteSpace: "nowrap" }}>Field Type</TableCell>
                                                <TableCell sx={{ whiteSpace: "nowrap" }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {formFields.map((field, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{index + 1}</TableCell>
                                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{field.name}</TableCell>
                                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{field.label}</TableCell>
                                                    <TableCell sx={{ whiteSpace: "nowrap" }}>{field.type}</TableCell>
                                                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                                                        <Button
                                                            variant="contained"
                                                            color="warning"
                                                            size="small"
                                                            sx={{ mr: 1 }}
                                                            onClick={() => handleEditField(index)}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleDeleteField(index)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        )}
                    </Grid>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClose}
                    disabled={isLoading || isFetching}
                    sx={{
                        borderRadius: 2,
                        fontWeight: 700,
                        fontSize: 16,
                        px: 4,
                        py: 1,
                        textTransform: 'none',
                    }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        borderRadius: 2,
                        fontWeight: 700,
                        fontSize: 16,
                        px: 4,
                        py: 1,
                        background: '#2198f3',
                        boxShadow: '0 2px 8px 0 rgba(33, 203, 243, 0.15)',
                        textTransform: 'none',
                    }}
                    onClick={handleSubmit}
                    disabled={isLoading || isFetching}
                    size="large"
                >
                    {isLoading ? 'Updating...' : 'Update Lead'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditLeadModal;