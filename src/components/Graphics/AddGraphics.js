"use client";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  TableContainer,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { DataEncrypt, DataDecrypt } from "../../../utils/encryption";
import dayjs from "dayjs";

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

const AddGraphicsTransactions = () => {
  const [title, setTitle] = useState("");
  const [cat_group, setCatGroup] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/api/graphics/get-graphics-category");
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

  const handleChange = (event) => setTransactionType(event.target.value);
  const handleFileChange = (event) => setSelectedFile(event.target.files[0]);

  const handleSubmit = async () => {
    const allowedCharacters = /^[a-zA-Z\s]*$/;

    try {
      if (!allowedCharacters.test(cat_group)) {
        alert("Please enter a valid Category Group name (letters only).");
        return;
      }

      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("graphics_name", title);
      formData.append("category_id", transactionType);
      formData.append("cat_group", cat_group);

      const response = await api.post("/api/graphics/add-graphics", formData, {
        headers: { "content-type": "multipart/form-data" },
      });

      if (response) {
        alert("Graphics added successfully");
        window.history.back();
      } else {
        console.error("Failed to upload graphics");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={3} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 24px rgba(33,150,243,0.08)",
              p: { xs: 2, sm: 4 },
            }}
          >
            {/* Header */}
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: 600,
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              Add New Graphics
            </Typography>

            {/* Form Grid */}
            <Grid container spacing={2}>
              {/* Graphics Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Graphics Name"
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>

              {/* Category Select */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Graphics Category</InputLabel>
                  <Select
                    value={transactionType}
                    label="Graphics Category"
                    onChange={handleChange}
                  >
                    <MenuItem value="">Please Select</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Category Group */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Graphics Category Group"
                  variant="outlined"
                  value={cat_group}
                  onChange={(e) => setCatGroup(e.target.value)}
                />
              </Grid>

              {/* Upload File */}
              <Grid item xs={12} sm={6}>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{
                    background: "linear-gradient(90deg, #2196F3 0%, #21CBF3 100%)",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  Upload File
                  <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                </Button>
                {selectedFile && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      textAlign: "center",
                      wordBreak: "break-all",
                      color: "text.secondary",
                    }}
                  >
                    {selectedFile.name}
                  </Typography>
                )}
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button
                    variant="contained"
                    color="success"
                    size="medium"
                    onClick={handleSubmit}
                    sx={{
                      px: 4,
                      fontWeight: "bold",
                      borderRadius: 2,
                      textTransform: "none",
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </TableContainer>
        </Grid>
      </Grid>
    </main>
  );
};

export default AddGraphicsTransactions;
