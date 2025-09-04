import { AssignmentTurnedIn as DocumentIcon } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import DriverInfoTab from "./DriverInfo/DriverInfoTab";
import DocumentsTab from "./Documents/DocumentsTab";
import RidesTab from "./Rides/RidesTab";
import { Driver, Ride, DocumentType } from "../../../types";
import { useAuth } from "../../../contexts/AuthContext";
import { useState } from "react";

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface DriverDetailsDialogProps {
  driverDetailsOpen: boolean;
  setDriverDetailsOpen: (open: boolean) => void;
  selectedDriver: Driver | null;
  setSelectedDriver: (driver: Driver | null) => void;
  loadingDriverDetails: boolean;
  drivers: Driver[];
  setDrivers: (drivers: Driver[]) => void;
  driverRides: {
    id: string;
    created_at: string;
    status: string;
    rider_id: string;
    base_fare: number;
  }[];
  setDriverRides: React.Dispatch<React.SetStateAction<Ride[]>>;
  tabValue: number;
  setTabValue: (value: number) => void;
  setError: (error: string | null) => void;
  setDocumentUpdateSuccess: (message: string | null) => void;
  setDocumentUpdateError: (error: string | null) => void;
  documentUpdateSuccess: string | null;
  handleOpenUploadDialog: (docType: DocumentType) => void;
  documentUpdateError: string | null;
  getDocumentTitle: (docType: DocumentType) => string;
  uploadingDocument: boolean;
}

function DriverDetailsDialog({
  driverDetailsOpen,
  setDriverDetailsOpen,
  selectedDriver,
  setSelectedDriver,
  loadingDriverDetails,
  drivers,
  setDrivers,
  driverRides,
  setDriverRides,
  tabValue,
  setTabValue,
  setError,
  setDocumentUpdateSuccess,
  setDocumentUpdateError,
  documentUpdateSuccess,
  handleOpenUploadDialog,
  documentUpdateError,
  getDocumentTitle,
  uploadingDocument,
}: DriverDetailsDialogProps) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showRejectionReason, setShowRejectionReason] = useState(false);
  const { updateDriveractivestatus } = useAuth();
  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`driver-tabpanel-${index}`}
        aria-labelledby={`driver-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
      </div>
    );
  }

  const handleCloseDriverDetails = () => {
    setDriverDetailsOpen(false);
    setShowRejectionReason(false);
    if (selectedDriver) {
      const updatedDrivers = drivers.map((driver) =>
        driver.id === selectedDriver.id ? selectedDriver : driver,
      );
      setDrivers(updatedDrivers as Driver[]);
    }
    setSelectedDriver(null);
    setDriverRides([]);
    setDocumentUpdateSuccess(null);
    setDocumentUpdateError(null);
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleToggleDriverStatus = async () => {
    if (!selectedDriver) return;

    setUpdatingStatus(true);
    try {
      const updatedDriverstatus = await updateDriveractivestatus(
        String(selectedDriver.id),
        {
          is_active: !selectedDriver.is_active,
        },
        setError,
      );
      const updatedDriver = {
        ...selectedDriver,
        is_active: updatedDriverstatus.is_active,
      };
      setSelectedDriver(updatedDriver);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getPendingDocumentsCount = (driver: Driver): number => {
    return driver?.documents?.filter((doc) => doc.status === "pending").length;
  };
  return (
    <Dialog
      open={driverDetailsOpen}
      onClose={handleCloseDriverDetails}
      maxWidth="md"
      fullWidth
    >
      {/* Loading driver details... model until api fetching data */}
      {loadingDriverDetails && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            padding: 2,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {selectedDriver && (
        <>
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={selectedDriver.photo}
                alt={selectedDriver.name}
                sx={{ width: 48, height: 48, mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{selectedDriver.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedDriver.email}
                </Typography>
              </Box>
              <Chip
                label={selectedDriver.is_active ? "Active" : "Inactive"}
                color={selectedDriver.is_active ? "success" : "default"}
                size="small"
                sx={{ ml: 2 }}
              />
              {getPendingDocumentsCount(selectedDriver) > 0 && (
                <Badge
                  badgeContent={getPendingDocumentsCount(selectedDriver)}
                  color="warning"
                  sx={{ ml: 2 }}
                >
                  <DocumentIcon />
                </Badge>
              )}
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="driver details tabs"
              >
                <Tab label="Driver Info" id="driver-tab-0" />
                <Tab
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Documents
                      {getPendingDocumentsCount(selectedDriver) > 0 && (
                        <Badge
                          badgeContent={getPendingDocumentsCount(
                            selectedDriver,
                          )}
                          color="warning"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  }
                  id="driver-tab-1"
                />
                <Tab label="Rides" id="driver-tab-2" />
              </Tabs>
            </Box>
          </DialogTitle>

          <DialogContent dividers>
            {/* Tab 1: Driver Info */}
            {selectedDriver && (
              <DriverInfoTab
                TabPanel={TabPanel}
                tabValue={tabValue}
                selectedDriver={selectedDriver}
                updatingStatus={updatingStatus}
                handleToggleDriverStatus={handleToggleDriverStatus}
                getVehicleTypeIcon={() => <DocumentIcon />}
                getVehicleTypeLabel={(carType: string) => carType}
              />
            )}

            {/* Tab 2: Documents */}
            {selectedDriver && (
              <DocumentsTab
                tabValue={tabValue}
                TabPanel={TabPanel}
                selectedDriver={selectedDriver}
                setSelectedDriver={setSelectedDriver}
                documentUpdateSuccess={documentUpdateSuccess}
                setDocumentUpdateSuccess={setDocumentUpdateSuccess}
                documentUpdateError={documentUpdateError}
                setDocumentUpdateError={setDocumentUpdateError}
                showRejectionReason={showRejectionReason}
                setShowRejectionReason={setShowRejectionReason}
                getDocumentTitle={getDocumentTitle}
                handleOpenUploadDialog={handleOpenUploadDialog}
                uploadingDocument={uploadingDocument}
              />
            )}

            {/* Tab 3: Rides */}
            <RidesTab
              loadingDriverDetails={loadingDriverDetails}
              driverRides={driverRides}
              TabPanel={TabPanel}
              tabValue={tabValue}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDriverDetails}>Close</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default DriverDetailsDialog;
