import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
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
import {
  Delete,
  Edit,
  Search as SearchIcon,
} from "@mui/icons-material";
import { requiredDocuments } from "../types";
import { formatDate } from "../utils/formatters";
export const Documents = () => {
  const [documentTypes, setDocumentTypes] = useState<requiredDocuments[]>([]);
  const [filtereddocumentTypes, setFiltereddocumentTypes] = useState<
    requiredDocuments[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    fetchDocumenttypes();
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                      No riders found matching your search.
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
    </Container>
  );
};
