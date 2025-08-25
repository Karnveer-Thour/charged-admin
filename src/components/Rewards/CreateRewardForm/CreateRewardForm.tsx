import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface CreateRewardFormProps {
  isCreateRewardFormOpened: boolean;
  CreateRewardFormLoading: boolean;
  setIsCreateRewardFormOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateRewardForm = ({
  isCreateRewardFormOpened,
  CreateRewardFormLoading,
  setIsCreateRewardFormOpened,
}: CreateRewardFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCloseCreateRewardFormDocument = () => {
    setIsCreateRewardFormOpened(false);
  };

  const handleSubmitCreateRewardForm = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate submit
    setTimeout(() => {
      setLoading(false);
      setIsCreateRewardFormOpened(false);
    }, 1500);
  };

  return (
    <Dialog
      open={isCreateRewardFormOpened}
      onClose={handleCloseCreateRewardFormDocument}
      maxWidth="sm"
      fullWidth
    >
      {CreateRewardFormLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <DialogTitle>
            <Typography variant="h6" textAlign="center" fontWeight="bold">
              Create New Reward
            </Typography>
          </DialogTitle>

          <DialogContent dividers>
            <Box
              component="form"
              onSubmit={handleSubmitCreateRewardForm}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 1,
              }}
            >
              <TextField
                label="Reward Title"
                name="title"
                required
                fullWidth
                disabled={loading}
              />
              <TextField
                label="Reward Description"
                name="description"
                required
                fullWidth
                multiline
                minRows={3}
                disabled={loading}
              />
              <TextField
                label="Points Required"
                name="pointsRequired"
                type="number"
                required
                fullWidth
                disabled={loading}
              />
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={handleCloseCreateRewardFormDocument}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitCreateRewardForm}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Create Reward"
              )}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default CreateRewardForm;