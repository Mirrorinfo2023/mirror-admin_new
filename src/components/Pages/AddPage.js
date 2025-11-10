"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import api from "../../../utils/api";

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 12,
  boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
  backgroundColor: "#fff",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const AddPageTransactions = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    try {
      const formData = {
        title,
        content,
      };

      const response = await api.post("/api/page/add-page", formData);

      if (response.status === 200) {
        alert("Page added successfully!");
        window.history.back();
      } else {
        console.error("Failed to upload Page");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <Grid container justifyContent="center" sx={{ padding: 2 }}>
        <Grid item xs={12} md={12}>
          <FormContainer>
            {/* Page Title */}
            <Box mb={3}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Add New Page
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Create a new page by filling in the details below.
              </Typography>
            </Box>

            {/* Page Name Input */}
            <Box mb={3}>
              <TextField
                label="Page Name"
                variant="outlined"
                fullWidth
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Box>

            {/* Content Input */}
            <Box mb={3}>
              <Typography variant="subtitle1" mb={1}>
                Content
              </Typography>
              <TextareaAutosize
                minRows={6}
                placeholder="Enter content here..."
                style={{
                  width: "100%",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  padding: "12px",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  resize: "vertical",
                }}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Box>

            {/* Submit Button */}
            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </FormContainer>
        </Grid>
      </Grid>
    </main>
  );
};

export default AddPageTransactions;
