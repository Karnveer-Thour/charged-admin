import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  DocumentStatus,
  DocumentType,
  Driver,
  DriverDocument,
} from "../../../../../types";
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Error as PendingIcon,
  AccessTime as ExpiredIcon,
  Add as NotSubmittedIcon,
  OpenInNew as OpenIcon,
  UploadFile as UploadFileIcon,
} from "@mui/icons-material";
import { useAuth } from "../../../../../contexts/AuthContext";

interface AccordianGroupProps {
  selectedDriver: Driver;
  setSelectedDriver: (driver: Driver | null) => void;
  setDocumentUpdateSuccess: (message: string | null) => void;
  setDocumentUpdateError: (error: string | null) => void;
  showRejectionReason: boolean;
  setShowRejectionReason: (show: boolean) => void;
  getDocumentTitle: (docType: DocumentType) => string;
  handleOpenUploadDialog: (docType: DocumentType) => void;
  uploadingDocument: boolean;
  updatingDocument: boolean;
  setUpdatingDocument: React.Dispatch<React.SetStateAction<boolean>>;
}

const AccordianGroup = ({
  selectedDriver,
  setSelectedDriver,
  setDocumentUpdateSuccess,
  setDocumentUpdateError,
  showRejectionReason,
  setShowRejectionReason,
  getDocumentTitle,
  handleOpenUploadDialog,
  uploadingDocument,
  setUpdatingDocument,
  updatingDocument,
}: AccordianGroupProps) => {
  const [accordianIndex, setAccordianIndex] = useState<number | false>(
    localStorage.getItem("accordianIndex")
      ? parseInt(localStorage.getItem("accordianIndex") as string, 10)
      : false,
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [verifyNotes, setVerifyNotes] = useState("");
  const { updateDriverdocsStatus } = useAuth();
  const handleUpdateDocumentStatus = async (
    document: DriverDocument,
    newStatus: DocumentStatus,
  ) => {
    if (!selectedDriver) return;
    try {
      if (
        newStatus === "rejected" &&
        rejectionReason.trim().length === 0 &&
        !showRejectionReason
      ) {
        setShowRejectionReason(true);
        return;
      }
      setUpdatingDocument(true);
      setDocumentUpdateError(null);

      const updatedDocument = await updateDriverdocsStatus(
        document.user_id,
        document.id,
        {
          status: newStatus,
          rejection_reason: rejectionReason || "",
          notes: verifyNotes || "",
        },
      );

      const updatedDocuments = selectedDriver.documents.map((doc) =>
        doc.id === updatedDocument.id
          ? { ...updatedDocument, document_type: doc.document_type }
          : doc,
      );

      const updatedDriver = {
        ...selectedDriver,
        documents: updatedDocuments,
      };

      setSelectedDriver(updatedDriver);
      setDocumentUpdateSuccess(`Document status updated to ${newStatus}`);

      setRejectionReason("");
      setVerifyNotes("");
      setShowRejectionReason(false);
    } catch (err) {
      if (err instanceof Error) {
        setDocumentUpdateError(err.message);
      } else {
        setDocumentUpdateError("An unknown error occurred.");
      }
    } finally {
      setUpdatingDocument(false);
    }
  };

  const getDocumentStatusColor = (
    status: DocumentStatus,
  ): "success" | "error" | "warning" | "default" => {
    switch (status) {
      case "verified":
        return "success";
      case "rejected":
      case "expired":
        return "error";
      case "pending":
        return "warning";
      case "notSubmitted":
      default:
        return "default";
    }
  };
  const getDocumentStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case "verified":
        return <ApprovedIcon color="success" />;
      case "rejected":
        return <RejectedIcon color="error" />;
      case "pending":
        return <PendingIcon color="warning" />;
      case "expired":
        return <ExpiredIcon color="error" />;
      case "notSubmitted":
        return <NotSubmittedIcon color="disabled" />;
      default:
        return null;
    }
  };
  return (
    <Grid container spacing={3}>
      {selectedDriver?.documents?.map((document, index) => (
        <Grid
          item
          xs={12}
          key={document.id}
          onClick={() => {
            localStorage.setItem("accordianIndex", index.toString());
            setAccordianIndex(index);
            if (accordianIndex === index) {
              setAccordianIndex(false);
              localStorage.removeItem("accordianIndex");
            }
          }}
        >
          <Accordion expanded={accordianIndex === index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {getDocumentStatusIcon(document.status)}
                  <Typography variant="subtitle1" sx={{ ml: 1 }}>
                    {getDocumentTitle(document.document_type)}
                  </Typography>
                </Box>
                <Chip
                  label={document.status}
                  color={getDocumentStatusColor(document.status)}
                  size="small"
                  sx={{ textTransform: "capitalize" }}
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {document.status}
                  </Typography>

                  {document.uploaded_at && (
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Date Submitted
                      </Typography>
                      <Typography variant="body1">
                        {new Date(document.uploaded_at).toLocaleDateString()}
                      </Typography>
                    </>
                  )}

                  {document.updated_at && (
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Date Reviewed
                      </Typography>
                      <Typography variant="body1">
                        {new Date(document.updated_at).toLocaleDateString()}
                      </Typography>
                    </>
                  )}

                  {document.expiry_date && (
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Expiry Date
                      </Typography>
                      <Typography
                        variant="body1"
                        color={
                          new Date(document.expiry_date) < new Date()
                            ? "error"
                            : "inherit"
                        }
                      >
                        {new Date(document.expiry_date).toLocaleDateString()}
                        {new Date(document.expiry_date) < new Date() &&
                          " (Expired)"}
                      </Typography>
                    </>
                  )}

                  {document.reviewed_by && (
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Reviewed By
                      </Typography>
                      <Typography variant="body1">
                        {document.reviewed_by}
                      </Typography>
                    </>
                  )}

                  {document.notes && (
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Notes
                      </Typography>
                      <Typography variant="body1">{document.notes}</Typography>
                    </>
                  )}

                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<UploadFileIcon />}
                      onClick={() =>
                        handleOpenUploadDialog(document.document_type)
                      }
                      disabled={uploadingDocument}
                      sx={{ mr: 1 }}
                    >
                      Upload Document
                    </Button>

                    {document.file_url && (
                      <Button
                        variant="outlined"
                        startIcon={<OpenIcon />}
                        href={document.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Document
                      </Button>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Update Document Status
                  </Typography>

                  <ButtonGroup variant="outlined" sx={{ mb: 2 }}>
                    {/* Approve */}
                    <Button
                      color="success"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUpdateDocumentStatus(document, "verified");
                      }}
                      disabled={
                        document.status === "verified" || updatingDocument
                      }
                    >
                      Approve
                    </Button>

                    <Button
                      color="error"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUpdateDocumentStatus(document, "rejected");
                      }}
                      disabled={
                        document.status === "rejected" || updatingDocument
                      }
                    >
                      Reject
                    </Button>

                    <Button
                      color="warning"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUpdateDocumentStatus(document, "pending");
                      }}
                      disabled={
                        document.status === "pending" || updatingDocument
                      }
                    >
                      Mark Pending
                    </Button>
                  </ButtonGroup>

                  {/* ✅ Show Rejection Reason only once */}
                  {(showRejectionReason || document.status === "rejected") && (
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Rejection Reason"
                        multiline
                        rows={3}
                        size="small"
                        value={rejectionReason}
                        placeholder="Rejection reason required..."
                        disabled={
                          updatingDocument || document.status === "rejected"
                        }
                        required
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                    </Box>
                  )}

                  {/* ✅ Notes field (only once) */}
                  <Box>
                    <TextField
                      fullWidth
                      label="Add Notes"
                      multiline
                      rows={3}
                      size="small"
                      value={verifyNotes}
                      placeholder="Add notes about this document..."
                      disabled={updatingDocument}
                      onClick={(e) => e.stopPropagation()}
                      onFocus={(e) => e.stopPropagation()}
                      onChange={(e) => setVerifyNotes(e.target.value)}
                    />
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      ))}
    </Grid>
  );
};

export default AccordianGroup;
