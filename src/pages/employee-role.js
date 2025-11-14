"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import Transactions from "@/components/Employee/role";
import {
  Grid,
  Paper,
  TableContainer,
  Button,
  Typography,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

function EmployeeRole() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const uid = Cookies.get("uid");

  useEffect(() => {
    const getRoles = async () => {
      try {
        const response = await api.post("/api/employee/get-role-list");
        if (response.status === 200) {
          setShowServiceTrans(response.data.data);
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

    if (uid) getRoles();
  }, [uid, dispatch]);

  const filteredRows = showServiceTrans.filter((row) =>
    row.role_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: "0px 3px 8px rgba(0,0,0,0.1)",
              backgroundColor: "#fafafa",
            }}
          >
            {/* 🔹 Top Row — Title + Search + Button */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              {/* Title */}
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  flex: { xs: "1 1 100%", md: "0 0 auto" },
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Employee Role
              </Typography>

              {/* Search Input */}
              <TextField
                placeholder="Search Role..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "gray" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: { xs: "100%", sm: 250 },
                  flex: { xs: "1 1 100%", md: "0 0 auto" },
                }}
              />

              {/* Add New Button */}
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                href="/add-new-role/"
                sx={{
                  flex: { xs: "1 1 100%", sm: "0 0 auto" },
                  background: "#2198f3",
                  boxShadow: "0 2px 8px 0 rgba(33, 203, 243, 0.15)",
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Add New
              </Button>
            </Box>
          </TableContainer>
        </Grid>


      </Grid>
      <Transactions showServiceTrans={filteredRows} />
    </Layout>
  );
}

export default withAuth(EmployeeRole);
