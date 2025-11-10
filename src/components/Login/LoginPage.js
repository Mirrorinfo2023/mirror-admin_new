import { Box, Divider, Typography, Paper, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import UserName from "./UserName";;
import style from "./Login.module.css";
import Image from "next/image";
import ImageSlider from './ImageSlider';
import { styled } from '@mui/material/styles';
import AppLogo from '../../../public/mirror_logo.png'

const LoginPage = () => {
    const [value, setValue] = useState('1');
    const [valueMaster, setValueMaster] = useState('1');
    const [screenHeight, setScreenHeight] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        const updateScreenHeight = () => {
            setScreenHeight(window.innerHeight);
        };
        window.addEventListener('resize', updateScreenHeight);
        updateScreenHeight();
        return () => {
            window.removeEventListener('resize', updateScreenHeight);
        };
    }, []);

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: screenHeight - 40
    }));

    return (
        <>
            <div className={style.loginBg}></div>
            <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #f5f7fa 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', py: { md: 4 } }}>
                <Grid container sx={{
                    minHeight: { xs: 'auto', md: '80vh' },
                    maxWidth: 950,
                    margin: '0 auto',
                    borderRadius: { md: 4 },
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
                    overflow: 'hidden',
                    background: '#fff',
                }}>
                    <Grid item xs={12} md={6} sx={{
                        display: { xs: 'none', md: 'block' },
                        position: 'relative',
                        minHeight: { md: '80vh' },
                        background: 'linear-gradient(135deg, #1976d2 0%, #00c6a7 100%)',
                        borderTopLeftRadius: 4,
                        borderBottomLeftRadius: 4,
                        overflow: 'hidden',
                    }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, background: 'rgba(25, 118, 210, 0.25)' }} />
                        <Box sx={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}>
                            <ImageSlider />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{
                        minHeight: { xs: '100vh', md: '70vh' },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: { xs: 'linear-gradient(135deg, #e3f0ff 0%, #f5f7fa 100%)', md: '#fff' },
                        borderTopRightRadius: { md: 4 },
                        borderBottomRightRadius: { md: 4 },
                        p: { xs: 2, md: 6 },
                    }}>
                        <Box sx={{
                            width: '100%',
                            maxWidth: 400,
                            mx: 'auto',
                            background: '#fff',
                            borderRadius: 4,
                            boxShadow: { xs: 2, md: 'none' },
                            p: { xs: 3, md: 0 },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                        }}>
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 1 }}>
                                <Image
                                    src={AppLogo}
                                    style={{ maxWidth: '160px', height: 'auto', margin: '0 auto', display: 'block' }}
                                    alt="Logo"
                                />
                            </Box>
                            <Divider sx={{ width: '100%', mb: 2 }} />
                            <Box sx={{ width: '100%' }}>
                                <TabContext value={valueMaster}>
                                    <TabPanel value="1" sx={{ p: 0, mb: 2 }}>
                                        <Typography marginBottom={1} variant="h6" textAlign={'left'} fontWeight={700} color="#1976d2"><b>PayDils <span style={{ color: '#00c6a7' }}>Admin</span></b></Typography>
                                        <Typography marginBottom={2} variant="body1" textAlign={'left'} fontWeight={600} color="#222">Welcome!<br /><span style={{ fontWeight: 400, color: '#555' }}>Enter your username and password.</span></Typography>
                                    </TabPanel>
                                </TabContext>
                                <TabContext value={valueMaster}>
                                    <TabPanel value="1" sx={{ p: 0 }}>
                                        <UserName handleChange={handleChange} />
                                    </TabPanel>
                                </TabContext>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
export default LoginPage;