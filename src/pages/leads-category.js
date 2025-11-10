"use client"
import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import dynamic from "next/dynamic";
const Transactions = dynamic(() => import("@/components/leads/category"), { 
  ssr: false,
  loading: () => <div>Loading categories...</div>
});
import { Grid, Paper, TableContainer, Button, Typography, Box, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { DataEncrypt, DataDecrypt } from '../../utils/encryption';

const getDate = () => {
  const dateObject = new Date();
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  
  return `${year}-${month}-${day}`;
};

function TransactionHistory(props) {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const uid = Cookies.get('uid');

  let rows = showServiceTrans && showServiceTrans.length > 0 ? [...showServiceTrans] : [];

  useEffect(() => {
    const all_parameters = {
      "category_name1": null
    };
    
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
  }, [uid, dispatch]);

  const filteredRows = rows.filter(row => {
    return (
      row.category_name && 
      row.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Layout>
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <TableContainer 
            component={Paper}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: 2,
                flexWrap: { xs: 'wrap', md: 'nowrap' },
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: '#fafafa'
              }}
            >
              {/* Title on the left */}
              <Typography variant="h5" sx={{ flexShrink: 0, marginRight: 2, fontWeight: 600 }}>
                Lead Categories
              </Typography>

              {/* Search and Button on the right */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                flexGrow: 1, 
                justifyContent: 'flex-end',
                flexWrap: { xs: 'wrap', sm: 'nowrap' }
              }}>
                {/* Search Field */}
                <TextField 
                  id="standard-basic" 
                  placeholder="Search" 
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon color="action" />,
                  }}
                  sx={{ 
                    minWidth: 200,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    }
                  }}
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
                    py: 1,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px 0 rgba(33,203,243,0.15)',
                    textTransform: 'uppercase',
                    letterSpacing: 0,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    border: '1px solid #1976d2',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #21cbf3 0%, #1976d2 100%)',
                      boxShadow: '0 4px 12px 0 rgba(33,203,243,0.3)',
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

      <Transactions showServiceTrans={filteredRows} />
    </Layout>
  );
}

export default withAuth(TransactionHistory);