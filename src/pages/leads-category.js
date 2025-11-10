"use client"
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import dynamic from "next/dynamic";
const Transactions = dynamic(() => import("@/components/leads/category"), { ssr: false });
import { Grid, Paper, TableContainer, Button, Typography, Divider, Box, TextField, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { DataEncrypt, DataDecrypt } from '../../utils/encryption';

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
  boxShadow: 24, overflow: 'auto'
};

const innerStyle = {
  overflow: 'auto',
  width: 400,
  height: 400,
};


function TransactionHistory(props) {

  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const dispatch = useDispatch();
  const uid = Cookies.get('uid');

  let rows;

  if (showServiceTrans && showServiceTrans.length > 0) {
    rows = [
      ...showServiceTrans
    ];
  } else {
    rows = [];
  }
  // const [fromDate, setFromDate] = useState(new Date());
  // const [toDate, setToDate] = useState(new Date());

  const [fromDate, setFromDate] = React.useState(dayjs(getDate.dateObject));
  const [toDate, setToDate] = React.useState(dayjs(getDate.dateObject));

  useEffect(() => {
    const all_parameters = {
      "category_name1": null
    }
    const encryptedData = DataEncrypt(JSON.stringify(all_parameters));
    const getTnx = async () => {
      const reqData = {
        encReq: encryptedData
      };

      try {
        const response = await api.post('/api/leads/get-category', reqData);
        if (response.status === 200) {
          const decryptedObject = DataDecrypt(response.data);
          console.log(decryptedObject);
          setShowServiceTrans(Array.isArray(decryptedObject.data) ? decryptedObject.data : []);
        }
      } catch (error) {
        if (error?.response?.data?.error) {
          dispatch(callAlert({ message: error.response.data.error, type: 'FAILED' }));
        } else {
          dispatch(callAlert({ message: error.message, type: 'FAILED' }));
        }
      }
    };

    if (uid) {
      getTnx();
    }
  }, [uid, fromDate, toDate, dispatch]);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = rows.filter(row => {
    return (
      (row.category_name && row.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
      // Add conditions for other relevant columns
    );
  });
  return (

    <Layout>
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: 2,
                flexWrap: { xs: 'wrap', md: 'nowrap' } // Allow wrapping on small screens
              }}
            >
              {/* Title on the left */}
              <Typography variant="h5" sx={{ flexShrink: 0, marginRight: 2 }}>
                Lead Categories
              </Typography>

              {/* Search and Button on the right */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, justifyContent: 'flex-end' }}>
                {/* Search Field */}
                <TextField 
                  id="standard-basic" 
                  placeholder="Search" 
                  variant="standard" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon />,
                  }}
                  sx={{ minWidth: 200 }}
                />

                {/* Add New Button */}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  href={`/add-new-lead-category/`}
                  sx={{
                    background: 'linear-gradient(90deg, #1976d2 0%, #21cbf3 100%)',
                    color: '#fff',
                    fontWeight: 500,
                    fontSize: 15,
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px 0 rgba(33,203,243,0.15)',
                    textTransform: 'uppercase',
                    letterSpacing: 0,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    '&:hover': {
                      background: 'linear-gradient(90deg, #21cbf3 0%, #1976d2 100%)',
                    },
                  }}
                >
                  Add New
                </Button>
              </Box>
            </Box>
          </TableContainer>
        </Grid>
      </Grid>

      <Transactions showServiceTrans={showServiceTrans} />
    </Layout>
  );
}
export default withAuth(TransactionHistory);