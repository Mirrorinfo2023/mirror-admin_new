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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";

function TransactionHistory() {
  const [service_name, setServiceName] = useState("");
  const [service_short_name, setServiceShortName] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [isCashback, setIsCashback] = useState("");
  const [data, setData] = useState([]);
  const [operator, setOperator] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const { panel_id } = router.query;

  useEffect(() => {
    const getPanelData = async () => {
      try {
        const response = await api.post("/api/setting/get-panel", { panel_id });
        if (response.status === 200) {
          const res = response.data;
          setServiceName(res.data.service_name);
          setServiceShortName(res.data.short_name);
          setPriority(res.data.priority);
          setStatus(res.data.status);
          setIsCashback(res.data.is_cashback);
          setData(res.operators || []);

          if (Array.isArray(res.operators)) {
            const activeOps = res.operators
              .filter((d) => d.active_status === 1)
              .map((d) => d.id);
            setOperator(activeOps);
          }
        }
      } catch (error) {
        dispatch(
          callAlert({
            message: error?.response?.data?.error || error.message,
            type: "FAILED",
          })
        );
      }
    };
    if (panel_id) getPanelData();
  }, [panel_id, dispatch]);

  const handleSubmit = async () => {
    const formData = {
      panel_id,
      status,
      priority,
      is_cashback: isCashback,
      operator_ids: operator,
    };

    try {
      const response = await api.post("/api/setting/recharge-panel", formData);
      if (response) {
        alert("Updated successfully");
        window.history.back();
      }
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  const ListItem = ({ item }) => {
    const [isOn, setIsOn] = useState(item.active_status === 1);
    const toggleSwitch = () => {
      setIsOn(!isOn);
      const updated = [...operator];
      const index = updated.indexOf(item.id);
      if (index === -1) updated.push(item.id);
      else updated.splice(index, 1);
      setOperator(updated);
    };

    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        py={0.5}
        borderBottom="1px solid #eee"
      >
        <Typography variant="body2">{item.operator_name}</Typography>
        <input type="checkbox" checked={isOn} onChange={toggleSwitch} />
      </Box>
    );
  };

  return (
    <Layout>
      <Box
        sx={{
          backgroundColor: "#f5f6fa",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          py: 5,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            p: 4,
            m:4,
            mt:0,
            pt:1,
            borderRadius: 3,
            backgroundColor: "#fff",
          }}
        >
          <Typography variant="h5" fontWeight="600" gutterBottom>
            Recharge Panel [Update]
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Service Name"
                value={service_name}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Service Short Name"
                value={service_short_name}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value={1}>Active</MenuItem>
                  <MenuItem value={0}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Is Cashback Services</InputLabel>
                <Select
                  value={isCashback}
                  onChange={(e) => setIsCashback(e.target.value)}
                >
                  <MenuItem value={1}>Active</MenuItem>
                  <MenuItem value={0}>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                Select Operator
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  maxHeight: 250,
                  overflowY: "auto",
                  borderRadius: 2,
                  backgroundColor: "#fafafa",
                }}
              >
                {data && data.length > 0 ? (
                  data.map((item, i) => <ListItem key={i} item={item} />)
                ) : (
                  <Typography variant="body2">No operators found</Typography>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleSubmit}
                  sx={{
                    textTransform: "none",
                    px: 4,
                    borderRadius: 2,
                  }}
                >
                  Update
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Layout>
  );
}

export default withAuth(TransactionHistory);
