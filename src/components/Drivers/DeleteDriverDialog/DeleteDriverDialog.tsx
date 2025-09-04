import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const DeleteDriverDialog = () => {
  const handleCloseDeleteDeleteDriverDialog = () => {};
  const handleDeleteRewardPoint = async () => {};
  return (
    <Dialog
      open={isDriverDeleted}
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
