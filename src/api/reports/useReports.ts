import { useQuery } from "react-query";
import { fetchReport, fetchReports } from "./reports";

const useReports = (page: number, status?: string) => {
  return useQuery(["reports", page, status], () => fetchReports(page, status), {
    keepPreviousData: true,
  });
};

export default useReports;

export const useReport = (id: number | undefined, enabled: boolean) => {
  return useQuery(["report", id], () => fetchReport(id), { enabled });
};
