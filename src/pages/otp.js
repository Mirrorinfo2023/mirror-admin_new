"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import OtpTransactions from "@/components/Otp/Otp";
import { 
    Grid,
    TableContainer, 
    Paper, 
    Typography, 
    Box, 
    TextField,
    Card,
    CardContent 
} from "@mui/material";
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import MessageIcon from "@mui/icons-material/Message";
import TimerOffIcon from "@mui/icons-material/TimerOff";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { DataDecrypt, DataEncrypt } from "../../utils/encryption";

const drawWidth = 220;

const getDate = (timeZone) => {
  const dateString = timeZone;
  const dateObject = new Date(dateString);
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");
  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);
  const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;
  return formattedDateTime;
};

// New StatCard Design
const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: '8px',
  height: '120px',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'hidden',
  minWidth: '280px',
}));

const FilterCard = styled(Paper)(({ theme }) => ({
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  marginBottom: '24px',
  border: '1px solid rgba(0,0,0,0.05)',
}));

function OtpReport(props) {
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const [masterReport, setmasterReport] = useState({});
    const dispatch = useDispatch();
    const uid = Cookies.get('uid');

    const [fromDate, setFromDate] = React.useState(dayjs(getDate.date));
    const [toDate, setToDate] = React.useState(dayjs(getDate.date));
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const getTnx = async () => {
            try {
                const response = await api.post("/api/report/otp");
                if (response.status === 200) {
                    setShowServiceTrans(response.data.otpResult)
                    setmasterReport(response.data.report)
                }
            } catch (error) {
                // Error handling commented out in original code
            }
        }

        if (fromDate || toDate) {
            getTnx();
        }
    }, [fromDate, toDate, dispatch])

    const handleFromDateChange = (date) => {
        setFromDate(date);
    };

    const handleToDateChange = (date) => {
        setToDate(date);
    };

    // Card configurations
    const cards = [
        {
            label: "Total OTP",
            value: masterReport.totalSms ?? 0,
            color: "#FFC107",
            icon: <MessageIcon />
        },
        {
            label: "Expired OTP",
            value: masterReport.totalExpsms ?? 0,
            color: "#5C6BC0",
            icon: <TimerOffIcon />
        },
        {
            label: "Active OTP",
            value: masterReport.totalActivesms ?? 0,
            color: "#26A69A",
            icon: <AccessTimeIcon />
        }
    ];

    return (
        <Layout>
            <Grid container spacing={2} sx={{ p: 2 }}>
                {/* Statistics Cards - New Design */}
                <Grid item xs={12}>
                    <Box sx={{ 
                        display: "flex", 
                        gap: 2, 
                        flexWrap: "wrap", 
                        justifyContent: "center", 
                        mb: 3 
                    }}>
                        {cards.map((card, index) => (
                            <StatCard 
                                key={index}
                                sx={{ 
                                    backgroundColor: '#f5f5f5', 
                                    borderLeft: `4px solid ${card.color}`,
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    '&:hover': {
                                        backgroundColor: card.color,
                                        boxShadow: `0 8px 25px ${card.color}80`,
                                        transform: 'translateY(-4px)',
                                        '& .MuiTypography-root': {
                                            color: 'white',
                                        },
                                        '& .stat-icon': {
                                            color: 'white',
                                            opacity: 0.8
                                        }
                                    }
                                }}
                            >
                                <CardContent sx={{ 
                                    padding: '16px !important', 
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography 
                                            variant="h4" 
                                            sx={{ 
                                                color: '#000000', 
                                                transition: 'color 0.3s ease', 
                                                fontWeight: 700, 
                                                fontSize: '24px', 
                                                mb: 1,
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {card.value}
                                        </Typography>
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                color: '#000000', 
                                                transition: 'color 0.3s ease', 
                                                fontWeight: 600,
                                                fontSize: '14px',
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {card.label}
                                        </Typography>
                                    </Box>
                                    <Box 
                                        className="stat-icon"
                                        sx={{ 
                                            color: card.color, 
                                            transition: 'color 0.3s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            ml: 2
                                        }}
                                    >
                                        {React.cloneElement(card.icon, { sx: { fontSize: 40 } })}
                                    </Box>
                                </CardContent>
                            </StatCard>
                        ))}
                    </Box>
                </Grid>

                {/* Filter Section */}
                <Grid item xs={12}>
                    <FilterCard>
                        <Box sx={{ p: 3 }}>
                            <Typography 
                                variant="h5" 
                                sx={{ 
                                    mb: 3,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontWeight: 'bold'
                                }}
                            >
                                OTP Report
                            </Typography>

                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 2,
                                flexWrap: 'wrap'
                            }}>
                                <TextField 
                                    id="standard-basic" 
                                    placeholder="Search" 
                                    variant="outlined"
                                    size="small"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon color="action" />,
                                    }}
                                    sx={{ 
                                        width: { xs: '100%', sm: '300px' },
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            backgroundColor: 'rgba(0,0,0,0.02)',
                                        }
                                    }} 
                                />
                            </Box>
                        </Box>
                    </FilterCard>
                </Grid>
            </Grid>

            <OtpTransactions showServiceTrans={showServiceTrans} searchTerm={searchTerm} />
        </Layout>
    );
}

export default withAuth(OtpReport);