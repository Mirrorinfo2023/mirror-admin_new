"use client";
import React, { useEffect, useState } from "react";
import {
    Grid,
    Paper,
    Typography,
    Box,
    TextField,
    Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";

const FormCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: 12,
    boxShadow: "0px 4px 16px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    maxWidth: 500,
    margin: "auto",
}));

function ResetPassword() {
    const dispatch = useDispatch();
    const uid = Cookies.get("uid");
    const mobile = Cookies.get("mobile");

    const [mobile_no, setMobileNo] = useState("");
    const [old_password, setOldPassword] = useState("");
    const [new_password, setNewPassword] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (mobile) setMobileNo(mobile);
    }, [mobile]);

    // ✅ Form Validation
    const validateForm = () => {
        let tempErrors = {};

        if (!mobile_no.trim()) tempErrors.mobile_no = "Mobile number is required.";
        if (!old_password.trim()) tempErrors.old_password = "Old password is required.";
        if (!new_password.trim()) tempErrors.new_password = "New password is required.";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    // ✅ Submit handler
    const handleSubmit = async () => {
        if (!validateForm()) return;

        const formData = {
            userid: uid,
            oldpassword: old_password,
            password: new_password,
        };

        try {
            const response = await api.post("/api/users/admin-reset-password", formData);

            if (response.status === 200) {
                dispatch(callAlert({ message: "Password reset successfully!", type: "SUCCESS" }));
                Cookies.remove("uid");
                Cookies.remove("role");
            } else {
                dispatch(callAlert({ message: response.data.error, type: "FAILED" }));
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

    return (
        <Layout>
            <Grid container justifyContent="center" alignItems="center" sx={{ mt: 6 }}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <FormCard>
                        {/* Title */}
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            align="center"
                            color="primary"
                            gutterBottom
                        >
                            Reset Password
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            align="center"
                            sx={{ mb: 3 }}
                        >
                            Update your account password securely.
                        </Typography>

                        {/* Form Fields */}
                        <Box component="form" display="flex" flexDirection="column" gap={2}>
                            <TextField
                                label="Mobile No"
                                variant="outlined"
                                fullWidth
                                value={mobile_no}
                                InputProps={{ readOnly: true }}
                                error={!!errors.mobile_no}
                                helperText={errors.mobile_no}
                            />

                            <TextField
                                label="Old Password"
                                variant="outlined"
                                type="password"
                                fullWidth
                                value={old_password}
                                onChange={(e) => setOldPassword(e.target.value)}
                                error={!!errors.old_password}
                                helperText={errors.old_password}
                            />

                            <TextField
                                label="New Password"
                                variant="outlined"
                                type="password"
                                fullWidth
                                value={new_password}
                                onChange={(e) => setNewPassword(e.target.value)}
                                error={!!errors.new_password}
                                helperText={errors.new_password}
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{ mt: 2 }}
                                onClick={handleSubmit}
                            >
                                Change Password
                            </Button>
                        </Box>
                    </FormCard>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default withAuth(ResetPassword);
