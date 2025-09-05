import { useEffect, useState } from "react";
import { requiredDocuments } from "../../../types";

export const useDocuments = (getDocumenttypes: () => Promise<requiredDocuments[]>) => {
  const [documents, setDocuments] = useState<requiredDocuments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const docs = await getDocumenttypes();
      setDocuments(docs);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { documents, loading, error, fetchDocuments };
};