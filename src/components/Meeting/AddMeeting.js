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
  Alert
} from "@mui/material";
import { useState } from "react";
import api from "../../../utils/api";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

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

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StyledTextArea = styled('textarea')(({ theme, error }) => ({
  width: '100%',
  minHeight: '120px',
  padding: '16px',
  border: error ? '2px solid #d32f2f' : '1px solid #ced4da',
  borderRadius: '12px',
  backgroundColor: error ? 'rgba(211, 47, 47, 0.04)' : 'rgba(0,0,0,0.02)',
  fontFamily: 'inherit',
  fontSize: '1rem',
  resize: 'vertical',
  '&:focus': {
    outline: 'none',
    border: error ? '2px solid #d32f2f' : '2px solid #667eea',
    backgroundColor: 'white',
  },
  '&:hover': {
    backgroundColor: error ? 'rgba(211, 47, 47, 0.08)' : 'rgba(0,0,0,0.04)',
  }
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '12px',
  padding: '12px 32px',
  fontWeight: '600',
  textTransform: 'none',
  fontSize: '1rem',
  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
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

const UploadButton = styled(Button)(({ theme, error }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  textTransform: 'none',
  fontWeight: '500',
  border: error ? '2px dashed #d32f2f' : '2px dashed #667eea',
  color: error ? '#d32f2f' : '#667eea',
  backgroundColor: error ? 'rgba(211, 47, 47, 0.04)' : 'rgba(102, 126, 234, 0.05)',
  '&:hover': {
    backgroundColor: error ? 'rgba(211, 47, 47, 0.08)' : 'rgba(102, 126, 234, 0.1)',
    border: error ? '2px dashed #d32f2f' : '2px dashed #5a6fd8',
  },
}));

const AddMeetingTransactions = () => {
  const [title, setTitle] = useState('');
  const [meeting_link, setMeetingLink] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [meetingDate, setMeetingDate] = useState(dayjs());
  const [meetingTime, setMeetingTime] = useState(dayjs());

  // Validation states
  const [errors, setErrors] = useState({
    title: '',
    meeting_link: '',
    meeting_date: '',
    meeting_time: '',
    description: ''
  });
  const [touched, setTouched] = useState({
    title: false,
    meeting_link: false,
    meeting_date: false,
    meeting_time: false,
    description: false
  });
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        return value.trim() === '' ? 'Meeting name is required' : '';
      case 'meeting_link':
        if (value.trim() === '') return 'Meeting link is required';
        if (!value.match(/^https?:\/\/.+\..+$/)) return 'Please enter a valid URL';
        return '';
      case 'meeting_date':
        return !value ? 'Meeting date is required' : '';
      case 'meeting_time':
        return !value ? 'Meeting time is required' : '';
      case 'description':
        return value.trim() === '' ? 'Description is required' : '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {
      title: validateField('title', title),
      meeting_link: validateField('meeting_link', meeting_link),
      meeting_date: validateField('meeting_date', meetingDate),
      meeting_time: validateField('meeting_time', meetingTime),
      description: validateField('description', description)
    };
    
    setErrors(newErrors);
    
    // Mark all fields as touched to show errors
    setTouched({
      title: true,
      meeting_link: true,
      meeting_date: true,
      meeting_time: true,
      description: true
    });

    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleFieldBlur = (fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    // Validate the field that was just blurred
    let value;
    switch (fieldName) {
      case 'title':
        value = title;
        break;
      case 'meeting_link':
        value = meeting_link;
        break;
      case 'meeting_date':
        value = meetingDate;
        break;
      case 'meeting_time':
        value = meetingTime;
        break;
      case 'description':
        value = description;
        break;
      default:
        value = '';
    }
    
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleFromDateChange = (date) => {
    setMeetingDate(date);
    if (touched.meeting_date) {
      const error = validateField('meeting_date', date);
      setErrors(prev => ({ ...prev, meeting_date: error }));
    }
  };

  const handleSetTime = (time) => {
    setMeetingTime(time);
    if (touched.meeting_time) {
      const error = validateField('meeting_time', time);
      setErrors(prev => ({ ...prev, meeting_time: error }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async () => {
    const isValid = validateForm();
    
    if (!isValid) {
      setShowValidationAlert(true);
      // Scroll to top to show alert
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setShowValidationAlert(false);

    const date = new Date(meetingTime);
    const options = { hour12: true, hour: '2-digit', minute: '2-digit' };
    const formattedTime = date.toLocaleTimeString('en-US', options);

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('meeting_name', title);
    formData.append('meeting_link', meeting_link);
    formData.append('description', description);
    formData.append('meeting_date', meetingDate.format('YYYY-MM-DD'));
    formData.append('meeting_time', formattedTime);

    try {
      const response = await api.post('/api/meeting/add-meeting', formData, {
        headers: { 'content-type': 'multipart/form-data' }
      });

      if (response) {
        window.history.back();
        alert('Meeting Added successfully');
      } else {
        console.error('Failed to upload graphics');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Check if form is valid for enabling submit button
  const isFormValid = () => {
    return title.trim() !== '' && 
           meeting_link.trim() !== '' && 
           meetingDate && 
           meetingTime && 
           description.trim() !== '' &&
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
          Add New Meeting
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Schedule a new meeting with all necessary details
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
            {errors.title && <li>Meeting Name: {errors.title}</li>}
            {errors.meeting_link && <li>Meeting Link: {errors.meeting_link}</li>}
            {errors.meeting_date && <li>Meeting Date: {errors.meeting_date}</li>}
            {errors.meeting_time && <li>Meeting Time: {errors.meeting_time}</li>}
            {errors.description && <li>Description: {errors.description}</li>}
          </Box>
        </Alert>
      )}

      <StyledCard>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          {/* Form Grid */}
          <Grid container spacing={3}>
            {/* Meeting Name & Link - Two columns on desktop, one on mobile */}
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
                Meeting Name<RequiredAsterisk>*</RequiredAsterisk>
              </Typography>
              <StyledTextField
                fullWidth
                required
                variant="outlined"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (touched.title) {
                    const error = validateField('title', e.target.value);
                    setErrors(prev => ({ ...prev, title: error }));
                  }
                }}
                onBlur={() => handleFieldBlur('title')}
                placeholder="Enter meeting title"
                error={touched.title && !!errors.title}
                helperText={touched.title && errors.title}
              />
            </Grid>

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
                Meeting Link<RequiredAsterisk>*</RequiredAsterisk>
              </Typography>
              <StyledTextField
                fullWidth
                required
                variant="outlined"
                value={meeting_link}
                onChange={(e) => {
                  setMeetingLink(e.target.value);
                  if (touched.meeting_link) {
                    const error = validateField('meeting_link', e.target.value);
                    setErrors(prev => ({ ...prev, meeting_link: error }));
                  }
                }}
                onBlur={() => handleFieldBlur('meeting_link')}
                placeholder="https://meet.example.com/your-meeting"
                error={touched.meeting_link && !!errors.meeting_link}
                helperText={touched.meeting_link && errors.meeting_link}
              />
            </Grid>

            {/* Date & Time - Two columns on desktop, one on mobile */}
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
                Meeting Date<RequiredAsterisk>*</RequiredAsterisk>
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={meetingDate}
                  onChange={handleFromDateChange}
                  onClose={() => handleFieldBlur('meeting_date')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: touched.meeting_date && !!errors.meeting_date,
                      helperText: touched.meeting_date && errors.meeting_date,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: (touched.meeting_date && errors.meeting_date) ? 'rgba(211, 47, 47, 0.04)' : 'rgba(0,0,0,0.02)',
                        }
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

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
                Meeting Time<RequiredAsterisk>*</RequiredAsterisk>
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  value={meetingTime}
                  onChange={handleSetTime}
                  onClose={() => handleFieldBlur('meeting_time')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: touched.meeting_time && !!errors.meeting_time,
                      helperText: touched.meeting_time && errors.meeting_time,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          backgroundColor: (touched.meeting_time && errors.meeting_time) ? 'rgba(211, 47, 47, 0.04)' : 'rgba(0,0,0,0.02)',
                        }
                      }
                    }
                  }}
                />
              </LocalizationProvider>
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
                Description<RequiredAsterisk>*</RequiredAsterisk>
              </Typography>
              <StyledTextArea
                placeholder="Enter meeting description, agenda, or any additional notes..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (touched.description) {
                    const error = validateField('description', e.target.value);
                    setErrors(prev => ({ ...prev, description: error }));
                  }
                }}
                onBlur={() => handleFieldBlur('description')}
                error={touched.description && !!errors.description}
              />
              {touched.description && errors.description && (
                <FormHelperText error sx={{ mt: 1, mx: 1 }}>
                  {errors.description}
                </FormHelperText>
              )}
            </Grid>

            {/* File Upload - Full width */}
            <Grid item xs={12}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
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
                  Upload Meeting File (Optional)
                </Typography>
                <UploadButton
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  error={false}
                >
                  Choose File
                  <VisuallyHiddenInput 
                    type="file" 
                    onChange={handleFileChange} 
                  />
                </UploadButton>
                {selectedFile && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 1, 
                      color: 'success.main',
                      fontWeight: '500'
                    }}
                  >
                    ✅ {selectedFile.name}
                  </Typography>
                )}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    mt: 1, 
                    color: 'text.secondary' 
                  }}
                >
                  Supported formats: PDF, DOC, PPT, Images (Max: 10MB)
                </Typography>
              </Box>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: { xs: 'center', md: 'flex-start' },
                mt: 2
              }}>
                <SubmitButton
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={!isFormValid()}
                >
                  Create Meeting
                </SubmitButton>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      {/* Help Text */}
      <Box sx={{ 
        textAlign: 'center', 
        mt: 3,
        p: 2,
        backgroundColor: 'rgba(102, 126, 234, 0.05)',
        borderRadius: '12px'
      }}>
        <Typography variant="body2" color="text.secondary">
          💡 Fields marked with <RequiredAsterisk>*</RequiredAsterisk> are required. Please fill all required fields to create the meeting.
        </Typography>
      </Box>
    </Container>
  );
};

export default AddMeetingTransactions;