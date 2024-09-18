import { useQuery } from "react-query";
import { fetchReport, fetchReports } from "./reports";

const useReports = (page: number, status?: string) => {
  return useQuery(["reports", status], () => fetchReports(page, status));
};

export default useReports;

export const useReport = (id: number | undefined, enabled: boolean) => {
  return useQuery(["report", id], () => fetchReport(id), { enabled });
};
