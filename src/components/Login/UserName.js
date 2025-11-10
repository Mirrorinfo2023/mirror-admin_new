import { Grid, TextField, FormControlLabel, Checkbox, Button, FormHelperText, Snackbar, Alert, Typography, InputAdornment, IconButton, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import CryptoJS from 'crypto-js';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { DataEncrypt, DataDecrypt } from '../../../utils/encryption';
import ReCAPTCHA from 'react-google-recaptcha';

const UserName = ({ handleChange }) => {

    const route = useRouter();

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null);

    const [alert, setAlert] = useState({ open: false, type: false, message: null });

    const [error, setError] = useState({
        username: { status: false, message: '' },
        password: { status: false, message: '' },
        captcha: { status: false, message: '' }
    })

    const [showPassword, setShowPassword] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Validate form fields
    const validateForm = () => {
        const newError = {
            username: { status: false, message: '' },
            password: { status: false, message: '' },
            captcha: { status: false, message: '' }
        };

        // Username validation
        if (!userName.trim()) {
            newError.username = { status: true, message: 'Username is required' };
        } else if (userName.length < 3) {
            newError.username = { status: true, message: 'Username must be at least 3 characters long' };
        } else if (!/^[a-zA-Z_@+.\d+]*$/.test(userName)) {
            newError.username = { status: true, message: 'Username contains invalid characters' };
        }

        // Password validation
        if (!password.trim()) {
            newError.password = { status: true, message: 'Password is required' };
        } else if (password.length < 6) {
            newError.password = { status: true, message: 'Password must be at least 6 characters long' };
        } else if (/[<>]/.test(password)) {
            newError.password = { status: true, message: 'Password contains invalid characters' };
        }

        // CAPTCHA validation
        if (!captchaToken) {
            newError.captcha = { status: true, message: 'Please complete the CAPTCHA verification' };
        }

        setError(newError);
        return !Object.values(newError).some(error => error.status);
    };

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
        // Clear CAPTCHA error when user completes it
        if (token) {
            setError(prev => ({
                ...prev,
                captcha: { status: false, message: '' }
            }));
        }
    };

    const handleCaptchaExpired = () => {
        setCaptchaToken(null);
        setError(prev => ({
            ...prev,
            captcha: { status: true, message: 'CAPTCHA expired. Please verify again.' }
        }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setFormSubmitted(true);

        const attempt = Cookies.get('attempt');

        // Check if account is temporarily locked
        if (attempt && attempt >= 3) {
            setAlert({ open: true, type: false, message: 'Your account has been temporarily locked due to multiple incorrect login attempts!' });
            return;
        }

        // Validate form before submission
        if (!validateForm()) {
            setAlert({ open: true, type: false, message: 'Please fix the errors in the form before submitting.' });
            return;
        }

        try {
            const reqData = {
                username: userName,
                password: password,
                is_admin: 1,
                captchaToken
            }

            const response = await api.post('/api/users/admin_login', reqData);

            if (response.status === 200) {
                setAlert({ open: true, type: true, message: 'SignIn successfully!' });
                const responseData = response.data.data;

                // Store user data in localStorage
                localStorage.setItem('role', 'user');
                localStorage.setItem('uid', responseData.id);
                localStorage.setItem('email', responseData.email);
                localStorage.setItem('name', responseData.first_name + ' ' + responseData.last_name);
                localStorage.setItem('mobile', responseData.mobile);
                localStorage.setItem('employee_role', responseData.role_name);
                localStorage.setItem('menu', JSON.stringify(response.data.employeeMenu));

                // Store user data in cookies
                Cookies.set('role', 'user', { expires: 1 });
                Cookies.set('uid', responseData.id, { expires: 1 });
                Cookies.set('name', responseData.first_name + ' ' + responseData.last_name);
                Cookies.set('mobile', responseData.mobile);
                Cookies.set('employee_role', responseData.role_name, { expires: 1 });

                // Reset attempt counter on successful login
                Cookies.remove('attempt');

                // Redirect to dashboard
                route.push('/dashboard');

            } else {
                setAlert({ open: true, type: false, message: response.data.message });
            }

        } catch (error) {
            // Increment attempt counter on failed login
            let attempt = Cookies.get('attempt');
            if (attempt) {
                Cookies.set('attempt', parseInt(attempt) + 1, { expires: new Date(Date.now() + 3 * 60000) });
            } else {
                Cookies.set('attempt', 1, { expires: new Date(Date.now() + 3 * 60000) });
            }

            if (error?.response?.status && error.response.status === 404) {
                setAlert({ open: true, type: false, message: error.response.data });
            } else if (error?.response?.status && error.response.status === 401) {
                setAlert({ open: true, type: false, message: error.response.data.message });
            } else {
                console.log(error);
                if (error?.response?.data?.message) {
                    setAlert({ open: true, type: false, message: error.response.data.message });
                } else {
                    setAlert({ open: true, type: false, message: error.message });
                }
            }
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlert({ open: false, type: false, message: null });
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // Real-time validation for username
    const handleUsernameChange = (e) => {
        const inputValue = e.target.value;
        if (/^[a-zA-Z_@+.\d+]*$/.test(inputValue)) {
            setUserName(inputValue);
            // Clear error when user starts typing
            if (formSubmitted) {
                setError(prev => ({
                    ...prev,
                    username: { status: false, message: '' }
                }));
            }
        }
    };

    // Real-time validation for password
    const handlePasswordChange = (e) => {
        const inputValue = e.target.value;
        if (!/[<>]/.test(inputValue)) {
            setPassword(inputValue);
            // Clear error when user starts typing
            if (formSubmitted) {
                setError(prev => ({
                    ...prev,
                    password: { status: false, message: '' }
                }));
            }
        }
    };

    return (
        <>
            <Grid spacing={2} container>
                <Grid item xs={12}>
                    <TextField
                        required
                        error={error.username.status}
                        value={userName}
                        onChange={handleUsernameChange}
                        onBlur={() => formSubmitted && validateForm()}
                        fullWidth
                        label="Username"
                        variant="outlined"
                        helperText={error.username.message}
                    />
                </Grid>

                <Grid item xs={12}>
                    <FormControl
                        variant="outlined"
                        sx={{ width: '100%' }}
                        error={error.password.status}
                        required   // 🔹 Add this line to show the red asterisk
                    >
                        <InputLabel htmlFor="outlined-adornment-password" required>
                            Password
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={() => formSubmitted && validateForm()}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password *" // optional manual addition for clarity
                        />
                        {error.password.message && (
                            <FormHelperText error>{error.password.message}</FormHelperText>
                        )}
                    </FormControl>
                </Grid>


                {/* Google reCAPTCHA */}
                <Grid item xs={12}>
                    <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LffIwYrAAAAAHJ805Lxbl5cbn7QPrJhj2CsZzzN"}
                        onChange={handleCaptchaChange}
                        onExpired={handleCaptchaExpired}
                    />
                    {error.captcha.message && (
                        <FormHelperText error sx={{ mt: 1 }}>
                            {error.captcha.message}
                        </FormHelperText>
                    )}
                </Grid>

                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color={'primary'}
                        fullWidth
                        onClick={submitHandler}
                        size='large'
                    >
                        Login
                    </Button>
                </Grid>
            </Grid>

            <Snackbar
                open={alert.open}
                autoHideDuration={2000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={alert.type === true ? 'success' : 'error'}>
                    {alert.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default UserName;