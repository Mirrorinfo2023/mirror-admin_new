"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import {
  Grid,
  Paper,
  Button,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import TextareaAutosize from "@mui/material/TextareaAutosize";

function TransactionHistory() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchPage = async () => {
      try {
        const response = await api.post("/api/page/get-page-details", {
          page_id: id,
        });
        if (response.status === 200) {
          setTitle(response.data.data.title);
          setContent(response.data.data.content);
        }
      } catch (error) {
        const msg = error?.response?.data?.error || error.message;
        dispatch(callAlert({ message: msg, type: "FAILED" }));
      }
    };

    fetchPage();
  }, [id, dispatch]);

  const handleSubmit = async () => {
    try {
      const response = await api.post("/api/page/update-page", {
        page_id: id,
        title,
        content,
      });
      if (response.status === 200) {
        alert("Updated successfully");
        router.back();
      }
    } catch (error) {
      console.error("Error updating page:", error);
    }
  };

  return (
    <Layout>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          p: { xs: 2, md: 4 },
          minHeight: "80vh",
          backgroundColor: "#f9fafc",
        }}
      >
        <Grid item xs={12} sm={11} md={11} lg={11}>
          <Paper
            elevation={5}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
            }}
          >
            {/* Title */}
            <Typography
              variant="h5"
              fontWeight={600}
              textAlign="center"
              gutterBottom
            >
              Page [Update]
            </Typography>
            {/* <Divider sx={{ mb: 3 }} /> */}

            {/* Form Fields */}
            <Box display="flex" flexDirection="column" gap={3}>
              <TextField
                fullWidth
                required
                label="Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, fontWeight: 500 }}
                >
                  Content
                </Typography>
                <TextareaAutosize
                  minRows={6}
                  placeholder="Enter page content..."
                  style={{
                    width: "100%",
                    borderRadius: 6,
                    padding: 12,
                    border: "1px solid #cfd8dc",
                    fontFamily: "inherit",
                    fontSize: "1rem",
                    resize: "vertical",
                    backgroundColor: "white",
                  }}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </Box>
            </Box>

            {/* Button */}
            <Box
              display="flex"
              justifyContent="flex-end"
              mt={4}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  px: 4,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: "none",
                }}
                onClick={handleSubmit}
              >
                Update
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default withAuth(TransactionHistory);
