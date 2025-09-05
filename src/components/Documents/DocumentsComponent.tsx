import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { createDocumentType, requiredDocuments } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { useDocuments } from "./Hooks/useDocument";
import DocumentTable from "./Components/DocumentTable";
import UpdateDocumentDialog from "./Components/UpdateDocumentDialog";
import AddDocumentDialog from "./Components/AddDocumentDialog";
import DeleteDocumentDialog from "./Components/DeleteDocumentDialog";

export const DocumentsComponent = () => {
  const { getDocumenttypes } = useAuth();
  const { documents, loading, error, fetchDocuments } =
    useDocuments(getDocumenttypes);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isDocumentDeleting, setIsDocumentDeleting] = useState<boolean>(false);
  const [documentToDelete, setDocumentToDelete] = useState<requiredDocuments | null>(null);
  const [selectedDocument, setSelectedDocument] =
    useState<requiredDocuments | null>(null);

  const handleOpenAdd = () => setAddDialogOpen(true);
  const handleCloseAdd = () => setAddDialogOpen(false);

  const handleOpenUpdate = (doc: requiredDocuments) => {
    setSelectedDocument(doc);
    setUpdateDialogOpen(true);
  };
  const handleCloseUpdate = () => {
    setSelectedDocument(null);
    setUpdateDialogOpen(false);
  };
  const handleSubmitUpdate = () => {};

  const handleDelete = (doc: requiredDocuments) => {
    setDocumentToDelete(doc);
    setIsDocumentDeleting(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchDocuments}>
          Retry
        </Button>
      </Container>
    );
  }

  const filteredDocs = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.user_type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h4">Document Types</Typography>
        <TextField
          placeholder="Search Document..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mb: 2 }}
        onClick={handleOpenAdd}
      >
        Add Document
      </Button>

      <DocumentTable
        documents={filteredDocs}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        onEdit={handleOpenUpdate}
        onDelete={handleDelete}
      />

      <AddDocumentDialog
        open={addDialogOpen}
        setDialogOpen={setAddDialogOpen}
        fetchDocuments={fetchDocuments}
      />

      <UpdateDocumentDialog
        open={updateDialogOpen}
        loading={updateLoading}
        document={selectedDocument}
        onClose={handleCloseUpdate}
        onSubmit={handleSubmitUpdate}
      />

      <DeleteDocumentDialog 
        open={isDocumentDeleting}
        onClose={setIsDocumentDeleting}
        SelectedDocumentToDelete={documentToDelete!}
        setSelectedDocumentToDelete={setDocumentToDelete}
      />
    </Container>
  );
};
