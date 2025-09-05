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
import { useEffect, useState } from "react";
import { requiredDocuments, updateDocumentType, UserType } from "../../../types";
import toast from "react-hot-toast";
import { useAuth } from "../../../contexts/AuthContext";

interface UpdateDocumentDialogProps {
  open: boolean;
  document: requiredDocuments;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDocumentToUpdate: React.Dispatch<React.SetStateAction<requiredDocuments | null>>;
  fetchDocuments:()=>Promise<void>;
}

const UpdateDocumentDialog = ({
  open,
  document,
  setDocumentToUpdate,
  setDialogOpen,
  fetchDocuments,
}: UpdateDocumentDialogProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<updateDocumentType>({
    name: document?.name || "",
    display_name: document?.display_name || "",
    description: document?.description || "",
    is_required: document?.is_required ?? false,
    user_type: document?.user_type as UserType || UserType.DRIVER,
  });
  const {updateExistingDocument}=useAuth();

  useEffect(() => {
    if (document) {
      setFormData({
        name: document?.name || "",
        display_name: document?.display_name || "",
        description: document?.description || "",
        is_required: document?.is_required ?? false,
        user_type: document?.user_type as UserType || UserType.DRIVER,
      });
    }
  }, [document]);

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
    setDocumentToUpdate(null);
    setDialogOpen(false);
  };

  const handleSubmit = async() => {
    setLoading(true);
    if(!formData.name || !formData.display_name || !formData.user_type){
      setLoading(false);
      toast.error("Please fill all required fields");
      return;
    }
    await updateExistingDocument(document.id.toString(),formData);
    await fetchDocuments()
    onClose();
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
          <CircularProgress />
        </Box>
      ) : (
        document && (
          <>
            <DialogTitle>
              <Typography variant="h6" textAlign="center">
                Update Document
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Box
                component="form"
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
              >
                <TextField
                  margin="normal"
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  margin="normal"
                  label="Display Name"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleChange}
                  required
                  fullWidth
                />
                <TextField
                  margin="normal"
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
                      checked={formData.is_required || false}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Required Document"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} disabled={loading}>
                Close
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={22} color="inherit" /> : "Update"}
              </Button>
            </DialogActions>
          </>
        )
      )}
    </Dialog>
  );
};

export default UpdateDocumentDialog;