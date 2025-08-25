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
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import React, { useState } from "react";
import { AdjustmentType, ChangeRewardPointsBody, Rider } from "../../../types";
import { Grid } from "@mui/material";
import { useAuth } from "../../../contexts/AuthContext";

interface RewardAdjustmentDialogProps {
  adjustmentDialogOpen: boolean;
  setIsAdjustmentDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rider: Rider;
  adjustmentType: AdjustmentType;
  rewards?: number;
}

const RewardAdjustmentDialog: React.FC<RewardAdjustmentDialogProps> = ({
  adjustmentDialogOpen,
  setIsAdjustmentDialogOpen,
  rider,
  adjustmentType,
  rewards = 0,
}) => {
  const [formSubmitValues, setFormSubmitValues] =
    useState<ChangeRewardPointsBody>();
  const { updateRewardPoints } = useAuth();
  const handleCloseAdjustmentDialog = () => {
    setFormSubmitValues({
      amount: undefined,
      description: undefined,
    });
    setIsAdjustmentDialogOpen(false);
  };
  const handleFormSubmit = async () => {
    const newForm: ChangeRewardPointsBody = {
      amount: formSubmitValues?.amount ?adjustmentType===AdjustmentType.DECREMENT? -Math.abs(formSubmitValues.amount) : formSubmitValues.amount:0,
      description: formSubmitValues?.description || "",
    };

    await updateRewardPoints(Number(rider.id), newForm);
    handleCloseAdjustmentDialog();
  };
  return (
    <Dialog
      open={adjustmentDialogOpen}
      onClose={handleCloseAdjustmentDialog}
      maxWidth="sm"
      fullWidth
    >
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
        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{ mb: 3 }}
        ></Grid>
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
            onChange={(e) =>
              setFormSubmitValues((prev) => ({
                amount: e.target.value ? Number(e.target.value) : undefined,
                description: prev?.description ?? "",
              }))
            }
            helperText={
              adjustmentType === AdjustmentType.INCREMENT
                ? "Specify how many reward points you want to add."
                : "Specify how many reward points you want to consume."
            }
          />
        </Grid>
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
                quantity: formSubmitValues?.amount ?? undefined,
                description: e.target.value,
              }))
            }
            helperText={`Justify your reason to ${adjustmentType === AdjustmentType.INCREMENT ? "add" : "cosume"} points...`}
          />
        </Grid>
        <Grid item sx={{ mt: 2 }}>
          <Divider />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleFormSubmit}
            disabled={
              formSubmitValues?.amount === undefined &&
              formSubmitValues?.description === undefined
            }
          >
            Submit
          </Button>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseAdjustmentDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RewardAdjustmentDialog;
