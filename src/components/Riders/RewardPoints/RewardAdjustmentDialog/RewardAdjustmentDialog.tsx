import { Adjust } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import React, { useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  AdjustmentType,
  ChangeRewardPointsBody,
  Rider,
} from "../../../../types";

interface RewardAdjustmentDialogProps {
  adjustmentDialogOpen: boolean;
  setIsAdjustmentDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rider: Rider;
  adjustmentType: AdjustmentType;
  fetchRewardPoints: (riderId: number) => Promise<void>;
}

const RewardAdjustmentDialog: React.FC<RewardAdjustmentDialogProps> = ({
  adjustmentDialogOpen,
  setIsAdjustmentDialogOpen,
  rider,
  adjustmentType,
  fetchRewardPoints,
}) => {
  const [formSubmitValues, setFormSubmitValues] =
    useState<ChangeRewardPointsBody>();
  const [isRewardPointsChanging,setIsRewardPointsChanging]=useState<boolean>(false);
  const { updateRewardPoints } = useAuth();

  const handleCloseAdjustmentDialog = () => {
    setFormSubmitValues({
      amount: undefined,
      description: undefined,
    });
    setIsAdjustmentDialogOpen(false);
  };

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsRewardPointsChanging(true);

    const newForm: ChangeRewardPointsBody = {
      amount: formSubmitValues?.amount
        ? adjustmentType === AdjustmentType.DECREMENT
          ? -Math.abs(Number(formSubmitValues.amount))
          : Math.abs(Number(formSubmitValues.amount))
        : 0,
      description: formSubmitValues?.description || "",
    };

    await updateRewardPoints(Number(rider.id), newForm);
    await fetchRewardPoints(Number(rider.id));
    handleCloseAdjustmentDialog();
    setIsRewardPointsChanging(false);
  };

  return (
    <Dialog
      open={adjustmentDialogOpen}
      onClose={handleCloseAdjustmentDialog}
      maxWidth="sm"
      fullWidth
    >
      <form onSubmit={handleFormSubmit}>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Adjust sx={{ mr: 1 }} />
              <Typography variant="h6">
                {adjustmentType === AdjustmentType.INCREMENT ? "Add" : "Consume"}{" "}
                {rider.name}'s Rewards
              </Typography>
            </Box>
            <IconButton onClick={handleCloseAdjustmentDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={4} justifyContent="center" sx={{ mb: 3 }} />

          {/* Amount input */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              {adjustmentType === AdjustmentType.INCREMENT
                ? "Add Reward points"
                : "Consume Reward points"}
            </Typography>

            <TextField
              label={
                adjustmentType === AdjustmentType.INCREMENT
                  ? "Reward points to Add"
                  : "Reward points to Consume"
              }
              type="number"
              fullWidth
              value={formSubmitValues?.amount ?? ""}
              placeholder={
                adjustmentType === AdjustmentType.INCREMENT
                  ? "Enter the number of rewards to add"
                  : "Enter the number of rewards to consume"
              }
              onChange={(e) => {
                setFormSubmitValues((prev) => ({
                  amount: Number(e.target.value),
                  description: prev?.description ?? "",
                }));
              }}
              helperText={
                adjustmentType === AdjustmentType.INCREMENT
                  ? "Specify how many reward points you want to add."
                  : "Specify how many reward points you want to consume."
              }
            />
          </Grid>

          {/* Reason input */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Reason
            </Typography>

            <TextField
              label={
                adjustmentType === AdjustmentType.INCREMENT
                  ? "Reason for adding rewards"
                  : "Reason to consume rewards"
              }
              type="text"
              fullWidth
              value={formSubmitValues?.description ?? ""}
              placeholder={
                adjustmentType === AdjustmentType.INCREMENT
                  ? "Enter the reason for adding rewards points"
                  : "Enter the reason for consuming reward points"
              }
              onChange={(e) =>
                setFormSubmitValues((prev) => ({
                  amount: prev?.amount ?? undefined,
                  description: e.target.value,
                }))
              }
              helperText={`Justify your reason to ${
                adjustmentType === AdjustmentType.INCREMENT ? "add" : "consume"
              } points...`}
            />
          </Grid>

          {/* Submit button */}
          <Grid item sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={
                !formSubmitValues?.amount || !formSubmitValues?.description || isRewardPointsChanging
              }
            >
              Submit
            </Button>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseAdjustmentDialog}>Close</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RewardAdjustmentDialog;
