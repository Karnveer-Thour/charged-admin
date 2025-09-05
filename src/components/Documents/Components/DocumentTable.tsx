import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { requiredDocuments } from "../../../types";
import { formatDate } from "../../../utils/formatters";

interface DocumentTableProps {
  documents: requiredDocuments[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (doc: requiredDocuments) => void;
  onDelete: (doc: requiredDocuments) => void;
}

const DocumentTable = ({
  documents,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
}: DocumentTableProps) => {
  return (
    <Paper elevation={3}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Required</TableCell>
              <TableCell align="center">User Type</TableCell>
              <TableCell align="center">Creation Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((doc) => (
                <TableRow key={doc.id} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {doc.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ID: {doc.id}
                    </Typography>
                  </TableCell>
                  <TableCell>{doc.description}</TableCell>
                  <TableCell align="center">
                    {doc.is_required ? "Required" : "Not Required"}
                  </TableCell>
                  <TableCell align="center">{doc.user_type}</TableCell>
                  <TableCell align="center">{formatDate(doc.created_at)}</TableCell>
                  <TableCell align="center">
                    <Box>
                      <IconButton
                        color="primary"
                        size="small"
                        title="Edit Document"
                        onClick={() => onEdit(doc)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        size="small"
                        title="Delete Document"
                        onClick={() => onDelete(doc)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

            {documents.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No Documents found.
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
        count={documents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
};

export default DocumentTable;