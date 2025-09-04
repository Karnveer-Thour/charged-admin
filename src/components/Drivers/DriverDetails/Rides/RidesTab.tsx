import { Box, Chip, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { TabPanelProps } from "../DriverDetailsDialog";

interface RidesTabProps {
    tabValue: number;
    TabPanel: (props: TabPanelProps) => JSX.Element;
    loadingDriverDetails: boolean;
    driverRides: {
        id: string;
        created_at: string;
        status: string;
        rider_id: string;
        base_fare: number;
    }[];
    }

const RidesTab = ({TabPanel,tabValue,loadingDriverDetails,driverRides}:RidesTabProps) => {
  return (
    <TabPanel value={tabValue} index={2}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Recent Rides
            </Typography>
            {loadingDriverDetails ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 3,
                  mb: 2,
                }}
              >
                <CircularProgress size={24} />
              </Box>
            ) : driverRides.length > 0 ? (
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Rider</TableCell>
                      <TableCell align="right">Fare</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {driverRides.map((ride) => (
                      <TableRow key={ride.id} hover>
                        <TableCell>
                          {new Date(ride.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ride.status}
                            size="small"
                            color={
                              ride.status === "completed"
                                ? "success"
                                : ride.status === "canceled"
                                  ? "error"
                                  : ride.status === "accepted"
                                    ? "primary"
                                    : "default"
                            }
                            sx={{ textTransform: "capitalize" }}
                          />
                        </TableCell>
                        <TableCell>{ride.rider_id}</TableCell>
                        <TableCell align="right">${ride.base_fare}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ py: 2, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No rides found for this driver
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{ p: 1, textAlign: "center" }}
                >
                  <Typography variant="h6">{driverRides.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Rides
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{ p: 1, textAlign: "center" }}
                >
                  <Typography variant="h6">
                    {driverRides.filter((r) => r.status === "completed").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{ p: 1, textAlign: "center" }}
                >
                  <Typography variant="h6">
                    {driverRides.filter((r) => r.status === "canceled").length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cancelled
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default RidesTab;
