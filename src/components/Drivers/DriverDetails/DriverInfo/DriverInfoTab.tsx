import {
  Box,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import { Star as StarIcon } from "@mui/icons-material";
import { Driver } from "../../../../types";
import { TabPanelProps } from "../DriverDetailsDialog";

interface DriverInfoTabProps {
  TabPanel: (props: TabPanelProps) => JSX.Element;
  tabValue: number;
  selectedDriver: Driver;
  updatingStatus: boolean;
  handleToggleDriverStatus: () => void;
  getVehicleTypeIcon: (carType: string) => JSX.Element;
  getVehicleTypeLabel: (carType: string) => string;
}

const DriverInfoTab = ({
  TabPanel,
  tabValue,
  selectedDriver,
  updatingStatus,
  handleToggleDriverStatus,
  getVehicleTypeIcon,
  getVehicleTypeLabel,
}: DriverInfoTabProps) => {
  return (
    <TabPanel value={tabValue} index={0}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Driver Information
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1">
                    {selectedDriver?.phone}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Rating
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <StarIcon sx={{ color: "gold", mr: 0.5 }} />
                    <Typography variant="body1">
                      {selectedDriver.rating ? selectedDriver.rating : 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={selectedDriver.is_active}
                        onChange={handleToggleDriverStatus}
                        disabled={updatingStatus}
                        color="success"
                      />
                    }
                    label={
                      updatingStatus
                        ? "Updating status..."
                        : `Driver is ${selectedDriver?.is_active ? "active" : "inactive"}`
                    }
                  />
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Vehicle Information
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Vehicle Type
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 0.5,
                    }}
                  >
                    {getVehicleTypeIcon(selectedDriver.car_type)}
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {getVehicleTypeLabel(selectedDriver.car_type)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    License Plate
                  </Typography>
                  <Typography variant="body1">
                    {selectedDriver?.license_plate}
                  </Typography>
                </Grid>
                {selectedDriver?.vehicleDetails && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Make & Model
                      </Typography>
                      <Typography variant="body1">
                        {selectedDriver.vehicleDetails.make}{" "}
                        {selectedDriver.vehicleDetails.model}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Color & Year
                      </Typography>
                      <Typography variant="body1">
                        {selectedDriver.vehicleDetails.color},{" "}
                        {selectedDriver.vehicleDetails.year}
                      </Typography>
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Current Location
                  </Typography>
                  {selectedDriver.address ? (
                    <Typography variant="body1">
                      {selectedDriver?.address.address}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.disabled">
                      Location not available
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </TabPanel>
  );
};

export default DriverInfoTab;
