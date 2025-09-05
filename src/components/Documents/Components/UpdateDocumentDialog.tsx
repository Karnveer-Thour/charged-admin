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
import { requiredDocuments } from "../../../types";

interface UpdateDocumentDialogProps {
  open: boolean;
  loading: boolean;
  document: requiredDocuments | null;
  onClose: () => void;
  onSubmit: () => void;
}

const UpdateDocumentDialog = ({
  open,
  loading,
  document,
  onClose,
  onSubmit,
}: UpdateDocumentDialogProps) => {
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
              <Box component="form" sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  defaultValue={document.name}
                  label="Document Name"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  defaultValue={document.description}
                  label="Document Description"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Close</Button>
              <Button onClick={onSubmit}>Submit</Button>
            </DialogActions>
          </>
        )
      )}
    </Dialog>
  );
};

export default UpdateDocumentDialog;