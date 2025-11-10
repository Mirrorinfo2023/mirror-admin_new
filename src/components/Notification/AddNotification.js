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
  FormHelperText,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/material/styles";
import api from "../../../utils/api";

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

const AddNotificationTransactions = () => {
  const [title, setTitle] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [appType, setAppType] = useState("");
  const [categories, setCategories] = useState([]);
  const [appCategories, setAppCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/api/notification/get-notification-category");
        if (response.status === 200) {
          setCategories(response.data.data.NotificationCategory);
          setAppCategories(response.data.data.notificationApp);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategories();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const validateForm = () => {
    let newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!transactionType) newErrors.transactionType = "Please select a notification type";
    if (!appType) newErrors.appType = "Please select an app type";
    if (!message.trim()) newErrors.message = "Message cannot be empty";
    if (!selectedFile) newErrors.selectedFile = "Please upload a file";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    window.history.back();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("title", title);
    formData.append("type_id", transactionType);
    formData.append("body", message);
    formData.append("app_id", appType);

    try {
      const response = await api.post("/api/notification/add-notification", formData, {
        headers: { "content-type": "multipart/form-data" },
      });

      if (response.status === 200) {
        alert("Notification saved successfully!");
        window.history.back();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <Grid container spacing={3} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Add New Notification
            </Typography>

            <Grid container spacing={2}>
              {/* Title */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  // required
                  label={
                    <>
                      Title <span style={{ color: "red" }}>*</span>
                    </>
                  }
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={!!errors.title}
                  helperText={errors.title}
                />
              </Grid>

              {/* Notification Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.transactionType}>
                  <InputLabel >
                    Notification Type <span style={{ color: "red" }}>*</span>
                  </InputLabel>
                  <Select
                    value={transactionType}
                    label="Notification Type"
                    onChange={(e) => setTransactionType(e.target.value)}
                  >
                    <MenuItem value="">Please Select</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.notification_type}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.transactionType}</FormHelperText>
                </FormControl>
              </Grid>

              {/* App Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.appType}>
                  <InputLabel >
                    App Type <span style={{ color: "red" }}>*</span>
                  </InputLabel>
                  <Select
                    value={appType}
                    label="App Type"
                    onChange={(e) => setAppType(e.target.value)}
                  >
                    <MenuItem value="">Please Select</MenuItem>
                    {appCategories.map((app) => (
                      <MenuItem key={app.id} value={app.id}>
                        {app.app_name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.appType}</FormHelperText>
                </FormControl>
              </Grid>

              {/* Message */}
              <Grid item xs={12}>
                <Typography sx={{ mb: 1, fontWeight: 500 }}>
                  Message <span style={{ color: "red" }}>*</span>
                </Typography>
                <TextareaAutosize
                  minRows={4}
                  placeholder="Enter message here..."
                  style={{
                    width: "100%",
                    border: errors.message ? "1px solid red" : "1px solid #ccc",
                    borderRadius: "6px",
                    padding: "10px",
                    fontFamily: "inherit",
                    fontSize: "14px",
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                {errors.message && (
                  <Typography variant="body2" sx={{ color: "red", mt: 0.5 }}>
                    {errors.message}
                  </Typography>
                )}
              </Grid>

              {/* File Upload */}
              <Grid item xs={12} md={6}>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  sx={{ textTransform: "none" }}
                >
                  Upload File <span style={{ color: "red", marginLeft: 4 }}>*</span>
                  <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => handleFileChange(event)}
                  />
                </Button>
                {selectedFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {selectedFile.name}
                  </Typography>
                )}
                {errors.selectedFile && (
                  <Typography variant="body2" sx={{ color: "red", mt: 0.5 }}>
                    {errors.selectedFile}
                  </Typography>
                )}
              </Grid>

              {/* Buttons */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "flex-start",
                    gap: 2,
                    mt: 3,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                  >
                    Submit
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
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

export default AddNotificationTransactions;
