import {
    Box,
    Button,
    TextField,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardContent,
    useTheme,
    useMediaQuery,
    FormHelperText,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import { useState } from "react";
import api from "../../../utils/api";
import { styled } from '@mui/material/styles';
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { callAlert } from "../../../redux/actions/alert";
import SaveIcon from '@mui/icons-material/Save';
import LinkIcon from '@mui/icons-material/Link';

// Styled components for better UI
const StyledCard = styled(Card)(({ theme }) => ({
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)',
    marginBottom: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme, error }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: error ? 'rgba(211, 47, 47, 0.04)' : 'rgba(0,0,0,0.02)',
        '&:hover': {
            backgroundColor: error ? 'rgba(211, 47, 47, 0.08)' : 'rgba(0,0,0,0.04)',
        },
        '&.Mui-focused': {
            backgroundColor: 'white',
            boxShadow: error ? '0 0 0 2px rgba(211, 47, 47, 0.2)' : '0 0 0 2px rgba(102, 126, 234, 0.2)',
        }
    }
}));

const RequiredAsterisk = styled('span')(({ theme }) => ({
    color: theme.palette.error.main,
    marginLeft: theme.spacing(0.5),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
    color: 'white',
    borderRadius: '12px',
    padding: '12px 32px',
    fontWeight: '600',
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
    '&:hover': {
        background: 'linear-gradient(135deg, #43A047 0%, #2E7D32 100%)',
        boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
        transform: 'translateY(-1px)',
    },
    '&:disabled': {
        background: 'rgba(0,0,0,0.12)',
        color: 'rgba(0,0,0,0.26)',
        boxShadow: 'none',
        transform: 'none',
    },
    transition: 'all 0.3s ease-in-out',
}));

