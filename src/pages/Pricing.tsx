import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  InputAdornment,
} from "@mui/material";
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  ElectricCar as ElectricIcon,
  DirectionsCar as CarIcon,
  AirportShuttle as SuvIcon,
} from "@mui/icons-material";
import { mockApi } from "../services/mockApi";
import { PricingRule, rideTypes } from "../types";
import { useAuth } from "../contexts/AuthContext";

// Ride type icons mapping
const rideTypeIcons: Record<string, React.ReactNode> = {
  electric: <ElectricIcon sx={{ fontSize: 40, color: "success.main" }} />,
  regular: <CarIcon sx={{ fontSize: 40, color: "primary.main" }} />,
  suv: <SuvIcon sx={{ fontSize: 40, color: "warning.main" }} />,
};

const Pricing: React.FC = () => {
  const [pricingRules, setPricingRules] = useState<rideTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingRules, setSavingRules] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const {getRidetypes,updateRidetype}=useAuth();

  // Load pricing rules on component mount
  useEffect(() => {
    fetchPricingRules();
  }, []);

  const fetchPricingRules = async () => {
    setLoading(true);
    try {
      const rules = await getRidetypes();
      setPricingRules(rules);
      setError(null);
    } catch (err) {
      setError("Failed to load pricing rules. Please try again.");
      console.error("Error fetching pricing rules:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePricingChange = (
    id: number,
    field: keyof rideTypes,
    value: any,
  ) => {
    setPricingRules((prevRules) =>
      prevRules.map((rule) =>
        rule.id === id ? { ...rule, [field]: parseFloat(value) || 0 } : rule,
      ),
    );
  };

  const handleSaveRule = async (rule: rideTypes) => {
    // Set saving state only for this specific rule
    setSavingRules((prev) => ({ ...prev, [rule.id]: true }));

    try {
      await updateRidetype(rule.id,rule); 
      setNotification({
        open: true,
        message: `Successfully updated ${rule?.name} pricing rules`,
        severity: "success",
      });
    } catch (err) {
      setNotification({
        open: true,
        message: `Failed to update pricing rules: ${err}`,
        severity: "error",
      });
    } finally {
      // Clear saving state only for this specific rule
      setSavingRules((prev) => ({ ...prev, [rule.id]: false }));
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const getRideTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      electric: "Electric Vehicle",
      regular: "Standard Vehicle",
      suv: "SUV Vehicle",
    };
    return labels[type] || type;
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
        <Button
          startIcon={<RefreshIcon />}
          variant="contained"
          onClick={fetchPricingRules}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Pricing Rules
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Configure pricing rules for different ride types including base prices,
        per-kilometer rates, cancellation fees, and refund policies.
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {pricingRules.map((rule) => (
            <Grid item xs={12} md={4} key={rule.id}>
              <Card elevation={3}>
                <CardHeader
                  avatar={rideTypeIcons[rule.icon]}
                  title={
                    <Typography variant="h6">
                      {getRideTypeLabel(rule.name)}
                    </Typography>
                  }
                  subheader={`Last updated: ${new Date(rule.updated_at).toLocaleDateString()}`}
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Base Price"
                        type="number"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        fullWidth
                        value={rule?.base_price}
                        onChange={(e) =>
                          handlePricingChange(
                            rule.id,
                            "base_price",
                            e.target.value,
                          )
                        }
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        label="Per km"
                        type="number"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        fullWidth
                        value={rule?.price_per_km}
                        onChange={(e) =>
                          handlePricingChange(
                            rule.id,
                            "price_per_km",
                            e.target.value,
                          )
                        }
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        label="Per minute"
                        type="number"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        fullWidth
                        value={rule?.price_per_minute}
                        onChange={(e) =>
                          handlePricingChange(
                            rule.id,
                            "price_per_minute",
                            e.target.value,
                          )
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Cancellation & Refund Policy
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        label="Cancel Fee"
                        type="number"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                        fullWidth
                        value={rule?.cancel_fee}
                        onChange={(e) =>
                          handlePricingChange(
                            rule.id,
                            "cancel_fee",
                            e.target.value,
                          )
                        }
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField
                        label="Refund Distance"
                        type="number"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">m</InputAdornment>
                          ),
                        }}
                        fullWidth
                        value={rule?.refund_distance_in_m}
                        onChange={(e) =>
                          handlePricingChange(
                            rule.id,
                            "refund_distance_in_m",
                            e.target.value,
                          )
                        }
                        helperText="Refund if driver is further than this"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Distance Pricing Rules
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Minimum Billable Distance"
                        type="number"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">km</InputAdornment>
                          ),
                        }}
                        fullWidth
                        value={rule?.minimum_billable_distance}
                        onChange={(e) =>
                          handlePricingChange(
                            rule.id,
                            "minimum_billable_distance",
                            e.target.value,
                          )
                        }
                        helperText="First N kilometers included in base price (no extra charge)"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Commission Settings
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Commission Percentage"
                        type="number"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                        }}
                        fullWidth
                        value={rule?.commission_percentage}
                        onChange={(e) =>
                          handlePricingChange(
                            rule.id,
                            "commission_percentage",
                            e.target.value,
                          )
                        }
                        helperText="Percentage of driver earnings that go to the platform"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<SaveIcon />}
                        onClick={() => handleSaveRule(rule)}
                        disabled={savingRules[rule.id]}
                        sx={{ mt: 2 }}
                      >
                        {savingRules[rule.id] ? "Saving..." : "Save Changes"}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Pricing;
