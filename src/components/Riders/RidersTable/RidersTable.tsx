import {
  Avatar,
  Box,
  Chip,
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
import {
  Star as StarIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import React, { useState } from "react";
import { formatDate, formatRelativeTime } from "../../../utils/formatters";
import Multiselect from "../../../utils/Multiselect";
import { Rider } from "../../../types";

interface RidersTableProps {
  filteredRiders: Rider[];
  handleViewRiderRides: (rider: Rider) => Promise<void>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const RidersTable = ({
  filteredRiders,
  handleViewRiderRides,
  page,
  setPage,
}: RidersTableProps) => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper elevation={3}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rider</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell align="center">Reward Points</TableCell>
              <TableCell align="center">Rides</TableCell>
              <TableCell align="center">Joined</TableCell>
              <TableCell align="center">Last Ride</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRiders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((rider) => (
                <TableRow key={rider.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={rider.photo}
                        alt={rider.name}
                        sx={{ mr: 2, width: 40, height: 40 }}
                      />
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {rider.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {rider.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{rider.email}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {rider.phone}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      icon={<StarIcon fontSize="small" />}
                      label={rider.rewardPoints}
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">{rider.totalRides}</TableCell>
                  <TableCell align="center">
                    {formatDate(rider.created_at)}
                  </TableCell>
                  <TableCell align="center">
                    {rider.lastRideDate
                      ? formatRelativeTime(rider.lastRideDate)
                      : "Never"}
                  </TableCell>
                  <TableCell align="center">
                    <Box>
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleViewRiderRides(rider)}
                        title="View rides"
                      >
                        <ViewIcon />
                      </IconButton>
                      <Multiselect
                        Heading={
                          <IconButton
                            color="secondary"
                            size="small"
                            title="Edit rider"
                          >
                            <EditIcon />
                          </IconButton>
                        }
                      >
                        <div style={{ width: "130px", height: "35px" }}>
                          <span
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-around",
                              background: "white",
                              border: "none",
                              fontSize: "1.2rem",
                              cursor: "pointer",
                              borderBottom: "2px solid black",
                            }}
                            onClick={undefined}
                          >
                            Delete
                          </span>
                        </div>
                        <div style={{ width: "130px", height: "35px" }}>
                          <span
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-around",
                              background: "white",
                              border: "none",
                              fontSize: "1.2rem",
                              cursor: "pointer",
                              borderBottom: "2px solid black",
                            }}
                            onClick={undefined}
                          >
                            Active
                          </span>
                        </div>
                      </Multiselect>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

            {filteredRiders.length === 0 && (
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
        count={filteredRiders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default RidersTable;
