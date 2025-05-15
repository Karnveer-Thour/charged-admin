import React, { useState, useEffect, useCallback } from "react";
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
  FormControlLabel,
  Divider,
  Tabs,
  Tab,
  Badge,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Input,
  DialogContentText,
  ButtonGroup,
} from "@mui/material";
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
  DirectionsCar as CarIcon,
  ElectricCar as ElectricIcon,
  AirportShuttle as SuvIcon,
  Check as ActiveIcon,
  Close as InactiveIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Error as PendingIcon,
  AccessTime as ExpiredIcon,
  Add as NotSubmittedIcon,
  VerifiedUser as VerifiedIcon,
  OpenInNew as OpenIcon,
  AssignmentTurnedIn as DocumentIcon,
  UploadFile as UploadFileIcon,
} from "@mui/icons-material";
import { mockApi } from "../services/mockApi";
import {
  Driver,
  Ride,
  RideType,
  DriverDocument,
  DocumentStatus,
  DocumentType,
} from "../types";
import { useAuth } from "../contexts/AuthContext";
import { updateDriverstatus } from "../API/axios";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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

const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedVehicleType, setSelectedVehicleType] = useState<
    RideType | "all"
  >("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<
    boolean | "all"
  >("all");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [driverRides, setDriverRides] = useState<Ride[]>([]);
  const [driverDetailsOpen, setDriverDetailsOpen] = useState(false);
  const [loadingDriverDetails, setLoadingDriverDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [updatingDocument, setUpdatingDocument] = useState(false);
  const [documentUpdateSuccess, setDocumentUpdateSuccess] = useState<
    string | null
  >(null);
  const [documentUpdateError, setDocumentUpdateError] = useState<string | null>(
    null,
  );
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<
    DocumentType | ""
  >("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadDialogNotes, setUploadDialogNotes] = useState("");
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [showRejectionReason, setShowRejectionReason] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [verifyNotes, setVerifyNotes] = useState("");
  const {
    getDrivers,
    getDriverDocs,
    updateDriverdocsStatus,
    updateDriveractivestatus,
  } = useAuth();

  useEffect(() => {
    fetchDrivers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...drivers];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (driver) =>
          driver?.name?.toLowerCase()?.includes(query) ||
          driver?.email?.toLowerCase()?.includes(query) ||
          driver?.phone?.includes(query) ||
          driver?.license_plate?.toLowerCase().includes(query),
      );
      setPage(0);
    }

    // Apply vehicle type filter
    if (selectedVehicleType !== "all") {
      result = result.filter(
        (driver) => driver.car_type === selectedVehicleType,
      );
      setPage(0);
    }

    // Apply status filter
    if (selectedStatusFilter !== "all") {
      result = result.filter(
        (driver) => driver.is_active === selectedStatusFilter,
      );
      setPage(0);
    }

    setFilteredDrivers(result);
  }, [drivers, searchQuery, selectedVehicleType, selectedStatusFilter]);

  useEffect(() => {
    applyFilters();
  }, [
    drivers,
    searchQuery,
    selectedVehicleType,
    selectedStatusFilter,
    applyFilters,
  ]);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const data = await getDrivers();
      setDrivers(data);
      setFilteredDrivers(data);
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDriver = async (driver: Driver) => {
    try {
      setLoadingDriverDetails(true);
      setDriverDetailsOpen(true);
      const documents = await getDriverDocs(driver.id as any);
      setLoadingDriverDetails(false);
      setSelectedDriver({ ...driver, documents });
      setTabValue(0);
      // setDriverRides(rides);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoadingDriverDetails(false);
    }
  };

  const handleCloseDriverDetails = () => {
    setDriverDetailsOpen(false);
    setShowRejectionReason(false);
    const updatedDrivers = drivers.map((driver) =>
      driver.id === selectedDriver!.id ? selectedDriver! : driver,
    );
    setDrivers(updatedDrivers as Driver[]);
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

  const handleUpdateDocumentStatus = async (
    document: DriverDocument,
    newStatus: DocumentStatus,
  ) => {
    if (!selectedDriver) return;
    try {
      setUpdatingDocument(true);
      const updatedDocument = await updateDriverdocsStatus(
        document.user_id,
        document.id,
        {
          status: newStatus,
          rejection_reason: rejectionReason || "",
          notes: verifyNotes || "",
        },
      );
      const updatedDocuments = selectedDriver.documents.map((doc) =>
        doc.id === updatedDocument.id
          ? { ...updatedDocument, document_type: doc.document_type }
          : doc,
      );
      const updatedDriver = {
        ...selectedDriver,
        documents: updatedDocuments,
      };
      // Update selected driver
      setSelectedDriver(updatedDriver);
      setDocumentUpdateSuccess(`Document status updated to ${newStatus}`);
    } catch (err) {
      if (err instanceof Error) {
        setDocumentUpdateError(err.message);
      } else {
        setDocumentUpdateError("An unknown error occurred.");
      }
    } finally {
      setUpdatingDocument(false);
      setRejectionReason("");
      setVerifyNotes("");
      setShowRejectionReason(false);
    }
  };

  const getVehicleTypeIcon = (type: RideType) => {
    switch (type) {
      case "electric":
        return <ElectricIcon color="success" />;
      case "regular":
        return <CarIcon color="primary" />;
      case "suv":
        return <SuvIcon color="warning" />;
      default:
        return <CarIcon />;
    }
  };

  const getVehicleTypeLabel = (type: RideType) => {
    switch (type) {
      case "electric":
        return "Electric";
      case "regular":
        return "Regular";
      case "suv":
        return "SUV";
      default:
        return type;
    }
  };

  const getDocumentTitle = (documentType: string): string => {
    switch (documentType) {
      case "driverLicense":
        return "Driver License";
      case "vehicleInsurance":
        return "Vehicle Insurance";
      case "vehiclePermit":
        return "Vehicle Permit";
      case "backgroundCheck":
        return "Background Check";
      case "workEligibility":
        return "Work Eligibility";
      case "driverAbstract":
        return "Driver Abstract";
      case "vehicleDetails":
        return "Vehicle Details";
      default:
        return documentType;
    }
  };

  const getDocumentStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case "verified":
        return <ApprovedIcon color="success" />;
      case "rejected":
        return <RejectedIcon color="error" />;
      case "pending":
        return <PendingIcon color="warning" />;
      case "expired":
        return <ExpiredIcon color="error" />;
      case "notSubmitted":
        return <NotSubmittedIcon color="disabled" />;
      default:
        return null;
    }
  };

  const getDocumentStatusColor = (
    status: DocumentStatus,
  ): "success" | "error" | "warning" | "default" => {
    switch (status) {
      case "verified":
        return "success";
      case "rejected":
      case "expired":
        return "error";
      case "pending":
        return "warning";
      case "notSubmitted":
      default:
        return "default";
    }
  };

  const getPendingDocumentsCount = (driver: Driver): number => {
    return driver?.documents?.filter((doc) => doc.status === "pending").length;
  };

  const handleOpenUploadDialog = (docType: DocumentType) => {
    setSelectedDocumentType(docType);
    setUploadedFile(null);
    setUploadDialogNotes("");
    setUploadDialogOpen(true);
  };

  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
    setSelectedDocumentType("");
    setUploadedFile(null);
    setUploadDialogNotes("");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadedFile(event.target.files[0]);
    }
  };

  const handleUploadDocument = async () => {
    if (!selectedDocumentType || !uploadedFile || !selectedDriver) {
      return;
    }

    setUploadingDocument(true);

    try {
      // Upload document using the mockApi
      const uploadResponse = await mockApi.uploadDocumentForDriver(
        selectedDriver.uuid,
        selectedDocumentType,
        uploadedFile,
        uploadDialogNotes,
      );

      // Notify the driver
      const notifyResponse = await mockApi.notifyDriverAboutDocument(
        selectedDriver.uuid,
        selectedDocumentType,
      );

      // Get the updated driver data (in a real app, this would come from the server)
      const updatedDriver = await mockApi.getDriver(selectedDriver.uuid);

      // Update the selected driver in the UI
      setSelectedDriver(updatedDriver);

      setDocumentUpdateSuccess(
        `Document ${getDocumentTitle(selectedDocumentType)} uploaded successfully and driver has been notified!`,
      );
      handleCloseUploadDialog();
    } catch (error) {
      console.error("Error uploading document:", error);
      setDocumentUpdateError("Failed to upload document. Please try again.");
    } finally {
      setUploadingDocument(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Driver Management
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        View and manage drivers, filter by vehicle type, and see driver
        statistics.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search drivers"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              placeholder="Search by name, email, phone, or license plate"
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Vehicle Type
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Chip
                  label="All"
                  onClick={() => setSelectedVehicleType("all")}
                  color={selectedVehicleType === "all" ? "primary" : "default"}
                  variant={
                    selectedVehicleType === "all" ? "filled" : "outlined"
                  }
                />
                <Chip
                  icon={<ElectricIcon />}
                  label="Electric"
                  onClick={() => setSelectedVehicleType("electric")}
                  color={
                    selectedVehicleType === "electric" ? "primary" : "default"
                  }
                  variant={
                    selectedVehicleType === "electric" ? "filled" : "outlined"
                  }
                />
                <Chip
                  icon={<CarIcon />}
                  label="Regular"
                  onClick={() => setSelectedVehicleType("regular")}
                  color={
                    selectedVehicleType === "regular" ? "primary" : "default"
                  }
                  variant={
                    selectedVehicleType === "regular" ? "filled" : "outlined"
                  }
                />
                <Chip
                  icon={<SuvIcon />}
                  label="SUV"
                  onClick={() => setSelectedVehicleType("suv")}
                  color={selectedVehicleType === "suv" ? "primary" : "default"}
                  variant={
                    selectedVehicleType === "suv" ? "filled" : "outlined"
                  }
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6} md={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Status
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Chip
                  label="All"
                  onClick={() => setSelectedStatusFilter("all")}
                  color={selectedStatusFilter === "all" ? "primary" : "default"}
                  variant={
                    selectedStatusFilter === "all" ? "filled" : "outlined"
                  }
                />
                <Chip
                  icon={<ActiveIcon />}
                  label="Active"
                  onClick={() => setSelectedStatusFilter(true)}
                  color={selectedStatusFilter === true ? "primary" : "default"}
                  variant={
                    selectedStatusFilter === true ? "filled" : "outlined"
                  }
                />
                <Chip
                  icon={<InactiveIcon />}
                  label="Inactive"
                  onClick={() => setSelectedStatusFilter(false)}
                  color={selectedStatusFilter === false ? "primary" : "default"}
                  variant={
                    selectedStatusFilter === false ? "filled" : "outlined"
                  }
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="drivers table">
            <TableHead>
              <TableRow>
                <TableCell>Driver</TableCell>
                <TableCell>Vehicle Type</TableCell>
                <TableCell>License Plate</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Total Rides</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDrivers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((driver) => (
                  <TableRow hover key={driver.uuid}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          src={driver.photo}
                          alt={driver.name}
                          sx={{ mr: 2, width: 40, height: 40 }}
                        />
                        <Box>
                          <Typography variant="body1">{driver.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {driver.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {getVehicleTypeIcon(driver.car_type)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {getVehicleTypeLabel(driver.car_type)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{driver.license_plate}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <StarIcon sx={{ color: "gold", mr: 0.5 }} />
                        {driver.rating}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={driver.is_active ? "Active" : "Inactive"}
                        color={driver.is_active ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">{driver.total_rides}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewDriver(driver)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredDrivers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No drivers found matching the search criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredDrivers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Driver Details Dialog */}
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
                                {selectedDriver.rating
                                  ? selectedDriver.rating
                                  : 0}
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
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Make & Model
                                </Typography>
                                <Typography variant="body1">
                                  {selectedDriver.vehicleDetails.make}{" "}
                                  {selectedDriver.vehicleDetails.model}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
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

              {/* Tab 2: Documents */}
              <TabPanel value={tabValue} index={1}>
                {documentUpdateSuccess && (
                  <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                    onClose={() => setDocumentUpdateSuccess(null)}
                  >
                    {documentUpdateSuccess}
                  </Alert>
                )}

                {documentUpdateError && (
                  <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setDocumentUpdateError(null)}
                  >
                    {documentUpdateError}
                  </Alert>
                )}

                <Grid container spacing={3}>
                  {selectedDriver?.documents?.map((document) => (
                    <Grid item xs={12} key={document.id}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                              justifyContent: "space-between",
                            }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              {getDocumentStatusIcon(document.status)}
                              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                                {getDocumentTitle(document.document_type)}
                              </Typography>
                            </Box>
                            <Chip
                              label={document.status}
                              color={getDocumentStatusColor(document.status)}
                              size="small"
                              sx={{ textTransform: "capitalize" }}
                            />
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Status
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ textTransform: "capitalize" }}
                              >
                                {document.status}
                              </Typography>

                              {document.uploaded_at && (
                                <>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                  >
                                    Date Submitted
                                  </Typography>
                                  <Typography variant="body1">
                                    {new Date(
                                      document.uploaded_at,
                                    ).toLocaleDateString()}
                                  </Typography>
                                </>
                              )}

                              {document.updated_at && (
                                <>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                  >
                                    Date Reviewed
                                  </Typography>
                                  <Typography variant="body1">
                                    {new Date(
                                      document.updated_at,
                                    ).toLocaleDateString()}
                                  </Typography>
                                </>
                              )}

                              {document.expiry_date && (
                                <>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                  >
                                    Expiry Date
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    color={
                                      new Date(document.expiry_date) <
                                      new Date()
                                        ? "error"
                                        : "inherit"
                                    }
                                  >
                                    {new Date(
                                      document.expiry_date,
                                    ).toLocaleDateString()}
                                    {new Date(document.expiry_date) <
                                      new Date() && " (Expired)"}
                                  </Typography>
                                </>
                              )}

                              {document.reviewed_by && (
                                <>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                  >
                                    Reviewed By
                                  </Typography>
                                  <Typography variant="body1">
                                    {document.reviewed_by}
                                  </Typography>
                                </>
                              )}

                              {document.notes && (
                                <>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                  >
                                    Notes
                                  </Typography>
                                  <Typography variant="body1">
                                    {document.notes}
                                  </Typography>
                                </>
                              )}

                              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                                <Button
                                  variant="outlined"
                                  startIcon={<UploadFileIcon />}
                                  onClick={() =>
                                    handleOpenUploadDialog(
                                      document.document_type,
                                    )
                                  }
                                  disabled={uploadingDocument}
                                  sx={{ mr: 1 }}
                                >
                                  Upload Document
                                </Button>

                                {document.file_url && (
                                  <Button
                                    variant="outlined"
                                    startIcon={<OpenIcon />}
                                    href={document.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View Document
                                  </Button>
                                )}
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="body2" sx={{ mb: 2 }}>
                                Update Document Status
                              </Typography>
                              <ButtonGroup variant="outlined" sx={{ mb: 2 }}>
                                <Button
                                  color="success"
                                  onClick={() =>
                                    handleUpdateDocumentStatus(
                                      document,
                                      "verified",
                                    )
                                  }
                                  disabled={
                                    document.status === "verified" ||
                                    updatingDocument
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  color="error"
                                  onClick={() => {
                                    if (!showRejectionReason) {
                                      setShowRejectionReason(true);
                                      return;
                                    }
                                    if (rejectionReason.length !== 0) {
                                      handleUpdateDocumentStatus(
                                        document,
                                        "rejected",
                                      );
                                    } else {
                                      setDocumentUpdateError(
                                        "Rejection reason required.",
                                      );
                                    }
                                  }}
                                  disabled={
                                    document.status === "rejected" ||
                                    updatingDocument
                                  }
                                >
                                  Reject
                                </Button>
                                <Button
                                  color="warning"
                                  onClick={() =>
                                    handleUpdateDocumentStatus(
                                      document,
                                      "pending",
                                    )
                                  }
                                  disabled={
                                    document.status === "pending" ||
                                    updatingDocument
                                  }
                                >
                                  Mark Pending
                                </Button>
                              </ButtonGroup>
                              {(showRejectionReason ||
                                document.status === "rejected") && (
                                <>
                                  <Box>
                                    <TextField
                                      fullWidth
                                      label="Rejection Reason"
                                      multiline
                                      rows={3}
                                      size="small"
                                      placeholder="Rejection reason required..."
                                      disabled={
                                        updatingDocument ||
                                        document.status === "rejected"
                                      }
                                      required
                                      onChange={(e) =>
                                        setRejectionReason(e.target.value)
                                      }
                                    />
                                  </Box>
                                  <br />
                                </>
                              )}
                              <Box>
                                <TextField
                                  fullWidth
                                  label="Add Notes"
                                  multiline
                                  rows={3}
                                  size="small"
                                  placeholder="Add notes about this document..."
                                  disabled={updatingDocument}
                                  onChange={(e) => {
                                    setVerifyNotes(e.target.value);
                                  }}
                                />
                              </Box>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                  ))}
                </Grid>

                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Last document update:{" "}
                    {selectedDriver.documents &&
                    selectedDriver?.documents?.filter((d) => d.updated_at)
                      .length > 0
                      ? new Date(
                          Math.max(
                            ...selectedDriver.documents
                              .filter((d) => d.updated_at)
                              .map((d) => new Date(d.updated_at!).getTime()),
                          ),
                        ).toLocaleDateString()
                      : "Never"}
                  </Typography>

                  <Box>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<VerifiedIcon />}
                      disabled={
                        updatingDocument ||
                        (selectedDriver.documents &&
                          selectedDriver.documents.some(
                            (d) =>
                              d?.status !== "verified" &&
                              d?.status !== "notSubmitted",
                          ))
                      }
                      onClick={() => {
                        const pendingDocs = selectedDriver.documents
                          ? selectedDriver.documents.filter(
                              (d) =>
                                d.status !== "verified" &&
                                d.status !== "notSubmitted",
                            )
                          : [];
                        if (pendingDocs.length === 0) {
                          setDocumentUpdateSuccess(
                            "All required documents are verified",
                          );
                        }
                      }}
                    >
                      All Documents Verified
                    </Button>
                  </Box>
                </Box>
              </TabPanel>

              {/* Tab 3: Rides */}
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
                                    {new Date(
                                      ride.created_at,
                                    ).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={ride.status}
                                      size="small"
                                      color={
                                        ride.status === "completed"
                                          ? "success"
                                          : ride.status === "cancelled"
                                            ? "error"
                                            : ride.status === "in-progress"
                                              ? "primary"
                                              : "default"
                                      }
                                      sx={{ textTransform: "capitalize" }}
                                    />
                                  </TableCell>
                                  <TableCell>{ride.rider_id}</TableCell>
                                  <TableCell align="right">
                                    ${ride.base_fare.toFixed(2)}
                                  </TableCell>
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
                            <Typography variant="h6">
                              {selectedDriver.total_rides}
                            </Typography>
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
                              {
                                driverRides.filter(
                                  (r) => r.status === "completed",
                                ).length
                              }
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
                              {
                                driverRides.filter(
                                  (r) => r.status === "cancelled",
                                ).length
                              }
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
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseDriverDetails}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Document Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={handleCloseUploadDialog}>
        <DialogTitle>
          Upload{" "}
          {selectedDocumentType
            ? getDocumentTitle(selectedDocumentType)
            : "Document"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Upload a document on behalf of the driver. This document will be
            marked as pending and will need to be verified.
          </DialogContentText>

          <Box sx={{ mt: 2, mb: 2 }}>
            <Input
              type="file"
              id="document-upload"
              inputProps={{ accept: "image/*,.pdf" }}
              onChange={handleFileChange}
              sx={{ display: "none" }}
            />

            <Box
              sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}
            >
              <Button
                variant="outlined"
                component="label"
                htmlFor="document-upload"
                startIcon={<UploadFileIcon />}
              >
                Select File
              </Button>
            </Box>

            {uploadedFile && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  border: "1px dashed #ccc",
                  borderRadius: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="body2">
                  Selected: {uploadedFile.name}
                </Typography>
                {uploadedFile.type.startsWith("image/") && (
                  <Box sx={{ mt: 1 }}>
                    <img
                      src={URL.createObjectURL(uploadedFile)}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                    />
                  </Box>
                )}
              </Box>
            )}

            <TextField
              margin="dense"
              label="Notes"
              fullWidth
              multiline
              rows={3}
              value={uploadDialogNotes}
              onChange={(e) => setUploadDialogNotes(e.target.value)}
              placeholder="Add any important notes about this document"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>Cancel</Button>
          <Button
            onClick={handleUploadDocument}
            disabled={!uploadedFile || uploadingDocument}
            variant="contained"
            color="primary"
          >
            {uploadingDocument ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Drivers;
