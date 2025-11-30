'use client';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  FormControl,
  FormHelperText,
  Card,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
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

const AddLeadForm = ({ editId, onSuccess, onCancel }) => {
  // State for Add/Edit Lead Form (same as your existing form)
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

  // Sample data for editing
  const sampleLead = {
    id: 1,
    title: 'Home Loan Inquiry',
    discountRange: '5%',
    description: 'Customer looking for home loan options with flexible EMI',
    category: '1',
    formFields: [{ name: 'loan_amount', label: 'Loan Amount', type: 'number' }],
  };

  useEffect(() => {
    fetchCategories();
    if (editId) {
      // In real implementation, you would fetch lead details by ID
      setTitle(sampleLead.title);
      setRange(sampleLead.discountRange);
      setDescription(sampleLead.description);
      setLeadCategory(sampleLead.category);
      setFormFields(sampleLead.formFields);
    }
  }, [editId]);

  const fetchCategories = async () => {
    try {
      const all_parameters = { category_name1: null };
      const encryptedData = DataEncrypt(JSON.stringify(all_parameters));
      const reqData = { encReq: encryptedData };
      const response = await api.post('/api/leads/get-category', reqData);

      if (response.status === 200) {
        const decrypted = DataDecrypt(response.data);
        // console.log("decrypted ", decrypted)
        setCategories(decrypted.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setRange('');
    setSelectedFile(null);
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

  // Your existing form handlers (keep all your existing validation and handlers)
  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.trim().length < 2) return 'Title must be at least 2 characters long';
        return '';
      case 'range':
        if (!value.trim()) return 'Discount range is required';
        if (!/^\d+(\.\d+)?$/.test(value)) return 'Discount range must be a valid number';
        return '';
      case 'description':
        if (!value.trim()) return 'Description is required';
        if (value.trim().length < 10) return 'Description must be at least 10 characters long';
        return '';
      case 'leadCategory':
        if (!value) return 'Please select a category';
        return '';
      case 'selectedFile':
        if (!editId && !value) return 'Please upload a file';
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
    setSelectedFile(file);
    setErrors(prev => ({
      ...prev,
      selectedFile: validateField('selectedFile', file)
    }));
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setErrors(prev => ({
      ...prev,
      selectedFile: editId ? '' : 'Please upload a file'
    }));
  };

  const handleChange = (event) => {
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
    const payload = {
      lead_image: selectedFile,
      lead_name: title,
      description,
      category_id: leadCategory,
      discount_upto: range,
      formFields,
    };

    try {
      let response;
      if (editId) {
        payload.lead_id = editId;
        console.log("payload are: ", payload)
        response = await api.post('/api/leads/update-leads', payload, {
          headers: { 'content-type': 'multipart/form-data' },
        });
      } else {
        console.log("payload are: ", payload)
        response = await api.post('/api/leads/add-leads', payload, {
          headers: { 'content-type': 'multipart/form-data' },
        });
      }

      if (response) {
        alert(editId ? 'Lead Updated Successfully' : 'Lead Saved Successfully');
        onSuccess();
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Error saving lead. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
          {editId ? 'Edit Lead' : 'Add New Lead'}
        </Typography>

        <Grid container spacing={3}>
          {/* Category Select */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={touched.leadCategory && Boolean(errors.leadCategory)}>
              <InputLabel>Lead Category</InputLabel>
              <Select
                value={leadCategory}
                label="Lead Category"
                onChange={handleChange}
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
          <Grid item xs={12} md={6}>
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
                {!selectedFile ? (
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
                ) : (
                  <>
                    <InsertDriveFileIcon
                      sx={{
                        fontSize: 48,
                        color: '#4caf50',
                        mb: 1
                      }}
                    />
                    <Typography variant="h6" gutterBottom>
                      File Selected
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
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
                )}
                {touched.selectedFile && errors.selectedFile && (
                  <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    {errors.selectedFile}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* --- Dynamic Fields Section --- */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Add Dynamic Form Fields
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

          {/* --- Fields Display Table --- */}
          {formFields.length > 0 && (
            <Grid item xs={12}>
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

        {/* Form Actions */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={onCancel}
              disabled={isLoading}
              sx={{ py: 1 }}
            >
              Cancel
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 16,
                py: 1,
                background: '#2198f3',
                boxShadow: '0 2px 8px 0 rgba(33, 203, 243, 0.15)',
                textTransform: 'none',
              }}
              onClick={handleSubmit}
              disabled={isLoading}
              size="large"
            >
              {isLoading ? 'Saving...' : editId ? 'Update Lead' : 'Submit Lead'}
            </Button>
          </Grid>
        </Grid>

      </Paper>
    </Container>
  );
};

export default AddLeadForm;