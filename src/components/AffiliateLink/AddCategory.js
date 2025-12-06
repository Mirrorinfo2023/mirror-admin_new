import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import api from "../../../utils/api";

const AddAffiliateCategoryTransactions = () => {

  const [title, setTitle] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const [errors, setErrors] = useState({
    title: "",
    subCategory: ""
  });

  const [serverError, setServerError] = useState("");

  const handleCancel = () => {
    window.history.back();
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!title.trim()) {
      formErrors.title = "Category name is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    setServerError("");

    if (!validateForm()) return;

    const payload = {
      category_name: title,
      sub_category: subCategory,
    };

    try {
      console.log("Payload sent to backend:", payload);

      const response = await api.post(
        "/api/affiliate_link/e8c972c374e0499787cf9a6674ee95ba94e2731f",
        payload   // ⬅ SEND NORMAL JSON
      );

      console.log("Backend response:", response.data);

      if (response.data.status === 201) {
        alert("Category Saved Successfully");
        window.history.back();
      }

    } catch (error) {
      console.log("Error:", error);

      if (error.response) {
        setServerError(error.response.data.message || "Something went wrong");
      } else {
        setServerError("Network error");
      }
    }
  };

  return (
    <main className="p-6 space-y-6" style={{ marginTop: "20px" }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={11} md={10} lg={10}>
          <Paper
            elevation={4}
            sx={{
              padding: 4,
              borderRadius: 3,
              background: "#ffffff",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              textAlign="center"
              mb={3}
              sx={{ color: "#333" }}
            >
              Add New Affiliate Category
            </Typography>

            {serverError && (
              <Typography color="error" textAlign="center" mb={2}>
                {serverError}
              </Typography>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Category Name"
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={Boolean(errors.title)}
                  helperText={errors.title}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Sub Category (optional)"
                  variant="outlined"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                />
              </Grid>
            </Grid>

            <Box mt={4} display="flex" justifyContent="space-between" gap={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </main>
  );
};

export default AddAffiliateCategoryTransactions;
