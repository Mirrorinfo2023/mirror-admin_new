"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import OtpTransactions from "@/components/Otp/Otp";
import { Grid,TableContainer, Paper, Typography, Box, TextField } from "@mui/material";
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
  // Determine if it's AM or PM
  const amOrPm = hours >= 12 ? "PM" : "AM";
  // Convert hours to 12-hour format
  const formattedHours = hours % 12 === 0 ? "12" : String(hours % 12);
  const formattedDateTime = `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;
  return formattedDateTime;
};
const StatCard = styled(Paper)(({ bgcolor }) => ({
  background: bgcolor,
  color: "#fff",
  borderRadius: 12,
  padding: "28px 36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minWidth: 280,
  minHeight: 100,
  position: "relative",
  overflow: "hidden",
  marginRight: 24,
}));

const StatContent = styled("div")({
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
});

const StatValue = styled("div")({
  fontSize: 32,
  fontWeight: 700,
  lineHeight: 1.1,
  marginBottom: 4,
});

const StatLabel = styled("div")({
  fontSize: 12,
  fontWeight: 500,
  opacity: 0.85,
  letterSpacing: 1,
  textTransform: "uppercase",
});

const StatIcon = styled("div")({
  position: "absolute",
  right: 24,
  top: "50%",
  transform: "translateY(-50%)",
  opacity: 0.18,
  fontSize: 64,
  zIndex: 1,
});
const FilterRow = styled(Box)(({ theme }) => ({
  background: "#f5faff",
  borderRadius: 12,
  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  gap: 20,
  marginBottom: 10,
  flexWrap: "nowrap",
  justifyContent: "flex-start",
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
            // const reqData = {
            //     from_date: fromDate.toISOString().split('T')[0],
            //     to_date: toDate.toISOString().split('T')[0],
            // }

            try {

                const response = await api.post("/api/report/otp");
                if (response.status === 200) {
                    setShowServiceTrans(response.data.otpResult)
                    setmasterReport(response.data.report)
                }

            } catch (error) {

                // if (error?.response?.data?.error) {
                //     dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }))
                // } else {
                //     dispatch(callAlert({ message: error.message, type: 'FAILED' }))
                // }

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
    return (

        <Layout>
            <Grid
                container
                spacing={4}
                sx={{ padding: 2 }}
            >
                <Grid item={true} justifyContent="center" xs={12}>
                    <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                            justifyContent: "center",
                            mb: 1,
                        }}
                    >
                        <StatCard bgcolor="#FFC107">
                            <StatContent>
                                <StatValue> {masterReport.totalSms ?? 0}</StatValue>
                                <StatLabel> Total OTP</StatLabel>
                            </StatContent>
                            <StatIcon>
                                <MessageIcon sx={{ fontSize: 64, color: "#fff" }} />
                            </StatIcon>
                        </StatCard>
                        <StatCard bgcolor="#5C6BC0">
                            <StatContent>
                                <StatValue>{masterReport.totalExpsms ?? 0}</StatValue>
                                <StatLabel> Expired OTP</StatLabel>
                            </StatContent>
                            <StatIcon>
                                <TimerOffIcon sx={{ fontSize: 64, color: "#fff" }} />
                            </StatIcon>
                        </StatCard>
                        <StatCard bgcolor="#26A69A">
                            <StatContent>
                                <StatValue>{masterReport.totalActivesms ?? 0}</StatValue>
                                <StatLabel> Active OTP</StatLabel>
                            </StatContent>
                            <StatIcon>
                                <AccessTimeIcon sx={{ fontSize: 64, color: "#fff" }} />
                            </StatIcon>
                        </StatCard>
                    </Box>
                </Grid>

                <Grid item={true} xs={12}   >
                    <TableContainer component={Paper} >
                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'right'} mt={1} mb={1} style={{ width: '70%', verticalAlign: 'top' }} >
                            <Typography variant="h5" sx={{ padding: 2 }}>Otp Report</Typography>
                        </Box>
                        <Box display={'inline-block'} justifyContent={'space-between'} alignItems={'center'} mt={3} mb={1} sx={{ width: '25%', verticalAlign: 'top' }}>
                            <TextField id="standard-basic" placeholder="Search" variant="standard" mt={2} style={{ width: '100%' }}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon />
                                    ),
                                }} />
                        </Box>


                    </TableContainer>
                </Grid>

            </Grid>
            <OtpTransactions showServiceTrans={showServiceTrans} searchTerm={searchTerm} />
        </Layout>


    );
}
export default withAuth(OtpReport);

