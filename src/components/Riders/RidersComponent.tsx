import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { RewardPointDetail, Ride, Rider } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import RidersTable from "./RidersTable/RidersTable";
import RiderRidesDialog from "./RiderRides/RiderRidesDialog";

const RidersComponent: React.FC = () => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [filteredRiders, setFilteredRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [riderRides, setRiderRides] = useState<Ride[]>([]);
  const [rideDialogOpen, setRideDialogOpen] = useState(false);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [page, setPage] = useState(0);
  const [RewardPointDetails, setRewardPointDetails] = useState<
    RewardPointDetail[]
  >([]);
  const [rideDialogLoading, setRideDialogLoading] = useState(false);

  const { getRiders, getRidesByUserId, getRewardPointsData } = useAuth();

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
          rider.phone.includes(searchQuery)
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

  const handleViewRiderRides = async (rider: Rider) => {
    setSelectedRider(rider);
    setRideDialogOpen(true);
    setRideDialogLoading(true);
    await fetchRewardPoints(Number(rider.id));

    try {
      const rides = await getRidesByUserId(Number(rider.id));
      rides.length > 0 ? setRiderRides(rides) : setRiderRides([]);
    } catch (err) {
      console.error("Error fetching rider rides:", err);
    } finally {
      setRideDialogLoading(false);
    }
  };

  const fetchRewardPoints = async (riderId: number) => {
    try {
      const data = await getRewardPointsData(riderId);
      let totalPoints: number = 0;
      data?.forEach((rewardPoint) => {
        totalPoints += rewardPoint?.amount ? Number(rewardPoint.amount) : 0;
      });
      setTotalPoints(totalPoints);
      setRewardPointDetails(data?.length > 0 ? data : []);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
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

      <RidersTable
        filteredRiders={filteredRiders}
        handleViewRiderRides={handleViewRiderRides}
        page={page}
        setPage={setPage}
      />

      {/* Rider Rides Dialog */}
      {selectedRider && (
        <RiderRidesDialog
          setRideDialogOpen={setRideDialogOpen}
          setSelectedRider={setSelectedRider}
          setRiderRides={setRiderRides}
          rideDialogOpen={rideDialogOpen}
          riderRides={riderRides}
          selectedRider={selectedRider}
          totalPoints={totalPoints}
          rideDialogLoading={rideDialogLoading}
          RewardPointDetails={RewardPointDetails}
          fetchRewardPoints={fetchRewardPoints}
        />
      )}
    </Container>
  );
};

export default RidersComponent;
