import { Box, Container, Divider, Typography, Paper, Tab, Grid, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import UserName from "./UserName";
import Link from "next/link";
import style from "./Login.module.css";
import classNames from "classnames";
import { Login, RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import Image from "next/image";
import { Carousel } from 'react-responsive-carousel';
import ResetPassword from "./ResetPassword";




const ForgotPassword = () => {

    const [value, setValue] = useState('1');
    const [valueMaster, setValueMaster] = useState('1');


    const handleChange = (event, newValue) => {

        setValue(newValue);

    };


    const handleChangeMaster = (event, newValue) => {

        setValueMaster(newValue);

    };

    const isXsScreen = useMediaQuery('(max-width:600px)');


    return (
        <>

            <Box className={style.fullbg}></Box>
            <Container maxWidth="md" sx={{ marginTop: 6, marginBottom: 6, position: 'relative' }} >

                <Box className={style.backdrop} />
                <Paper elevation={1} >
                    <Grid container spacing={0}>
                        {/* sx={{ backgroundImage: 'url(/himachal-sso.jpg)' }} */}


                        <Grid item xs={12} md={6}>
                            <Box style={{ padding: '12px' }}>
                                <Typography marginBottom={3} marginTop={2} variant="h5" textAlign={'center'}>Change or reset your password</Typography>
                                <Divider />

                                <TabContext value={value}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                                            <Tab sx={{ fontSize: '12px' }} label="Reset" value="1" />
                                        </TabList>
                                    </Box>

                                    <TabPanel value="1">
                                        <ResetPassword handleChange={handleChange} />
                                    </TabPanel>

                                    
                                    <Link href="/login">
                                        <Typography textAlign={'center'} variant="body2" color={'primary'}>Sign in to Himachal Pradesh SSO</Typography>
                                    </Link>



                                </TabContext>


                            </Box>

                        </Grid>
                    </Grid>

                </Paper>

            </Container >

        </>

    )
}
export default ForgotPassword;