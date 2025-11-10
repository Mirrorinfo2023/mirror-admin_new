import { Box, Typography } from "@mui/material";

// components/Footer.js
const Footer = () => {
  return (
    <Box bgcolor={'#343434'}>
      <Box textAlign={'center'} p={3}>
        <Typography color={'#fff'} variant="h5">Himachal Pradesh SSO</Typography>
        <br />
        <Typography color={'#fff'} variant="body">&copy; {new Date().getFullYear()} All rights reserved.</Typography>
      </Box>
    </Box>
  );
};

export default Footer;
