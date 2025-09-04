import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Rider } from "../../../../types";
import { useAuth } from "../../../../contexts/AuthContext";
import { useState } from "react";

interface DeleteRiderDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  removeRider: React.Dispatch<React.SetStateAction<Rider | null>>;
  riderToDelete: Rider;
  fetchRiders: () => void;
}

const DeleteRiderDialog = ({
  open,
  setOpen,
  removeRider,
  riderToDelete,
  fetchRiders,
}: DeleteRiderDialogProps) => {
  const [isRiderDeleting, setIsRiderDeleting] = useState<boolean>(false);
  const { deleteExistingUser } = useAuth();
  const handleCloseDeleteDeleteRiderDialog = () => {
    setOpen(false);
    removeRider(null);
  };
  const handleDeleteRewardPoint = async () => {
    setIsRiderDeleting(true);
    await deleteExistingUser(riderToDelete.id);
    handleCloseDeleteDeleteRiderDialog();
    fetchRiders();
    setIsRiderDeleting(false);
  };
  return (
    <Dialog
      open={open}
      onClose={handleCloseDeleteDeleteRiderDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Delete Reward</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Do you really want to delete this rider?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseDeleteDeleteRiderDialog}
          color="inherit"
          disabled={isRiderDeleting}
        >
          Close
        </Button>
        <Button
          onClick={handleDeleteRewardPoint}
          color="error"
          variant="contained"
          disabled={isRiderDeleting}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRiderDialog;
