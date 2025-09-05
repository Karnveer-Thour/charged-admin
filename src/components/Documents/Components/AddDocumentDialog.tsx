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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useState } from "react";
import { createDocumentType, UserType } from "../../../types";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";

interface AddDocumentDialogProps {
  open: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchDocuments: () => Promise<void>;
}

const AddDocumentDialog = ({
  open,
  setDialogOpen,
  fetchDocuments,
}: AddDocumentDialogProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<createDocumentType>({
    name: "",
    display_name: "",
    description: "",
    is_required: false,
    user_type: UserType.DRIVER,
  });
  const {createNewDocument}=useAuth();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, is_required: e.target.checked }));
  };

  const onClose = () => {
    setFormData({
      name: "",
      display_name: "",
      description: "",
      is_required: false,
      user_type: UserType.DRIVER,
    });
    setDialogOpen(false);
  };

  const handleSubmit = async() => {
    setLoading(true);
    if (!formData.name || !formData.display_name || !formData.user_type) {
      setLoading(false);
      toast.error("Please fill all required fields");
      return;
    }
    await createNewDocument(formData);
    await fetchDocuments()
    onClose();
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={200}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <DialogTitle>
            <Typography variant="h6" textAlign="center" fontWeight="bold">
              Add New Document
            </Typography>
          </DialogTitle>

          <DialogContent dividers>
            <Box
              component="form"
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Display Name"
                name="display_name"
                value={formData.display_name}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_required}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Required Document"
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Add Document"
              )}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default AddDocumentDialog;