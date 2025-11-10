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
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import dayjs from "dayjs";
import api from "../../../utils/api";
import { useRouter } from "next/router";

const AddEmployeeTransactions = () => {
  const router = useRouter();
  const { id, action } = router.query;
  const currentDate = new Date();

  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [education, setEducation] = useState("");
  const [address, setAddress] = useState("");

  const handleCancel = () => router.back();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = {
      Name: name,
      Mobile: mobile,
      Email: email,
      Address: address,
      City: city,
      District: district,
      State: state,
      Gender: gender,
      Role: role,
      Pincode: pincode,
      Education: education,
    };
    for (const [key, val] of Object.entries(required)) {
      if (!val) return alert(`${key} is required!`);
    }

    const formData = {
      first_name: name,
      dob: dob.toISOString().split("T")[0],
      mobile_no: mobile,
      email,
      address,
      city,
      district,
      state,
      gender,
      role_id: role,
      pincode,
      education,
    };

    try {
      let response = [];
      if (action === "edit") {
        formData.employee_id = id;
        response = await api.post("/api/employee/edit-employee", formData);
      } else {
        response = await api.post("/api/employee/add-employee", formData);
      }

      if (response.status === 200) {
        alert("Employee saved successfully");
        router.back();
      } else alert(response.data.message);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const getRoles = async () => {
      try {
        const response = await api.get("/api/employee/get-roles");
        if (response.status === 200) setRoles(response.data.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    if (action === "edit") {
      const getEmployee = async () => {
        try {
          const response = await api.post("/api/employee/get-employee", { employee_id: id });
          if (response.status === 200) {
            const d = response.data.data;
            setRole(d.role_id);
            setName(d.first_name);
            setMobile(d.mobile);
            setGender(d.gender);
            setDob(dayjs(d.dob));
            setEmail(d.email);
            setCity(d.city);
            setDistrict(d.district);
            setState(d.state);
            setAddress(d.address);
            setPincode(d.pincode);
            setEducation(d.education);
          }
        } catch (error) {
          console.error(error);
        }
      };
      getEmployee();
    }

    getRoles();
  }, [action, id]);

  return (
    <main className="p-6 space-y-6">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: "#f9f9f9",
        //   maxWidth: 1100,
          mx: "auto",
          m:2
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: "#333" }}>
          {action === "edit" ? "Edit Employee" : "Add New Employee"}
        </Typography>

        <Grid container spacing={2}>
          {/* Row 1 */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} size="small" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} size="small" />
          </Grid>

          {/* Row 2 */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} size="small" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                value={dob}
                onChange={(newDate) => setDob(newDate)}
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Row 3 */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Gender</InputLabel>
              <Select value={gender} label="Gender" onChange={(e) => setGender(e.target.value)}>
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Transgender">Transgender</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select value={role} label="Role" onChange={(e) => setRole(e.target.value)}>
                <MenuItem value="">Select</MenuItem>
                {roles.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.role_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Row 4 */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="City" value={city} onChange={(e) => setCity(e.target.value)} size="small" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="District" value={district} onChange={(e) => setDistrict(e.target.value)} size="small" />
          </Grid>

          {/* Row 5 */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="State" value={state} onChange={(e) => setState(e.target.value)} size="small" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} size="small" />
          </Grid>

          {/* Row 6 */}
          <Grid item xs={12} sm={6}>
            <TextareaAutosize
              minRows={3}
              placeholder="Education"
              style={{ width: "100%", border: "1px solid #ccc", borderRadius: "6px", padding: "8px" }}
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextareaAutosize
              minRows={3}
              placeholder="Address"
              style={{ width: "100%", border: "1px solid #ccc", borderRadius: "6px", padding: "8px" }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Grid>

          {/* Row 7 — Upload */}
          <Grid item xs={12}>
            <Box
              sx={{
                border: "2px dashed #ccc",
                borderRadius: 2,
                p: 2,
                textAlign: "center",
                background: "#fff",
              }}
            >
              <Typography variant="body2" sx={{ color: "#777" }}>
                Upload Employee Photo
              </Typography>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ mt: 1, backgroundColor: "#5C6BC0", textTransform: "none" }}
              >
                Choose File
                <input hidden accept="image/*" type="file" />
              </Button>
            </Box>
          </Grid>

          {/* Buttons */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                color="primary"
                sx={{ textTransform: "none", px: 4, backgroundColor: "#26A69A" }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Button variant="outlined" sx={{ textTransform: "none" }} onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </main>
  );
};

export default AddEmployeeTransactions;
