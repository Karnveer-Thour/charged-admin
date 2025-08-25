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
import DeleteRewardDialog from "./DeleteRewardDialog/DeleteRewardDialog";
import { Reward } from "../../types";

const RewardsComponent: React.FC = () => {
  const [createRewardFormLoading, setCreateRewardFormLoading] =
    useState<boolean>(false);
  const [isCreateRewardFormOpened, setIsCreateRewardFormOpened] =
    useState<boolean>(false);
  const [isDeleteRewardDialogOpened, setIsDeleteRewardDialogOpened] =
    useState<boolean>(false);
  const [selectedRewardToDelete, setSelectedRewardToDelete] = useState<Reward|undefined>();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleOpenCreateRewardForm = () => {
    setIsCreateRewardFormOpened(true);
    setCreateRewardFormLoading(false);
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
        />
        <RewardsTable
          searchQuery={searchQuery}
          setIsDeleteRewardDialogOpened={setIsDeleteRewardDialogOpened}
          setSelectedRewardToDelete={setSelectedRewardToDelete}
        />
        {selectedRewardToDelete && <DeleteRewardDialog
          isDeleteRewardDialogOpened={isDeleteRewardDialogOpened}
          SelectedRewardToDelete={selectedRewardToDelete}
          setIsDeleteRewardDialogOpened={setIsDeleteRewardDialogOpened}
          setSelectedRewardToDelete={setSelectedRewardToDelete}
        />}
      </Container>
    </>
  );
};

export default RewardsComponent;
