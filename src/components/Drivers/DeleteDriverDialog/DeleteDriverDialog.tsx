import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Driver } from "../../../types";

interface DeleteDriverDialogProps {
  driverId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  removeDriver: React.Dispatch<React.SetStateAction<Driver | null>>;
  fetchDrivers: () => void;
}

const DeleteDriverDialog = ({
  driverId,
  open,
  setOpen,
  removeDriver,
  fetchDrivers,
}: DeleteDriverDialogProps) => {
  const { deleteExistingDriver } = useAuth();
  const handleCloseDeleteDeleteDriverDialog = () => {
    setOpen(false);
  };
  const handleDeleteRewardPoint = async () => {
    await deleteExistingDriver(driverId);
    removeDriver(null);
    setOpen(false);
    fetchDrivers();
  };
  return (
    <Dialog
      open={open}
      onClose={handleCloseDeleteDeleteDriverDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Delete Reward</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Do you really want to delete this driver?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteDeleteDriverDialog} color="inherit">
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

export default DeleteDriverDialog;
