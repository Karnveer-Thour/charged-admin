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
import React, { useState } from "react";
import { CreateRewardBody } from "../../../types";
import { useAuth } from "../../../contexts/AuthContext";

interface CreateRewardFormProps {
  isCreateRewardFormOpened: boolean;
  CreateRewardFormLoading: boolean;
  setIsCreateRewardFormOpened: React.Dispatch<React.SetStateAction<boolean>>;
  fetchRewards: () => Promise<void>;
}

const CreateRewardForm = ({
  isCreateRewardFormOpened,
  CreateRewardFormLoading,
  setIsCreateRewardFormOpened,
  fetchRewards,
}: CreateRewardFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitFormValues, setSubmitFormValues] = useState<CreateRewardBody>({
    title: "",
    description: "",
    point_required: "",
  });
  const { createNewReward } = useAuth();

  const handleCloseCreateRewardFormDocument = () => {
    setIsCreateRewardFormOpened(false);
    setSubmitFormValues({
      title: "",
      description: "",
      point_required: "",
    });
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSubmitFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitCreateRewardForm = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (
        !submitFormValues.title.trim() ||
        !submitFormValues.description.trim() ||
        !submitFormValues.point_required
      ) {
        throw new Error("All fields are required");
      }

      const newReward: CreateRewardBody = {
        title: submitFormValues.title.trim(),
        description: submitFormValues.description.trim(),
        point_required: Number(submitFormValues.point_required),
      };

      await createNewReward(newReward);
      await fetchRewards();
      handleCloseCreateRewardFormDocument();
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create a new reward."
      );
    } finally {
      setLoading(false);
    }
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
                value={submitFormValues.title}
                onChange={handleOnChange}
                disabled={loading}
              />
              <TextField
                label="Reward Description"
                name="description"
                required
                fullWidth
                multiline
                minRows={3}
                value={submitFormValues.description}
                onChange={handleOnChange}
                disabled={loading}
              />
              <TextField
                label="Points Required"
                name="point_required"
                type="number"
                required
                fullWidth
                value={submitFormValues.point_required}
                onChange={handleOnChange}
                disabled={loading}
              />
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}

              <DialogActions sx={{ px: 0, pb: 0, pt: 2 }}>
                <Button
                  onClick={handleCloseCreateRewardFormDocument}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={
                    loading ||
                    Number(submitFormValues.point_required) <= 0 ||
                    !submitFormValues.title ||
                    !submitFormValues.description
                  }
                >
                  {loading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "Create Reward"
                  )}
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default CreateRewardForm;
