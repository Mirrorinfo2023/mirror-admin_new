import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography } from '@mui/material';
import { Box, Button, Divider, TextField, Container} from '@mui/material';
import { useDispatch } from 'react-redux';
import { callAlert } from "../../../redux/actions/alert";
import withAuth from "../../../utils/withAuth";
import api from "../../../utils/api"; // Ensure this import is correct
import Dashboardchart1 from "@/components/DashboardCharts/chart1";
import Dashboardchart2 from "@/components/DashboardCharts/chart2";
import Dashboardchartmain from "@/components/DashboardCharts/mainchart";
import Dashboardchartrow from "@/components/DashboardCharts/rowA";

function TransactionHistory(props) {
  const dispatch = useDispatch();

  // State for recharge data
  const [totalRCount, setTotalRecharge] = useState(0.00);
  const [todaysuccesscount, setSuccessRecharge] = useState(0.00);
  const [todayfailurecount, setFailedRecharge] = useState(0.00);
  const [todayholdcount, settodayholdcount] = useState(0.00);

  // State for bill payment data
  const [totalBillPaymentCount, settotalBillPaymentCount] = useState(0.00);
  const [todaysBillSuccess, settodaysBillSuccess] = useState(0.00);
  const [todaysBillFail, settodaysBillFail] = useState(0.00);
  const [todaysBillHold, settodaysBillHold] = useState(0.00);



  const [totalPrimeUser, settotalPrimeUser] = useState(0.00);
  const [todayTotalPrime, settodayTotalPrime] = useState(0.00);
  const [totalUser, settotalUser] = useState(0.00);
  const [totalTodayJoindUser, settotalTodayJoindUser] = useState(0.00);
  const [totalBlockUser, settotalBlockUser] = useState(0.00);
  const [todayBlockUser, settodayBlockUser] = useState(0.00);
  const [totalSendMoney, settotalSendMoney] = useState(0.00);
  const [todaySendMoney, settodaySendMoney] = useState(0.00);
  const [totalAddMoney, settotalAddMoney] = useState(0.00);
  const [todayAddMoney, settodayAddMoney] = useState(0.00);
  const [last15daysSendMoney, setlast15daysSendMoney] = useState(0.00);
  const [last15daysAddMoney, setlast15daysAddMoney] = useState(0.00);


  useEffect(() => {
    // const getRechargeData = async () => {
    //   try {
    //     const response = await api.post('/api/users/admin-recharge');
    //     console.log('Recharge API Response:', response); // Log the full response
    //     if (response.status === 200) {
    //       const decryptedObject = response.data.data;
    
    //       setTotalRecharge(decryptedObject.totalRCount);
    //       setSuccessRecharge(decryptedObject.todaysuccesscount);
    //       setFailedRecharge(decryptedObject.todayfailurecount);
    //       settodayholdcount(decryptedObject.todayholdcount);
    //     } else {
    //       console.error('Unexpected response status:', response.status);
    //     }
    //   } catch (error) {
    //     const errorMessage = error?.response?.data?.error || error.message;
    //     console.error('API Error:', errorMessage); // Log the error
    //     dispatch(callAlert({ message: errorMessage, type: 'FAILED' }));
    //   }
    // };

    
    // const getBillPaymentData = async () => {
    //   try {
    //     const response = await api.post('/api/users/admin-bbps');
    //     if (response.status === 200) {
    //       const decryptedObject = response.data.data;

    //       settotalBillPaymentCount(decryptedObject.totalBillPaymentCount);
    //       settodaysBillSuccess(decryptedObject.todaysBillSuccess);
    //       settodaysBillFail(decryptedObject.todaysBillFail);
    //       settodaysBillHold(decryptedObject.todaysBillHold);
    //     }
    //   } catch (error) {
    //     const errorMessage = error?.response?.data?.error || error.message;
    //     dispatch(callAlert({ message: errorMessage, type: 'FAILED' }));
    //   }
    // };


    // const getUserData = async () => {
    //   try {
    //     const response = await api.post('/api/users/admin-prime');
    //     if (response.status === 200) {
    //       const decryptedObject = response.data.data;

    //       settotalPrimeUser(decryptedObject.totalPrimeUser);
    //       settodayTotalPrime(decryptedObject.todayTotalPrime);
    //       settotalUser(decryptedObject.totalUser);
    //       settotalTodayJoindUser(decryptedObject.totalTodayJoindUser);
    //       settotalBlockUser(decryptedObject.totalBlockUser);
    //       settodayBlockUser(decryptedObject.todayBlockUser);
    //       settotalSendMoney(decryptedObject.totalSendMoney);
    //       settodaySendMoney(decryptedObject.todaySendMoney);
    //       settotalAddMoney(decryptedObject.totalAddMoney);
    //       settodayAddMoney(decryptedObject.todayAddMoney);
    //       setlast15daysSendMoney(decryptedObject.last15daysSendMoney);
    //       setlast15daysAddMoney(decryptedObject.last15daysAddMoney);
       

    //     }
    //   } catch (error) {
    //     const errorMessage = error?.response?.data?.error || error.message;
    //     dispatch(callAlert({ message: errorMessage, type: 'FAILED' }));
    //   }
    // };



    const getDashboardData = async () => {
      try {
        const response = await api.post('/api/users/getDashboard_API');
        console.log('Recharge API Response:', response); // Log the full response
        if (response.status === 200) {
          const decryptedObject = response.data.data;
    
          setTotalRecharge(decryptedObject.totalRCount);
          setSuccessRecharge(decryptedObject.todaysuccesscount);
          setFailedRecharge(decryptedObject.todayfailurecount);
          settodayholdcount(decryptedObject.todayholdcount);

          settotalBillPaymentCount(decryptedObject.totalBillPaymentCount);
          settodaysBillSuccess(decryptedObject.todaysBillSuccess);
          settodaysBillFail(decryptedObject.todaysBillFail);
          settodaysBillHold(decryptedObject.todaysBillHold);

          settotalPrimeUser(decryptedObject.totalPrimeUser);
          settodayTotalPrime(decryptedObject.todayTotalPrime);
          settotalUser(decryptedObject.totalUser);
          settotalTodayJoindUser(decryptedObject.totalTodayJoindUser);
          settotalBlockUser(decryptedObject.totalBlockUser);
          settodayBlockUser(decryptedObject.todayBlockUser);
          settotalSendMoney(decryptedObject.totalSendMoney);
          settodaySendMoney(decryptedObject.todaySendMoney);
          settotalAddMoney(decryptedObject.totalAddMoney);
          settodayAddMoney(decryptedObject.todayAddMoney);
          setlast15daysSendMoney(decryptedObject.last15daysSendMoney);
          setlast15daysAddMoney(decryptedObject.last15daysAddMoney);
        } else {
          console.error('Unexpected response status:', response.status);
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.error || error.message;
        console.error('API Error:', errorMessage); // Log the error
        dispatch(callAlert({ message: errorMessage, type: 'FAILED' }));
      }
    };

    // getRechargeData();
    // getBillPaymentData();
    // getUserData();

    getDashboardData();

  }, [dispatch]);

  return (
    <Grid
    container
    spacing={4}
    sx={{ padding: '0px 16px' }}
>
    <Grid item={true} xs={12}   >
     <br/><br/>
                   
     
        <Grid item={true} xs={12} >
            <Grid
                container
                spacing={4}
                sx={{ padding: 2 }}
            >



        <Grid item xs={12} md={3} lg={3}>
 
             
                <Paper sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 150,
                  background: 'linear-gradient(135deg, #E0FFFF, #B0E0E6, #ADD8E6)',
                }}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Total recharge
                  </Typography>
                  <Typography component="p" variant="h5">
                    ₹ {totalRCount}
                  </Typography>
                  <Typography color="text.secondary" sx={{ flex: 1 }}>
                    from {totalRCount} transactions
                  </Typography>
                </Paper>
             
            </Grid>

            <Grid item xs={12} md={3} lg={3}>
              
                <Paper sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 150,
                  background: 'linear-gradient(135deg, #E0FFFF, #B0E0E6, #ADD8E6)',
                }}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Todays success
                  </Typography>
                  <Typography component="p" variant="h5">
                    ₹ {todaysuccesscount}
                  </Typography>
                  <Typography color="text.secondary" sx={{ flex: 1 }}>
                    from {todaysuccesscount} transactions
                  </Typography>
                </Paper>
              
            </Grid>

            <Grid item xs={12} md={3} lg={3}>
           
                <Paper sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 150,
                  background: 'linear-gradient(135deg, #E0FFFF, #B0E0E6, #ADD8E6)',
                }}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Todays failed
                  </Typography>
                  <Typography component="p" variant="h5">
                    ₹ {todayfailurecount}
                  </Typography>
                  <Typography color="text.secondary" sx={{ flex: 1 }}>
                    from {} transactions
                  </Typography>
                </Paper>
              
            </Grid>

            <Grid item xs={12} md={3} lg={3}>
             
                <Paper sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 150,
                  background: 'linear-gradient(135deg, #E0FFFF, #B0E0E6, #ADD8E6)',
                }}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Todays hold
                  </Typography>
                  <Typography component="p" variant="h5">
                    ₹ {todayholdcount}
                  </Typography>
                  <Typography color="text.secondary" sx={{ flex: 1 }}>
                    from {} transactions
                  </Typography>
                </Paper>
              
            </Grid>

            {/* Bill Payment Data */}
            <Grid item xs={12} md={3} lg={3}>
             
                <Paper sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 150,
                  background: 'linear-gradient(135deg, #FF9248, #FFB347, #FFD8A4)',
                }}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Total BBPS bill
                  </Typography>
                  <Typography component="p" variant="h5">
                    ₹ {totalBillPaymentCount}
                  </Typography>
                  <Typography color="text.secondary" sx={{ flex: 1 }}>
                    from {} transactions
                  </Typography>
                </Paper>
              
            </Grid>

            <Grid item xs={12} md={3} lg={3}>
             
                <Paper sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 150,
                  background: 'linear-gradient(135deg, #FF9248, #FFB347, #FFD8A4)',
                }}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Todays bill success
                  </Typography>
                  <Typography component="p" variant="h5">
                    ₹ {todaysBillSuccess}
                  </Typography>
                  <Typography color="text.secondary" sx={{ flex: 1 }}>
                    from {todaysBillSuccess} transactions
                  </Typography>
                </Paper>
              
            </Grid>

            <Grid item xs={12} md={3} lg={3}>
             
                <Paper sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 150,
                  background: 'linear-gradient(135deg, #FF9248, #FFB347, #FFD8A4)',
                }}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Todays bill failed
                  </Typography>
                  <Typography component="p" variant="h5">
                    ₹ {todaysBillFail}
                  </Typography>
                  <Typography color="text.secondary" sx={{ flex: 1 }}>
                    from {todaysBillFail} transactions
                  </Typography>
                </Paper>
              
            </Grid>

            <Grid item xs={12} md={3} lg={3}>
              
                <Paper sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 150,
                  background: 'linear-gradient(135deg, #FF9248, #FFB347, #FFD8A4)',
                }}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Todays bill hold
                  </Typography>
                  <Typography component="p" variant="h5">
                    ₹ {todaysBillHold}
                  </Typography>
                  <Typography color="text.secondary" sx={{ flex: 1 }}>
                    from {todaysBillHold} transactions
                  </Typography>
                </Paper>
              
            </Grid>
       <Dashboardchart1 /> 

      <Grid item xs={12} md={3} lg={3}>
     
        <Paper sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 150,
          background: 'linear-gradient(135deg, #E0FFFF, #B0E0E6, #ADD8E6)',
        }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom >
          Total send money
          </Typography>
          <Typography component="p" variant="h5">
            ₹ {totalSendMoney} 
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from {totalSendMoney} transactions
          </Typography>
        </Paper>
        
      </Grid>

      <Grid item xs={12} md={3} lg={3}>
     
        <Paper sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 150,
          background: 'linear-gradient(135deg, #E0FFFF, #B0E0E6, #ADD8E6)',
        }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Todays Send money
          </Typography>
          <Typography component="p" variant="h5">
            ₹ {todaySendMoney} 0.00
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from {todaySendMoney} transactions
          </Typography>
        </Paper>
        
      </Grid>

      <Grid item xs={12} md={3} lg={3}>
    
        <Paper sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 150,
          background: 'linear-gradient(135deg, #E0FFFF, #B0E0E6, #ADD8E6)',
        }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Total add money
          </Typography>
          <Typography component="p" variant="h5">
            ₹ {totalAddMoney}
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from {} transactions
          </Typography>
        </Paper>
        
      </Grid>

      <Grid item xs={12} md={3} lg={3}>
     
        <Paper sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 150,
          background: 'linear-gradient(135deg, #E0FFFF, #B0E0E6, #ADD8E6)',
        }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Todays add money
          </Typography>
          <Typography component="p" variant="h5">
            ₹ {todayAddMoney}0.00
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from {} transactions
          </Typography>
        </Paper>
        
      </Grid>


      <Grid item xs={12} md={3} lg={3}>
     
        <Paper sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 150,
          background: 'linear-gradient(135deg, #FF9248, #FFB347, #FFD8A4)',
        }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom >
          Todays manual ad money
          </Typography>
          <Typography component="p" variant="h5">
            ₹ {} 0.00
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from {} transactions
          </Typography>
        </Paper>
        
      </Grid>

      <Grid item xs={12} md={3} lg={3}>
     
        <Paper sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 150,
          background: 'linear-gradient(135deg, #FF9248, #FFB347, #FFD8A4)',
        }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Total fund transfer
          </Typography>
          <Typography component="p" variant="h5">
            ₹ {todaysuccesscount} 0.00
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from {} transactions
          </Typography>
        </Paper>
      
      </Grid>

      <Grid item xs={12} md={3} lg={3}>
     
        <Paper sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 150,
          background: 'linear-gradient(135deg, #FF9248, #FFB347, #FFD8A4)',
        }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Todays transfer
          </Typography>
          <Typography component="p" variant="h5">
            ₹ {todayfailurecount}0.00
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from {} transactions
          </Typography>
        </Paper>
        
      </Grid>

      


  
      <Grid item xs={12} md={3} lg={3}>
     
        <Paper sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 150,
          background: 'linear-gradient(135deg, #FF9248, #FFB347, #FFD8A4)',
        }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom >
            Total Prime
          </Typography>
          <Typography component="p" variant="h5">
            ₹ {totalPrimeUser} 0.00
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from {} transactions
          </Typography>
        </Paper>
        
      </Grid>
      <Dashboardchart2 />  
      <Grid item xs={12} md={3} lg={3}>
    
        <Paper sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 150,
          background: 'linear-gradient(135deg, #E0FFFF, #B0E0E6, #ADD8E6)',
        }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Todays Prime
          </Typography>
          <Typography component="p" variant="h5">
            ₹ {todayTotalPrime} 0.00
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from {} transactions
          </Typography>
        </Paper>
        
      </Grid>

      <Grid item xs={12} md={3} lg={3}>
     
        <Paper sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 150,
          background: 'linear-gradient(135deg, #E0FFFF, #B0E0E6, #ADD8E6)',
        }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Total User
          </Typography>
          <Typography component="p" variant="h5">
            ₹ {totalUser}0.00
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from {} transactions
          </Typography>
        </Paper>
       
      </Grid>

      <Grid item xs={12} md={3} lg={3}>
     
        <Paper sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 150,
          background: 'linear-gradient(135deg, #E0FFFF, #B0E0E6, #ADD8E6)',
        }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Todays Join User
          </Typography>
          <Typography component="p" variant="h5">
            ₹ {totalTodayJoindUser}0.00
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from {} transactions
          </Typography>
        </Paper>
        
      </Grid>

      {/* <Grid item xs={12} md={3} lg={3}>
      
        <Paper sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 150,
          background: 'linear-gradient(135deg, #E0FFFF, #B0E0E6, #ADD8E6)',
        }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Total Prime User
          </Typography>
          <Typography component="p" variant="h5">
            ₹ {} 0.00
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from {} transactions
          </Typography>
        </Paper>
        
      </Grid> */}

      <Grid item xs={12} md={3} lg={3}>
     
        <Paper sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 150,
          background: 'linear-gradient(135deg, #FF9248, #FFB347, #FFD8A4)',
        }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Todays Prime User
          </Typography>
          <Typography component="p" variant="h5">
            ₹ {todaysuccesscount}0.00
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from {} transactions
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3} lg={3}>
     
        <Paper sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 150,
          background: 'linear-gradient(135deg, #FF9248, #FFB347, #FFD8A4)',
        }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Total Block User
          </Typography>
          <Typography component="p" variant="h5">
            ₹ {totalBlockUser}0.00
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from {} transactions
          </Typography>
        </Paper>
        
      </Grid>

      <Grid item xs={12} md={3} lg={3}>
     
        <Paper sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 150,
          background: 'linear-gradient(135deg, #FF9248, #FFB347, #FFD8A4)',
        }}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Todays Block User
          </Typography>
          <Typography component="p" variant="h5">
            ₹ {todayBlockUser}0.00
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            from {} transactions
          </Typography>
        </Paper>
        
      </Grid>

     

    </Grid>
    </Grid>

    </Grid>
    </Grid>
  );
};



export default withAuth(TransactionHistory);