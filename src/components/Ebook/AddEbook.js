"use client";
import React, { useEffect, useState } from "react";
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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/material/styles";
import api from "../../../utils/api";
import Cookies from "js-cookie";

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

const AddEbookTransactions = () => {
  const uid = Cookies.get("uid");

  const [ebook_name, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [discount, setDiscount] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.post("/api/ebookCategories/get-category");
        if (response.status === 200) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
  const handleFileChangePdf = (e) => setSelectedPdf(e.target.files[0]);
  const handleCancel = () => window.history.back();

  const handleSubmit = async () => {
    const formData = {
      ebook_name,
      author,
      description,
      price,
      quantity,
      discount,
      created_by: uid,
      category: transactionType,
      image: selectedFile,
      ebook_pdf: selectedPdf,
    };

    try {
      const response = await api.post("/api/ebook/add-ebook", formData, {
        headers: { "content-type": "multipart/form-data" },
      });
      if (response.data.status === 200) {
        alert(response.data.message);
        window.history.back();
      } else {
        console.error("Failed to save Category");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <Grid container justifyContent="center">
        <Grid item xs={12} md={10} lg={11}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Add New Ebook
            </Typography>

            <Grid container spacing={3}>
              {/* Ebook Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Ebook Name"
                  value={ebook_name}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>

              {/* Author */}
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </Grid>

              {/* Price */}
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Grid>

              {/* Quantity */}
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Grid>

              {/* Discount */}
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  label="Discount (%)"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </Grid>

              {/* Category */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Ebook Category</InputLabel>
                  <Select
                    value={transactionType}
                    label="Ebook Category"
                    onChange={(e) => setTransactionType(e.target.value)}
                  >
                    <MenuItem value="">Select Category</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Upload PDF */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                  Upload PDF
                </Typography>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Upload PDF
                  <VisuallyHiddenInput type="file" onChange={handleFileChangePdf} />
                </Button>
                {selectedPdf && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {selectedPdf.name}
                  </Typography>
                )}
              </Grid>

              {/* Upload Image */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                  Upload Image
                </Typography>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Upload Image
                  <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                </Button>
                {selectedFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {selectedFile.name}
                  </Typography>
                )}
              </Grid>

              {/* Description - Full width */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                  Description
                </Typography>
                <TextareaAutosize
                  minRows={4}
                  placeholder="Enter description..."
                  style={{
                    width: "100%",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                  }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>

              {/* Buttons */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    justifyContent: "flex-start",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmit}
                    sx={{ flex: { xs: 1, sm: "none" } }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{ flex: { xs: 1, sm: "none" } }}
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

export default AddEbookTransactions;
