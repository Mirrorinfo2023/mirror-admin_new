"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../../utils/api";
import withAuth from "../../utils/withAuth";
import { callAlert } from "../../redux/actions/alert";
import Layout from "@/components/Dashboard/layout";
import GraphicsTransactions from "@/components/Graphics/Graphics_list";
import {
  Grid,
  Button,
  TableContainer,
  Paper,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";

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

  return `${day}-${month}-${year} ${formattedHours}:${minutes} ${amOrPm}`;
};

function GraphicsReport() {
  const [showServiceTrans, setShowServiceTrans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();

  const currentDate = new Date();
  const [fromDate, setFromDate] = useState(
    dayjs(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  );
  const [toDate, setToDate] = useState(dayjs());

  useEffect(() => {
    const getTnx = async () => {
      const reqData = {
        from_date: fromDate.toISOString().split("T")[0],
        to_date: toDate.toISOString().split("T")[0],
      };

      try {
        const response = await api.post(
          "/api/graphics/get-graphics-report",
          reqData
        );

        if (response.status === 200) {
          setShowServiceTrans(response.data.data || []);
        }
      } catch (error) {
        if (error?.response?.data?.error) {
          dispatch(
            callAlert({ message: error.response.data.error, type: "FAILED" })
          );
        } else {
          dispatch(callAlert({ message: error.message, type: "FAILED" }));
        }
      }
    };

    getTnx();
  }, [fromDate, toDate, dispatch]);

  let rows = showServiceTrans || [];
  let filteredRows;

  if (selectedValue !== "") {
    filteredRows = rows.filter((row) =>
      row.sub_type?.toLowerCase().includes(selectedValue.toLowerCase())
    );
  } else {
    filteredRows = rows.filter(
      (row) =>
        row.cat_group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.graphics_name?.includes(searchTerm) ||
        row.category_name?.includes(searchTerm)
    );
  }

  const handleFromDateChange = (date) => setFromDate(date);
  const handleToDateChange = (date) => setToDate(date);
  const handleChange = (event) => setSelectedValue(event.target.value);

  return (
    <Layout>
      <Grid container spacing={4} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 24px rgba(33,150,243,0.08)",
              backgroundColor: "#fff",
            }}
          >
            {/*  Unified Header Row */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                p: 2,
                borderBottom: "1px solid #eee",
              }}
            >
              {/* Title */}
              <Typography
                variant="h5"
                sx={{ whiteSpace: "nowrap", flexShrink: 0, fontWeight: 600 }}
              >
                Marketing
              </Typography>

              {/* Buttons */}
            

              {/* Search + Date Filters */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 2,
                  flex: 1,
                  minWidth: "280px",
                }}
              >
                {/* Search Box */}
                <TextField
                  placeholder="Search"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ color: "action.active", mr: 1 }} />
                    ),
                  }}
                  sx={{
                    // minWidth: "160px",
                    flex: "1",
                  }}
                />

                {/* Date Pickers */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <DatePicker
                      label="From"
                      value={fromDate}
                      format="DD-MM-YYYY"
                      onChange={handleFromDateChange}
                      slotProps={{ textField: { size: "small" } }}
                    />
                    <DatePicker
                      label="To"
                      value={toDate}
                      format="DD-MM-YYYY"
                      onChange={handleToDateChange}
                      slotProps={{ textField: { size: "small" } }}
                    />
                  </Box>
                </LocalizationProvider>
              </Box>

                <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  href={`/add-new-graphics/`}
                  sx={{
                    background:
                      "#2198f3",
                    borderRadius: "12px",
                    color: "#fff",
                    fontWeight: "bold",
                    boxShadow: "none",
                    textTransform: "none",
                    fontSize: "1rem",
                    px: 3,
                  }}
                >
                  Add New Graphics
                </Button>
                <Button
                  variant="contained"
                  href={`/graphics-category-list/`}
                  sx={{
                    background:
                      "#2198f3",
                    borderRadius: "12px",
                    color: "#fff",
                    fontWeight: "bold",
                    boxShadow: "none",
                    textTransform: "none",
                    fontSize: "1rem",
                    px: 3,
                  }}
                >
                  Category List
                </Button>
              </Box>
            </Box>
          </TableContainer>
        </Grid>
      </Grid>

      {/*  Report Table */}
      <GraphicsTransactions showServiceTrans={filteredRows} />
    </Layout>
  );
}

export default withAuth(GraphicsReport);
