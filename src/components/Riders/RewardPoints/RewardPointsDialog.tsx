import { Close as CloseIcon, Diamond } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
  Grid,
  DialogContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import { formatDate } from "../../../utils/formatters";
import { Minus, Plus } from "lucide-react";
import { AdjustmentType, RewardPointDetail } from "../../../types";
import RewardAdjustmentDialog from "./RewardAdjustmentDialog";

interface RewardPointsDialogProps {
  rewardDialogOpen: boolean;
  setDisplayRewardPointsModel: React.Dispatch<React.SetStateAction<boolean>>;
  rewards: number;
  userName: string;
}

const RewardPointDetails: RewardPointDetail[] = [
  {
    id: "8749854379874398",
    points: +800,
    description: "Earned points from completing a task",
    created_at: "2025-08-01T10:15:00Z",
  },
  {
    id: "8749854379874398",
    points: -500,
    description: "Redeemed points for a reward",
    created_at: "2025-08-10T14:45:00Z",
  },
  {
    id: "8749854379874398",
    points: +700,
    description: "Earned bonus points for consistency",
    created_at: "2025-08-20T08:30:00Z",
  },
  {
    id: "8749854379874398",
    points: -600,
    description: "Points deducted for late submission",
    created_at: "2025-08-25T12:00:00Z",
  },
  {
    id: "8749854379874398",
    points: +450,
    description: "Earned from completing milestone",
    created_at: "2025-09-01T09:10:00Z",
  },
  {
    id: "8749854379874398",
    points: +900,
    description: "Special event reward points",
    created_at: "2025-09-05T15:25:00Z",
  },
  {
    id: "8749854379874398",
    points: -750,
    description: "Points used for gift redemption",
    created_at: "2025-09-10T18:45:00Z",
  },
  {
    id: "8749854379874398",
    points: +500,
    description: "Earned points from daily activity",
    created_at: "2025-09-15T11:20:00Z",
  },
  {
    id: "8749854379874398",
    points: +650,
    description: "Bonus points for streak",
    created_at: "2025-09-20T13:30:00Z",
  },
  {
    id: "8749854379874398",
    points: -800,
    description: "Points redeemed for voucher",
    created_at: "2025-09-25T16:10:00Z",
  },
  {
    id: "8749854379874398",
    points: +550,
    description: "Earned from referral program",
    created_at: "2025-10-01T08:00:00Z",
  },
  {
    id: "8749854379874398",
    points: +720,
    description: "Earned from participation in event",
    created_at: "2025-10-05T20:40:00Z",
  },
  {
    id: "8749854379874398",
    points: -680,
    description: "Points spent on premium feature",
    created_at: "2025-10-12T14:25:00Z",
  },
  {
    id: "8749854379874398",
    points: +400,
    description: "Earned for completing challenge",
    created_at: "2025-10-18T19:55:00Z",
  },
  {
    id: "8749854379874398",
    points: +1000,
    description: "Big reward for monthly achievement",
    created_at: "2025-10-25T09:30:00Z",
  },
  {
    id: "8749854379874398",
    points: -560,
    description: "Points deducted for inactivity",
    created_at: "2025-11-01T11:15:00Z",
  },
  {
    id: "8749854379874398",
    points: +640,
    description: "Earned from bonus activity",
    created_at: "2025-11-08T17:45:00Z",
  },
  {
    id: "8749854379874398",
    points: +700,
    description: "Earned for weekly progress",
    created_at: "2025-11-15T22:00:00Z",
  },
  {
    id: "8749854379874398",
    points: -480,
    description: "Points used for reward redemption",
    created_at: "2025-11-22T10:05:00Z",
  },
  {
    id: "8749854379874398",
    points: +890,
    description: "Special bonus reward",
    created_at: "2025-11-28T12:30:00Z",
  },
  {
    id: "8749854379874398",
    points: +530,
    description: "Earned for daily activity",
    created_at: "2025-12-05T07:50:00Z",
  },
  {
    id: "8749854379874398",
    points: -610,
    description: "Redeemed for discount coupon",
    created_at: "2025-12-10T21:20:00Z",
  },
  {
    id: "8749854379874398",
    points: +720,
    description: "Earned for consistent login",
    created_at: "2025-12-18T15:45:00Z",
  },
  {
    id: "8749854379874398",
    points: +800,
    description: "Earned as festival bonus",
    created_at: "2025-12-25T18:10:00Z",
  },
  {
    id: "8749854379874398",
    points: -560,
    description: "Points deducted for policy violation",
    created_at: "2026-01-01T09:00:00Z",
  },
  {
    id: "8749854379874398",
    points: +670,
    description: "Reward for completing target",
    created_at: "2026-01-08T11:30:00Z",
  },
  {
    id: "8749854379874398",
    points: +950,
    description: "Special achievement reward",
    created_at: "2026-01-15T20:15:00Z",
  },
  {
    id: "8749854379874398",
    points: -420,
    description: "Points spent on merchandise",
    created_at: "2026-01-20T14:55:00Z",
  },
];

