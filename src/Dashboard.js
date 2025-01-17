import React from 'react';
    import { Box, Grid, Paper, Typography } from '@mui/material';

    function Dashboard() {
      return (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h5">Lead Statistics</Typography>
                <ul>
                  <li>Total Leads: 100</li>
                  <li>Converted Leads: 40</li>
                  <li>Pending Leads: 60</li>
                </ul>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h5">Task List</Typography>
                <ul>
                  <li>Complete the report by 5 PM</li>
                  <li>Schedule a meeting with John</li>
                  <li>Follow up on lead 123</li>
                </ul>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      );
    }

    export default Dashboard;