const AddOTTLinkTransactions = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        ott_name: "",
        link: "",
        status: "1",
        description: ""
    });

    // Validation states
    const [errors, setErrors] = useState({
        ott_name: '',
        link: '',
    });
    const [touched, setTouched] = useState({
        ott_name: false,
        link: false,
    });
    const [showValidationAlert, setShowValidationAlert] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const ottPlatforms = [
        "Netflix",
        "Amazon Prime Video",
        "Disney+ Hotstar",
        "ZEE5",
        "SonyLIV",
        "Voot",
        "MX Player",
        "JioCinema",
        "ALTBalaji",
        "Other"
    ];

    // Validation functions
    const validateField = (name, value) => {
        switch (name) {
            case 'ott_name':
                return value.trim() === '' ? 'OTT name is required' : '';
            case 'link':
                if (value.trim() === '') return 'OTT link is required';
                if (!value.match(/^https?:\/\/.+\..+$/)) return 'Please enter a valid URL';
                return '';
            default:
                return '';
        }
    };

    const validateForm = () => {
        const newErrors = {
            ott_name: validateField('ott_name', formData.ott_name),
            link: validateField('link', formData.link),
        };

        setErrors(newErrors);

        // Mark all fields as touched to show errors
        setTouched({
            ott_name: true,
            link: true,
        });

        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleFieldBlur = (fieldName) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));

        // Validate the field that was just blurred
        let value = formData[fieldName];
        const error = validateField(fieldName, value);
        setErrors(prev => ({ ...prev, [fieldName]: error }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (touched[name] && errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validateForm();

        if (!isValid) {
            setShowValidationAlert(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setShowValidationAlert(false);
        setLoading(true);

        try {
            const response = await api.post("/api/ott/add-ott-link", {
                ott_name: formData.ott_name,
                link: formData.link,
                status: parseInt(formData.status),
                description: formData.description
            });

            if (response.status === 200 || response.status === 201) {
                dispatch(callAlert({
                    message: "OTT link added successfully",
                    type: "SUCCESS"
                }));
                router.push("/dashboard/ott-links");
            } else if (response.data && response.data.error) {
                dispatch(callAlert({
                    message: response.data.error,
                    type: "FAILED"
                }));
            }
        } catch (error) {
            const msg = error?.response?.data?.error || error.message || "Something went wrong";
            dispatch(callAlert({ message: msg, type: "FAILED" }));
        } finally {
            setLoading(false);
        }
    };

    // Check if form is valid for enabling submit button
    const isFormValid = () => {
        return formData.ott_name.trim() !== '' &&
            formData.link.trim() !== '' &&
            !Object.values(errors).some(error => error !== '');
    };

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1
                    }}
                >
                    Add OTT Link
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Add a new OTT platform link to your collection
                </Typography>
            </Box>

            {/* Validation Alert */}
            {showValidationAlert && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: '12px',
                        '& .MuiAlert-message': {
                            width: '100%'
                        }
                    }}
                    onClose={() => setShowValidationAlert(false)}
                >
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                        Please fix the following errors:
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2 }}>
                        {errors.ott_name && <li>OTT Name: {errors.ott_name}</li>}
                        {errors.link && <li>OTT Link: {errors.link}</li>}
                    </Box>
                </Alert>
            )}

            <StyledCard>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <form onSubmit={handleSubmit}>
                        {/* Form Grid */}
                        <Grid container spacing={3}>
                            {/* OTT Name - Full width on mobile, half on desktop */}
                            <Grid item xs={12} md={6}>
                                <Typography
                                    variant="body1"
                                    component="label"
                                    sx={{
                                        display: 'block',
                                        mb: 1,
                                        fontWeight: '500',
                                        color: 'text.primary'
                                    }}
                                >
                                    OTT Platform<RequiredAsterisk>*</RequiredAsterisk>
                                </Typography>
                                <FormControl fullWidth error={touched.ott_name && !!errors.ott_name}>
                                    <InputLabel>Select OTT Platform</InputLabel>
                                    <Select
                                        name="ott_name"
                                        value={formData.ott_name}
                                        onChange={handleInputChange}
                                        onBlur={() => handleFieldBlur('ott_name')}
                                        label="Select OTT Platform"
                                        required
                                    >
                                        {ottPlatforms.map((platform) => (
                                            <MenuItem key={platform} value={platform}>
                                                {platform}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {touched.ott_name && errors.ott_name && (
                                        <FormHelperText>{errors.ott_name}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* OTT Link - Full width on mobile, half on desktop */}
                            <Grid item xs={12} md={6}>
                                <Typography
                                    variant="body1"
                                    component="label"
                                    sx={{
                                        display: 'block',
                                        mb: 1,
                                        fontWeight: '500',
                                        color: 'text.primary'
                                    }}
                                >
                                    OTT Link<RequiredAsterisk>*</RequiredAsterisk>
                                </Typography>
                                <StyledTextField
                                    fullWidth
                                    required
                                    name="link"
                                    variant="outlined"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    onBlur={() => handleFieldBlur('link')}
                                    placeholder="https://example.com/ott-link"
                                    error={touched.link && !!errors.link}
                                    helperText={errors.link || "Enter the complete OTT platform link"}
                                />
                            </Grid>

                            {/* Description - Full width */}
                            <Grid item xs={12}>
                                <Typography
                                    variant="body1"
                                    component="label"
                                    sx={{
                                        display: 'block',
                                        mb: 1,
                                        fontWeight: '500',
                                        color: 'text.primary'
                                    }}
                                >
                                    Description (Optional)
                                </Typography>
                                <StyledTextField
                                    fullWidth
                                    name="description"
                                    variant="outlined"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={4}
                                    placeholder="Add any notes or description about this OTT link..."
                                    helperText="This will help you identify and manage the link later"
                                />
                            </Grid>

                            {/* Status - Full width on mobile, half on desktop */}
                            <Grid item xs={12} md={6}>
                                <Typography
                                    variant="body1"
                                    component="label"
                                    sx={{
                                        display: 'block',
                                        mb: 1,
                                        fontWeight: '500',
                                        color: 'text.primary'
                                    }}
                                >
                                    Status
                                </Typography>
                                <FormControl fullWidth>
                                    <InputLabel>Select Status</InputLabel>
                                    <Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        label="Select Status"
                                    >
                                        <MenuItem value="1">Active</MenuItem>
                                        <MenuItem value="2">Inactive</MenuItem>
                                    </Select>
                                    <FormHelperText>
                                        Active links will be visible to users
                                    </FormHelperText>
                                </FormControl>
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: { xs: 'center', md: 'flex-start' },
                                    gap: 2,
                                    mt: 2
                                }}>
                                    <SubmitButton
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        startIcon={<SaveIcon />}
                                        disabled={!isFormValid() || loading}
                                    >
                                        {loading ? 'Adding...' : 'Add OTT Link'}
                                    </SubmitButton>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => router.push("/ott-link")}
                                        disabled={loading}
                                        sx={{
                                            borderRadius: '12px',
                                            padding: '12px 32px',
                                            textTransform: 'none',
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </StyledCard>

            {/* Tips Card */}
            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                    <Card sx={{ borderRadius: 2, backgroundColor: '#f5faff' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <LinkIcon sx={{ color: '#1976d2', fontSize: 32 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Tips for Adding OTT Links
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Alert severity="info" sx={{ borderRadius: 1 }}>
                                    Ensure the link is valid and accessible
                                </Alert>
                                <Alert severity="info" sx={{ borderRadius: 1 }}>
                                    Use descriptive names for easy identification
                                </Alert>
                                <Alert severity="info" sx={{ borderRadius: 1 }}>
                                    Mark as inactive if the link is temporarily unavailable
                                </Alert>
                                <Alert severity="warning" sx={{ borderRadius: 1 }}>
                                    Always verify links before adding to avoid broken links
                                </Alert>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Help Text */}
            <Box sx={{
                textAlign: 'center',
                mt: 3,
                p: 2,
                backgroundColor: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '12px'
            }}>
                <Typography variant="body2" color="text.secondary">
                    💡 Fields marked with <RequiredAsterisk>*</RequiredAsterisk> are required.
                    Please ensure all required fields are filled correctly.
                </Typography>
            </Box>
        </Container>
    );
};

export default AddOTTLinkTransactions;