const RewardPointsDialog: React.FC<RewardPointsDialogProps> = ({
  rewardDialogOpen,
  setDisplayRewardPointsModel,
  rewards,
  userName,
}) => {
  const [rewardDialogLoading, setRewardDialogLoading] = useState(false);
  const [isAdujstingRewards,setIsAdjustingRewards]=useState(false);
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType | undefined>(undefined);
  const handleCloseRewardDialog = () => {
    setDisplayRewardPointsModel(false);
  };
  const handleRewardPointsAdjustmentDialog=(adjustmentType:AdjustmentType)=>{
    setIsAdjustingRewards(true);
    setAdjustmentType(adjustmentType);
  }
  return (
    <Dialog
      open={rewardDialogOpen}
      onClose={handleCloseRewardDialog}
      maxWidth="md"
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
            <Diamond sx={{ mr: 1 }} />
            <Typography variant="h6">{userName}'s' Reward Points</Typography>
          </Box>
          <IconButton onClick={handleCloseRewardDialog} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {rewardDialogLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    maxWidth: 600,
                    margin: "0 auto",
                  }}
                  elevation={2}
                >
                  <Typography variant="h4" color="primary">
                    {rewards}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Reward Points
                  </Typography>
                </Paper>
              </Grid>

              {/* Buttons in one row */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      startIcon={<Minus />}
                      onClick={()=>handleRewardPointsAdjustmentDialog(AdjustmentType.DECREMENT)}
                      disabled={false}
                    >
                      Consume Reward Points
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<Plus />}
                      onClick={()=>handleRewardPointsAdjustmentDialog(AdjustmentType.INCREMENT)}
                      disabled={false}
                    >
                      Add  Reward Points
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <TableContainer component={Paper} elevation={0} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Date</TableCell>
                    <TableCell align="center">Description</TableCell>
                    <TableCell align="center">Reward Points</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {RewardPointDetails.map((RewardPointDetail) => (
                    <TableRow key={RewardPointDetail.id} hover>
                      <TableCell align="left">
                        {formatDate(RewardPointDetail.created_at)}
                      </TableCell>
                      <TableCell align="center">
                        {RewardPointDetail.description}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: RewardPointDetail.points > 0 ? "green" : "red"
                        }}
                      >
                        {Math.abs(RewardPointDetail.points)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseRewardDialog}>Close</Button>
      </DialogActions>
      {adjustmentType !== undefined && (
        <RewardAdjustmentDialog
          adjustmentDialogOpen={isAdujstingRewards}
          setIsAdjustmentDialogOpen={setIsAdjustingRewards}
          userName={userName}
          adjustmentType={adjustmentType}
        />
      )}
    </Dialog>
  );
};

export default RewardPointsDialog;
