"use client"
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import Layout from "@/components/Dashboard/layout";
import GraphicsCategoryTransactions from "@/components/Graphics/categoryList";
import { Grid, TableContainer, Paper, Typography, Divider, Box, TextField, Button } from "@mui/material";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchIcon from '@mui/icons-material/Search';


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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    bgcolor: 'background.paper',
    borderRadius: 2,
    // border: '2px solid #000',
    boxShadow: 24, overflow: 'auto'
};

const innerStyle = {
    overflow: 'auto',
    width: 400,
    height: 400,
};

function GraphicsCategoryReport(props) {
    const [showServiceTrans, setShowServiceTrans] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    let rows;

    if (showServiceTrans && showServiceTrans.length > 0) {
        rows = [
            ...showServiceTrans
        ];
    } else {
        rows = [];
    }
    const handleSearch = (text) => {
        setSearchTerm(text);
    };
    const dispatch = useDispatch();
    const currentDate = new Date();
    const [fromDate, setFromDate] = React.useState(dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)));
    const [toDate, setToDate] = React.useState(dayjs(getDate.date));

    useEffect(() => {
        const getTnx = async () => {
            const reqData = {
                from_date: fromDate.toISOString().split('T')[0],
                to_date: toDate.toISOString().split('T')[0],
            }

            try {

                const response = await api.post("/api/graphics/get-category-list", reqData);

                if (response.status === 200) {
                    setShowServiceTrans(response.data.data);
                    // const decryptedObject = DataDecrypt(response.data);
                    // setShowServiceTrans(decryptedObject.data)
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

    }, [fromDate, toDate, dispatch]);

    const handleFromDateChange = (date) => {
        setFromDate(date);
    };

    const handleToDateChange = (date) => {
        setToDate(date);
    };

    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = (event) => {

        setSelectedValue(event.target.value);
    };
    let filteredRows;

    if (selectedValue != '') {
        filteredRows = rows.filter(row => {
            return (
                (row.sub_type && row.sub_type.toLowerCase().includes(selectedValue.toLowerCase()))
            );
        });
    } else {
        filteredRows = rows.filter(row => {
            return (
                (row.category && row.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (row.category_name && row.category_name.toLowerCase().includes(searchTerm.toLowerCase()))

                // Add conditions for other relevant columns
            );
        });
    }

    return (
        <Layout>
            <Grid container spacing={4} sx={{ padding: 2 }}>
                <Grid item xs={12}>
                    <TableContainer
                        component={Paper}
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            boxShadow: "0 4px 24px rgba(33,150,243,0.08)",
                            overflowX: "auto", // ✅ allows horizontal scroll
                            whiteSpace: "nowrap", // ✅ keeps in one line
                        }}
                    >
                        <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                            justifyContent="space-between"
                            gap={2}
                            sx={{
                                flexWrap: "nowrap", // ✅ no wrapping at all
                                minWidth: "fit-content", // ✅ dynamic width (only what’s needed)
                            }}
                        >
                            {/* --- TITLE --- */}
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    flexShrink: 0,
                                }}
                            >
                                Graphics Category List
                            </Typography>

                            {/* --- SEARCH FIELD --- */}
                            <Box sx={{ flexShrink: 0 }}>
                                <TextField
                                    size="small"
                                    variant="outlined"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <SearchIcon sx={{ color: "action.active", mr: 1 }} />,
                                    }}
                                    sx={{
                                        width: { xs: 140, sm: 200, md: 240 }, // ✅ responsive width
                                    }}
                                />
                            </Box>

                            {/* --- DATE PICKERS --- */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Box display="flex" alignItems="center" gap={1} flexShrink={0}>
                                    <DatePicker
                                        label="From"
                                        value={fromDate}
                                        format="DD-MM-YYYY"
                                        slotProps={{
                                            textField: {
                                                size: "small",
                                                sx: { width: { xs: 120, sm: 140, md: 160 } },
                                            },
                                        }}
                                        onChange={handleFromDateChange}
                                    />
                                    <DatePicker
                                        label="To"
                                        value={toDate}
                                        format="DD-MM-YYYY"
                                        slotProps={{
                                            textField: {
                                                size: "small",
                                                sx: { width: { xs: 120, sm: 140, md: 160 } },
                                            },
                                        }}
                                        onChange={handleToDateChange}
                                    />
                                </Box>
                            </LocalizationProvider>

                            {/* --- ADD NEW CATEGORY BUTTON --- */}
                            <Button
                                variant="contained"
                                color="primary"
                                href="/add-new-graphics-category/"
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    fontSize: 16,
                                    px: 3,
                                    py: 1,
                                    background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 100%)',
                                    boxShadow: '0 2px 8px 0 rgba(33, 203, 243, 0.15)',
                                    textTransform: 'none',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Add New Category
                            </Button>
                        </Box>
                    </TableContainer>

                </Grid>
            </Grid>

            <GraphicsCategoryTransactions showServiceTrans={filteredRows} />
        </Layout>
    );

}
export default withAuth(GraphicsCategoryReport);

