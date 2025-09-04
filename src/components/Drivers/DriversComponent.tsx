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
  Input,
  DialogContentText,
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
  UploadFile as UploadFileIcon,
  Delete,
} from "@mui/icons-material";
import { Driver, Ride, RideType, DocumentType } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { mockApi } from "../../services/mockApi";
import DriverDetailsDialog from "./DriverDetails/DriverDetailsDialog";

const DriversComponent: React.FC = () => {
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
  const [tabValue, setTabValue] = useState(0);
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
  const [isDriverDeleted, setIsDriverDeleted] = useState(false);
  const [deletingDriver, setDeletingDriver] = useState<Driver|null>(null);
  const { getDrivers, getDriverDocs, getRidesByUserId } = useAuth();

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
      const rides = await getRidesByUserId(Number(driver.id));
      console.log("Fetched rides:", rides, driver.id);
      setSelectedDriver({ ...driver, documents });
      setTabValue(0);
      rides ? setDriverRides(rides) : setDriverRides([]);
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

  const handleOpenUploadDialog = (docType: DocumentType) => {
    setSelectedDocumentType(docType);
    setUploadedFile(null);
    setUploadDialogNotes("");
    setUploadDialogOpen(true);
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
                      <IconButton
                        color="secondary"
                        size="small"
                        title="Delete Document"
                        onClick={()=>{}}
                      >
                        <Delete />
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
      <DriverDetailsDialog
        driverDetailsOpen={driverDetailsOpen}
        setDriverDetailsOpen={setDriverDetailsOpen}
        selectedDriver={selectedDriver}
        setSelectedDriver={setSelectedDriver}
        loadingDriverDetails={loadingDriverDetails}
        drivers={drivers}
        setDrivers={setDrivers}
        driverRides={driverRides}
        setDriverRides={setDriverRides}
        tabValue={tabValue}
        setTabValue={setTabValue}
        setError={setError}
        setDocumentUpdateSuccess={setDocumentUpdateSuccess}
        setDocumentUpdateError={setDocumentUpdateError}
        documentUpdateSuccess={documentUpdateSuccess}
        handleOpenUploadDialog={handleOpenUploadDialog}
        documentUpdateError={documentUpdateError}
        uploadingDocument={uploadingDocument}
        getDocumentTitle={getDocumentTitle}
      />

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

export default DriversComponent;
