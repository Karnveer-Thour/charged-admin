import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Chip,
  Button,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
  DirectionsCar as RideIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Delete,
} from "@mui/icons-material";
import { mockApi } from "../services/mockApi";
import { Rider, Ride } from "../types";
import { formatDate, formatRelativeTime } from "../utils/formatters";
import { useAuth } from "../contexts/AuthContext";
import Multiselect from "../utils/Multiselect";

const Riders: React.FC = () => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [filteredRiders, setFilteredRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [riderRides, setRiderRides] = useState<Ride[]>([]);
  const [rideDialogOpen, setRideDialogOpen] = useState(false);
  const [rideDialogLoading, setRideDialogLoading] = useState(false);
  const { getRiders } = useAuth();

  // Load riders on component mount
  useEffect(() => {
    fetchRiders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter riders when search query changes
  useEffect(() => {
    if (riders.length) {
      const filtered = riders.filter(
        (rider) =>
          rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rider.phone.includes(searchQuery),
      );
      setFilteredRiders(filtered);
      setPage(0); // Reset to first page when filtering
    }
  }, [searchQuery, riders]);

  const fetchRiders = async () => {
    setLoading(true);
    try {
      const data = await getRiders();
      setRiders(data);
      setFilteredRiders(data);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewRiderRides = async (rider: Rider) => {
    setSelectedRider(rider);
    setRideDialogOpen(true);
    setRideDialogLoading(true);

    try {
      const rides = await mockApi.getRiderRides(rider.uuid);
      setRiderRides(rides);
    } catch (err) {
      console.error("Error fetching rider rides:", err);
    } finally {
      setRideDialogLoading(false);
    }
  };

  const handleCloseRideDialog = () => {
    setRideDialogOpen(false);
    setSelectedRider(null);
    setRiderRides([]);
  };

  const getRideStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "info";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchRiders}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4">Riders</Typography>

        <TextField
          placeholder="Search riders..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rider</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell align="center">Reward Points</TableCell>
                <TableCell align="center">Rides</TableCell>
                <TableCell align="center">Joined</TableCell>
                <TableCell align="center">Last Ride</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRiders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((rider) => (
                  <TableRow key={rider.uuid} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={rider.photo}
                          alt={rider.name}
                          sx={{ mr: 2, width: 40, height: 40 }}
                        />
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {rider.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {rider.uuid}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{rider.email}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {rider.phone}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={<StarIcon fontSize="small" />}
                        label={rider.rewardPoints}
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">{rider.totalRides}</TableCell>
                    <TableCell align="center">
                      {formatDate(rider.created_at)}
                    </TableCell>
                    <TableCell align="center">
                      {rider.lastRideDate
                        ? formatRelativeTime(rider.lastRideDate)
                        : "Never"}
                    </TableCell>
                    <TableCell align="center">
                      <Box>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleViewRiderRides(rider)}
                          title="View rides"
                        >
                          <ViewIcon />
                        </IconButton>
                        <Multiselect
                          Heading={
                            <IconButton
                              color="secondary"
                              size="small"
                              title="Edit rider"
                            >
                              <EditIcon />
                            </IconButton>
                          }
                        >
                          <div style={{ width: "130px", height: "35px" }}>
                            <button
                              style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-around",
                                background: "black",
                                color: "white",
                                fontSize: "1.2rem",
                              }}
                              onClick={undefined}
                            >
                              Delete
                            </button>
                          </div>
                          <div style={{ width: "130px", height: "35px" }}>
                            <button
                              style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-around",
                                background: "black",
                                color: "white",
                                fontSize: "1.2rem",
                              }}
                              onClick={undefined}
                            >
                              Active
                            </button>
                          </div>
                        </Multiselect>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

              {filteredRiders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No riders found matching your search.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRiders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Rider Rides Dialog */}
      <Dialog
        open={rideDialogOpen}
        onClose={handleCloseRideDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <RideIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                {selectedRider?.name}'s Rides
              </Typography>
            </Box>
            <IconButton onClick={handleCloseRideDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {rideDialogLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: "center" }} elevation={2}>
                    <Typography variant="h4" color="primary">
                      {selectedRider?.totalRides || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Rides
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: "center" }} elevation={2}>
                    <Typography variant="h4" color="primary">
                      {selectedRider?.rewardPoints || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Reward Points
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: "center" }} elevation={2}>
                    <Typography variant="h4" color="primary">
                      {
                        riderRides.filter((r) => r.status === "completed")
                          .length
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed Rides
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: "center" }} elevation={2}>
                    <Typography variant="h4" color="primary">
                      {
                        riderRides.filter((r) => r.status === "cancelled")
                          .length
                      }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cancelled Rides
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Recent Rides
              </Typography>

              {riderRides.length === 0 ? (
                <Typography
                  align="center"
                  color="text.secondary"
                  sx={{ py: 4 }}
                >
                  No rides found for this rider.
                </Typography>
              ) : (
                <TableContainer
                  component={Paper}
                  elevation={0}
                  variant="outlined"
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>From</TableCell>
                        <TableCell>To</TableCell>
                        <TableCell align="right">Fare</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Points</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {riderRides.map((ride) => (
                        <TableRow key={ride.id} hover>
                          <TableCell>{formatDate(ride.createdAt)}</TableCell>
                          <TableCell sx={{ textTransform: "capitalize" }}>
                            {ride.rideType}
                          </TableCell>
                          <TableCell>
                            {ride.pickupLocation.address.split(",")[0]}
                          </TableCell>
                          <TableCell>
                            {ride.dropoffLocation.address.split(",")[0]}
                          </TableCell>
                          <TableCell align="right">
                            ${ride.fare.toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={ride.status}
                              size="small"
                              color={getRideStatusColor(ride.status)}
                              sx={{ textTransform: "capitalize" }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {ride.pointsAwarded > 0 ? (
                              <Chip
                                icon={<StarIcon fontSize="small" />}
                                label={ride.pointsAwarded}
                                size="small"
                                variant="outlined"
                              />
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                -
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRideDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Riders;
