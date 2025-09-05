import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Reward } from "../../../types";
import { useAuth } from "../../../contexts/AuthContext";
import { useState } from "react";

interface DeleteRewardDialogProps {
  isDeleteRewardDialogOpened: boolean;
  SelectedRewardToDelete: Reward;
  setIsDeleteRewardDialogOpened: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedRewardToDelete: React.Dispatch<
    React.SetStateAction<Reward | undefined>
  >;
  fetchRewards: () => Promise<void>;
}

const DeleteRewardDialog = ({
  isDeleteRewardDialogOpened,
  SelectedRewardToDelete,
  setIsDeleteRewardDialogOpened,
  setSelectedRewardToDelete,
  fetchRewards,
}: DeleteRewardDialogProps) => {
  const [isRewardDeleting, setIsRewardDeleting] = useState<boolean>(false);
  const { deleteExistingReward } = useAuth();
  const handleCloseDeleteRewardDialog = () => {
    setIsDeleteRewardDialogOpened(false);
    setSelectedRewardToDelete(undefined);
  };
  const handleDeleteReward = async () => {
    setIsRewardDeleting(true);
    try {
      await deleteExistingReward(SelectedRewardToDelete.id);
      await fetchRewards();
      handleCloseDeleteRewardDialog();
    } catch (error) {
      console.log(error);
    }
    setIsRewardDeleting(false);
  };
  return (
    <Dialog
      open={isDeleteRewardDialogOpened}
      onClose={handleCloseDeleteRewardDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Delete Reward</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Do you really want to delete {SelectedRewardToDelete?.title} reward?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseDeleteRewardDialog}
          color="inherit"
          disabled={isRewardDeleting}
        >
          Close
        </Button>
        <Button
          onClick={handleDeleteReward}
          color="error"
          variant="contained"
          disabled={isRewardDeleting}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRewardDialog;
