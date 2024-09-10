import { useQuery } from "react-query";
import { fetchReport, fetchReports } from "./reports";

const useReports = (status: string, page: number) => {
  return useQuery(["reports", status], () => fetchReports(status, page), {
    // TODO remove status param for author role users
    enabled: !!status,
  });
};

export default useReports;

export const useReport = (id: number | undefined, enabled: boolean) => {
  return useQuery(["report", id], () => fetchReport(id), { enabled });
};
