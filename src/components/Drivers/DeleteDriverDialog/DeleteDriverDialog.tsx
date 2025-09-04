import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
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
  const [isDriverDeleting, setIsDriverDeleting] = useState<boolean>(false);
  const { deleteExistingUser } = useAuth();
  const handleCloseDeleteDriverDialog = () => {
    setOpen(false);
  };
  const handleDeleteDriver = async () => {
    setIsDriverDeleting(true);
    await deleteExistingUser(driverId);
    removeDriver(null);
    setOpen(false);
    fetchDrivers();
    setIsDriverDeleting(false);
  };
  return (
    <Dialog
      open={open}
      onClose={handleCloseDeleteDriverDialog}
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
        <Button
          onClick={handleCloseDeleteDriverDialog}
          color="inherit"
          disabled={isDriverDeleting}
        >
          Close
        </Button>
        <Button
          onClick={handleDeleteDriver}
          color="error"
          variant="contained"
          disabled={isDriverDeleting}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDriverDialog;
