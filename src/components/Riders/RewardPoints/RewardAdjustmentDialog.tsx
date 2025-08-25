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
import { AdjustmentType } from "../../../types";
import { Grid } from "@mui/material";
import { useFormAction } from "react-router-dom";

interface RewardAdjustmentDialogProps {
  adjustmentDialogOpen: boolean;
  setIsAdjustmentDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userName: string;
  adjustmentType: AdjustmentType;
  rewards?: number;
}

interface FormValues {
  quantity: number | undefined;
  message: string | undefined;
}

const RewardAdjustmentDialog: React.FC<RewardAdjustmentDialogProps> = ({
  adjustmentDialogOpen,
  setIsAdjustmentDialogOpen,
  userName,
  adjustmentType,
  rewards=0,
}) => {
  const [formSubmitValues, setFormSubmitValues] = useState<FormValues>();
  const handleCloseAdjustmentDialog = () => {
    setIsAdjustmentDialogOpen(false);
  };
  const handleFormSubmit=()=>{
    console.log(formSubmitValues);
  }
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
              {userName}'s Rewards
            </Typography>
          </Box>
          <IconButton onClick={handleCloseAdjustmentDialog} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={4} justifyContent="center" sx={{ mb: 3 }}>
        </Grid>
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
            value={formSubmitValues?.quantity ?? ""}
            placeholder={
              adjustmentType === AdjustmentType.INCREMENT
                ? "Enter the number of rewards to add"
                : "Enter the number of rewards to consume"
            }
            onChange={(e) =>
              setFormSubmitValues((prev) => ({
                quantity: e.target.value ? Number(e.target.value) : undefined,
                message: prev?.message ?? "",
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
            value={formSubmitValues?.message ?? ""}
            placeholder={
              adjustmentType === AdjustmentType.INCREMENT
                ? "Enter the reason for adding rewards points"
                : "Enter the reason for consuming reward points"
            }
            onChange={(e) =>
              setFormSubmitValues((prev) => ({
                quantity: formSubmitValues?.quantity ?? undefined,
                message: e.target.value,
              }))
            }
            helperText={`Justify your reason to ${adjustmentType === AdjustmentType.INCREMENT ? "add" : "cosume"} points...`}
          />
        </Grid>
        <Grid item sx={{mt:2}}>
          <Divider />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleFormSubmit}
            disabled={formSubmitValues?.quantity===undefined}
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
