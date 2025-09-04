import { Alert, Box, Button, Typography } from "@mui/material";
import { VerifiedIcon } from "lucide-react";
import {
  DocumentStatus,
  DocumentType,
  Driver,
  DriverDocument,
} from "../../../../types";
import { TabPanelProps } from "../DriverDetailsDialog";
import { useState } from "react";
import AccordianGroup from "./AccordianGroup/AccordianGroup";

interface DocumentsTabProps {
  tabValue: number;
  TabPanel: (props: TabPanelProps) => JSX.Element;
  selectedDriver: Driver;
  setSelectedDriver: (driver: Driver | null) => void;
  documentUpdateSuccess: string | null;
  setDocumentUpdateSuccess: (message: string | null) => void;
  documentUpdateError: string | null;
  setDocumentUpdateError: (error: string | null) => void;
  setShowRejectionReason: (show: boolean) => void;
  showRejectionReason: boolean;
  getDocumentTitle: (docType: DocumentType) => string;
  handleOpenUploadDialog: (docType: DocumentType) => void;
  uploadingDocument: boolean;
}

const DocumentsTab = ({
  tabValue,
  TabPanel,
  selectedDriver,
  setSelectedDriver,
  documentUpdateSuccess,
  setDocumentUpdateSuccess,
  documentUpdateError,
  setDocumentUpdateError,
  showRejectionReason,
  setShowRejectionReason,
  getDocumentTitle,
  handleOpenUploadDialog,
  uploadingDocument,
}: DocumentsTabProps) => {
  const [updatingDocument, setUpdatingDocument] = useState(false);
  return (
    <TabPanel value={tabValue} index={1}>
      {documentUpdateSuccess && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setDocumentUpdateSuccess(null)}
        >
          {documentUpdateSuccess}
        </Alert>
      )}

      {documentUpdateError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setDocumentUpdateError(null)}
        >
          {documentUpdateError}
        </Alert>
      )}

      <AccordianGroup
        selectedDriver={selectedDriver}
        setSelectedDriver={setSelectedDriver}
        setDocumentUpdateSuccess={setDocumentUpdateSuccess}
        setDocumentUpdateError={setDocumentUpdateError}
        showRejectionReason={showRejectionReason}
        setShowRejectionReason={setShowRejectionReason}
        getDocumentTitle={getDocumentTitle}
        handleOpenUploadDialog={handleOpenUploadDialog}
        uploadingDocument={uploadingDocument}
        setUpdatingDocument={setUpdatingDocument}
        updatingDocument={updatingDocument}
      />

      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Last document update:{" "}
          {selectedDriver.documents &&
          selectedDriver?.documents?.filter((d) => d.updated_at).length > 0
            ? new Date(
                Math.max(
                  ...selectedDriver.documents
                    .filter((d) => d.updated_at)
                    .map((d) => new Date(d.updated_at!).getTime()),
                ),
              ).toLocaleDateString()
            : "Never"}
        </Typography>

        <Box>
          <Button
            variant="contained"
            color="success"
            startIcon={<VerifiedIcon />}
            disabled={
              updatingDocument ||
              (selectedDriver.documents &&
                selectedDriver.documents.some(
                  (d) =>
                    d?.status !== "verified" && d?.status !== "notSubmitted",
                ))
            }
            onClick={() => {
              const pendingDocs = selectedDriver.documents
                ? selectedDriver.documents.filter(
                    (d) =>
                      d.status !== "verified" && d.status !== "notSubmitted",
                  )
                : [];
              if (pendingDocs.length === 0) {
                setDocumentUpdateSuccess("All required documents are verified");
              }
            }}
          >
            All Documents Verified
          </Button>
        </Box>
      </Box>
    </TabPanel>
  );
};

export default DocumentsTab;
