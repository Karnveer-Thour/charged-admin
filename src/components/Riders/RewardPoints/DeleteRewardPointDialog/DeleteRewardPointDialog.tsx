import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { RewardPointDetail } from "../../../../types";
import React from "react";
import { useAuth } from "../../../../contexts/AuthContext";

interface DeleteRewardPointDialogProps {
  isDeleteRewardPointDialogOpened: boolean;
  selectedDeleteRewardPoint: RewardPointDetail;
  setIsDeleteRewardPointDialogOpened: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setSelectedDeleteRewardPoint: React.Dispatch<
    React.SetStateAction<RewardPointDetail | undefined>
  >;
  riderId:number;
  fetchRewardPoints:(riderId:number)=>Promise<void>;
}

const DeleteRewardPointDialog = ({
  isDeleteRewardPointDialogOpened,
  selectedDeleteRewardPoint,
  setIsDeleteRewardPointDialogOpened,
  setSelectedDeleteRewardPoint,
  fetchRewardPoints,
  riderId,
}: DeleteRewardPointDialogProps) => {
  const { deleteExistingRewardPoints } = useAuth();
  const handleCloseDeleteRewardPointDialog = () => {
    setIsDeleteRewardPointDialogOpened(false);
    setSelectedDeleteRewardPoint(undefined);
  };
  const handleDeleteRewardPoint = async () => {
    await deleteExistingRewardPoints(selectedDeleteRewardPoint.id);
    await fetchRewardPoints(riderId);
    handleCloseDeleteRewardPointDialog();
  };
  return (
    <Dialog
      open={isDeleteRewardPointDialogOpened}
      onClose={handleCloseDeleteRewardPointDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Delete Reward</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Do you really want to delete this reward point?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteRewardPointDialog} color="inherit">
          Close
        </Button>
        <Button
          onClick={handleDeleteRewardPoint}
          color="error"
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRewardPointDialog;
