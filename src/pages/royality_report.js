"use client";
import { useEffect, useState } from 'react';
import Layout from "@/components/Dashboard/layout";
import api from "../../utils/api";
import { 
  Container, Typography, Table, TableBody, TableCell, Grid, 
  TableContainer, TableHead, TableRow, Paper, TextField, 
  Button, TablePagination, Box 
} from '@mui/material';
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';

const RoyalityPage = () => {
  const [royality, setRoyality] = useState([]);
  const [filteredRoyality, setFilteredRoyality] = useState([]);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  useEffect(() => {
    const fetchRoyality = async () => {
      try {
        const response = await api.post("/api/royality/63a14cf5d75879f5bfe50b7246dcc0ff57c91c71");
        setRoyality(response.data.data);
        setFilteredRoyality(response.data.data);
      } catch (error) {
        setError('Failed to fetch royality');
        console.log(error);
      }
    };

    fetchRoyality();
  }, []);

  useEffect(() => {
    let filtered = royality;

    // Date filter
    if (fromDate && toDate) {
      filtered = filtered.filter(royalty => {
        const entryDate = dayjs(royalty.entry_date).format('YYYY-MM-DD');
        return entryDate >= fromDate && entryDate <= toDate;
      });
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(royalty =>
        Object.values(royalty).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    setFilteredRoyality(filtered);
    setPage(0); // Reset to first page when filters change
  }, [fromDate, toDate, searchTerm, royality]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Layout>
      <Box sx={{ p: 1.5, mt: 2 }}>
        {/* Compact Header Section */}
        <TableContainer component={Paper} sx={{ p: 1.5, mb: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flexWrap: 'wrap'
          }}>
            {/* Title */}
            <Typography variant="h6" sx={{ 
              fontWeight: "bold",
              whiteSpace: "nowrap",
              fontSize: '16px',
              minWidth: 'fit-content'
            }}>
              Royality List
            </Typography>

            {/* Search Field */}
            <TextField
              placeholder="Search..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#666', mr: 1, fontSize: 20 }} />,
              }}
              sx={{
                width: "180px",
                '& .MuiOutlinedInput-root': {
                  height: '36px',
                  fontSize: '0.8rem',
                }
              }}
            />

            {/* Date Fields */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                size="small"
                type="date"
                placeholder="From"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                InputProps={{ 
                  inputProps: { max: dayjs().format('YYYY-MM-DD') },
                  sx: { height: '36px', fontSize: '0.8rem' }
                }}
                sx={{ width: 130 }}
              />
              <Typography variant="caption" sx={{ color: 'text.secondary', mx: 0.5 }}>
                to
              </Typography>
              <TextField
                size="small"
                type="date"
                placeholder="To"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                InputProps={{ 
                  inputProps: { max: dayjs().format('YYYY-MM-DD') },
                  sx: { height: '36px', fontSize: '0.8rem' }
                }}
                sx={{ width: 130 }}
              />
            </Box>

            {/* Filter Button */}
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                if (fromDate && toDate) {
                  setFromDate(fromDate);
                  setToDate(toDate);
                }
              }}
              sx={{
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "0.8rem",
                px: 2,
                py: 0.8,
                whiteSpace: "nowrap",
                minWidth: 'fit-content',
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              Filter
            </Button>

            {/* Results Count */}
            <Typography variant="caption" sx={{ 
              color: 'text.secondary', 
              fontWeight: 500,
              ml: 'auto'
            }}>
              {filteredRoyality.length} records
            </Typography>
          </Box>
        </TableContainer>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "gainsboro" }}>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', py: 1 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', py: 1 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', py: 1 }}>Credit/Person</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', py: 1 }}>Details</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', py: 1 }}>Royality</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', py: 1 }}>Credit Users</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', py: 1 }}>Active Users</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem', py: 1 }}>Drop Users</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRoyality
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((royalty, index) => (
                <TableRow key={royalty.id} hover>
                  <TableCell sx={{ py: 1, fontSize: '0.8rem' }}>
                    {index + 1 + page * rowsPerPage}
                  </TableCell>
                  <TableCell sx={{ py: 1, fontSize: '0.8rem' }}>
                    {dayjs(royalty.entry_date).format('DD-MM-YY')}
                  </TableCell>
                  <TableCell sx={{ py: 1, fontSize: '0.8rem' }}>
                    {royalty.credit_per_person}
                  </TableCell>
                  <TableCell sx={{ py: 1, fontSize: '0.8rem' }}>
                    {royalty.details}
                  </TableCell>
                  <TableCell sx={{ py: 1, fontSize: '0.8rem' }}>
                    {royalty.royalty}
                  </TableCell>
                  <TableCell sx={{ py: 1, fontSize: '0.8rem' }}>
                    {royalty.total_credit_user}
                  </TableCell>
                  <TableCell sx={{ py: 1, fontSize: '0.8rem' }}>
                    {royalty.total_active_users}
                  </TableCell>
                  <TableCell sx={{ py: 1, fontSize: '0.8rem' }}>
                    {royalty.total_drop_users}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Compact Pagination */}
        <TablePagination
          rowsPerPageOptions={[20, 50, 100]}
          component="div"
          count={filteredRoyality.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '& .MuiTablePagination-toolbar': {
              minHeight: '52px',
              padding: '0 8px'
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.8rem'
            }
          }}
        />
      </Box>
    </Layout>
  );
};

export default RoyalityPage;