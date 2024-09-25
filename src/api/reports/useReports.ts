import { useQuery } from "react-query";
import { fetchDocumentImage, fetchReport, fetchReports } from "./reports";

const useReports = (page: number, status?: string) => {
  return useQuery(["reports", page, status], () => fetchReports(page, status), {
    keepPreviousData: true,
  });
};

export default useReports;

export const useReport = (id: number | undefined, enabled: boolean) => {
  return useQuery(["report", id], () => fetchReport(id), { enabled });
};

export const useDocumentImages = (documentIds: string[], reportId: string) => {
  return useQuery(
    ["documentImages", documentIds],
    async () => {
      const promises = documentIds.map((id) =>
        fetchDocumentImage(id, reportId)
      );
      return Promise.all(promises); // Wait for all images to load
    },
    {
      enabled: documentIds.length > 0,
    }
  );
};
