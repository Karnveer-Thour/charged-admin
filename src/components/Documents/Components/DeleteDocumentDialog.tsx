import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { requiredDocuments } from "../../../types";
import { useDocuments } from "../Hooks/useDocument";
import { useAuth } from "../../../contexts/AuthContext";

interface DeleteDocumentDialogProps {
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  SelectedDocumentToDelete: requiredDocuments;
  setSelectedDocumentToDelete: React.Dispatch<
    React.SetStateAction<requiredDocuments | null>
  >;
}

const DeleteDocumentDialog = ({
  open,
  onClose,
  SelectedDocumentToDelete,
  setSelectedDocumentToDelete,
}: DeleteDocumentDialogProps) => {
  const [isDocumentDeleting, setIsDocumentDeleting] = useState<boolean>(false);
  const {getDocumenttypes,deleteExistingDocument}=useAuth();
  const { fetchDocuments } = useDocuments(getDocumenttypes);
  const handleCloseDeleteDocumentDialog = () => {
    onClose(false);
    setSelectedDocumentToDelete(null);
  };
  const handleDeleteDocument = async() => {
    setIsDocumentDeleting(true);
    await deleteExistingDocument(SelectedDocumentToDelete.id.toString());
    await fetchDocuments()
    handleCloseDeleteDocumentDialog();
    setIsDocumentDeleting(false);
  };
  return (
    <Dialog
      open={open}
      onClose={handleCloseDeleteDocumentDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Delete Reward</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Do you really want to delete {SelectedDocumentToDelete?.name} Document?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseDeleteDocumentDialog}
          color="inherit"
          disabled={isDocumentDeleting}
        >
          Close
        </Button>
        <Button
          onClick={handleDeleteDocument}
          color="error"
          variant="contained"
          disabled={isDocumentDeleting}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDocumentDialog;
