import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Grid,
  Card,
  CardContent,
  TextField,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  MoneyOff as MoneyIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { mockApi } from "../services/mockApi";
import { formatCurrency } from "../utils/formatters";
import { Ride, Rider, Driver, PricingRule } from "../types";
import { useAuth } from "../contexts/AuthContext";

const TestRide: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [ride, setRide] = useState<Ride | null>(null);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [distance, setDistance] = useState(5); // Default 5km
  const [duration, setDuration] = useState(15); // Default 15 minutes
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [selectedRideType, setSelectedRideType] = useState<string>("electric");
  const { getDrivers,getRiders } = useAuth();

  // Calculated fare
  const [fareBreakdown, setFareBreakdown] = useState({
    baseFare: 0,
    distanceFare: 0,
    durationFare: 0,
    totalFare: 0,
    commissionAmount: 0,
    driverEarnings: 0,
    commissionPercentage: 15,
  });

  const steps = [
    "Select Rider & Driver",
    "Configure Ride Details",
    "View Fare Breakdown",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedRiders, fetchedDrivers, fetchedPricingRules] =
          await Promise.all([
            getRiders(),
            getDrivers(),
            mockApi.getPricingRules(),
          ]);

        setRiders(fetchedRiders as any);
        setDrivers(fetchedDrivers.filter((d) => d.is_active));
        setPricingRules(fetchedPricingRules);

        // Select first rider and driver by default
        if (fetchedRiders.length > 0) setSelectedRider(fetchedRiders[0] as any);
        if (fetchedDrivers.length > 0) setSelectedDriver(fetchedDrivers[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate fare whenever distance, duration or ride type changes
  useEffect(() => {
    if (!pricingRules.length) return;

    const rule =
      pricingRules.find((r) => r.rideTypeId === selectedRideType) ||
      pricingRules[0];

    const baseFare = rule.basePrice;

    // Calculate billable distance (only charge for distance beyond the minimum billable distance)
    const billableDistance = Math.max(
      0,
      distance - rule.minimumBillableDistance,
    );
    const distanceFare = billableDistance * rule.pricePerKm;

    const durationFare = duration * rule.pricePerMinute;
    const totalFare = baseFare + distanceFare + durationFare;

    const commissionAmount = totalFare * (rule.commissionPercentage / 100);
    const driverEarnings = totalFare - commissionAmount;

    setFareBreakdown({
      baseFare,
      distanceFare,
      durationFare,
      totalFare,
      commissionAmount,
      driverEarnings,
      commissionPercentage: rule.commissionPercentage,
    });
  }, [distance, duration, selectedRideType, pricingRules]);

  const handleNext = () => {
    if (activeStep === 2) {
      // Simulate completing the ride
      completeRide();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const completeRide = async () => {
    if (!selectedRider || !selectedDriver) return;

    setLoading(true);

    // Create mock ride locations
    const pickupLocation = {
      latitude: 37.7749,
      longitude: -122.4194,
      address: "123 Market St, San Francisco, CA",
    };

    const dropoffLocation = {
      latitude: 37.7849,
      longitude: -122.4294,
      address: "456 Mission St, San Francisco, CA",
    };

    // Create a completed ride
    const createdRide: Ride = {
      id: `test-ride-${Date.now()}`,
      riderId: selectedRider.uuid,
      driverId: selectedDriver.uuid,
      rideType: selectedRideType as any,
      status: "completed",
      pickupLocation,
      dropoffLocation,
      distance,
      duration,
      fare: fareBreakdown.totalFare,
      startTime: new Date(Date.now() - duration * 60 * 1000).toISOString(),
      endTime: new Date().toISOString(),
      refunded: false,
      pointsAwarded: Math.floor(fareBreakdown.totalFare),
      createdAt: new Date(
        Date.now() - (duration + 5) * 60 * 1000,
      ).toISOString(),
    };

    setRide(createdRide);
    setLoading(false);
    setActiveStep(3); // Move to completed step
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Select Rider
                    </Typography>

                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <>
                        {riders.length > 0 ? (
                          <TextField
                            select
                            fullWidth
                            label="Rider"
                            value={selectedRider?.uuid || ""}
                            onChange={(e) => {
                              const rider = riders.find(
                                (r) => r.uuid === e.target.value,
                              );
                              setSelectedRider(rider || null);
                            }}
                            SelectProps={{
                              native: true,
                            }}
                          >
                            {riders.map((rider) => (
                              <option key={rider.uuid} value={rider.uuid}>
                                {rider.name} ({rider.email})
                              </option>
                            ))}
                          </TextField>
                        ) : (
                          <Typography color="text.secondary">
                            No riders available
                          </Typography>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Select Driver
                    </Typography>

                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <>
                        {drivers.length > 0 ? (
                          <TextField
                            select
                            fullWidth
                            label="Driver"
                            value={selectedDriver?.uuid || ""}
                            onChange={(e) => {
                              const driver = drivers.find(
                                (d) => d.uuid === e.target.value,
                              );
                              setSelectedDriver(driver || null);
                            }}
                            SelectProps={{
                              native: true,
                            }}
                          >
                            {drivers.map((driver) => (
                              <option key={driver.uuid} value={driver.uuid}>
                                {driver.name} ({driver.car_type})
                              </option>
                            ))}
                          </TextField>
                        ) : (
                          <Typography color="text.secondary">
                            No drivers available
                          </Typography>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Ride Type
                    </Typography>

                    <TextField
                      select
                      fullWidth
                      label="Ride Type"
                      value={selectedRideType}
                      onChange={(e) => setSelectedRideType(e.target.value)}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="electric">Electric</option>
                      <option value="regular">Regular</option>
                      <option value="suv">SUV</option>
                    </TextField>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Distance
                    </Typography>

                    <TextField
                      type="number"
                      fullWidth
                      label="Distance (km)"
                      value={distance}
                      onChange={(e) => setDistance(Number(e.target.value))}
                      inputProps={{
                        min: 1,
                        max: 50,
                        step: 0.1,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Duration
                    </Typography>

                    <TextField
                      type="number"
                      fullWidth
                      label="Duration (minutes)"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      inputProps={{
                        min: 5,
                        max: 120,
                        step: 1,
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Fare Breakdown
                    </Typography>

                    <List disablePadding>
                      <ListItem>
                        <ListItemText
                          primary="Base Fare"
                          secondary={formatCurrency(fareBreakdown.baseFare)}
                        />
                      </ListItem>

                      <ListItem>
                        <ListItemText
                          primary={`Distance (${distance} km)`}
                          secondary={
                            <>
                              {formatCurrency(fareBreakdown.distanceFare)}
                              {pricingRules.length > 0 && (
                                <Typography
                                  variant="caption"
                                  display="block"
                                  color="text.secondary"
                                >
                                  First{" "}
                                  {pricingRules.find(
                                    (r) => r.rideTypeId === selectedRideType,
                                  )?.minimumBillableDistance || 0}
                                  km included in base price
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>

                      <ListItem>
                        <ListItemText
                          primary={`Duration (${duration} min)`}
                          secondary={formatCurrency(fareBreakdown.durationFare)}
                        />
                      </ListItem>

                      <Divider />

                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="bold">
                              Total Fare
                            </Typography>
                          }
                          secondary={
                            <Typography variant="subtitle1">
                              {formatCurrency(fareBreakdown.totalFare)}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Commission & Earnings
                    </Typography>

                    <List disablePadding>
                      <ListItem>
                        <ListItemIcon>
                          <MoneyIcon color="info" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Platform Commission (${fareBreakdown.commissionPercentage}%)`}
                          secondary={
                            <Typography color="info.main">
                              {formatCurrency(fareBreakdown.commissionAmount)}
                            </Typography>
                          }
                        />
                      </ListItem>

                      <Divider variant="inset" />

                      <ListItem>
                        <ListItemIcon>
                          <MoneyIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Driver Earnings"
                          secondary={
                            <Typography
                              color="success.main"
                              fontWeight="medium"
                            >
                              {formatCurrency(fareBreakdown.driverEarnings)}
                            </Typography>
                          }
                        />
                      </ListItem>

                      <ListItem>
                        <ListItemText
                          primary="Driver's Share"
                          secondary={`${100 - fareBreakdown.commissionPercentage}% of the total fare`}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Paper elevation={3} sx={{ p: 3, mb: 3, bgcolor: "success.light" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CheckIcon color="success" fontSize="large" sx={{ mr: 1 }} />
                <Typography variant="h5" color="success.dark">
                  Ride Completed Successfully
                </Typography>
              </Box>

              <Typography variant="body1" paragraph>
                The test ride has been successfully completed. The driver earned{" "}
                {formatCurrency(fareBreakdown.driverEarnings)} after the{" "}
                {fareBreakdown.commissionPercentage}% platform commission of{" "}
                {formatCurrency(fareBreakdown.commissionAmount)}.
              </Typography>

              {ride && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/ride/${ride.id}`)}
                >
                  View Ride Details
                </Button>
              )}
            </Paper>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Ride Summary
                    </Typography>

                    <List>
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Rider"
                          secondary={selectedRider?.name}
                        />
                      </ListItem>

                      <ListItem>
                        <ListItemIcon>
                          <CarIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Driver"
                          secondary={selectedDriver?.name}
                        />
                      </ListItem>

                      <ListItem>
                        <ListItemIcon>
                          <LocationIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Distance"
                          secondary={`${distance} km`}
                        />
                      </ListItem>

                      <ListItem>
                        <ListItemIcon>
                          <MoneyIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Total Fare"
                          secondary={formatCurrency(fareBreakdown.totalFare)}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Platform Commission
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Typography variant="h3" color="info.main" sx={{ mr: 1 }}>
                        {fareBreakdown.commissionPercentage}%
                      </Typography>
                      <Typography variant="body1">of the total fare</Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Paper
                          sx={{
                            p: 2,
                            bgcolor: "info.light",
                            color: "info.contrastText",
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="body2">
                            Platform Commission
                          </Typography>
                          <Typography variant="h6">
                            {formatCurrency(fareBreakdown.commissionAmount)}
                          </Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={6}>
                        <Paper
                          sx={{
                            p: 2,
                            bgcolor: "success.light",
                            color: "success.contrastText",
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="body2">
                            Driver Earnings
                          </Typography>
                          <Typography variant="h6">
                            {formatCurrency(fareBreakdown.driverEarnings)}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return "Unknown step";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Test Ride with Commission Calculation
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Simulate a ride to see how the 15% platform commission is calculated and
        how much the driver earns.
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box>{getStepContent(activeStep)}</Box>

        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0 || activeStep === 3}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>

          <Box sx={{ flex: "1 1 auto" }} />

          {activeStep === 3 ? (
            <Button variant="contained" onClick={() => navigate("/")}>
              Back to Dashboard
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                loading ||
                (!selectedRider && activeStep === 0) ||
                (!selectedDriver && activeStep === 0)
              }
            >
              {activeStep === steps.length - 1 ? "Complete Ride" : "Next"}
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default TestRide;
