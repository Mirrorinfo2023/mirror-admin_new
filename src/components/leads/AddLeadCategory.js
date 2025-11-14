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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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

const AddLeadCategoryTransactions = () => {
  const [title, setTitle] = useState('');
  const [range, setRange] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [leadCategory, setLeadCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const [formFields, setFormFields] = useState([]);
  const [newField, setNewField] = useState({ name: '', label: '', type: 'text' });
  const [editingIndex, setEditingIndex] = useState(null);

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'password', label: 'Password' },
    { value: 'image', label: 'Image' },
  ];

  useEffect(() => {
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
    fetchCategories();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleChange = (event) => {
    setLeadCategory(event.target.value);
  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleAddFieldChange = (e) => {
    const { name, value } = e.target;
    setNewField((prev) => ({ ...prev, [name]: value }));
  };

  const addField = () => {
    if (!newField.name || !newField.label) return alert('Please fill all field details');
    if (editingIndex !== null) {
      const updatedFields = [...formFields];
      updatedFields[editingIndex] = newField;
      setFormFields(updatedFields);
      setEditingIndex(null);
    } else {
      setFormFields((prev) => [...prev, newField]);
    }
    setNewField({ name: '', label: '', type: 'text' });
  };

  const handleEditField = (index) => {
    setNewField(formFields[index]);
    setEditingIndex(index);
  };

  const handleDeleteField = (index) => {
    setFormFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const payload = {
      category_image: selectedFile,
      category_name: title,
      description,
      category_id: leadCategory,
      discount_upto: range,
      formFields,
    };

    try {
      const response = await api.post('/api/leads/add-category', payload, {
        headers: { 'content-type': 'multipart/form-data' },
      });
      if (response) {
        alert('Leads Saved Successfully');
        window.history.back();
      }
    } catch (error) {
      console.error('Error uploading:', error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Add New Leads Category
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={leadCategory}
                label="Category"
                onChange={handleChange}
              >
                <MenuItem value="">Select Category</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Discount Upto"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              component="label"
              variant="contained"
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 16,
                px: 3,
                py: 1,
                background: '#2198f3',
                boxShadow: '0 2px 8px 0 rgba(33, 203, 243, 0.15)',
                textTransform: 'none',
                whiteSpace: 'nowrap',
              }}
              startIcon={<CloudUploadIcon />}
            >
              Upload File
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </Button>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {selectedFile.name}
              </Typography>
            )}
          </Grid>

          {/* --- Dynamic Fields Section --- */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Add Dynamic Form Fields
            </Typography>

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

          {/* --- Action Buttons --- */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-start" gap={2} mt={2}>
              <Button variant="contained"
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  fontSize: 16,
                  px: 3,
                  py: 1,
                  background: '#2198f3',
                  boxShadow: '0 2px 8px 0 rgba(33, 203, 243, 0.15)',
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                }} onClick={handleSubmit}>
                Submit
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AddLeadCategoryTransactions;
