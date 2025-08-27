import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
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
import React, { useEffect, useState } from "react";
import { formatDate } from "../../../utils/formatters";
import { Delete } from "@mui/icons-material";
import { Reward } from "../../../types";
import DeleteRewardDialog from "../DeleteRewardDialog/DeleteRewardDialog";

interface RewardsTableProps {
  searchQuery: string;
  fetchRewards: () => Promise<void>;
  rewards: Reward[];
  setFilteredRewards: React.Dispatch<React.SetStateAction<Reward[]>>;
  filteredRewards: Reward[];
  loading:boolean,
  error:string|null,
}

const RewardsTable = ({
  searchQuery,
  fetchRewards,
  rewards,
  setFilteredRewards,
  filteredRewards,
  loading,
  error
}: RewardsTableProps) => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedRewardToDelete, setSelectedRewardToDelete] = useState<
    Reward | undefined
  >();
  const [isDeleteRewardDialogOpened, setIsDeleteRewardDialogOpened] =
    useState<boolean>(false);
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleOpenDeleteRewardDialog = () => {
    setIsDeleteRewardDialogOpened(true);
  };
  useEffect(() => {
    fetchRewards();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (rewards.length) {
      const filtered = rewards.filter(
        (Documents) =>
          Documents.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          Documents.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          Documents.created_at.includes(searchQuery) ||
          Documents.point_required.toString().includes(searchQuery)
      );
      setFilteredRewards(filtered);
    }
    // eslint-disable-next-line
  }, [searchQuery, rewards]);
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
        <Button variant="contained" onClick={fetchRewards}>
          Retry
        </Button>
      </Container>
    );
  }
  return (
    <>
      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Title</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Points Required</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRewards
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((Reward: Reward) => (
                  <TableRow key={Reward.id} hover>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "10.5px",
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            align="center"
                          >
                            {Reward.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            align="left"
                          >
                            ID: RWD{Reward.id.toString().padStart(3, "0")}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" align="center">
                        {Reward.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {Reward.point_required}
                    </TableCell>
                    <TableCell align="center">
                      {formatDate(Reward.created_at)}
                    </TableCell>
                    <TableCell align="center">
                      <Box>
                        <IconButton
                          color="secondary"
                          size="small"
                          title="Delete Document"
                          onClick={() => {
                            handleOpenDeleteRewardDialog();
                            setSelectedRewardToDelete(Reward);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

              {filteredRewards.length === 0 && (
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
          count={filteredRewards.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {selectedRewardToDelete && (
        <DeleteRewardDialog
          isDeleteRewardDialogOpened={isDeleteRewardDialogOpened}
          SelectedRewardToDelete={selectedRewardToDelete}
          setIsDeleteRewardDialogOpened={setIsDeleteRewardDialogOpened}
          setSelectedRewardToDelete={setSelectedRewardToDelete}
          fetchRewards={fetchRewards}
        />
      )}
    </>
  );
};

export default RewardsTable;
