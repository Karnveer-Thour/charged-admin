import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, Edit, Search as SearchIcon } from "@mui/icons-material";
import { requiredDocuments } from "../types";
import { formatDate } from "../utils/formatters";
export const Documents = () => {
  const [documentTypes, setDocumentTypes] = useState<requiredDocuments[]>([]);
  const [filtereddocumentTypes, setFiltereddocumentTypes] = useState<
    requiredDocuments[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updateDocumentLoading, setUpdateDocumentLoading] = useState(false);
  const [isUpdateDocumentOpened, setIsUpdateDocumentOpened] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(false);
  const [addDocumentLoading, setAddDocumentLoading] = useState(false);
  const [isAddDocumentOpened, setIsAddDocumentOpened] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { getDocumenttypes } = useAuth();
  const fetchDocumenttypes = async () => {
    try {
      setLoading(true);
      const documentTypes = await getDocumenttypes();
      setDocumentTypes(documentTypes);
      setFiltereddocumentTypes(documentTypes);
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleOpenUpdateDocument = () => {
    setUpdateDocumentLoading(true);
    setIsUpdateDocumentOpened(true);
    setTimeout(() => {
      setSelectedDocument(true);
      setUpdateDocumentLoading(false);
    }, 2000);
  };

  const handleSubmitUpdateDocument = () => {};

  const handleCloseUpdateDocument = () => {
    setSelectedDocument(false);
    setIsUpdateDocumentOpened(false);
  };

  const handleOpenAddDocument = () => {
    setAddDocumentLoading(false);
    setIsAddDocumentOpened(true);
  };

  const handleSubmitAddDocument = () => {};

  const handleCloseAddDocument = () => {
    setSelectedDocument(false);
    setIsAddDocumentOpened(false);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    fetchDocumenttypes();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (documentTypes.length) {
      const filtered = documentTypes.filter(
        (Documents) =>
          Documents.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          Documents.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          Documents.created_at.includes(searchQuery) ||
          Documents.user_type.includes(searchQuery),
      );
      setFiltereddocumentTypes(filtered);
    }
  }, [searchQuery, documentTypes]);
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={fetchDocumenttypes}>
          Retry
        </Button>
      </Container>
    );
  }
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 0 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4">Document Types</Typography>

        <TextField
          placeholder="Search Document..."
          variant="outlined"
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
        disabled={addDocumentLoading}
        onClick={handleOpenAddDocument}
      >
        Add Document
      </Button>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">required</TableCell>
                <TableCell align="center">User Type</TableCell>
                <TableCell align="center">Creation Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtereddocumentTypes
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((documentTypes) => (
                  <TableRow key={documentTypes.id} hover>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "10.5px",
                        }}
                      >
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {documentTypes.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {documentTypes.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {documentTypes.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {documentTypes.is_required ? "Required" : "Not Required"}
                    </TableCell>
                    <TableCell align="center">
                      {documentTypes.user_type}
                    </TableCell>
                    <TableCell align="center">
                      {formatDate(documentTypes.created_at)}
                    </TableCell>
                    <TableCell align="center">
                      <Box>
                        <IconButton
                          color="primary"
                          size="small"
                          title="Edit Document"
                          onClick={handleOpenUpdateDocument}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          size="small"
                          title="Delete Document"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

              {documentTypes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No Documents found matching your search.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={documentTypes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/*Add document dialog*/}
      <Dialog
      open={isAddDocumentOpened}
      onClose={handleCloseAddDocument}
      maxWidth="sm"
      fullWidth
    >
      {addDocumentLoading ? (
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
              Add New Document
            </Typography>
          </DialogTitle>

          <DialogContent dividers>
            <Box
              component="form"
              onSubmit={handleSubmitAddDocument}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 1,
              }}
            >
              <TextField
                label="Document Name"
                name="documentName"
                required
                fullWidth
                disabled={loading}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseAddDocument} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmitAddDocument}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Add Document"}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
      {/* Update document dialog */}
      <Dialog
        open={isUpdateDocumentOpened}
        onClose={handleCloseUpdateDocument}
        maxWidth="md"
        fullWidth
      >
        {updateDocumentLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 200,
              padding: 2,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {!updateDocumentLoading && selectedDocument && (
          <>
            <DialogTitle>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="h6" sx={{ textAlign: "center" }}>
                  Update Document
                </Typography>
              </Box>
            </DialogTitle>
            <Box component="form" onSubmit={() => {}} sx={{ mt: 1, mx: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="Name"
                label="Document Name"
                name="Name"
                autoComplete="Name"
                autoFocus
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="Description"
                label="Document Description"
                name="Description"
                autoComplete="Description"
                autoFocus
                disabled={loading}
              />
            </Box>
            <DialogActions>
              <Button onClick={handleCloseUpdateDocument}>Close</Button>
              <Button onClick={handleSubmitUpdateDocument}>Submit</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};
