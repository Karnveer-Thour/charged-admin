import {
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { SearchIcon } from "lucide-react";
import React, { useState } from "react";
import RewardsTable from "./RewardsTable/RewardsTable";
import CreateRewardForm from "./CreateRewardForm/CreateRewardForm";
import { useAuth } from "../../contexts/AuthContext";
import { Reward } from "../../types";

const RewardsComponent: React.FC = () => {
  const [createRewardFormLoading, setCreateRewardFormLoading] =
    useState<boolean>(false);
  const [isCreateRewardFormOpened, setIsCreateRewardFormOpened] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rewards, setRewards] = useState<Reward[] | []>([]);
  const [filteredRewards, setFilteredRewards] = useState<Reward[]>([]);
  const { getRewardsData } = useAuth();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleOpenCreateRewardForm = () => {
    setIsCreateRewardFormOpened(true);
    setCreateRewardFormLoading(false);
  };

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const data = await getRewardsData();
      setRewards(data?.length ? data : []);
      setFilteredRewards(data?.length ? data : []);
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
  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4">Special Rewards</Typography>

          <TextField
            placeholder="Search Document..."
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mb: 2 }}
          disabled={createRewardFormLoading}
          onClick={handleOpenCreateRewardForm}
        >
          Create a new reward
        </Button>
        <CreateRewardForm
          isCreateRewardFormOpened={isCreateRewardFormOpened}
          setIsCreateRewardFormOpened={setIsCreateRewardFormOpened}
          CreateRewardFormLoading={createRewardFormLoading}
          fetchRewards={fetchRewards}
        />
        <RewardsTable
          searchQuery={searchQuery}
          fetchRewards={fetchRewards}
          rewards={rewards}
          setFilteredRewards={setFilteredRewards}
          filteredRewards={filteredRewards}
          loading={loading}
          error={error}
        />
      </Container>
    </>
  );
};

export default RewardsComponent;
